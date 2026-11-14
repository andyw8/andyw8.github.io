// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://andywaite.com',
	// Keep Jekyll's file layout: posts are written as `<slug>.html` and pages
	// such as `/about/` stay directories. Cloudflare Pages then serves each post
	// at its extension-less path and redirects the `.html` form.
	trailingSlash: 'ignore',
	build: {
		format: 'preserve',
	},
	// A custom `/sitemap.xml` endpoint is used instead of @astrojs/sitemap so that
	// the canonical (extension-less) post URLs are listed exactly.
	integrations: [mdx()],
	markdown: {
		// Match Kramdown's typographic replacements from the Jekyll site.
		smartypants: true,
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
