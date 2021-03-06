---
layout: post
title:  "Speed up your TDD by refactoring rails_helper.rb"
date:   2020-03-14
published: true
---

Having a fast feedback cycle is critical element of successful test-driven development.
You should be able to run a single test within one second.

If you use rspec-rails, and your app has been around for more than a few years, the chances are that your `rails_helper.rb` has accumulated a lot of cruft.
This increases the time it takes to run a single test, probably to several seconds at least.
As this usually happens gradually, it often goes unnoticed by those who work in a codebase every day.
Developers may become accustomed to waiting ten seconds or more to run a single test.

The default `rails_helper.rb` generated by the rspec-rails installer is minimal and fast. There are a variety of things which tend to be added which slow it down:

- Seeds tasks (such as from seed_fu).
- Requiring of all files within `spec/support` (older versions of rspec-rails defaulted to this but this approach is now discouraged by the RSpec team).
- Global RSpec hooks such as `Before` and `After`
- Libraries to manage database state, such as DatabaseCleaner
- Setup for browser testing tools, such as Capybara
- Miscellaneous other testing support libraries.

Some of these will have a much bigger impact than others.
You can use profiling tools to better understand the contribution of each.

## Overview

The key to speeding up the TDD cycle is to only load what's needed for a specific test.
This strays from Rails' convention of having everything auto-loaded, but I would argue it's a worthwhile trade-off.

(Note that this will probably not have any impact on your overall test suite time. The focus here is on the time for running an individual test or test file).

Refactoring your whole test suite at once could take some time, perhaps several days for a large app.
We want to do it gradually, in small steps, so that test suite stays green. Here's how.

## Implementation

First, we rename the existing `rails_helper.rb` to something like `legacy_rails_helper.rb`.

We then update the existing references to that file with the new filename, which should be a simple global search and replace in your editor.

Run your tests suite to ensure everything is still passing.

Next, we create a 'clean slate' `rails_helper.rb`. An easy to do this is by re-running the rspec-rails generator, i.e. `rails generate rspec:install`.

Now, find a relatively basic test in your test suite. It's usually easier to start with focused unit tests rather than integration tests, since they typically have more dependencies.

Change the test to run with the new `rails_helper.rb`. If it passes, then great, we're done.

Note that it's important to verify that the tests passes individually. If you run the whole suite, a previously run test may have already loaded a necessary dependency. Since RSpec runs the tests in a random order, this may result in a false positive.

But what if the test fails? Often the test output will indicate that the failure is due to a missing dependency.

There are a few courses of action you can take to resolve this:

- You can determine what lines in `legacy_rails_helper.rb` are needed, and copy them to your `rails_helper.rb`.
- You can use custom hooks so that particular lines are only executed for tests that are tagged with that hook name.
- You can copy only what's required for that specific test.

Let's talk about the pros and cons of each.

If we always copy the code back into `rails_helper.rb` then we'll end up close to where we started.
So we should reserve that for dependencies which are used in a large number of tests, e.g. something like FactoryBot.

What about hooks? RSpec lets us run specific code for tests with a particular tag:

```ruby
RSpec.configure do |config|
  config.before(:db) do
    require "some-library"
  end
end
```

This can be useful, but the downside is that we're adding a layer of indirection.
A developer reading the test would need to know what a particular tag represents.

The last approach is to be explicit about each test's dependencies, for example:

```ruby
require "rails_helper"
require "some-library"
```

While this might result in a little more typing, it's an effective way to manage dependency loading.

## Communicating the Change

If you're working on a team, you'll want to ensure that while the changeover is in progress, new tests are written using the new `rails_helper.rb`.
This is something you could also add to your project's README or developer documentation so that others joining the team are also aware.
You could also use a custom RuboCop check.

## Final Steps

Eventually, you'll have moved every test over to the new `rails_helper.rb`. You can now delete `legacy_helper.rb`. You may also discover there gems in your Gemfile which are no longer needed, and can be dropped. You may also be able to remove unused files from `spec/support` if they are no longer referenced.
