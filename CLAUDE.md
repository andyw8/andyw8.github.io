# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Repo

Personal website and blog for Andy Waite, built with Jekyll using the Minima theme. Deployed via GitHub Pages.

## Commands

```bash
# Install dependencies
bundle install

# Serve locally with live reload
bundle exec jekyll serve

# Build static site
bundle exec jekyll build
```

## Content Structure

- `_posts/` — Blog posts in Markdown, named `YYYY-MM-DD-slug.md` or `.markdown`
- `_config.yml` — Site settings (title, URL, plugins)
- `*.md` — Top-level pages (about, contact, resume, work)
- `assets/` — Static assets

## Creating New Posts

When creating a new post:

1. Run `date` to verify the current date before naming the file.
2. Name the file `YYYY-MM-DD-slug.md` under `_posts/`.
3. Always set `published: false` in the front matter initially.

The target audience is senior/staff developers — assume deep technical knowledge and avoid over-explaining fundamentals.

## Plugins

- `jekyll-feed` — RSS feed
- `jekyll-redirect-from` — URL redirects via `redirect_from:` front matter

## CI

Dependabot PRs for non-major updates are auto-approved and auto-merged via `.github/workflows/dependabot_automerge.yml`.
