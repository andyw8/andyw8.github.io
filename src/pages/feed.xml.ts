import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import {
	getPosts,
	postDateObject,
	postDescription,
	postHref,
	postTitle,
} from '../lib/posts';

export async function GET(context: APIContext) {
	// jekyll-feed only included the ten most recent posts.
	const posts = (await getPosts()).slice(0, 10);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site ?? 'https://andywaite.com',
		items: posts.map((post) => ({
			title: postTitle(post),
			pubDate: postDateObject(post),
			link: postHref(post),
			description: postDescription(post),
		})),
		customData: '<language>en</language>',
	});
}
