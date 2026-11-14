# 할부 이자 카드뉴스 — 댓글 → DM 자동화 설정 (도구에 그대로 입력)

> 상태: **준비만 됨, 미가동**. 공식 API 기반 도구(소셜비즈·매니챗 등)를 사용자가 가입·권한 승인해야 켜진다.
> 가이드: `docs/insta-auto-dm-automation-guide.md` (§4 제재 방지 규칙 준수)

## 트리거
- 대상 게시물: 할부 이자 카드뉴스(5장, 2026-11-14 게시)
- 키워드(정확 일치): `할부`, `할부계산`
- 공개 대댓글 자동 답글: **끄기** (DM만 발송)
- 1일 발송 상한: 첫 달 50건 이하 (가이드 §4)

## DM 문구 (3~4개 변형을 순환, 링크는 1개, 4줄 이내)
변형 A
```
요청하신 중고차 할부 이자 계산표입니다.
👉 https://physhow9657-blip.github.io/posts/used-car-installment-interest-calc/?utm_source=instagram&utm_medium=dm&utm_campaign=card01_installment
금리·기간별 총이자를 한눈에 비교할 수 있어요.
※ 이 메시지는 키워드를 남겨주신 분께 1회만 발송됩니다.
```
변형 B
```
“할부” 남겨주셔서 보내드려요!
👉 https://physhow9657-blip.github.io/posts/used-car-installment-interest-calc/?utm_source=instagram&utm_medium=dm&utm_campaign=card01_installment
2,000만원 기준 금리·기간별 총이자 계산표가 들어 있습니다.
※ 키워드를 남겨주신 분께 1회만 발송됩니다.
```
변형 C
```
할부 이자 전체 계산표 링크예요.
👉 https://physhow9657-blip.github.io/posts/used-car-installment-interest-calc/?utm_source=instagram&utm_medium=dm&utm_campaign=card01_installment
실제 견적서 금리로 다시 계산해 보세요.
※ 요청하신 분께 1회만 발송됩니다.
```
- 제휴 링크 없음 → 대가성 문구 불필요
- 본인 테스트 링크는 `utm_campaign` 뒤에 `&utm_content=test` 를 붙일 것(애드센스 무효 트래픽 방지)

## DM 유도 카드
- 5장 교체본: `installment-v2/05-dm.png` (댓글 "할부" → DM 안내 박스 포함)
- 게시물에 반영하려면 5번째 이미지 교체가 필요하지만 인스타는 게시 후 이미지 교체가 안 되므로 **재게시**해야 함. 자동화가 실제로 켜진 뒤에 재게시할 것(켜지기 전에 DM 안내를 올리면 약속을 못 지킴).

## 켜기 전 체크
- [ ] 인스타 프로페셔널(크리에이터) 계정 전환
- [ ] 도구 가입·인스타 연결·'메시지 관리' 권한 승인 (사용자가 직접)
- [ ] 키워드·문구 입력 → 지인 계정으로 댓글 테스트 → DM 수신·UTM 유지 확인
- [ ] 계정 나이 2주 이상, 팔로워 100명 이상 권장 (현재 팔로워 0)
