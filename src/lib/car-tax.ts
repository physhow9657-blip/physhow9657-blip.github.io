/**
 * 중고차 취등록세·이전등록 비용 계산 규칙 (순수 함수).
 *
 * - 화면(계산기 페이지)과 테스트가 같은 규칙을 쓰도록 로직을 여기 한 곳에 모았습니다.
 * - 세율·기한이 바뀌면 이 파일의 RULES 만 고치면 됩니다.
 *
 * 기준: 2026-11-14
 *  · 취득세: 비영업용 승용 7%, 경형 4%(75만원 공제 ~2027-12-31),
 *            승합·화물 5%, 이륜 2% (지방세법 제12조)
 *  · 친환경 감면: 전기 140만원(~2026-12-31), 수소 140만원(~2027-12-31),
 *                수소 화물 50%(~2028-12-31) (지방세특례제한법 제66조)
 *  · 공채: 1,600cc 미만 승용 면제, 서울 이전 6%·경기 4%(1,600~2,000cc),
 *          부산 4%(1,600cc 이상) — 조례별 차이, 'other' 는 직접 입력
 *  · 등록면허세 15,000원(기타등록), 증지·인지 등 4,000원
 */

export type VehicleType = 'passenger' | 'compact' | 'van' | 'truck' | 'moto';
export type FuelType = 'ice' | 'hybrid' | 'ev' | 'hydrogen';
export type RegistrationType = 'new' | 'transfer';
export type RegionCode = 'seoul' | 'busan' | 'gyeonggi' | 'other';

export interface CarTaxInput {
  /** 거래가(원) */
  price: number;
  /** 시가표준액(원). 모르면 0 */
  marketValue?: number;
  vehicle: VehicleType;
  /** 배기량(cc). 전기차는 0 */
  cc: number;
  fuel: FuelType;
  registrationType: RegistrationType;
  region: RegionCode;
  /** region === 'other' 일 때 매입률(%) */
  bondRateOverride?: number;
  /** 공채 즉시매도 할인율(%, 예: 6.5) */
  discountRate?: number;
  /** 대행료·번호판 등 기타 비용(원) */
  extra?: number;
  /** 감면 기한 판정 기준일 (테스트용, 기본 오늘) */
  today?: Date;
}

export interface CarTaxLine {
  label: string;
  note: string;
  amount: number;
}

export interface CarTaxResult {
  taxBase: number;
  rate: number;
  acquisitionTaxRaw: number;
  deduction: number;
  deductionLabel: string;
  acquisitionTax: number;
  bondRatePct: number;
  bondAmount: number;
  bondDiscount: number;
  licenseTax: number;
  miscFee: number;
  extra: number;
  total: number;
  lines: CarTaxLine[];
  notes: string[];
}

export const RULES = {
  acquisitionRate: {
    passenger: 0.07,
    compact: 0.04,
    van: 0.05,
    truck: 0.05,
    moto: 0.02,
  } as Record<VehicleType, number>,
  compactDeduction: { amount: 750000, until: '2027-12-31' },
  ecoDeduction: {
    ev: { amount: 1400000, until: '2026-12-31' },
    hydrogen: { amount: 1400000, until: '2027-12-31' },
    hydrogenTruck: { rate: 0.5, until: '2028-12-31' },
  },
  licenseTax: 15000,
  miscFee: 4000,
  minBond: 5000,
} as const;

function isBefore(dateStr: string, today: Date): boolean {
  return today.getTime() <= new Date(`${dateStr}T23:59:59`).getTime();
}

/** 지역·등록구분·배기량별 공채 매입률(%) */
export function bondRatePercent(input: {
  region: RegionCode;
  registrationType: RegistrationType;
  cc: number;
  vehicle: VehicleType;
  fuel: FuelType;
  bondRateOverride?: number;
}): number {
  const { region, registrationType, cc, vehicle, fuel } = input;

  if (region === 'other') return input.bondRateOverride ?? 0;

  // 경차(1,000cc 미만)·이륜차는 매입 면제
  if (vehicle === 'compact' || vehicle === 'moto') return 0;
  if (cc > 0 && cc < 1000) return 0;

  const isEco = fuel === 'ev' || fuel === 'hybrid' || fuel === 'hydrogen';
  if (isEco) {
    // 서울·부산: 친환경차 매입 면제. 경기: 1,600cc 초과 하이브리드만 매입.
    if (region === 'gyeonggi') {
      if (fuel === 'hybrid' && cc > 1600) return registrationType === 'new' ? 8 : 4;
      return 0;
    }
    return 0;
  }

  // 승합·화물은 정액(별도 계산)
  if (vehicle === 'van' || vehicle === 'truck') return 0;

  if (vehicle === 'passenger') {
    if (region === 'seoul') {
      if (cc < 1600) return 0; // 소형 면제(~2028-12-31)
      if (registrationType === 'new') return cc > 2000 ? 20 : 12;
      return 6;
    }
    if (region === 'busan') {
      if (registrationType === 'new') return 0; // 한시 면제(~2026-12-31)
      return cc >= 1600 ? 4 : 0;
    }
    if (region === 'gyeonggi') {
      if (registrationType === 'new') return cc > 2000 ? 12 : cc > 1600 ? 8 : 0;
      return cc > 2000 ? 6 : cc > 1600 ? 4 : 0;
    }
  }
  return 0;
}

