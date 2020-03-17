---
layout: post
title:  "Defining your team's policy for broken builds"
date:   2020-03-16
published: true
---
To delivery working software at a sustainable pace, it's critical to keep the master build passing.

A failing build is demoralizing and disruptive for the team.
Developers will lose confidence in the correctness of the system.
They may not unable to know if a failing test was due to their change, or to something else's.

Keeping the master build passing should take priority over almost everything else.
The whole team should feel responsible for it.
When the build fails, the whole team should be alerted.
For example, you can configure your CI to post notifications to your team's Slack channel for high visibility.

It shouldn't be left to a 'devops' team, or only to senior developers.

We can do several things to help ensure master stays passing:
- Perform code reviews to potentially unstable tests
- Running linters to catch potential problem areas
- Using features such as GitHub Checks to enforce a passing build before the branch can be merged into master.

[GitHub Checks]: https://developer.github.com/v3/checks/

But even with these practices, things can still go wrong:

- We can have intermittent failures due to factors such as system time or concurrency.
- We can have a [semantic conflict, where behaviour is correct on individual branches but incorrect when they're combined.
- We can have infrastructure failures unrelated to the code.

[semantic conflict]: https://www.martinfowler.com/bliki/SemanticConflict.html

It's important to establish a clear process for what should be done when the master build fails.
The details of this should be discussed and agreed by your team, but I'll discuss one possible approach.

In most cases, the most recent merge will be the one that broke the build, so that provides a starting point.
If the author of the most recent merge hasn't reacted to the failure, send a gentle nudge.

The first thing the author should do is pull the latest master, and check if the test passes locally.
If it doesn't, that gives a good starting point. If it's doesn't, we'll have to broaden the investigation.

While this in progress, there are two key things to keep in mind:

- Getting the build back to passing as soon as possible
- Keeping the team informed, and sharing an ETA if feasible

If the team isn't aware of work going on, a developer might assume that a failure was due to their change.
Or another developer may start investigating the failure, unaware that someone else is already on it.
Both could result in wasted time.

The next step is more nuanced. It may need discussion with your team, and could depend on the nature of your project:

- Should you revert?
- Should you temporarily disable the test?
- Should you delete a flawed test?

If the fix is going to take some time to resolve, you should aim to give updates at least every hour or so.

Once the problem is resolved, take some time to reflect.
Was there a particular practice which caused this? Could you make some change to improve things?
There's almost always some learning opportunity.
