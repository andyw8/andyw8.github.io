---
layout: post
title: "Using hk for git pre-commit hooks in Ruby and Rails projects"
date: 2026-08-14
published: true
---
## Introduction

In this post I'll briefly explain what git hooks are, introduce [`hk`](https://hk.jdx.dev), and show some practical examples of using it with Ruby and Rails projects. 

## Git hooks

Git hooks are shell scripts which run automatically in response to particular events. These are usually written to a hidden `.git/hooks` directory, either per project, or globally in your home directory.

The most commonly used kind of Git hook is a `pre-commit` hook, typically used for linting and formatting. 

While you can write hooks by hand, people typically make use of hook manager tools. These usually provide higher-level abstractions, or make it easier to share hooks within a team, and keep them up to date. Common tools include:

- [Husky](https://github.com/typicode/husky) (written in JavaScript) - popular in the Node/JS world
- [pre-commit](https://pre-commit.com) (written in Python)
- [Overcommit](https://github.com/sds/overcommit) (written in Ruby)
- [Lefthook](https://github.com/evilmartians/lefthook) (written in Go) - by Evil Martians, who are well-known in the Ruby world

## Other approaches

Although git hooks have been around for a long time, I have found that they are not so commonly used. Instead, people would usually rely on their editor for linting, and make use of format-on-save, for example with [Ruby LSP](https://github.com/Shopify/ruby-lsp).

Now that more and more code is being written by agents, there is often no editor tooling involved so that approach fails. You could use a prompt (e.g. in `CLAUDE.md`) to make your agent to be aware of your linting tools, but this is not ideal:

* It's slow. The latency as the agent goes back and forth with the linting/formatting tools is a drag.
* It's a waste of tokens and context.
* The agent behaviour is non-deterministic, so even if it *usually* runs the linting/formatting, it may occasionally neglect to.

The one thing that we should aim for is to **always** catch linting/formatting issues before CI runs, to avoid wasteful cycles.

With hooks, we can have consistency and reliable linting and formatting for both human-authored and agent-authored code.

## Introducing hk

[`hk`](https://hk.jdx.dev) is a project by [Jeff Dickey (`jdx`)](https://jdx.dev) who is also the author of [`mise`](https://mise.jdx.dev), a popular tool for managing development environments.

It was first [announced](https://github.com/jdx/mise/discussions/4434) in February 2025. It fills a similar role to the tools listed above, but has some particular areas of emphasis:

- Performance: It's written in Rust and design so that tools can run concurrently, and knows to only run on modified files.
- Ease of configuration: It includes helpful defaults ("builtins") for a wide variety of ecosystems.
- Low friction: It handles aspects such as re-staging of fixes, and doesn't get in the way during git operations such as rebasing.

## Using hk with Ruby

`hk` includes builtins for many common Ruby tools:

- [brakeman](https://hk.jdx.dev/builtins.html#brakeman)
- [bundle-audit](https://hk.jdx.dev/builtins.html#bundle-audit)
- [erb](https://hk.jdx.dev/builtins.html#erb)
- [fasterer](https://hk.jdx.dev/builtins.html#fasterer)
- [reek](https://hk.jdx.dev/builtins.html#reek)
- [rubocop](https://hk.jdx.dev/builtins.html#rubocop)
- [rubocop-server](https://hk.jdx.dev/builtins.html#rubocop-server)
- [sorbet](https://hk.jdx.dev/builtins.html#sorbet)
- [standard-rb](https://hk.jdx.dev/builtins.html#standard-rb)

(I [contributed](https://github.com/jdx/hk/pull/995) `rubocop-server` to take advantage of RuboCop's [`--server` mode](https://docs.rubocop.org/rubocop/latest/usage/server.html)).

## Getting Started

`hk` has good documentation on how to install it, so I won't repeat the general steps here. Instead I'll focus on Ruby and Rails.

Once installed, run `hk init` to create a default `hk.pkl` configuration for your project. This can later be committed to a project to allow others to make use of it.

The default `hk.pkl` has no active steps, so by default it does nothing.

(Sidenote: the configuration format used is `pkl`, pronounced 'Pickle', which I had never heard of before. I was surprised to discover that it's an Apple [project](https://pkl-lang.org)).

## Adding RuboCop

We'll start with RuboCop, since it's so common in the Ruby world. Let's add a step for it:

```pkl
local linters = new Mapping<String, Step> {
["rubocop_server"] = Builtins.rubocop_server {
    prefix = "bundle exec"
}
```

Two things to note:

* We are using `rubocop_server` instead of RuboCop, to avoid the startup overhead.
* We are prefixing the command to ensure it uses the RuboCop version from `Gemfile.lock`, rather than the latest installed gem version.

Note that we don't have to specify the RuboCop command or flags, or be aware of subtleties like the [`--force-exclusion` flag](https://docs.rubocop.org/rubocop/latest/configuration/include_exclude.html). It's already defined as part of the builtin.

Let's test it out by creating a very simple Ruby file without committing it.

```ruby
# demo.rb
puts "hello world"
```
Then run `bundle exec rubocop demo.rb`

If you're using the default RuboCop configuration, you should see two issues reported:

```
demo.rb:1:1: C: [Correctable] Style/FrozenStringLiteralComment:
  Missing frozen string literal comment.
puts "hello world"
^
demo.rb:1:6: C: [Correctable] Style/StringLiterals:
  Prefer single-quoted strings when you don't need string interpolation or special symbols.
puts "hello world"
     ^^^^^^^^^^^^^
```

Now let's try committing that file:

```sh
git add demo.rb
git commit -m "Add demo.rb"
```

You notice that one offense is fixed, but not the other. This is because `Style/FrozenStringLiteralComment` is considered an unsafe autocorrection in RuboCop, as it could _potentially_ change the behaviour of the code.

Since the file is not considered valid, the commit is rejected. We need to manually fix the other offense by adding the `# frozen_string_literal: true` line, and then commit again.

If you were using a coding agent, you could let it handle this fix you. And depending on the model's capabilities, it may be be able to check if `# frozen_string_literal: true` is actually safe or not in this case.

## Adding Herb

Let's now look at how we could add support for a tool which isn't currently natively supported by `hk`.

`hk` has a builtin for `erb` linting, but there's a better, modern linter and formatter for ERB files - [herb](https://herb-tools.dev). Its focus on performance makes it a great match for `hk`.

Although there is a `herb` Ruby gem, the tools we need, `herb-lint` and `herb-format`, are actually npm packages, so we'll first add those to `package.json` as development dependencies:

```json
# package.json
{
  "devDependencies": {
    "@herb-tools/formatter": "0.10.3",
    "@herb-tools/linter": "0.10.3"
  }
}
```

And as `hk` doesn't have a builtin for `herb`, we'll need to add some custom configuration in `hk.pkl`.

```pkl
local linters = new Mapping<String, Step> {
    ["rubocop_server"] = Builtins.rubocop_server {
        prefix = "bundle exec"
    }
    
    ["herb_lint"] {
        glob = List("**/*.html.erb", "**/*.html", "**/*.rhtml", "**/*.turbo_stream.erb")
        exclude = List("node_modules/**/*")
        check = "node_modules/.bin/herb-lint {{ files }}"
        fix = "node_modules/.bin/herb-lint --fix {{ files }}"
    }
    
    ["herb_format"] {
        glob = List("**/*.html.erb", "**/*.html", "**/*.rhtml", "**/*.turbo_stream.erb")
        exclude = List("node_modules/**/*")
        check = "node_modules/.bin/herb-format --check {{ files }}"
        fix = "node_modules/.bin/herb-format {{ files }}"
    }
}
```

Note that we prefix the executable calls with `node_modules/.bin/` to prevent unintentionally falling back to globally installed versions, which could be different per machine.

With this set up alongside RuboCop, you'll now have linting and formatting for almost every file in a typical Rails app.

## Wrapping Up

Along with `mise`, `hk` has become one the tools that I rely on every day as a developer. Whether your writing code by hand, or using an agent, it will catch linting and formatting issues quickly and effectively, allowing you to focus on the more interesting things.
