# CLAUDE.md — AutoCost Lab 운영 지침 (Windows · Claude Code)

이 파일은 Claude Code가 이 폴더를 열었을 때 자동으로 읽는 작업 지침입니다.
**사용자는 한 줄만 입력하면 됩니다.** 나머지는 이 문서의 규칙대로 처리하세요.

예시 입력:
- `"수입차 보험료 특약 주제로 글 써줘"`
- `"이 유튜브 대본으로 블로그 글 + 릴스 대본 만들어줘"` (대본 붙여넣기)
- `"오늘 글 발행해줘"`

---

## 0. 프로젝트 한눈에

| 항목 | 내용 |
| --- | --- |
| 사이트 | Astro 5 정적 블로그 + 애드센스 + 인스타 릴스/DM 퍼널 |
| 호스팅 | Cloudflare Pages(권장) 또는 GitHub Pages |
| 언어 | 한국어 (모든 글·문구) |
| 작업 폴더 | `C:\Users\<사용자>\car-adsense-blog` (압축을 푼 위치) |
| 글 위치 | `src/content/posts/*.md` |
| 설정 | `src/config.ts` (브랜드·도메인·애드센스·인스타·제휴) |
| 릴스 초안 | `insta-drafts/*.md` |
| 배포 | `git push` → GitHub Actions 또는 Cloudflare 자동 빌드 |

### 폴더 구조

```
car-adsense-blog/
├── src/
│   ├── config.ts            ← 브랜드·도메인·애드센스·제휴 설정 (여기만 고치면 전체 반영)
│   ├── content.config.ts    ← 글 프론트매터 스키마 (빌드 시 검증)
│   ├── content/posts/       ← 블로그 글 (Markdown)
│   ├── layouts/             ← BaseLayout(공통), PostLayout(글)
│   ├── components/          ← AdSlot, AffiliateBox, CtaBox, InstaBox, Toc, PostCard …
│   ├── pages/               ← index, posts, category, tools/car-tax-calculator, about, privacy, contact
│   ├── lib/                 ← categories, url(withBase·utmUrl)
│   └── styles/global.css    ← 전체 디자인 (CSS 변수)
├── public/                  ← robots.txt, ads.txt, favicon.svg
├── docs/                    ← 키워드맵, 인스타 가이드, 시작 프롬프트
├── scripts/                 ← setup-windows.ps1, publish.ps1
├── insta-drafts/            ← 릴스 대본·캡션·DM 문구 초안
├── .github/workflows/       ← GitHub Pages 자동 배포
└── CLAUDE.md
```

---

## 1. 명령어 (PowerShell, 프로젝트 루트에서)

```powershell
npm install          # 최초 1회 (또는 scripts\setup-windows.ps1)
npm run dev          # 로컬 미리보기 http://localhost:4321
npm run build        # 빌드 검증 (배포 전 필수)
npm test             # 취등록세 계산 엔진 자체 테스트 (세율 수정 후 필수)
npm run preview      # 빌드 결과 확인
.\scripts\publish.ps1 -Message "글 발행: 중고차 보험 특약"
```

- **Node 22 이상** 필요. 없으면 `winget install OpenJS.NodeJS.LTS` 후 터미널 재시작.
- 빌드가 실패하면 **절대 push 하지 말고** 원인을 고친 뒤 다시 빌드하세요.

---

## 2. 절대 규칙 (어기면 사이트가 위험해짐)

1. **카톡모터스 금지** — 상호, 상사명, 소속, 특정 매물, 영업 노하우를 글·이미지·메타에 넣지 않습니다.
   이 블로그는 중립 정보 브랜드(`AutoCost Lab`)입니다.
2. **특정 차량·상사 비방 금지** — "이 차는 쓰레기", "○○상사는 사기" 같은 표현 금지.
   단점은 **수치와 조건**으로 씁니다("8만km 이후 변속기 오일 미교체 시 슬립 사례 있음").
3. **확인하지 않은 수치를 사실처럼 쓰지 않기** — 금액·세율·보험료는 출처(법령·조례·견적·실측)와
   기준일을 함께 적습니다. 추정치는 "추정", "범위"라고 명시합니다.
4. **AI 초안 그대로 발행 금지** — 실제 경험·견적·사진 중 최소 1개를 반드시 넣습니다.
   애드센스 '가치 없는 콘텐츠' 거절의 주된 원인입니다.
