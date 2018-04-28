---
layout: post
title:  "Using automation to continually improve your application architecture"
date:   2018-04-22
published: false
---
By continually monitoring some basic metrics of your codebase, you can have early detection of problems with your application architecture. Knowing how and when to respond to these indicators will result in code which is easier to understand, test and change.

I'll illustrate how to apply this workflow to your team with minimal disruption, even on a legacy codebase.

The examples are based for Ruby application but this technique could equally be applied to other languages.

# Static Analysis

Measuring code metrics by hand is possible, but impactical.
Instead, we use static analysis tools.
Static analysis provides insights about code without executing it.
The most common tool for doing this in Ruby is RuboCop.
It's typically know for its [linting] features to verify adherence to a coding styleguide.
But it also has the ability to measure code metrics such as:

* class length
* method length
* argument list length

# Code Smells

Each of these correspond to particular [Code Smells](https://martinfowler.com/bliki/CodeSmell.html), a term coined by [Kent Beck][beck].
Many of these smells were catalogued in Martin Fowler's classic [Refactoring](https://martinfowler.com/books/refactoring.html) book.

> A code smell is a surface indication that usually corresponds to a deeper problem in the system

The particular smells the above measurements correspond to are:

* Large Class
* Long Method
* Long Parameter List

RuboCop has rules within its [built-in defaults][rubocop defaults] for each of these:

* ClassLength (100 lines)
* MethodLength (10 lines)
* ParameterLists (7 parameters)

You might wonder where these numbers come from.
Why is a 9 line method fine but a 10 line method is somehow bad?

These defaults are intended to represent a [empirical consensus](https://github.com/bbatsov/ruby-style-guide) among the Ruby development community, but in reality they are somewhat arbitrary.

However, this doesn't mean they aren't useful.

### Example

Let's say your working a nice new, clean codebase. Running 
using the default RuboCop configuration reports no issues:

```
$ rubocop .
Inspecting 42 files
..........................................

42 files inspected, no offenses detected
```

Let's say your working on a new feature. The tests are passing, and you push the
branch to GitHub.

A few minutes later you get a notification:

"Build failed"

But you ran the tests. How can I have failed?

There's a problem:

```
app/models/widget.rb:11:3: C: Metrics/MethodLength: Method has too many lines. [11/10]
  def valid? ...
  ^^^^^^^^^^
```

A well-intentioned developer on the team has set up strict rules for

You go and look at method. There's not really much to it. It has some error
checking but it's really very easy to read.

But RuboCop is complaining so your better fix it. You extract some lines into a
new private method, but can't really think of a good name other than
`perform_validation`.

You run RuboCop locally 

### Acting on the information

So what do you do when a issue is identified?

First, you could choose to do nothing.
You might look at the issue, and from your expertise as a developer decide that this isn't something that should be addressed, or at least not right now.
That's fine. Don't blindly follow RuboCop if you don't agree with it.
The important thing is that RuboCop prompted you to *consider* if something should be done.

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
Once the new PR is merged into the master branch, you can update your branch then continue with the original change.
This echoes some of Kent's Beck's advice:

# So how do we make use of this in practice?

First, let's talk about how not to do it. I often see teams try to integrate RuboCop in their CI process, so if linting fails then the build is marked as failed.
But unlike unit tests, when it comes to code metrics, a binary pass or fail is not an appropriate indicator. A warning should trigger a discussion between the developer and their pair, or pull request reviewer.

A great tool for doing this is Code Climate, using an [engine] such as [RuboCop](https://github.com/bbatsov/rubocop), for if you're writing Ruby code.

But that's not particularly useful.
There's little point in altering code which the behaviour is rarely touched.
You might even introduce a bug.

Issue Statuses

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

{% twitter https://twitter.com/rubygems/status/250733358307500032 %}

These are just a handful of examples of how continuously monitoring your app's code can have a tremendous benefit.

Software development is hard.
Let's use automation to make our work more enjoyable.

---

_Thanks to [Bryan Helmkamp][bryan], [Hanna Kalinowska][hanna] and my team at [Financeit] for reviewing a draft of this._

[engine]: https://docs.codeclimate.com/v1.0/docs/list-of-engines
[beck]: https://twitter.com/kentbeck
[rubocop defaults]: https://github.com/bbatsov/rubocop/blob/master/config/default.yml
[Financeit]: https://www.financeit.io/
[Hanna]: https://github.com/hannakalinowska
[bryan]: https://twitter.com/brynary
[linting]: https://en.wikipedia.org/wiki/Lint_(software)
