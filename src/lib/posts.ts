import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;
export type Page = CollectionEntry<'pages'>;

const FILENAME_DATE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

export interface DateParts {
	year: string;
	month: string;
	day: string;
}

/**
 * Jekyll derived a post's URL from its frontmatter date when present, otherwise
 * from the `YYYY-MM-DD-` filename prefix. This mirrors that behaviour.
 */
export function postDate(post: Post): DateParts {
	const fromFrontmatter = datePartsFromValue(post.data.date);
	if (fromFrontmatter) return fromFrontmatter;

	const match = post.id.match(FILENAME_DATE);
	if (match) {
		return { year: match[1], month: match[2], day: match[3] };
	}

	throw new Error(`Could not determine a date for post "${post.id}"`);
}

export function postDateObject(post: Post): Date {
	const { year, month, day } = postDate(post);
	return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

export function postSlug(post: Post): string {
	const match = post.id.match(FILENAME_DATE);
	return match ? match[4] : post.id;
}

export function postCategories(post: Post): string[] {
	const { categories } = post.data;
	if (Array.isArray(categories)) return categories.map(String);
	if (typeof categories === 'string') {
		return categories.trim().split(/\s+/).filter(Boolean);
	}
	return [];
}

/**
 * The exact legacy permalink, e.g. `/rspec/bdd/testing/2013/02/21/playing-with-rspec-fire.html`.
 */
export function postHref(post: Post): string {
	const { year, month, day } = postDate(post);
	const segments = [...postCategories(post), year, month, day, postSlug(post)];
	return `/${segments.join('/')}.html`;
}

export function postTitle(post: Post): string {
	if (post.data.title) return post.data.title;
	// Jekyll fell back to the filename when a post had no title.
	return postSlug(post)
		.replace(/[-_]+/g, ' ')
		.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function isPublished(post: Post): boolean {
	return post.data.published !== false && post.data.draft !== true;
}

export async function getPosts({ includeDrafts = false } = {}): Promise<Post[]> {
	const posts = await getCollection('posts');
	return posts
		.filter((post) => includeDrafts || isPublished(post))
		.sort((a, b) => postDateObject(b).getTime() - postDateObject(a).getTime());
}

export async function getPage(id: string): Promise<Page> {
	const pages = await getCollection('pages');
	const page = pages.find((entry) => entry.id === id);
	if (!page) throw new Error(`Missing page collection entry "${id}"`);
	return page;
}

/** A plain-text summary suitable for meta descriptions and RSS. */
export function postDescription(post: Post, maxLength = 160): string {
	const text = post.body
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/<[^>]+>/g, ' ')
		.replace(/^#{1,6}\s+.*$/gm, ' ')
		.replace(/[*_`>]/g, '')
		.replace(/\s+/g, ' ')
		.trim();

	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function datePartsFromValue(value: string | Date | null | undefined): DateParts | undefined {
	if (value instanceof Date) {
		// YAML date-only values are parsed as UTC midnight; values with a time are
		// parsed as local wall time. Read the parts back the same way they came in.
		const isMidnightUtc =
			value.getUTCHours() === 0 &&
			value.getUTCMinutes() === 0 &&
			value.getUTCSeconds() === 0 &&
			value.getUTCMilliseconds() === 0;

		return {
			year: String(isMidnightUtc ? value.getUTCFullYear() : value.getFullYear()),
			month: String((isMidnightUtc ? value.getUTCMonth() : value.getMonth()) + 1).padStart(2, '0'),
			day: String(isMidnightUtc ? value.getUTCDate() : value.getDate()).padStart(2, '0'),
		};
	}

	if (typeof value === 'string') {
		const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
		if (match) return { year: match[1], month: match[2], day: match[3] };
	}

	return undefined;
}
