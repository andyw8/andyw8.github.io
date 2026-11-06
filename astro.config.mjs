// @ts-check

import mdx from '@astrojs/mdx';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://andywaite.com',
	// Keep the legacy Jekyll URLs: posts end in `.html` while pages such as
	// `/about/` stay directory-style.
	trailingSlash: 'ignore',
	build: {
		format: 'preserve',
	},
	// A custom `/sitemap.xml` endpoint is used instead of @astrojs/sitemap so that
	// the legacy `.html` post URLs are listed exactly as published.
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
