---
layout: post
title: "Coding Tour: Thoughtbot, Boston"
date: 2013-11-02 07:39
comments: true
external-url:
categories:
draft: false
published: false
---
Thoughtbot's office is next to the scenic [Boston Common][8], and was just a short walk from my hotel.

I first met with Anna, Thoughtbot's office manager, who gave me quick tour and introduced me to [Josh Clayton][4], one of Thoughtbot's managing directors. Coincidentally I'd just heard Josh speaking on the [Giant Robots podcast][10] while I was on the flight over.

Josh had been working on a feature for [factory_girl][1], a testing library which I was already familiar with. The `create_list` method can sometimes be abused, so they've decided to add a `create_pair` method to encourage people to only create a minimal number of test objects. We talked about the best way to test this against the various build strategies and shortly later committed [b9e1dd][2]. A great start to the day!

Next up was the daily standup. It's pretty fast-paced, with about 30 developers involved. Fridays are usually reserved for working on open source projects, or learning a new technology, kind of a '20% time'.

I then paired with [Joel Quenneville][5], building a basic Ember.js app from scratch, without involving any Rails stuff. We had quite a few "Ok, this works, but it shouldn't work!" moments, and overall we both discovered a few new things about Ember.

Lunch at Thoughtbot is catered in-office on Fridays, so I got to meet a few more of the team.

After lunch I paired a bit more with Joel, adding ember-data, and then with [Tony DiPasquale][7] on some iOS code for [TDAudioPlayer][6]. It was interesting to see all the improvements to Objective-C and XCode since I last used it (I tend to use RubyMotion).

Friday afternoons at Thoughtbot ends with a round-table tech discussion. The topic this week was Rails engines, which I've used but aren't deeply familiar with, but it was interesting to hear the lively argued discussion.

I met [Ben Orenstein][9] who I knew of through the Giant Robots podcast and his conferences talks.

The day finished with drinks and dinner at some local bars.

Overall, a great start to my tour! Thanks to everyone at Thoughtbot for being so welcoming.

[1]: http://github.com/thoughtbot/factory_girl
[2]: https://github.com/thoughtbot/factory_girl/commit/b9e1dde7e8bb4497a711487641e751a310fdf996
[4]: https://twitter.com/joshuaclayton
[5]: https://twitter.com/joelquen
[6]: https://github.com/tonyd256/TDAudioPlayer
[7]: https://twitter.com/TonyD256
[8]: http://en.wikipedia.org/wiki/Boston_Common
[9]: https://twitter.com/r00k
[10]: http://podcasts.thoughtbot.com/giantrobots
