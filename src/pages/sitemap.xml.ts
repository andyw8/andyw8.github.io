import type { APIContext } from 'astro';
import { getPosts, postDate, postHref } from '../lib/posts';

export async function GET(context: APIContext) {
	const site = context.site ?? new URL('https://andywaite.com');
	const posts = await getPosts();

	const pages = ['/', '/about/', '/contact/', '/work/'].map((path) => ({
		loc: new URL(path, site).href,
		lastmod: undefined,
	}));

	const postEntries = posts.map((post) => {
		const { year, month, day } = postDate(post);
		return {
			loc: new URL(postHref(post), site).href,
			lastmod: `${year}-${month}-${day}`,
		};
	});

	const urls = [...pages, ...postEntries]
		.map(
			({ loc, lastmod }) =>
				`<url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`,
		)
		.join('');

	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}
