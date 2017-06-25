---
layout: post
title: "Minimal Rakefile for RSpec, Cucumber and Jasmine"
date: 2013-02-28 12:30
comments: true
external-url:
categories: rspec cucumber jasmine bdd rake
published: true
draft: false
---
I found I was repeatedly Googling for the Rakefile configuration to run various kinds of tests, so for my own reference, and hopefully someone else's, here's an example:

{% highlight ruby %}
require 'rspec/core/rake_task'
require 'cucumber/rake/task'
require 'guard/jasmine/task'

RSpec::Core::RakeTask.new
Cucumber::Rake::Task.new
Guard::JasmineTask.new

task :default => [:spec, :cucumber, 'guard:jasmine']
{% endhighlight %}

Note that you'll need the [guard-jasmine]("https://github.com/netzpirat/guard-jasmine") gem for the Jasmine task.