/** 승합·화물 정액 공채 (서울 기준 참고값) */
export function bondFixedAmount(input: { vehicle: VehicleType; registrationType: RegistrationType }): number {
  const { vehicle, registrationType } = input;
  if (vehicle === 'van') return registrationType === 'new' ? 390000 : 130000;
  if (vehicle === 'truck') return registrationType === 'new' ? 195000 : 65000;
  return 0;
}

/** 2,500원 미만 버림, 2,500원 이상 5,000원 단위 올림, 최저 5,000원 */
export function roundBond(amount: number): number {
  if (amount < 2500) return 0;
  if (amount < RULES.minBond) return RULES.minBond;
  return Math.round(amount / RULES.minBond) * RULES.minBond;
}

export function calculateCarTax(input: CarTaxInput): CarTaxResult {
  const {
    price,
    marketValue = 0,
    vehicle,
    cc,
    fuel,
    registrationType,
    region,
    discountRate = 6.5,
    extra = 0,
    today = new Date(),
  } = input;

  // 1) 과세표준 = 거래가 vs 시가표준액 중 큰 값
  const taxBase = Math.max(price, marketValue);

  // 2) 취득세율 (경차는 배기량으로도 판정)
  const isCompact = vehicle === 'compact' || (vehicle === 'passenger' && cc > 0 && cc < 1000);
  const rate = isCompact ? RULES.acquisitionRate.compact : RULES.acquisitionRate[vehicle];
  const acquisitionTaxRaw = Math.floor((taxBase * rate) / 10) * 10;

  // 3) 친환경 감면 → 경차 공제 순서
  let deduction = 0;
  let deductionLabel = '';
  if (fuel === 'ev' && isBefore(RULES.ecoDeduction.ev.until, today)) {
    deduction = RULES.ecoDeduction.ev.amount;
    deductionLabel = '전기차 140만원 공제';
  } else if (fuel === 'hydrogen') {
    const rule = vehicle === 'truck' ? RULES.ecoDeduction.hydrogenTruck : RULES.ecoDeduction.hydrogen;
    if (isBefore(rule.until, today)) {
      if ('rate' in rule) {
        deduction = Math.floor(acquisitionTaxRaw * rule.rate);
        deductionLabel = '수소 화물차 50% 경감';
      } else {
        deduction = rule.amount;
        deductionLabel = '수소차 140만원 공제';
      }
    }
  }
  const afterEco = Math.max(0, acquisitionTaxRaw - deduction);

  const compactDeduction =
    isCompact && isBefore(RULES.compactDeduction.until, today)
      ? Math.min(afterEco, RULES.compactDeduction.amount)
      : 0;
  if (compactDeduction > 0) deductionLabel = '경차 75만원 공제';

  const acquisitionTax = Math.max(0, afterEco - compactDeduction);

  // 4) 공채(채권)
  const isVanOrTruck = vehicle === 'van' || vehicle === 'truck';
  let bondRatePct = 0;
  let bondAmount = 0;

  if (region === 'other') {
    bondRatePct = input.bondRateOverride ?? 0;
    bondAmount = roundBond(Math.floor((taxBase * bondRatePct) / 100));
  } else if (isVanOrTruck) {
    bondAmount = bondFixedAmount({ vehicle, registrationType });
  } else {
    bondRatePct = bondRatePercent({ region, registrationType, cc, vehicle, fuel, bondRateOverride: input.bondRateOverride });
    bondAmount = roundBond(Math.floor((taxBase * bondRatePct) / 100));
  }

  const bondDiscount = Math.round(bondAmount * (discountRate / 100));

  const licenseTax = RULES.licenseTax;
  const miscFee = RULES.miscFee;
  const total = acquisitionTax + bondDiscount + licenseTax + miscFee + extra;

  const lines: CarTaxLine[] = [
    {
      label: '취득세',
      note: `과세표준 ${taxBase.toLocaleString('ko-KR')}원 × ${(rate * 100).toFixed(0)}%`,
      amount: acquisitionTaxRaw,
    },
  ];
  if (deduction > 0) lines.push({ label: '감면', note: deductionLabel, amount: -deduction });
  if (compactDeduction > 0) lines.push({ label: '경차 공제', note: '75만원 한도', amount: -compactDeduction });
  lines.push({
    label: '공채 매입',
    note: bondAmount > 0 ? `매입률 ${bondRatePct}% · 매입액 ${bondAmount.toLocaleString('ko-KR')}원` : '매입 면제',
    amount: bondDiscount,
  });
  lines.push({ label: '등록면허세', note: '기타등록 정액', amount: licenseTax });
  lines.push({ label: '증지·인지 등', note: '지자체별 1,000~4,000원', amount: miscFee });
  if (extra > 0) lines.push({ label: '기타(대행·번호판)', note: '직접 입력', amount: extra });

  const notes: string[] = [];
  if (marketValue > price && marketValue > 0) notes.push('신고가가 시가표준액보다 낮아 시가표준액으로 계산했습니다.');
  if (fuel === 'ev' && !isBefore(RULES.ecoDeduction.ev.until, today)) {
    notes.push('전기차 감면 기한(2026-12-31)이 지나 감면 없이 계산했습니다.');
  }
  if (registrationType === 'transfer') notes.push('이전등록은 잔금일부터 15일 이내 신청해야 합니다(초과 시 최대 50만원 과태료).');
  if (bondAmount === 0) notes.push('이 조건은 공채 매입이 면제됩니다.');

  return {
    taxBase,
    rate,
    acquisitionTaxRaw,
    deduction,
    deductionLabel,
    acquisitionTax,
    bondRatePct,
    bondAmount,
    bondDiscount,
    licenseTax,
    miscFee,
    extra,
    total,
    lines,
    notes,
  };
}