5. **대가성 문구 유지** — 제휴 링크가 보이면 `config.affiliates.disclosure` 문구를 지우지 않습니다.
   (공정거래위원회 추천·보증 심사지침)
6. **`showAffiliates` / `adsense.enabled` 임의 변경 금지** — 아래 §5 상태표를 따르고,
   전환은 사용자에게 확인한 뒤 실행합니다.
7. **`.env`, 비밀번호, 애드센스 계정 정보 커밋 금지.**

---

## 3. 한 줄 지시를 받으면 하는 일 (5단계)

### ① 글 작성 — `src/content/posts/<slug>.md`

파일명: **영문 소문자 + 하이픈**. 예: `imported-car-insurance-discount-tips.md`
(날짜 접두어는 선택. 같은 주제가 반복될 때만 `2026-` 형태로 붙입니다.)

```markdown
---
title: "55~65자 안팎의 SEO 제목 (숫자·연도 포함)"
description: "80~155자. 검색 결과에 보이는 문장. 결론과 혜택을 포함."
pubDate: 2026-11-14
updatedDate: 2026-11-14          # 수정 시에만
category: buying                  # buying | insurance | running
tags:
  - 취등록세
  - 이전등록
summary:                          # 3~5개. 인스타 유입자가 3초에 판단하는 문장
  - 첫 번째 핵심 결론(숫자 포함)
  - 두 번째 핵심
  - 세 번째 핵심
instaKeyword: "계산기"            # 릴스 댓글 자동 DM 트리거 단어
ctaType: calculator               # calculator | affiliate | both | none
featured: false
faq:                              # 3~6개 (FAQPage 구조화 데이터로 자동 변환)
  - q: "질문?"
    a: "답변. 2~3문장."
---

첫 문단: 결론을 먼저(숫자 포함). 3문장 이내.

> **3초 요약** — 이 글의 핵심 한 줄.

## 소제목 (h2)
...
```

**본문 규칙**

- 분량: **1,500~2,500자**(공백 제외 기준 체감). 15편을 채울 때는 1,200자 이상이면 충분.
- h2 4~7개, 그 아래 h3 필요 시. **표 최소 1개**, 목록 최소 1개.
- 모든 금액에 기준일 표기: "2026년 11월 기준".
- 내부 링크 최소 2개: 계산기(`/tools/car-tax-calculator/`) + 관련 글 1개.
- 마지막에 면책 문단: "이 글은 ○○ 기준 … 세무·법률 자문이 아닙니다."
- 이미지가 있으면 `public/images/` 에 넣고 `/images/파일명.jpg` 로 참조. 없으면 넣지 않습니다.

### ② 릴스 대본 — `insta-drafts/<slug>-reel.md`

```markdown
# 릴스: <제목>

- 목표 길이: 28~32초
- 트리거 키워드: 계산기
- 연결 글: /posts/<slug>/

## 3초 훅 (0:00–0:03)
"..."  ← 숫자로 시작. 예: "등록비 140만원, 이거 모르고 계약합니다"

## 씬 구성
| 시간 | 화면 | 자막 | 내레이션 |
| --- | --- | --- | --- |
| 0:00–0:03 | 차 키 클로즈업 | 등록비 140만원 | ... |
| 0:03–0:12 | 계산기 화면 | 취득세 7% | ... |

## 캡션 (첫 2줄에 대가성 문구)
...
#중고차 #취등록세 #자동차 #셀프세차  (10~15개)

## 고정 댓글
"계산기" 남겨주시면 DM으로 링크 보내드려요.

## 자동 DM 문구
...
```

### ③ DM 문구 + UTM 링크

- 링크는 **1개만**. 형식:
  `https://<도메인>/posts/<slug>/?utm_source=instagram&utm_medium=dm&utm_campaign=reel<번호>_<주제>`
- 릴스 캡션용은 `utm_medium=reels`.
- 제휴 링크면 `utm_content=<제휴사>` 추가.
- DM 4줄 이내: 목적 → 링크 → 한 줄 설명 → (제휴 시) 대가성 문구.

### ④ 빌드 검증

```powershell
npm run build
```

