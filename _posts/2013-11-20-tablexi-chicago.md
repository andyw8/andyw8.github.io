---
layout: post
title: "Coding Tour: TableXI, Chicago"
date: 2013-11-20 20:04
comments: true
external-url:
categories:
draft: false
published: false
---
[TableXI](http://www.tablexi.com/) are based in a spacious loft-style office in the West Loop area of Chicago. The place has lots of nice touches highlighting the history and culture of the company, such as the recreation of their logo using just pins and string:

![Logo](http://i.imgur.com/1Rl22dv.jpg)

- - -

The coolest time to visit must be summer, when they run their own rooftop cinema on top the building!

The office design includes a professional kitchen. A chef cooks the team lunch each day, which encourages everyone to spend time together.

![Kitchen](http://i.imgur.com/4j3MAS4.jpg)

They're very supportive of the Chicago software development community, and sponsor or host many events:

![Chalkboard](http://i.imgur.com/VmcBK4o.jpg)

They often have guests working in the office, so today I was grateful to pair with [Zack Briggs](http://twitter.com/theotherzach) of [Test Double](http://www.testdouble.com/). He was working on a Chrome plugin using Angular.js for measuring JavaScript performance.

Below is a bunch of miscellaneous notes, observations and links from today:

* [Logitech Conference Cam](http://www.amazon.com/dp/B0083I7Y8W)
* [Lo-Dash](http://lodash.com/) is a Underscore.js replacement, with benefits including faster performance
* Backbone tends to be significantly slower than Angular or Ember - you can see this on the [TodoMVC](http://todomvc.com/) site after adding about 30 items.
* Angular's use of additional attributes may feel awkward at first, but it means there's almost never a need to add IDs or classes solely for behaviour
* Angular's `ng-repeat` makes dealing with collections much cleaner than using subviews
* The use of the pipe character (|) in Angular seems slightly odd at first - [StackOverflow post](http://stackoverflow.com/questions/15223447/syntax-for-ng-repeat-angular-directive-and-pipe-character)
* [Backbone.js has nicely annoted source](http://backbonejs.org/docs/backbone.html)
* NPM solves the problem of competing dependencies by having multiple copies of a dependant library. Rather different from RubyGems.
* Sometimes code can be "so DRY that it's chafing"
* [Dev Bootcamp](http://devbootcamp.com/), another Chicago company.
* [Backbone.js: .listenTo vs .on](http://stackoverflow.com/questions/16823746/backbone-js-listento-vs-on) to avoid phantom views
* [Chrome Canary](https://www.google.com/intl/en/chrome/browser/canary.html) can be a useful sandbox if you're building an extension and don't want to mess up your main browser
* [Alfred](http://www.alfredapp.com/), an alternative to QuickSilver, LaunchBar, etc.
* [An Intervention for ActiveRecord](http://www.youtube.com/watch?v=yuh9COzp5vo)
* Some recommended Destroy All Software episodes covering VIM and shell: [Processes and Jobs](https://www.destroyallsoftware.com/screencasts/catalog/processes-and-jobs), [File Navigation in Vim](https://www.destroyallsoftware.com/screencasts/catalog/file-navigation-in-vim), [The .vimrc](https://www.destroyallsoftware.com/screencasts/catalog/the-vimrc)
* All the Vim you need to get started and be productive can easily fit on an index card
* I knew some of the common Bash keyboard shortcuts, but I never realised they were inspired by emacs. You can also set bash to use vi mode.
* [Golden Gate Ruby Conference 2010 - Workflow - Ryan Davis](http://www.confreaks.com/videos/364-gogaruco2010-workflow)
* [Nobody will train you but you](http://www.confreaks.com/videos/2427-railsconf2013-nobody-will-train-you-but-you) - Zach's talk from RailsConf 2013
* [Oh My ZSH](https://github.com/robbyrussell/oh-my-zsh)
* Consider setting your shell prompt to indicate a dirty index or untracked files (see [this StackOverflow post](http://stackoverflow.com/questions/2657935/checking-for-a-dirty-index-or-untracked-files-with-git))
* When you set a breakpoint in JavaScript, you can hover over variables to see their current state
* When your pair with someone, you often learn more about improving your workflow than improving your coding
