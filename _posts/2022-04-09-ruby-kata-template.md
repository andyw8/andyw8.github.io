---
layout: post
title: "Ruby Kata Template"
date: 2022-04-09
published: true
---

Recently I've been aiming to do more [katas](http://codekata.com/), both in my personal time, and at [work](https://shopify.engineering/) in our [Deliberate Practice](https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_22/README.md) group.

I noticed that whenever I was starting on a new kata, I was doing the same basic setup repeatedly before being able to write a first test. I also felt I was missing some of the configuration that my other 'real' projects benefited from.

This led me to create [ruby-kata-template](https://github.com/andyw8/ruby-kata-template). Clicking on **Use this template** will give you a new blank project in seconds.

## Feature Overview

### Minitest

Although Minitest is already provided as a Bundled gem with Ruby, it is included in the `Gemfile` to ensure we're on the latest version. (I've RSpec extensively in the past, but my current preference is Minitest).

### Starting Points

I've provided an empty Project (`project.rb`) and a corresponding test (`project_test.rb`). I expect the first step in most katas will be to rename these.

### Directory Structure

I've followed the standard Ruby convention of the implementation being in `lib/` and the tests in `test/`

### And more

Take a look at the [README](https://github.com/andyw8/ruby-kata-template#readme) to learn more about what's included.
