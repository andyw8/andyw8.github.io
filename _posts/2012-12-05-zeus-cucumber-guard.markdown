---
layout: post
title: "Using Zeus with Cucumber and Guard"
date: 2012-12-05 14:13
comments: true
external-url:
categories: ruby bdd cucumber
---

[Zeus](https://github.com/burke/zeus) is rapidly overtaking [Spork](https://github.com/sporkrb/spork) as the tool of choice to speed up running Cucumber integration tests against Rails apps.

I wanted to use Zeus alongside [Guard](https://github.com/guard/guard) to provide a rapid feedback cycle when doing BDD. This ended up being quite fiddly to get working, and it seems not many people are doing this yet, so here I will describe my configuration.

These instructions are for Mac OS X 10.8. On other platforms you'll probably need to pick different gems for notifications and filesystems events.

## Gemfile

Zeus seems to be picky about which groups it loads gems from, depending on what command you're running. The configuration below works for me, but may not be optimal:

{% highlight ruby %}
# just an extract

group :development do
  gem 'guard', '~> 1.5.4'
  gem 'guard-cucumber', '~> 1.2.2'
  gem 'guard-rspec', '~> 2.3.0'
  gem 'rb-fsevent', '~> 0.9.2'
end

group :development, :test do
  gem 'rspec', '~> 2.12.0'
  gem 'rspec-rails', '~> 2.12.0'
end

group :test do
  gem 'capybara-webkit', '~> 0.7.1'
  gem 'cucumber-rails', '~> 1.1.0', :require => false
  gem 'terminal-notifier-guard' # Mac OS X 10.8 only
  gem 'zeus', '~> 0.12.0'
end
{% endhighlight %}

I've specified versions to show which combination worked for me. As some of these gems need to interact closely with each other, you need to be careful when upgrading in order to keep them 'in sync'.

Note that the Zeus gem is listed in the `:test` group, even though I'm not running Zeus through Bundler. I'm not entirely sure why it has to be here, but I get an error *zeus is not part of the bundle* when it's not present.

## Guardfile

My Guardfile is fairly standard. [guard-rspec](https://github.com/guard/guard-rspec) already has support for Zeus, so all I had to do was enable `zeus` and disable `bundler`:

{% highlight ruby %}
guard 'rspec', zeus: true, bundler: false do
  ...
end
{% endhighlight %}

[guard-cucumber](https://github.com/guard/guard-cucumber) doesn't have built-in support for Zeus, but the `command_prefix` setting can be used instead:

{% highlight ruby %}
guard 'cucumber', command_prefix: 'zeus', bundler: false do
  ...
end
{% endhighlight %}

## Booting Up

Start Zeus without using Bunder:

{% highlight bash %}
$ zeus start
{% endhighlight %}

Then start Guard via Bundler:

{% highlight bash %}
$ bundle exec guard
{% endhighlight %}

Now you can start building!
