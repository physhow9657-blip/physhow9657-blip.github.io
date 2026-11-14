// 취등록세 계산 엔진 자체 테스트
// 사용법: npm test   (Node 22 이상. 세율을 고친 뒤 이 테스트로 숫자를 검증하세요)
// 취등록세 계산 엔진 단위 테스트 — 글에 적은 사례 표와 같은 값이 나오는지 확인
import { calculateCarTax, roundBond, bondRatePercent } from '../src/lib/car-tax.ts';

const today = new Date('2026-11-14T12:00:00+09:00');
let pass = 0;
const fails = [];

function expect(name, actual, expected) {
  if (actual === expected) {
    pass += 1;
  } else {
    fails.push(`${name}: 기대 ${expected}, 실제 ${actual}`);
  }
}

const base = { fuel: 'ice', registrationType: 'transfer', region: 'seoul', discountRate: 6.5, today };

// 1) 아반떼 1,598cc · 1,500만원 · 서울 이전
let r = calculateCarTax({ ...base, price: 15000000, vehicle: 'passenger', cc: 1598 });
expect('아반떼 취득세', r.acquisitionTax, 1050000);
expect('아반떼 공채', r.bondAmount, 0);
expect('아반떼 총액', r.total, 1069000);

// 2) 쏘렌토 2,151cc · 3,500만원 · 서울 이전
r = calculateCarTax({ ...base, price: 35000000, vehicle: 'passenger', cc: 2151 });
expect('쏘렌토 취득세', r.acquisitionTax, 2450000);
expect('쏘렌토 공채 매입', r.bondAmount, 2100000);
expect('쏘렌토 공채 할인', r.bondDiscount, 136500);
expect('쏘렌토 총액', r.total, 2605500);

// 3) 캐스퍼 998cc 경차 · 1,200만원
r = calculateCarTax({ ...base, price: 12000000, vehicle: 'compact', cc: 998 });
expect('캐스퍼 취득세', r.acquisitionTax, 0);
expect('캐스퍼 총액', r.total, 19000);

// 4) 아이오닉5 전기 · 3,800만원 · 서울 이전
r = calculateCarTax({ ...base, price: 38000000, vehicle: 'passenger', cc: 0, fuel: 'ev' });
expect('전기차 취득세 원액', r.acquisitionTaxRaw, 2660000);
expect('전기차 감면', r.deduction, 1400000);
expect('전기차 취득세', r.acquisitionTax, 1260000);
expect('전기차 공채', r.bondAmount, 0);
expect('전기차 총액', r.total, 1279000);

// 5) BMW 520i 1,998cc · 4,200만원 · 부산 이전
r = calculateCarTax({ ...base, price: 42000000, vehicle: 'passenger', cc: 1998, region: 'busan' });
expect('520i 취득세', r.acquisitionTax, 2940000);
expect('520i 공채 매입', r.bondAmount, 1680000);
expect('520i 공채 할인', r.bondDiscount, 109200);
expect('520i 총액', r.total, 3068200);

// 6) 경기 하이브리드 1,799cc · 2,800만원 이전
r = calculateCarTax({ ...base, price: 28000000, vehicle: 'passenger', cc: 1799, fuel: 'hybrid', region: 'gyeonggi' });
expect('경기 하이브리드 매입률', r.bondRatePct, 4);
expect('경기 하이브리드 총액', r.total, 1960000 + 72800 + 19000);

// 7) 전기차 감면 기한 경과 (2027-01-05)
r = calculateCarTax({ ...base, price: 38000000, vehicle: 'passenger', cc: 0, fuel: 'ev', today: new Date('2027-01-05T12:00:00+09:00') });
expect('2027년 전기차 감면 없음', r.acquisitionTax, 2660000);

// 8) 시가표준액이 거래가보다 높은 경우
r = calculateCarTax({ ...base, price: 10000000, marketValue: 13000000, vehicle: 'passenger', cc: 1998 });
expect('시가표준액 과세표준', r.taxBase, 13000000);
expect('시가표준액 취득세', r.acquisitionTax, 910000);
expect('시가표준액 안내문', r.notes.some((n) => n.includes('시가표준액')), true);

// 9) 경차 2,000만원 → 80만원 − 75만원 = 5만원
r = calculateCarTax({ ...base, price: 20000000, vehicle: 'compact', cc: 998 });
expect('경차 2천만원 취득세', r.acquisitionTax, 50000);

// 10) 9인승 승합 3,000만원 서울 이전 → 정액 13만원
r = calculateCarTax({ ...base, price: 30000000, vehicle: 'van', cc: 2200 });
expect('승합 취득세', r.acquisitionTax, 1500000);
expect('승합 공채 정액', r.bondAmount, 130000);
expect('승합 총액', r.total, 1500000 + 8450 + 19000);

// 11) 수소 화물 5,000만원 → 50% 경감 + 공채 정액 6.5만원
r = calculateCarTax({ ...base, price: 50000000, vehicle: 'truck', cc: 0, fuel: 'hydrogen' });
expect('수소화물 취득세', r.acquisitionTax, 1250000);
expect('수소화물 총액', r.total, 1250000 + 4225 + 19000);

// 12) 공채 절사 규칙
expect('공채 절사 2,499원', roundBond(2499), 0);
expect('공채 절사 2,500원', roundBond(2500), 5000);
expect('공채 절사 7,400원', roundBond(7400), 5000);
expect('공채 절사 7,600원', roundBond(7600), 10000);

// 13) 1,600cc 미만 면제 / 이상 매입 (서울)
expect('서울 1,599cc 면제', bondRatePercent({ region: 'seoul', registrationType: 'transfer', cc: 1599, vehicle: 'passenger', fuel: 'ice' }), 0);
expect('서울 1,600cc 6%', bondRatePercent({ region: 'seoul', registrationType: 'transfer', cc: 1600, vehicle: 'passenger', fuel: 'ice' }), 6);
expect('부산 1,600cc 4%', bondRatePercent({ region: 'busan', registrationType: 'transfer', cc: 1600, vehicle: 'passenger', fuel: 'ice' }), 4);

console.log(`통과 ${pass}건 / 실패 ${fails.length}건`);
if (fails.length) {
  for (const f of fails) console.log('  X ' + f);
  process.exit(1);
}
console.log('계산 엔진 검증 완료 ✔');
