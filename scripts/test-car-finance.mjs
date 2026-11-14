// 할부 vs 렌트 계산 엔진 자체 테스트 (npm test 에 포함)
import assert from 'node:assert/strict';
import { monthlyPayment, calculateCarFinance, validate } from '../src/lib/car-finance.ts';

const near = (actual, expected, tol, name) =>
  assert.ok(Math.abs(actual - expected) <= tol, `${name}: 기대 ${expected}±${tol}, 실제 ${actual}`);
const interest = (p, rate, n) => monthlyPayment(p, rate, n) * n - p;

// 총이자 사례 (글 본문 수치)
near(interest(20_000_000, 8, 36), 2_560_000, 10_000, '2천만·8%·36개월');
near(interest(20_000_000, 8, 60), 4_330_000, 10_000, '2천만·8%·60개월');
near(interest(20_000_000, 18, 60), 10_470_000, 10_000, '2천만·18%·60개월');
assert.equal(monthlyPayment(12_000_000, 0, 12), 1_000_000); // 무이자
assert.equal(monthlyPayment(0, 6.5, 36), 0);

// 기본값 = rent-vs-lease-vs-installment-3year 글 수치
const base = {
  price: 40_000_000, down: 0, annualRate: 6.5, months: 36, residualPct: 55,
  registration: 3_000_000, insuranceYear: 1_000_000, taxYear: 519_480, maintenanceYear: 200_000,
  rentMonthly: 0, rentIncludesRunning: true,
};
const r = calculateCarFinance(base);
near(r.monthlyPayment, 1_226_000, 1_000, '월 상환액');
near(r.totalInterest, 4_135_000, 30_000, '총이자');
near(r.totalSpend, 52_293_000, 30_000, '총 지출');
near(r.netCost, 30_293_000, 30_000, '실질 총비용');
near(r.netMonthly, 841_000, 1_000, '실질 월');
assert.equal(r.rentTotal, null);

// 렌트 비교: 손익분기와 같은 월 납입금이면 차이 0, 더 싸면 음수
const be = calculateCarFinance({ ...base, rentMonthly: Math.round(r.breakEvenMonthly) });
near(be.diff, 0, 40, '손익분기 차이');
assert.ok(calculateCarFinance({ ...base, rentMonthly: 700_000 }).diff < 0);
assert.ok(calculateCarFinance({ ...base, rentMonthly: 900_000 }).diff > 0);
// 보험·세금 별도면 기준선이 낮아진다
assert.ok(calculateCarFinance({ ...base, rentIncludesRunning: false }).breakEvenMonthly < r.breakEvenMonthly);
// 선수금: 총 지출에 포함, 이자는 줄어든다
const d = calculateCarFinance({ ...base, down: 10_000_000 });
assert.ok(d.totalInterest < r.totalInterest);
near(d.totalSpend, r.totalSpend - (r.totalInterest - d.totalInterest), 5, '선수금 총지출');

// 검증
assert.deepEqual(validate(base), []);
assert.ok(validate({ ...base, price: 0 }).length > 0);
assert.ok(validate({ ...base, annualRate: -1 }).length > 0);
assert.ok(validate({ ...base, months: 0 }).length > 0);
assert.ok(validate({ ...base, months: NaN }).length > 0);
assert.ok(validate({ ...base, down: 50_000_000 }).length > 0);

console.log('할부·렌트 계산 테스트 통과');
