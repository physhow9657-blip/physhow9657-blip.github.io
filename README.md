# AutoCost Lab — 자동차·바이크 실구매·유지비 수익형 블로그

Astro 5 정적 블로그 + 애드센스 준비 + 인스타 릴스/자동 DM 퍼널이 한 폴더에 들어 있습니다.
호스팅비 0원(도메인비만), 로딩 1초대, 클로드 코드로 글 발행 자동화까지 엮은 스타터입니다.

| 항목 | 내용 |
| --- | --- |
| 프레임워크 | Astro 5.18 (정적 빌드) + `@astrojs/sitemap`, `@astrojs/rss` |
| 스타일 | 순수 CSS (프레임워크 없음, 다크 모드 대응, 모바일 퍼스트) |
| 콘텐츠 | Markdown + Content Layer(스키마 검증). 프론트매터가 틀리면 빌드 실패 |
| 수익화 | 애드센스(슬롯 3곳: 상단·본문 후반·하단) + 쿠팡파트너스/알리/장기렌트 CPA + 디지털 상품 |
| 배포 | Cloudflare Pages(권장) 또는 GitHub Pages(Actions 포함) |
| 운영 | Windows PowerShell 스크립트 + `CLAUDE.md` + `docs/claude-code-start-prompt.md` |

---

## 1. 5분 안에 로컬에서 띄우기

```powershell
# 1) 압축을 푼 폴더에서 PowerShell 열기
cd C:\Users\<사용자>\car-adsense-blog

# 2) 최초 1회: 환경 점검 + 설치 + 빌드 검증
.\scripts\setup-windows.ps1

# 3) 미리보기
npm run dev      # → http://localhost:4321
```

Node.js **22 이상**이 필요합니다. 없으면 `winget install --id OpenJS.NodeJS.LTS -e` 후 터미널을 새로 여세요.

---

## 2. 내 정보로 바꾸기 (한 파일)

`src/config.ts` 하나만 고치면 사이트 전체에 반영됩니다.

| 항목 | 바꿀 값 |
| --- | --- |
| 사이트 이름 | `name`, `shortName`, `description` |
| 주소 | `url` (+ `astro.config.mjs` 의 `SITE_URL`) |
| 운영자 | `author.name`, `author.role`, `author.bio`, `author.credentials` |
| 문의 메일 | `contact.email` ← **공개 주소입니다. 전용 메일을 권장** |
| 인스타 | `instagram.handle`, `instagram.url`, `instagram.defaultKeyword` |
| 애드센스 | `adsense.enabled`, `client`, `slots.*` |
| 제휴 | `showAffiliates`, `affiliates.coupang/aliexpress/rental/digital` |

추가로 손봐야 하는 3개 파일:

- `public/robots.txt` → `Sitemap:` 주소의 도메인
- `public/ads.txt` → `pub-XXXXXXXXXXXXXXXX` 을 본인 게시자 ID로
- `astro.config.mjs` → `SITE_URL`, `BASE_PATH`

---

## 3. 배포 A — Cloudflare Pages (권장)

1. GitHub에 새 저장소를 만들고 이 폴더를 push 합니다.

   ```powershell
   git init -b main
   git add -A
   git commit -m "init: AutoCost Lab"
   git remote add origin https://github.com/<아이디>/<저장소>.git
   git push -u origin main
   ```

2. [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages → Create → Pages → Connect to Git**.
3. 저장소 선택 → 빌드 설정:

   | 항목 | 값 |
   | --- | --- |
   | Framework preset | `Astro` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `22` (환경 변수 `NODE_VERSION=22`) |

4. **환경 변수**에 `SITE_URL` = `https://내도메인` (BASE_PATH 는 넣지 않음 = `/`).
5. Deploy → `*.pages.dev` 주소 확인.
6. 도메인 연결: Pages → Custom domains → 도메인 입력 → DNS 안내대로 레코드 추가(Cloudflare로 네임서버 이전하면 자동).
7. 도메인 연결 후 `astro.config.mjs` 의 `SITE_URL`, `public/robots.txt` 의 Sitemap 주소를 실제 도메인으로 바꾸고 다시 push.

> Cloudflare Pages 는 push 할 때마다 자동 빌드합니다. `main` 브랜치가 배포 대상입니다.

---

## 4. 배포 B — GitHub Pages

`.github/workflows/deploy-pages.yml` 이 포함되어 있어 push 만 하면 됩니다.

1. GitHub에 저장소 생성 → 위와 같이 push.
2. 저장소 → **Settings → Pages → Build and deployment → Source: GitHub Actions** 선택.
3. **Actions** 탭에서 `Deploy to GitHub Pages` 워크플로우가 성공하는지 확인.
4. 주소 규칙:
   - 프로젝트 저장소: `https://<아이디>.github.io/<저장소>/` → 워크플로우가 `BASE_PATH=/<저장소>` 를 자동 주입
   - 사용자 저장소(`<아이디>.github.io`): 워크플로우의 주석 블록대로 `SITE_URL`/`BASE_PATH` 수정
   - 커스텀 도메인: `SITE_URL` 만 도메인으로, `BASE_PATH: /`
5. `public/robots.txt` 의 Sitemap 주소도 실제 주소로 교체.

> 하위 경로 배포에서 CSS·링크가 깨지면 99%는 `BASE_PATH` 누락입니다. 모든 내부 링크는 `withBase()` 를 거치므로 `base` 만 맞으면 됩니다.

---

## 5. 애드센스 승인 순서

| 단계 | 할 일 |
| --- | --- |
| 1 | 글 15편 이상 (각 1,200자+, 표·실측 포함). 키워드맵: `docs/adsense-15-posts-keyword-map.md` |
| 2 | `about` / `privacy` / `contact` 의 실제 정보 입력 (실명·경력·연락처) |
| 3 | `public/ads.txt` 게시자 ID 교체, `robots.txt` Sitemap 도메인 확인 |
| 4 | Google Search Console 에 사이트 등록 + `sitemap-index.xml` 제출 |
| 5 | **`showAffiliates: false`** 로 내려 제휴 도배 없는 상태로 신청 |
| 6 | 승인 후 `adsense.enabled: true` + `client`/`slots` 입력 → `showAffiliates: true` |

광고 슬롯은 `src/components/AdSlot.astro` 가 담당합니다. 승인 전에는 스크립트가 **아예 로드되지 않고**,
개발 모드에서만 점선 자리 표시가 보입니다.

---

## 6. 수익화 구조 (1일 차부터)

```
[인스타 릴스] "댓글에 '계산기'"
      ↓ 자동 DM (링크 1개, UTM)
[블로그 글/계산기] 3초 요약 → 표 → 도구
      ↓
[애드센스] + [쿠팡파트너스·알리·장기렌트 CPA·디지털 상품]
```

- 제휴 카드는 `src/components/AffiliateBox.astro`. `config.showAffiliates` 가 스위치입니다.
- 대가성 문구(공정거래위원회 심사지침)는 `config.affiliates.disclosure` 한 곳에서 관리됩니다.
- 상세 전략: `docs/adsense-15-posts-keyword-map.md`(§2, §3), `docs/insta-auto-dm-automation-guide.md`.

---

## 7. 글 쓰기 & 발행

```powershell
# 글 1편 추가
#   src/content/posts/<영문-소문자-하이픈>.md

# 빌드 검증 + 커밋 + 푸시
.\scripts\publish.ps1 -Message "글 발행: 중고차 보험 특약"
```

프론트매터 스키마는 `src/content.config.ts` 에 있습니다. 필수: `title`, `description`, `pubDate`,
`category`, `summary`, `instaKeyword`. 선택: `tags`, `faq`, `ctaType`, `updatedDate`, `cover`, `draft`, `featured`.

계산기 세율·감면 기한을 고쳤다면 `npm test` 로 숫자를 검증하세요(37개 항목 자동 검사).
규칙은 `src/lib/car-tax.ts` 한 곳에 있습니다.

클로드 코드에서 한 줄로 시키는 방법은 `CLAUDE.md`, 처음 시작할 때 붙여넣을 프롬프트는
`docs/claude-code-start-prompt.md` 를 보세요.

---

## 8. 구조

```
src/
├── config.ts               사이트 설정 (브랜드·도메인·애드센스·인스타·제휴)
├── content.config.ts       글 스키마 (zod 검증)
├── content/posts/          글 (Markdown)
├── layouts/
│   ├── BaseLayout.astro    <head>·SEO·JSON-LD·헤더·푸터
│   └── PostLayout.astro    글 상세 (요약·목차·광고·CTA·FAQ·관련 글)
├── components/
│   ├── AdSlot.astro        애드센스 슬롯 (승인 전 자동 비활성)
│   ├── AffiliateBox.astro  제휴·CPA 카드 + 대가성 문구
│   ├── CtaBox.astro        계산기 CTA
│   ├── InstaBox.astro      인스타 DM 안내
│   ├── Toc.astro           목차 (모바일 접힘 / 데스크톱 고정)
│   ├── PostCard.astro      글 카드
│   ├── RelatedPosts.astro  관련 글
│   ├── SiteHeader.astro / SiteFooter.astro
├── pages/
│   ├── index.astro                     홈
│   ├── posts/index.astro               전체 글
│   ├── posts/[slug].astro              글 상세
│   ├── category/[category].astro       카테고리
│   ├── tools/car-tax-calculator.astro  취등록세 계산기
│   ├── about / privacy / contact / 404
│   └── rss.xml.js                      RSS
├── lib/{categories,url}.ts             카테고리·경로(base)·UTM 도우미
└── styles/global.css                   전체 디자인
public/       robots.txt · ads.txt · favicon.svg
docs/         키워드맵 · 인스타 가이드 · 클로드 시작 프롬프트
scripts/      setup-windows.ps1 · publish.ps1
insta-drafts/ 릴스 대본·캡션·DM 문구 초안
```

---

## 9. 문제 해결

| 증상 | 원인 / 해결 |
| --- | --- |
| `npm run build` 실패: `title 은 10자 이상` | `src/content.config.ts` 스키마 위반 — 프론트매터 확인 |
| `category` 오류 | `buying`, `insurance`, `running` 중 하나만 |
| 페이지는 뜨는데 CSS가 없다 | `BASE_PATH` 누락 (GitHub Pages 하위 경로) |
| 링크가 404 | 내부 링크는 반드시 `withBase()` 사용, 끝에 `/` 유지 |
| 한글 깨짐 (PowerShell) | 스크립트는 UTF-8 BOM으로 저장되어 있습니다. 편집 시 BOM 유지 |
| 광고가 안 보인다 | `adsense.enabled` 가 false 이거나 `client` 형식(`ca-pub-` + 16자리) 오류 |
| 제휴 카드가 안 보인다 | `showAffiliates` 가 false 이거나 `affiliates.*.url` 이 비어 있음 |
| 사이트맵이 없다 | `astro.config.mjs` 에 `site` 가 실제 도메인이어야 생성됩니다 |

---

## 10. 라이선스·주의

- 이 프로젝트의 코드는 자유롭게 사용·수정할 수 있습니다.
- 글 내용은 반드시 본인의 실제 경험·견적으로 검증한 뒤 발행하세요. AI가 만든 수치를 그대로 올리면
  애드센스 정책 위반(가치 없는 콘텐츠)으로 이어질 수 있습니다.
- 특정 상사·차량을 비방하는 내용, 소속 채널의 상호·영업 정보는 이 사이트에 넣지 않습니다.
