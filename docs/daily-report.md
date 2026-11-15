# 일일 초안 보고서

## 2026-11-16 (자동 실행일 기준 2026-11-15 환경 날짜 다음 항목과 별개로 기록)
- **주제/파일**: 초안 작성 안 함 (새 글 없음). 키워드맵에서 미작성 주제는 #12(BMW 520i vs 벤츠 E300 5년 유지비), #13(할리 다이나 정비비) 2개뿐인데 둘 다 공식 근거 확보 실패.
- **시도한 출처**:
  - 할리 다이나 정기점검 주기: https://serviceinfo.harley-davidson.com/sip/service/procedure/1952427414242019757/BLAISE/498834/en_US?nid=6695 (검색 결과에만 노출, 세션 네트워크에서 접속 차단 — serviceinfo.harley-davidson.com 허용 필요). 검색 요약상 엔진오일 8,000km(5,000mi) 주기, 브레이크액 2년 교체 정도만 확인되나 연식별 표를 직접 읽지 못함.
  - BMW 520i·벤츠 E300 공식 서비스 주기·부품가: 공식 수치를 찾지 못함(국내 커뮤니티·리뷰 글만 검색됨).
- **확인 못 해 뺀 내용**: 두 주제의 정비 주기 표, 공임·부품 가격 전부. 가격은 업체별 편차가 커 공식 근거 없음, 직접 견적이 필요한 주제라 규칙 4 위반 소지.
- **사람이 검토할 부분**: (1) 세션 네트워크에 serviceinfo.harley-davidson.com 허용 후 #13 재시도, 또는 (2) 키워드맵에 계산식·법령 기반 신규 주제(예: 자동차 취득세 면제·감면, 전기차 보조금 등) 추가. #12·#13은 실제 견적이 있어야 안전.
- **npm run build**: 실행 안 함(변경은 보고서만).

## 2026-11-15
- **주제/파일**: 수입차 자동차보험료 할인 특약 6가지 (키워드맵 #6) — `src/content/posts/imported-car-insurance-discount-tips.md` (draft: true)
- **근거 출처** (모두 WebSearch 결과로 확인한 2차 자료. 공식 원문은 접속 불가):
  - 금감원 관련 보도 요약(2026-11-03 사회초년생 가입 절차 개선), 마일리지 특약 2018·2022 보도, 2020년 가입·환급 통계: https://www.korea.kr/news/policyNewsView.do?newsId=148908526 , https://newstomato.com/ReadNews.aspx?no=801148 , https://www.metroseoul.co.kr/article/20220327500202
  - 경미손상·정품/대체부품 약관 논란(2025): https://news.mtn.co.kr/news-detail/2025080514464847870
  - UBI·블랙박스 할인 개요: https://www.hyundaimotorgroup.com/ko/story/CONT0000000000001100 , https://biz.newdaily.co.kr/site/data/html/2019/08/08/2019080800163.amp.html
- **확인 못 해 뺀/불확실한 내용**: 현재 보험사별 마일리지·블랙박스 구간별 할인율(연도마다 상이해 수치 미기재), 블랙박스 현행 할인율, 정품·대체부품 약관 최종 시행 여부, 금감원 2026-11-03 보도 원문(fss.or.kr, korea.kr, khan.co.kr 도메인이 세션 네트워크에서 차단됨), 수입차 특화 공식 통계 없음.
- **사람이 검토할 부분**: 인용한 보도 수치(2~45%, 1~7%, 0.3~27.0%, 68%/69%/10.7만원)를 원문과 대조, 금감원 공식 자료 링크 보강 후 발행 여부 결정. `essential-insurance-riders` 글과 일부 겹침 가능.
- **npm run build**: 성공 (21페이지)
