---
layout: post
title: "Playing with (RSpec)-Fire"
date: 2013-02-21 22:07
comments: true
external-url:
categories: rspec bdd testing
---
I've heard [rspec-fire](https://github.com/xaviershay/rspec-fire) mentioned in a few talks by [Gary Bernhardt](https://twitter.com/garybernhardt) as a way to keep test doubles in sync with their real classes. This prevents the risk of all the isolated tests passing but the actual app being broken, which is a common concern when doing [GOOS](http://www.growing-object-oriented-software.com/)-style testing where all the collaborators are replaced by test doubles.

Paraphrasing from the rspec-fire README:

  > rspec-fire only checks that the methods exist if the doubled class has already been loaded. No checking will happen when running the spec in isolation, but when run in the context of the full app (either as a full spec run or by explicitly preloading collaborators on the command line) a failure will be triggered if an invalid method is being stubbed.

It took me a little time to get my head around how rspec-fire works, so I've written up a slightly extended example here.

I followed the instructions in the README and found [a small problem](http://stackoverflow.com/questions/15009603/rspec-fire-specs-passing-when-they-shouldnt/15010004#15010004), but within minutes [@myronmarston](https://twitter.com/myronmarston) had fixed it.

Let's start with the class that we want to test. The example in the rspec-fire README inherits from `Struct` to keep things concise, but for clarity let's make it a normal class:

{% highlight ruby %}
class User
  def initialize(notifier)
    @notifier = notifier
  end

  def suspend!
    @notifier.notify("suspended as")
  end
end
{% endhighlight %}

You can check out my code at [https://github.com/andyw8/try-rspec-fire](https://github.com/andyw8/try-rspec-fire).

Here's what the spec for this class would look like, just using RSpec's built-in support for test doubles:

{% highlight ruby %}
describe User, '#suspend!' do
  it 'sends a notification' do
    notifier = double("EmailNotifier")

    notifier.should_receive(:notify).with("suspended as")

    user = User.new(notifier)
    user.suspend!
  end
end
{% endhighlight %}

(Keep in mind that in RSpec, `mock` and `stub` are simply aliases for `double`)

Our `EmailNotifier` would look like this:

{% highlight ruby %}
class EmailNotifier
  def notify(message)
    # ...
  end
end
{% endhighlight %}

Run `rspec spec/user_spec.rb` and this should pass.

Now let's say the requirements change. We want to add an option to specify whether the notification should be in plain text or html. The spec becomes:

{% highlight ruby %}
describe User, '#suspend!' do
  it 'sends a notification in the appropriate format' do
    notifier = double("EmailNotifier")
    format = stub

    notifier.should_receive(:notify).with("suspended as", format)

    user = User.new(notifier)
    user.suspend!(format)
  end
end
{% endhighlight %}

To make this spec pass, we change the user class so that `#suspend!` takes a `format` parameter:

{% highlight ruby %}
class User
  def initialize(notifier)
    @notifier = notifier
  end

  def suspend!(format)
    @notifier.notify("suspended as", format)
  end
end
{% endhighlight %}

The spec now passes. However, if we tried to use this in a real app it would be broken, because we haven't updated our `EmailNotifier` class.

This is the problem that spec-fire solves.

We first need to add a few lines to `spec_helper.rb`:

{% highlight ruby %}
require 'rspec/fire'

RSpec.configure do |config|
  config.include(RSpec::Fire)
end
{% endhighlight %}

And we need one small change to the spec, changing `double("EmailNotifier")` to `fire_double("EmailNotifier")`.

We then re-run the spec, but this time we preload the collaborator:

{% highlight bash %}
$ rspec -I lib -r email_notifier.rb spec/user_spec.rb
{% endhighlight %}

That command looks slightly cryptic. Let's check what the RSpec docs say:

    Usage: rspec [options] [files or directories]

        -I PATH                          Specify PATH to add to $LOAD_PATH (may be used more than once).
        -r, --require PATH               Require a file.

    User#suspend!
      sends a notification (FAILED - 1)

We're telling RSpec to require the real `EmailNotifier` class. When we call `fire_double`, it sees that the real class is loaded, uses that instead of the test double, and so triggers a failure:

    1) User#suspend! sends a notification in html
       Failure/Error: notifier.should_receive(:notify).with("suspended as", :html)
         Wrong number of arguments for notify. Expected 1, got 2.
       # ./spec/user_spec.rb:9:in `block (2 levels) in <top (required)>'

Let's fix `EmailNotifier`:

{% highlight ruby %}
class EmailNotifier
  def notify(message, format)
    # ...
  end
end
{% endhighlight %}

And the specs will now pass when testing against the real `EmailNotifier`.

So why does this all matter?

When all the unit tests are passing, but the actual app is still broken, a common reaction is to add more integration and system tests as a 'safety-net'. But these kind of tests tend to be brittle and slow to run.

We need both kinds of tests, but the vast majority of our test suite should be isolated unit tests.

In his talk [Fast Test, Slow Test](http://pyvideo.org/video/631/fast-test-slow-test), Gary Bernhardt suggests aiming for a ratio of 90/10 between unit and system tests, approaching 95/5 or even 99/1 as time goes on.

rspec-fire gives you greater confidence that the isolated tests' boundaries line up with the real system.
