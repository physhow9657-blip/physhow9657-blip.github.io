import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { config } from '../config';
import { getCategory } from '../lib/categories';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: `${config.name} — ${config.tagline}`,
    description: config.description,
    site: context.site ?? config.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}/`,
      categories: [getCategory(post.data.category).label, ...post.data.tags],
      author: config.author.name,
    })),
    customData: '<language>ko-KR</language>',
  });
}
