# 배포 상태와 업데이트 방법 (2026-11-14 기준)

- 실제 주소: **https://physhow9657-blip.github.io/**
- 저장소: `physhow9657-blip/physhow9657-blip.github.io` (Public)
- 배포 방식: **gh-pages 브랜치 배포** (Pages → Source: `gh-pages` / `/`, build_type `legacy`)
- 브랜치 구성
  - `main` : 사이트 소스(이 문서 포함). `node_modules`·`dist`·`.astro` 미포함
  - `gh-pages` : 빌드 산출물(`dist` 내용 + `.nojekyll`). Pages가 이 브랜치를 그대로 서빙

## 왜 GitHub Actions가 아니라 gh-pages 브랜치인가
Pickle의 GitHub 연결(App)에는 `workflows` 권한이 없어서, `.github/workflows/*.yml`을 push하면
다음처럼 거부됩니다.

```
refusing to allow a GitHub App to create or update workflow
`.github/workflows/deploy-pages.yml` without `workflows` permission
```

그래서 `.github/workflows/deploy-pages.yml`(Actions 배포용, 프로젝트에는 보관)은 저장소에 올리지 않았습니다.
나중에 사용자가 직접 push하거나, GitHub 웹 편집기로 그 파일을 추가하고
Settings → Pages → Source를 **GitHub Actions** 로 바꾸면 Actions 배포로 전환할 수 있습니다.

## 글을 추가/수정한 뒤 배포하는 방법
1. `main` 브랜치에 소스를 커밋·push
2. 로컬에서 빌드 (Node 22)
   ```bash
   SITE_URL=https://physhow9657-blip.github.io BASE_PATH=/ npm run build
   ```
3. `dist` 내용 + `.nojekyll` 파일을 `gh-pages` 브랜치에 push (Pages가 자동 재빌드)

> `.nojekyll` 은 꼭 필요합니다. 없으면 Jekyll이 `_astro/` 폴더를 무시해 CSS가 404가 됩니다.

## 확인된 것
- `npm test` 37건 통과 / `npm run build` 12페이지 생성
- 루트 및 `/tools/car-tax-calculator/`, `/about/`, `/privacy/`, `/posts/`, `/contact/`,
  `/robots.txt`, `/sitemap-index.xml`, `/rss.xml`, `/ads.txt` 모두 HTTP 200
- 계산기 페이지에서 실제 계산 동작 확인(차량가 15,000,000원 → 총비용 1,069,000원)

## 아직 사용자 조치가 필요한 것
- 애드센스: `src/config.ts`의 `adsense.enabled: false` → 승인 후 `true`, `client`에 `ca-pub-` ID 입력.
  (AdSense 고객 ID 7185513487 / AdMob pub-637572108... 는 메일로만 확인, 브라우저 로그인은 막혀 있었음)
- 제휴 링크(쿠팡파트너스·알리·렌트): 각 `url`이 비어 있어 카드가 자동으로 숨겨진 상태.
  쿠팡파트너스 가입 여부는 아직 확인되지 않음(로그인 필요)
- 인스타그램 `@autocost.lab` 계정 소유/사용 여부 미확인(비로그인 접근 403)
- `contact.email` 은 개인 지메일 노출을 피하려고 `contact@autocostlab.com` 플레이스홀더로 두었습니다.
  실제로 메일을 받으려면 도메인 포워딩이나 다른 주소로 바꿔 주세요.
