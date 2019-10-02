---
layout: post
title:  "Migrating from Mocha to rspec-mocks"
date:   2019-09-15
published: true
---

At [Financeit], our main app uses RSpec for the test suite, but didn't use
didn't use rspec-mocks. Instead, it used [Mocha] (not to be confused with the JavaScript library of the
same name) for stubbing and mocking.

We recently decided to switch to use rspec-mocks. Some reasons for this
were:

* We were already using rspec-mocks in other projects.
* There are more reference and training materials for rspec-mocks (books,
  screencasts, blog posts, etc).
* New developers joining the team were typically already familiar with rspec-mocks.

We didn't have any major problems with Mocha itself – it's well-designed, has good
documentation, and a responsive maintainer. The main reason was to have a
simple and consistent stack.

## Approach

As our test suite is large, we knew that an incremental approach would be
needed.

We made use of the [rspec-multi-mock] gem to allow Mocha and rspec-mocks to both
be used at the same time.

We then introduced a policy that new specs should be written using rspec-mocks
rather than Mocha. Our code review process helped to remind developers of this.

Next, we began the process of converting the test suite. Most Mocha has a direct
mapping to rspec-mocks. I created this 'cheatsheet' for easy reference:

|Mocha |rspec-mocks|
------|-----------|
`stub(a: 1)`|`double(a: 1)` |
`mock(a: 1)`|`double(a: 1)` |
`foo.stubs(:a).returns(1)`|`allow(foo).to receive(:a).and_return(1)`|
`foo.expects(:a).returns(1)`|`expect(foo).to receive(:a).and_return(1)`|
`Foo.any_instance.stubs(:a).returns(1)`|`allow_any_instance_of(Foo).to receive(:a).and_return(1)`|

The most obvious way to make these conversions would be using regular
expressions. And although this handles around 80% of conversions, the remainder would
need to manually reviewed and edited, or would need very complex regular
expressions.

As a general rule when changing code with automatic tools, it's better to
modify the AST (Abstract Syntax Tree) than to manipulate strings.

Ruby already has a powerful tools for this: [RuboCop], which makes use of the
[parser] gem, has an auto-correct feature to change code to follow a
preferred style.

## RuboCop Custom Cops

At [Financeit], we have a concept of 'spike weeks'
where developers get to work on something they have a personal interest in.
This gave me an opportunity to explore this area.

RuboCop can be extended with [custom cops] – the documentation is somewhat limited,
so it took some time to get the hang of, but after that I found it to be a very effective
approach.

I worked through the app in stages, beginning with `spec/controllers`, then
`spec/models`, `spec/services`, etc.

The test suite itself helped to verify that the conversions were correct, since
bad conversions should typically result in a syntax error, or a failing test.

I ran into a few situations where the conversion didn't work because of some
strange approaches in the test, so took the opportunity to re-write the test.

We've now converted around 95% of the test suite. We hope to soon reach 100%,
when we can then remove the rspec-multi-mock and Mocha gems.

I've published the RuboCop custom cops as the [mocha_to_rspec] gem.

[Financeit]: https://www.financeit.io
[mocha]: https://github.com/freerange/mocha
[rspec-mocks]: https://github.com/rspec/rspec-mocks
[mocha_to_rspec]: https://github.com/andyw8/mocha_to_rspec
[rspec-multi-mock]: https://github.com/endeepak/rspec-multi-mock
[rubocop]: https://github.com/rubocop-hq/rubocop
[custom cops]: https://github.com/rubocop-hq/rubocop/blob/master/manual/extensions.md
[parser]: https://github.com/whitequark/parser
