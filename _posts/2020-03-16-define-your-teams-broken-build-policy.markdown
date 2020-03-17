---
layout: post
title:  "Defining your team's policy for broken builds"
date:   2020-03-16
published: true
---
To delivery working software at a sustainable pace, it's critical to keep the
master build passing.

A failing build is demoralizing and disruptive for the team.
Developers will lose confidence in the correctness of the system.
They may not be able to tell if a failing test was due to their code, or to
something else.

Keeping the master green should take priority over almost everything else.
When the build fails, the whole team should be alerted.
For example, you can configure your CI to post notifications to your team's Slack channel for high visibility.

The whole team should feel responsible for keeping the master build green.
It shouldn't be left to a 'devops' team, or only to senior developers.

We can do several things to help ensure master stays green:
- Perform code reviews to potentially unstable tests
- Run linters to catch potential problem areas
- Use tooling to enforce passing build before the branch is merged into master.

But even with these practices, things can still go wrong:

- We can have intermittent failures to factors such as system time or concurrency
- We can have semantic conflicts, where behaviour is correct on individual
  branches but incorrect when combined.
- We can have infrastructure failures unrelated to the code.

It's important to establish a clear process for what should be done when the master build fails.
The details of this should be discussed and agreed by your team, but I'll discuss one possible approach.

In most cases, the most recent merge will be the one that broke the build, so that provides a starting point.
If the author of the most recent merge hasn't reacted to the failure, send a gentle nudge.

The first thing the author should do is pull the latest master, and check if the test passes locally.
If it doesn't, that gives a good starting point.

At the time, there are two important things to keep in mind:

- Getting the build back to green as soon as possible
- Keeping the team informed, with an ETA is possible

If the team isn't aware, on a branch a developer might assume that a failure was due to their change. That could result in wasted time.

The next step is more nuanced. It may need discussion with your team, and depends on the nature of your project.

- Should you revert?
- Should you temporarily disable the test?
- Should you delete a flawed test?

If the fix is going to take some time to resolve, you should aim to give updates at least every hour or so.
