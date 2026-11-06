---
title: Improve Your Workflow by Avoiding Conflated Commits
layout: post
---
There are two simple maxims which have had a huge impact on how I write code:

> *Always check a module in cleaner than when you checked it out.* -- [Uncle Bob](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule)

> *For each desired change, make the change easy (warning: this may be hard), then make the easy change* -- [Kent Beck](https://twitter.com/kentbeck/status/250733358307500032)

These have led to the following principle which I apply whenever committing code:

> **A single commit on the mainline branch should be either an improvement to the structure of existing code, or a change in behaviour, but not both.**

Here's why:

### Separate commits are easier to review

Git's `diff` is pretty smart, but it's not perfect.
It often can't distinguish between code which is new and code which has been moved around.
This makes changes more difficult to review.
By using separate commits, the reviewer can examine each diff separately, making it easier to understand what's changed.

### Separate commits improve Continuous Integration

If a conflated commit breaks the build, it's often not clear whether it was the clean-up or the behaviour change which is to blame.
Distinct commits help to pinpoint the cause of the breakage.

### Separate commits reduce waste

Sometimes there's a need to rollback a commit.
The `git revert` subcommand applies a new commit which reverses the changes made in a given commit.
If that commit was responsible for restructuring some existing code, as well as changing behaviour, then we'd lose out on the benefit of that clean-up.

### Separate commits are git-friendly

The `git bisect` command helps to discover when a defect was introduced.
Using separate commits makes this more effective.

### Separate commits give a clearer history

The commits on a file should give a clear history of how the file has changed over time. Keeping the commits focussed make this easier to understand.
