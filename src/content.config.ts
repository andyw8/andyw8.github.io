import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
	// Posts stay in the Jekyll-compatible `_posts` directory so existing
	// filenames (and their git history) are preserved.
	loader: glob({ base: './_posts', pattern: '**/*.{md,markdown}' }),
	schema: z.object({
		title: z.string().optional(),
		date: z.union([z.string(), z.date()]).nullish(),
		categories: z.union([z.string(), z.array(z.string())]).nullish(),
		// Jekyll used `published: false` to keep a post out of production builds.
		published: z.boolean().default(true),
		// Astro's own draft flag, also respected.
		draft: z.boolean().default(false),
		reddit_url: z.string().optional(),
	}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,markdown}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// Kept for reference; routes are defined explicitly for these pages.
		permalink: z.string().optional(),
	}),
});

export const collections = { posts, pages };
