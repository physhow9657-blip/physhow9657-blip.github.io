import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_IDS } from './lib/categories';

/**
 * 글(포스트) 컬렉션 스키마.
 *
 * Astro 5 의 Content Layer API 를 사용합니다.
 * - 글이 Markdown 파일이든, 나중에 원격 CMS 에서 오든 같은 방식으로 읽습니다.
 * - 프론트매터가 스키마와 다르면 `npm run build` 가 실패하므로
 *   잘못된 날짜·카테고리가 그대로 배포되는 사고를 막습니다.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    // SEO 제목 (55~65자 권장)
    title: z.string().min(10, 'title 은 10자 이상').max(90, 'title 은 90자 이하'),
    // 검색 결과에 보이는 설명 (80~155자 권장)
    description: z.string().min(50, 'description 은 50자 이상').max(200, 'description 은 200자 이하'),

    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),

    category: z.enum(CATEGORY_IDS),
    tags: z.array(z.string()).default([]),

    // 첫 화면 '핵심 요약' 박스 (인스타에서 온 독자가 3초에 판단할 수 있게 3~5개)
    summary: z.array(z.string()).min(1).max(5),

    // 인스타 자동 DM 트리거 키워드 (릴스 캡션의 "댓글에 '○○' 남기면 DM" 과 같은 단어)
    instaKeyword: z.string().min(1),

    // 본문 하단 CTA 종류
    ctaType: z.enum(['calculator', 'affiliate', 'both', 'none']).default('calculator'),

    // 이 글에만 쓰는 제휴 링크 (없으면 config 의 기본값 사용)
    affiliate: z
      .object({
        label: z.string(),
        url: z.string().url('제휴 링크는 https:// 로 시작해야 합니다'),
        note: z.string().optional(),
      })
      .optional(),

    // FAQ (구글 FAQPage 구조화 데이터로 자동 변환)
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        })
      )
      .default([]),

    // 대표 이미지 (public/ 기준 경로, 예: '/images/example.jpg')
    cover: z.string().optional(),

    // 초안이면 목록·RSS·사이트맵에서 제외 (로컬 dev 에서는 보임)
    draft: z.boolean().default(false),
    // 홈 상단에 크게 노출
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts };
