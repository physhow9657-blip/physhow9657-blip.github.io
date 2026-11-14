# 배포 상태와 업데이트 방법 (2026-11-14 기준, Actions 배포로 전환)

- 실제 주소: **https://physhow9657-blip.github.io/**
- 저장소: `physhow9657-blip/physhow9657-blip.github.io` (Public)
- 배포 방식: **GitHub Actions** (Pages → Source: `GitHub Actions`, build_type `workflow`)
- 워크플로: `.github/workflows/deploy-pages.yml` — `main` push 시 `npm ci` → `npm test` → `npm run build` → Pages 배포 (수동 실행도 가능)
- 브랜치 구성
  - `main` : 사이트 소스. push 하면 자동 배포
  - `gh-pages` : 예전 방식(빌드 산출물) 잔재. 지금은 사용하지 않음

## 글을 추가/수정한 뒤 배포하는 방법
1. 로컬에서 `npm run build` 로 빌드 확인 (Node 22)
2. `main` 브랜치에 커밋·push → 1~3분 내 자동 배포
3. 진행 상황: `gh run list --workflow deploy-pages.yml` 또는 저장소 Actions 탭
4. 수동 실행: `gh workflow run deploy-pages.yml`

## 워크플로 파일을 push 할 때 필요한 권한
`.github/workflows/*.yml` 을 push 하려면 `gh` 토큰에 `workflow` 권한이 필요합니다.
없으면 `refusing to allow an OAuth App to create or update workflow` 오류가 납니다.

```bash
gh auth refresh -h github.com -s workflow   # 코드 입력 후 브라우저에서 바로 승인
```

(2026-11-14 이전에는 이 권한이 없어 gh-pages 브랜치 배포를 썼고, 이후 Actions 배포로 전환했습니다.)

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
- 인스타그램 `@magic.jiny` 로 변경(2026-11-14, 본인 확인)
- `contact.email` 은 개인 지메일 노출을 피하려고 `contact@autocostlab.com` 플레이스홀더로 두었습니다.
  실제로 메일을 받으려면 도메인 포워딩이나 다른 주소로 바꿔 주세요.
