// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* -----------------------------------------------------------------------------
 * 사이트 주소 설정 (여기 2줄만 고치면 됩니다)
 * -----------------------------------------------------------------------------
 * 1) 내 도메인을 연결한 경우 (Cloudflare Pages 권장)
 *      SITE_URL  = 'https://autocostlab.com'
 *      BASE_PATH = '/'
 *
 * 2) GitHub Pages 의 "프로젝트 페이지"로 배포하는 경우
 *      SITE_URL  = 'https://<깃허브아이디>.github.io'
 *      BASE_PATH = '/<저장소이름>'          ← 예: '/car-adsense-blog'
 *    (GitHub Actions 워크플로우가 이 두 값을 자동으로 넣어 줍니다.
 *     로컬 빌드에서만 아래 기본값을 직접 바꿔 주세요.)
 *
 * 3) GitHub Pages 의 "사용자 페이지" (<아이디>.github.io 저장소)인 경우
 *      BASE_PATH = '/'
 * -------------------------------------------------------------------------- */

const SITE_URL = process.env.SITE_URL || 'https://physhow9657-blip.github.io';
const BASE_PATH = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE_URL,
  // base 는 항상 '/' 로 시작해야 합니다. (예: '/car-adsense-blog')
  base: BASE_PATH,

  // 모든 내부 링크를 '/경로/' 형태(끝에 슬래시)로 통일합니다.
  trailingSlash: 'always',

  // sitemap-index.xml 자동 생성 → robots.txt 의 Sitemap 줄과 짝을 이룹니다.
  integrations: [sitemap()],

  build: {
    // /posts/slug/ → /posts/slug/index.html 로 출력 (정적 호스팅 호환성 최고)
    format: 'directory',
  },

  markdown: {
    // 코드 블록 하이라이트 테마 (밝은 배경 기준 가독성 좋은 테마)
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
