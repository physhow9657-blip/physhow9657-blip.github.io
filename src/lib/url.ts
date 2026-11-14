/**
 * 내부 링크 도우미.
 *
 * GitHub Pages 프로젝트 페이지처럼 사이트가 하위 경로에 배포되면
 * href="/posts" 같은 절대 경로가 깨집니다.
 * 그래서 모든 내부 링크는 이 함수를 거쳐 `base` 를 앞에 붙입니다.
 *
 *   withBase('/posts/')  →  '/'            → '/posts/'
 *                        →  '/car-blog'    → '/car-blog/posts/'
 */
export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' 또는 '/car-blog'
  const clean = path.startsWith('/') ? path : `/${path}`;
  const joined = `${base}${clean}`;
  return joined === '' ? '/' : joined;
}

/** 글 상세 주소 */
export function postUrl(slug: string): string {
  return withBase(`/posts/${slug}/`);
}

/** 카테고리 목록 주소 */
export function categoryUrl(slug: string): string {
  return withBase(`/category/${slug}/`);
}

/**
 * 인스타 → 블로그 유입 측정용 UTM 링크를 만듭니다.
 * (릴스별로 campaign 을 다르게 주면 어느 릴스가 실제 유입을 만드는지 구분됩니다.)
 */
export function utmUrl(path: string, options: { campaign: string; content?: string }): string {
  const params = new URLSearchParams({
    utm_source: 'instagram',
    utm_medium: 'reels',
    utm_campaign: options.campaign,
  });
  if (options.content) params.set('utm_content', options.content);
  return `${path}${path.includes('?') ? '&' : '?'}${params.toString()}`;
}
