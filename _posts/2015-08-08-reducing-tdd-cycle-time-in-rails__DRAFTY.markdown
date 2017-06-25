---
title: Reducing TDD cycle time in Rails, and why Spring is not the answer
layout: post
draft: true
published: false
---

Most Rails developers are familiar with the TDD cycle of Red, Green, Refactor.

In this post, I want to talk about how shortening the duration of that cycle
helps to...


There's lot of discussion about speeding up a whole test suite. But what I want
to focus on here is the startup (or 'latency') of one in individual test, or
test file.


Implicit behaviour makes it more difficult to reason about a particular class.

I'll demonstrate how you should be able to run most individual tests in less
than a second.

This focuses on Rails and RSpec but I expect applicable elsewhere.

I strongly believe that a key of this technique is reducing the cycle time
between 

Make it pass or change the error

### Trigger the tests from within your editor

I'm still surprised by how many experienced developers manually switch to a terminal session to run a test.
This often involves having to to type the path to the file, and the line number of the test being executed.

Every editor I know of has a way to support running tests from within the editor.

In vim I use the mapping `<Leader>-s`. This runs the spec on the line where my cursor is.

For tests which don't rely on Rails (I'll talk about this later), this allows me 

It can certainly be confusing to this up initially, especially when dealing with
the overhead bundler and of RVM/rbenv/etc. and 


I'm going to assume RSpec but many of these principles will apply to other frameworks.

Testing classes in isolation makes it much easier to reason about their behaviour.

By default, Rails will `require` every gem listed in your Gemfile. This overhead
may only 20ms or so per gem, but in total this can add up.

### Avoid requiring gems unnecessarily

Aim to minimise the number of entries from your Gemfile by making good use of groups.

Some gems will only be needed in production. Some gems 

### Use `require: false` where you can.

Most gems don't need to be globally required in this way. If you make use of a
gem in only one place in your 

### Decouple your app from Rails

* Link to Bob Martin talk?




# Use the appropriate `spec_helper`

rspec-rails 3 made a small, but very significant change.

Since rspec-rails 3, running the `rspec:install` generator will output both a `spec_helper` and `rails_helper` file.

Using `spec_helper` means that Rails won't be loaded automatically.
This means tests can be run in a fraction of a second.

But the real benefit is not just about speed.

I strongly believe that decoupling your code from the Rails framework leads to better design.
There are a number of reason for this:

* When dependencies aren't automatically loaded, you need to manually require them in your class.
These `require` calls provide a visual cue as to how to how dependent your class is on other things. 
Five or more would be warning sign.

* `rails_helper`
* `spec_helper`
* `active_record_spec_helper`

### Use an ActiveRecord spec_helper




# Make dependencies explicit (in the implementation, not the test)

## TODO:

Benchmarks

### So what about Spring?

For several years there has been approaches at speeding up the Rails TDD cycle.
The current is Spring, which is now part of the default Rails stack.

Once the `rspec` binary is 'Springified', Rails will always be loaded when running a spec.

This 

You don't ever need to require `rails_helper`.

## Real World Example - URI builder?

You need to manually require dependencies.
Dependencies are listed explicitly.

```
require 'uri'

class WidgetServiceUri
  HOST = "example.com"
  PATH = "/widgets"

  def initialize(widget_id)
    @widget_id = widget_id
  end

  def to_s
    URI::HTTPS(host: HOST, path: path, query: query)
  end
end
