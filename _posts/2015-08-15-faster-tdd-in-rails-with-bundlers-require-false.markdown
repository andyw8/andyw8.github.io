---
title: "Faster TDD in Rails with Bundler's 'require: false'"
layout: post
---
One of the famous benefits of Rails is *convention over configuration*.
Many things which need to be handled manually in other frameworks are handled automatically for us by Rails.
However, there are usually trade-offs to be aware of.

If you've seen Java or C# code, you'll be familiar with there being a list of `import` or `using` statements at the top of each class.
And if you've written Ruby code outside Rails, you'll know that you have to call `require`, or perhaps `require_relative` to call code from another file.

In Rails, it's normal for all of the app's classes and modules to be automatically loaded on boot.
This means any module or class is callable from anywhere else in the app.

This also applies to any gems that your app uses.
After you create new application, you'll find the following code in `config/application.rb`:

{% highlight ruby %}
# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)
{% endhighlight %}

This means that, based on your Rails environment, only gems matching that group will be loaded when Rails starts up.
If a gem isn't within any particular group, then it will be loaded regardless of the Rails environment.

## The problem with Bundler.require

If you've ever worked on a long-running Rails project, you'll have noticed that startup time gradually creeps up over time.
This is often due to the accumulation of many gems.

Loading each gem takes time.
There is the filesystem overhead, since gems often contain hundreds of files.
There is a parsing overhead, as Ruby loads all the modules and classes defined and verifies the syntax.
And there may also be an initialization process for the gem.

This process typically takes in the order of 10ms to 100ms per gem, based on its complexity.
That doesn't sound like much, but once your app grows, that can add additional seconds to the time to start the Rails server, the Rails console, any generators, or any rake tasks.

But most importantly, they add to the overhead of running a single test.
Despite DHH's position, many of us still strongly believe that TDD is useful approach for writing clean code and to help drive good design.

If it takes ten seconds to run a single test, a developer is less likely to run tests as often.
This means mistakes are not caught quickly, and it becomes necessary to backtrack.
It's much easier to fix code you wrote 10 seconds ago than 10 minutes ago.

## The solution

By using `require: false`, gems will not be loaded until the first time where they're explicitly required.

This means it's up to you to decide when to require each gem.
Normally, you'll do so close to where you actually make use of them.

At that point you will still have the load-time overhead, but the difference is that this will now be limited to a particular subset of the app, rather than happening every time on startup.

## An example

Let's say your writing some code which needs to extract all the URLs of all the links within a web page.
We'll use HTTParty to fetch the content, and Nokogiri to parse it.

{% highlight ruby %}
# Gemfile
gem 'httparty', require: false
gem 'nokogiri', require: false
{% endhighlight %}

We *could* require these gems manually in our class immediately before they're needed:

{% highlight ruby %}
class LinkParser
  def initialize(url)
    @url = url
  end

  def links
    require 'nokogiri'
    doc = Nokogiri.parse(html)
    doc.all('a').map do |link|
      link[:href]
    end
  end

  private

  def html
    require 'httparty'
    HTTParty.get(@url).body
  end
end
{% endhighlight %}

But I think calling `require` from within a class feels a little awkward.
My preference, and the Ruby convention, is to group all the `require` calls together at the top of the implementation.
This means you can see all of a classes dependencies at a glance:

{% highlight ruby %}
require 'nokogiri'
require 'httparty'

class LinkParser
  # ...
end
{% endhighlight %}

This list also acts as a form of design feedback – if your class has lots of
dependencies then it probably has too many responsibilities and should be split
up.

Remember, there is no harm in calling `require` twice for the same path. Ruby
will recognize that the file has already been loaded, and ignore the call.

## But what about Spring?

Tools such as Spring or Zeus attempt to solve the slow startup problem by keeping Rails loaded in memory.
But there are some important downsides.

The first, and usually most common objection to Spring is that it can lead to confusing situations where changes are not reloaded.

The second is less obvious but more important.
Recently there has been a movement towards keeping the majority of application code in classes which are not dependent on Rails.
The `rspec-rails` gem now helpfully generates both a plain `spec_helper` and a `rails_helper`, so that you choose to test your class in isolation from Rails.

However, once you add Spring to your project, Rails will always be loaded, so's it very easy to accidentally make your
class implicitly dependent on Rails, a gem, or another class, without even realising so.

## Update: Benchmarks

A few people have ask for benchmarks, so I've added this section to show some measurements.

I've taken the Gemfile from [Discourse](https://github.com/discourse/discourse) as it's a reasonable-sized, production Rails app.

I had to make some small modifications which you can see in [this gist](https://gist.github.com/andyw8/3c8403490febee3d60e2).

Let's first measure how long it would take to require all the gems in the
`default` and `test` groups. This is equivalent to requiring each gem in the
traditional way, without the `default: false` option.

{% highlight sh %}
$ time bundle exec ruby -e 'Bundler.require(:default, :test)'
bundle exec ruby -e 'Bundler.require(:default, :test)'  3.90s user 1.40s system 95% cpu 5.527 total
{% endhighlight %}

Now let's run with `Bundler.setup`, which is the equivalent of setting `default: false` for every gem:

{% highlight sh %}
$ time bundle exec ruby -e 'Bundler.setup(:default, :test)'
bundle exec ruby -e 'Bundler.setup(:default, :test)'  1.19s user 0.16s system 98% cpu 1.375 total
{% endhighlight %}

(I ran these several times to get an average time. My machine is a 2013 MacBook Air).

So, the difference is over four seconds, which is very significant when you're doing real TDD and running hundreds of tests over the course of a day.
