---
layout: post
title: "Ruby Kata Template"
date: 2022-04-09
published: true
---

Recently I've been aiming to do more [katas](http://codekata.com/), both in my personal time, and at [work](https://shopify.engineering/) in our [Deliberate Practice](https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_22/README.md) group.

I noticed that whenever I was starting on a new kata, I was doing the same basic setup repeatedly before being able to write a first test. I also felt I was missing some of the configuration that my other 'real' projects benefited from.

This led me to create [ruby-kata-template](https://github.com/andyw8/ruby-kata-template). By clicking on **Use this template**, I get a new blank project in seconds, configured to my preferences.

## Feature Overview

### Starting Points

I've provided an empty Project (`project.rb`) and a corresponding test (`project_test.rb`). I expect the first step in most katas will be to rename these.

### Directory Structure

I've followed the standard Ruby convention of the implementation being in `lib/` and the tests in `test/`

### Minitest

Although Minitest is already provided as a Bundled gem with Ruby, it is included in the `Gemfile` to ensure we're on the latest version. (I've RSpec extensively in the past, but my current preference is Minitest).

### ActiveSupport::TestCase

`ActiveSupport::TestCase` is part of Rails but here we are using it independently. It allows you to write 'declarative' tests, e.g. `test "it works" do...` rather than `def test_it_works`, which I feel is more readable.

### Rake Task

It's common on Ruby apps to have `rake` or `rake test`, so we provide that. It has support for [both MiniTest naming conventions](https://minitest.rubystyle.guide/#file-naming) (`test_*.rb` and `*_test.rb`)

### Standard

[Standard](https://github.com/testdouble/standard) is an opinionated RuboCop configuration. 

For me, the real value of Standard (or RuboCop) is only apparent when you have two things configured in your editor:
* Immediate feedback (your editor highlights problems as you code)
* Auto-formatting (you can fix issues with one single shortcut, or automatically when the file is saved).

There are various ways to set up this, but the template uses `rubocop-lsp`.

### rubocop-lsp

[rubocop-lsp](https://rubygems.org/gems/rubocop-lsp) is a gem which implements the [Language Server Protocol](https://en.wikipedia.org/wiki/Language_Server_Protocol). It allows for a close integration between your editor with RuboCop. It avoids the overhead of starting RuboCop, meaning linting or auto-correction is near-instant. 

To use it, you'll also need an plugin/extension for your editor. The template is set up to recommend the VS Code [Shopify.rubocop-lsp](https://marketplace.visualstudio.com/items?itemName=Shopify.rubocop-lsp) extension.

### And more

Take a look at the [README](https://github.com/andyw8/ruby-kata-template#readme) to learn what else is included.