- 성공하면 `dist/` 생성. 실패하면 오류 메시지의 파일·줄을 고치고 재시도.
- 자주 나는 오류:
  - `title 은 10자 이상` 등 → 프론트매터 스키마 위반 (`src/content.config.ts`)
  - `category` 값 오타 → `buying | insurance | running` 중 하나만
  - 날짜 형식 오류 → `2026-11-14` (따옴표 없이)

### ⑤ 발행

```powershell
.\scripts\publish.ps1 -Message "글 발행: <제목>"
```

- 내부적으로 `npm run build` → `git add -A` → `commit` → `push`.
- push 후 1~3분 내 사이트 반영. Cloudflare Pages/GitHub Actions 로그에서 성공 확인.

---

## 4. 문체 가이드

- **존댓말, 짧은 문장.** 한 문장에 하나의 사실.
- 숫자는 아라비아 숫자 + 단위: `140만원`, `1,998cc`, `7%`.
- "제가 직접 계약·등록하며 확인한" 같은 1인칭 경험은 실제일 때만.
- 과장 금지: "무조건", "100%", "최고" 대신 조건을 붙입니다.
- 광고성 문구 금지: "지금 바로 구매하세요" → "가격 비교 후 결정하세요".

---

## 5. 수익화 스위치 상태표

| 단계 | `adsense.enabled` | `showAffiliates` | 설명 |
| --- | --- | --- | --- |
| 1일 차 (승인 전) | `false` | `true`* | 제휴 링크를 실제로 넣었으면 `true`. 없으면 `false` |
| 승인 신청 3일 전 ~ 승인 | `false` | **`false`** | 정보성 글만 있는 깨끗한 사이트로 심사 |
| 승인 직후 | `true` (실제 pub ID) | `true` | 애드센스 + 제휴 동시 |

\* 제휴 링크가 하나도 없으면 `showAffiliates: false` 그대로 두세요.

**전환 시 체크**

- [ ] `adsense.client` = `ca-pub-` + 숫자 16자리
- [ ] `adsense.slots.top/mid/bottom` = 광고 단위 ID(숫자)
- [ ] `public/ads.txt` 의 `pub-XXXXXXXXXXXXXXXX` 교체
- [ ] `showAffiliates: true` + 각 제휴 `url` 채움
- [ ] `npm run build` 성공 → push

---

## 6. 하지 말아야 할 작업

- `src/config.ts` 외의 파일에서 브랜드명·도메인을 하드코딩 (모두 config 참조)
- 광고 코드를 `AdSlot.astro` 밖에 직접 붙이기
- 기존 글 덮어쓰기·삭제 (수정은 `updatedDate` 추가 후 해당 부분만)
- `dist/`, `node_modules/`, `.astro/` 커밋
- 새 패키지 설치 전 사용자 확인 (Astro 메이저 업그레이드 포함)
- PowerShell 스크립트를 UTF-8(BOM 없음)으로 저장 (한글 깨짐 → UTF-8 with BOM 유지)

---

## 7. 자주 쓰는 작업 모음

| 하고 싶은 것 | 명령/방법 |
| --- | --- |
| 로컬에서 확인 | `npm run dev` → http://localhost:4321 |
| 새 글만 올리기 | 글 작성 → `.\scripts\publish.ps1 -Message "..."` |
| 제목만 수정 | 해당 md의 `title` 수정 + `updatedDate` 추가 → publish |
| 계산기 세율 수정 | `src/lib/car-tax.ts` 의 `RULES` 객체 → `npm test` 로 검증 |
| 카테고리 추가 | `src/lib/categories.ts` 에 항목 추가 (id, label, slug, description) |
| 사이트 이름 변경 | `src/config.ts` name·shortName·description (+ `astro.config.mjs` SITE_URL) |
| 인스타 핸들 변경 | `src/config.ts` instagram.handle·url |
| 광고 위치 조정 | `src/layouts/PostLayout.astro` 의 `<AdSlot slot="top|mid|bottom" />` 순서 |

---

## 8. 첫 실행 체크 (사용자에게 한 번만 안내)

1. `npm install` 이 끝났는지
2. `npm run dev` 로 미리보기가 뜨는지
3. `src/config.ts` 의 도메인·연락처·인스타 핸들이 실제 값인지
4. GitHub 저장소가 연결됐는지 (`git remote -v`)
