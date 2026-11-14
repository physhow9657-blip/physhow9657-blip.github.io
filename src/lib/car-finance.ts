/**
 * 자동차 할부 vs 렌트·리스 총비용 계산 (순수 함수).
 * 화면(계산기 페이지)과 테스트가 같은 식을 쓰도록 여기에 모았습니다.
 * 원리금균등상환: 월 상환액 = P·r / (1 − (1+r)^−n), r = 연금리/12 (r=0 이면 P/n)
 * 모든 값은 사용자가 넣은 가정이며 실제 견적이 아닙니다.
 */

export interface CarFinanceInput {
  price: number; // 차량가(원)
  down: number; // 선수금(원)
  annualRate: number; // 연 금리(%)
  months: number; // 할부·보유 기간(개월)
  residualPct: number; // 기간 종료 시 잔존가치율(%)
  registration: number; // 취득세 등 등록비용(원)
  insuranceYear: number; // 연 보험료(원)
  taxYear: number; // 연 자동차세(원)
  maintenanceYear: number; // 연 정비·소모품(원)
  rentMonthly: number; // 렌트·리스 월 납입금(원), 0 이면 비교 생략
  rentIncludesRunning: boolean; // 월 납입금에 보험·세금·정비 포함 여부
}

export interface CarFinanceResult {
  principal: number;
  monthlyPayment: number;
  totalInstallment: number; // 선수금 + 할부 납입 합계
  totalInterest: number;
  runningCost: number; // 보험·세금·정비 기간 합계
  totalSpend: number; // 할부 총 지출
  residualValue: number;
  netCost: number; // 잔존가치 차감 실질 총비용
  netMonthly: number;
  rentTotal: number | null;
  diff: number | null; // 양수면 렌트·리스가 더 비쌈(할부 유리)
  breakEvenMonthly: number; // 렌트·리스 월 납입금이 이 이하면 렌트·리스 유리
}

/** 원리금균등 월 상환액 (원 단위 반올림). */
export function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
}

/** 입력 검증. 문제가 있으면 한국어 메시지 배열, 없으면 빈 배열. */
export function validate(i: CarFinanceInput): string[] {
  const errs: string[] = [];
  const nums = Object.entries(i).filter(([, v]) => typeof v === 'number') as [string, number][];
  if (nums.some(([, v]) => !Number.isFinite(v) || v < 0)) errs.push('금액·비율은 0 이상의 숫자로 입력하세요.');
  if (!(i.price > 0)) errs.push('차량가는 0보다 커야 합니다.');
  if (i.down > i.price) errs.push('선수금이 차량가보다 클 수 없습니다.');
  if (!Number.isInteger(i.months) || i.months < 1 || i.months > 120) errs.push('기간은 1~120개월 정수로 입력하세요.');
  if (i.annualRate > 100) errs.push('연 금리는 100% 이하로 입력하세요.');
  if (i.residualPct > 100) errs.push('잔존가치율은 100% 이하로 입력하세요.');
  return errs;
}

export function calculateCarFinance(i: CarFinanceInput): CarFinanceResult {
  const principal = Math.max(0, i.price - i.down);
  const pay = monthlyPayment(principal, i.annualRate, i.months);
  const totalInstallment = i.down + pay * i.months;
  const totalInterest = pay * i.months - principal;
  const runningCost = ((i.insuranceYear + i.taxYear + i.maintenanceYear) * i.months) / 12;
  const totalSpend = totalInstallment + i.registration + runningCost;
  const residualValue = Math.round((i.price * i.residualPct) / 100);
  const netCost = totalSpend - residualValue;
  // 렌트·리스에 보험·세금이 안 들어 있으면 그만큼 별도로 더해 같은 조건으로 비교
  const rentExtra = i.rentIncludesRunning ? 0 : runningCost;
  const rentTotal = i.rentMonthly > 0 ? i.rentMonthly * i.months + rentExtra : null;
  return {
    principal,
    monthlyPayment: pay,
    totalInstallment,
    totalInterest,
    runningCost,
    totalSpend,
    residualValue,
    netCost,
    netMonthly: netCost / i.months,
    rentTotal,
    diff: rentTotal === null ? null : rentTotal - netCost,
    breakEvenMonthly: (netCost - rentExtra) / i.months,
  };
}
