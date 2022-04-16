---
layout: post
title: "A GitHub Actions Rails CI Workflow in 5 lines"
date: 2022-04-15
published: true
---
A few years ago, Matt Swanson wrote a [great post](https://boringrails.com/articles/building-a-rails-ci-pipeline-with-github-actions/) on setting up Rails CI on GitHub Actions. It quickly became my go-to reference for setting up CI for new apps.

Over time, I made few updates and adjustments to it, so whenever I started a new project I would copy the config from one of my older projects.
But this meant each project gradually became inconsistent, and some got updated more than others.

I wanted to have one single base workflow for all my apps, so that if I made a change, all the apps could easily benefit from it.

## Reusable Workflows

In November 2021, GitHub announced that [Reusable Workflows][1] was generally available.

[1]: https://github.blog/2021-11-29-github-actions-reusable-workflows-is-generally-available/

Although GitHub Actions has supported composite actions for a long time, Reusable Workflows allows for a much more concise configuration, and the ability to reference a whole workflow from another repository, rather than having to build up each step individually.

[Read more about it on GitHub's blog](https://github.blog/2022-02-10-using-reusable-workflows-github-actions/).

## Introducing setup-rails

Using the Reusable Workflows feature, I've created **[setup-rails](https://github.com/andyw8/setup-rails)** for quickly and easily enabling CI for Rails apps.

By creating a single file in your repo, e.g. `.github/workflows/verify.yml`, with the contents below, you should have a working CI workflow which configures the database and runs your app's tests:

```yaml
name: Verify
on: [push]

jobs:
  verify:
    uses: andyw8/setup-rails/.github/workflows/verify.yml@v1
```

You can take a look at [this example app](https://github.com/andyw8/setup-rails-example-app) to see it in action.

The first time you run the workflow may be slow, but subsequent runs should be much faster once the dependencies are cached.

I’ve also shared a [Railsbyte](https://railsbytes.com/templates/VMys8A) so that you can set this up with one command:

`rails app:template LOCATION="https://railsbytes.com/script/VMys8A"`

## Principles and Configuration

I designed `setup-rails` so it should work at a basic level with no configuration needed for most apps.

There are a few options you can enable depending on your app, such as RuboCop, Bundler Audit and RSpec - see the [README](https://github.com/andyw8/setup-rails) for details.

Currently only Postgres is supported but I'd like to expand to cover at least MySQL.

## Enhancements

Building upon Matt's great starting point, I made a few updates:

- Uses the latest versions of `setup-node` and `setup-ruby`
- Adds support for `rails test` (e.g. Minitest) as well as RSpec
- [Enabled Dependabot](https://github.com/andyw8/setup-rails/blob/main/.github/dependabot.yml) for updates of the actions that `setup-rails` depends on
- Uses `setup-node`'s JavaScript caching rather than a custom approach
- Skips `development` gems when running Bundler to avoid unnecessary work.

## Get Involved

I'm already using this on most of my apps, but I'd love to get wider feedback.

Please try [setup-rails](https://github.com/andyw8/setup-rails) on your app and let me know how it works for you. Issues and pull requests are welcome!
