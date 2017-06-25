---
title: "Prevent Accidental Coupling in Rails"
layout: post
---
I'm a strong proponent of separating application code from the Rails framework.
It leads to better design, and allows for faster feedback when doing TDD.

RSpec 3 encourages this approach by providing separate helpers for code which depends on Rails, and that which doesn't.

But there are some ways you can end up coupling your code to Rails without realizing it.

Let's say we're writing a very simple validation class which we want to isolate from Rails.
We've installed the `rspec-rails` gem and run the installer, so we have a `.rspec` file which contains:

{% highlight sh %}
--color
--require spec_helper
{% endhighlight %}

This means that `spec_helper.rb` will be automatically available in our tests, so we don't need to require it.
It provides only a minimal setup so we do need to manually require the class being tested:

{% highlight ruby %}
require "validator"

RSpec.describe Validator, ".call" do
  it "returns true if a name is provided" do
    result = Validator.call("foo")

    expect(result).to be(true)
  end
end
{% endhighlight %}

Notice how we aren't using `rails_helper`, since this shouldn't depend on Rails.
Here's our implementation:

{% highlight ruby %}
class Validator
  def self.call(name)
    name.present?
  end
end
{% endhighlight %}

Let's run `rake` to check it's working:

{% highlight sh %}
% bundle exec rake

Finished in 0.00296 seconds (files took 1.94 seconds to load)
1 example, 0 failures
{% endhighlight %}

Looks good. But now, let's try running just that one test in isolation:

{% highlight sh %}
% bundle exec rspec spec/validator_spec.rb

Failures:

  1) Validator.call returns true if a name is provided
     Failure/Error: result = Validator.call("foo")
     NoMethodError:
       undefined method `present?' for "foo":String
     # ./lib/validator.rb:5:in `call'
     # ./spec/validator_spec.rb:5:in `block (2 levels) in <top (required)>'
{% endhighlight %}

It fails. Confused?

The error message gives us a clue to what's happening.
The `#present?` method is added by ActiveSupport, and isn't part of Ruby.
When running the full test suite with `rake`, Rails will be autoloaded, and the tests which use `spec_helper` are no longer isolated.

This is trivial example, but there are many more subtle ways in which code can end up accidentally dependent on parts of Rails, or other parts of your application.
This often makes it more difficult to reason about behaviour.

So how do we make it pass?
In this case it's simple.

We could replace the use `#present?` with our own check such as, `name != ""`.
Or we could pull in just the small part of ActiveSupport which we actually need:

{% highlight ruby %}
require "active_support/core_ext/object/blank"
{% endhighlight %}

This could be put in either the spec or the implementation, but it makes more sense to have it in implementation so that the dependencies are explicit.

## Prefer Explicit over Implicit

The act of listing dependencies provides a valuable form of design feedback.
If a class has a large number of dependencies, then it's probably violating
the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).

## Prevention

The simplest way to reduce the chance of accidentally introducing these kinds of couplings is to be in the habit of running specs individually. If you do TDD by the book, then this shouldn't be a problem.
You should only need to run the full suite occasionally, e.g. before pushing.

## Spring

If your project uses Spring, this can lead to further complications.
As Spring pre-loads Rails, the Rails environment is always present.
To run a spec without Spring, you need pass an environment setting to the Springified RSpec executable:

{% highlight sh %}
% DISABLE_SPRING=1 bin/rspec spec/validator_spec.rb
{% endhighlight %}

or run it via `bundle exec`, which bypasses Spring:

{% highlight sh %}
% bundle exec rspec spec/validator_spec.rb
{% endhighlight %}

## Selectively enabling Spring

Ideally we want to use Spring only when the spec uses `rails_helper`.

If you normally run tests from within your editor, e.g. with [vim-spec](https://github.com/thoughtbot/vim-rspec),
you could write a function to skip Spring if the spec uses `rails_helper`, e.g.:

{% highlight vim %}
let [rails_helper_line, rails_helper_col] = searchpos('require.*rails_helper')
" check column number in case line is commented out
if rails_helper_line > 0 && rails_helper_col == 1
  let command = "rspec"
else
  let command = "DISABLE_SPRING=1 rspec"
endif
{% endhighlight %}

## Finding existing coupling

If you've already separated your Rails and non-Rails specs, and want to verify that you don't have any accidental Rails coupling, you can run:

{% highlight sh %}
find . -name "*_spec.rb" -print | xargs -n 1 bundle exec rspec
{% endhighlight %}

It may take a while to run on large test suites.
