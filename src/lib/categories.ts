/**
 * 글 카테고리 정의.
 * - id     : 프론트매터 `category` 에 쓰는 값 (영문 고정, URL 안전)
 * - label  : 화면·표에 보이는 이름
 * - slug   : /category/<slug>/ 주소
 * 새 카테고리를 추가하면 이 배열에만 넣으면 목록·필터·SEO가 자동으로 따라옵니다.
 */
export const CATEGORIES = [
  {
    id: 'buying',
    label: '구매·세금·금융',
    slug: 'buying',
    description: '취등록세, 이전등록 비용, 할부·리스·장기렌트 총비용 비교처럼 계약 전에 계산이 필요한 주제.',
  },
  {
    id: 'insurance',
    label: '보험·사고이력',
    slug: 'insurance',
    description: '자동차보험 특약, 보험료 산정 구조, 카히스토리·성능기록부로 사고차를 걸러내는 방법.',
  },
  {
    id: 'running',
    label: '유지비·부품',
    slug: 'running',
    description: '수입차·바이크의 연간 유지비, 소모품 교체 주기와 부품 가격, 고질병 대응.',
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

/** zod 스키마와 select 등에서 쓰는 id 목록 (튜플 형태 유지) */
export const CATEGORY_IDS: [CategoryId, ...CategoryId[]] = ['buying', 'insurance', 'running'];

export function getCategory(id: string) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];
}

export function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(value);
}
