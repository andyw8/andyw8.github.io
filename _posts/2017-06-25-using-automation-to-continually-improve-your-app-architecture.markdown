---
layout: post
title:  "Using automation to continually improve your architecture"
date:   2017-06-25 12:31:58 -0400
published: false
---
Continually monitoring some basic metrics of your codebase is a surprisingly effective way to improve your application's architecture, leading to code which is easier to understand, test and change.

In this post, I'll introduce some indicators that you can look out for, and how and when to act on them.

I'll then illustrate how we can how can design a workflow using Code Climate.

The examples are based on a Ruby application but this advice could equally be applied to other languages.

# Static Analyis

Measuring the metrics of your code by hand would be possible, but very tedious.
Instead, we use static analysis tools such as RuboCop.
These tools often thought of as [linters](https://en.wikipedia.org/wiki/Lint_(software)), and are typically used to verify that code conforms to a particular style guide.

But they usually also have the ability to measure code metrics such as:

* class length
* method length
* argument list length

These correspond to particular [Code Smells](https://martinfowler.com/bliki/CodeSmell.html), a term coined by Kent Beck.
Many of these smells were catalogued in the book [Refactoring](https://martinfowler.com/books/refactoring.html), by Martin Fowler:

> A code smell is a surface indication that usually corresponds to a deeper problem in the system

![Refactoring book cover](/assets/images/refactoring.jpg)

The particular smells the above measurements correspond to are:

* Large Class
* Long Method
* Long Parameter List

RuboCop has rules with built-in defaults for each of these:

* ClassLength (100 lines)
* MethodLength (10 lines)
* ParameterLists (7 parameters)

You might wonder where these numbers come from.
Why is a 9 line method fine but a 10 line method is somehow bad?

These defaults are intended to represent a [consensus](https://github.com/bbatsov/ruby-style-guide) among the Ruby development community, but in truth they are quite arbitrary.

However, this doesn't mean they don't have value.
Having _some_ limit is better than having no limit.
Don't take them as absolutes, but think of them as an indicator that there *might* be an issue.

# So how do we make use of this in practice?

A great tool for doing this is Code Climate, using an [engine] such as [RuboCop](https://github.com/bbatsov/rubocop), for if you're writing Ruby code.

If you run these metrics for any large code-base, you'll likely get many warnings of code which exceeds these counts.

But that's not particularly useful.
There's little point in altering code which the behaviour is rarely touched.
You might even introduce a bug.

When it comes to code metrics, a binary pass / fail is not an appropriate.


Issue Statusesj

![Issues statuses](https://codeclimate.com/files/58c179ae33909a3e7800244d)

Only all the open issues are resolved as Invalid or Wontfix, the status will
change from 'failed' to 'passed':

What we should really care about are the *changing* parts of the codebase, as they are where we spend most time and effort.

This is where Code Climate comes in.
Code Climate integrates with GitHub's pull requests, so it only highlights the issues which are new on your branch.

This acts as a way to help prevent new code smells being introduced, and to prevent existing code smells from getting stronger.

But simply enabling this integration is typically not effective.
It's too easy to ignore or forget about.

![GitHub branch protection](/assets/images/branch-protection.png)

Another Code Smell we can detect automatically is Duplicate Code.
This form of smell would be very difficult to identify in a pull request, unless you had deep knowledge of the existing code.
Code Climate's [Duplication engine](codeclimate-duplicatio), which uses [flay](https://github.com/seattlerb/flay) underneath, can identify these.

### Acting on this information

So what do you do when a issue is identified?

First, you could choose to do nothing.
You might look at the issue, and from your expertise as a developer decide that this isn't something that should be addressed, or at least not right now.
That's fine.
The important thing is that Code Climate prompted you to *consider* if something should be done.
Don't make a change just to silence the tool.

Alternately, you could address the issue.
Sometimes there's a simple and obvious way to do this.
Other times, it can be very challenging.
Familiarity with common refactorings such as [Extract Method](https://refactoring.com/catalog/extractMethod.html) or [Extract Class](https://refactoring.com/catalog/extractClass.html) will help.
If you're fairly new to software development, you might want to ask advice from someone with a few more years experience.
If you are already that person, you might want to consult with other members of your team.

At the heart of this approach is making refactoring a ongoing part of the your team's software development process.
No-one sets out to write a 3000 line class or a 200 line method.
They creep up on you, and when you realise how bad they've got it can feel like an insurmountable challenge.

You might be tempted to create a ticket to refactor code at a later time.
But I agree with Ron Jeffries that the refactoring 'stories' [should not be put on the backlog](http://ronjeffries.com/xprog/articles/refactoring-not-on-the-backlog/).
Similarly, Martin Fowler recommends an [Opportunistic Refactoring](https://martinfowler.com/bliki/OpportunisticRefactoring.html) approach:

> Although there are places for some scheduled refactoring efforts, I prefer to encourage refactoring as an opportunistic activity, done whenever and wherever code needs to cleaned up - by whoever.

One approach I find helpful is to put your current pull request on hold, and open a separate pull request to do the refactoring.
This prevents your PR from conflating behavioural changes alongside structural changes.
Once the the new PR is merged into the master branch, you can update your branch then continue with the original change.
This echoes some of Kent's Beck's advice:

{% twitter https://twitter.com/rubygems/status/250733358307500032 %}

These are just a handful of examples of how continuously monitoring your app's code can have a tremendous benefit.

Software development is hard.
Let's use automation to make our work more enjoyable.

[engine]: https://docs.codeclimate.com/v1.0/docs/list-of-engines
