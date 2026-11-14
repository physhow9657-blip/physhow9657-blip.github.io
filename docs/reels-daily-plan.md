# 하루 1릴스 계획 (만화풍 대화형 · 유머)

## 포맷 (렌트 릴스 `insta-drafts/reels/rent-cartoon.mp4` 기준)
- 구성: 훅(숫자·반전) → 영업사원/업자와 손님 대화(유머 한 방) → 결론(총액·기준 숫자 + 확인할 것 1~2개)
- 길이 25~35초, 목소리 3명(내레이터 Minchul / 영업사원 Mr.H / 손님 Yeonhee), 자막은 항상 켬
- 숫자는 해당 블로그 글에 있는 검증값만 사용, 가정값은 화면 하단에 명시
- 영상 소스: `~/remotion-shorts/src/videos/<이름>/` (cartoon-3d-short 스킬), 대사 생성은 ElevenLabs

## 제작 순서 (역할 분담: 제작은 Opus 이상 병렬, 렌더·업로드는 Sonnet)
1. 주제 선정 + 블로그 글에서 숫자 뽑기 (출처 글 확인)
2. 대사 5줄(훅 / 업자 / 손님 / 업자 / 결론) + 유머 한 줄
3. 목소리 생성 → 장면 타이밍 → 렌더 → 프레임·음량 확인
4. 사용자 미리보기 승인 → 인스타 업로드 → 캡션·해시태그 → 저장소 기록

## 주제 큐 (숫자는 각 글에서 다시 확인 후 사용)
| 순서 | 주제 | 유머 소재 | 출처 글 |
| --- | --- | --- | --- |
| 1 | 렌트 vs 할부 3년 (제작 완료) | "저희 남는 게 없어요" | rent-vs-lease-vs-installment-3year |
| 2 | 할부 이자 "월 50만원이면 되죠?" 만화 버전 | "월 납입금만 물어보는 손님" | used-car-installment-interest-calc |
| 3 | 침수차 구별 | "사장님 무사고예요 (발에 물 묻음)" | flooded-car-detection-10-signs (draft) |
| 4 | 엔진오일 교환 주기 | "5천km마다요! (정비소 사장님)" | engine-oil-change-interval (draft) |
| 5 | 자동차세 연납 할인 | "1월에 내면 깎아드려요" | car-tax-prepayment-discount-calc (draft, 공제율 확인 필요) |
| 6 | 이력 조회 | "성능점검기록부 있으니 믿으세요" | car365-history-lookup-guide (draft) |
| 7 | 업무용 승용차 비용처리 | "이거 다 경비 돼요" | business-vehicle-expense-guide (draft, 법령 대조 필요) |

draft 글을 소재로 쓸 때는 글의 "확인 필요" 항목을 영상에서 단정하지 않는다. 세금·법령 소재(5, 7번)는 법령 원문 대조 전에는 올리지 않는다.
