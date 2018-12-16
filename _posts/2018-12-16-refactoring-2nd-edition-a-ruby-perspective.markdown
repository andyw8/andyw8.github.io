---
layout: post
title:  "Refactoring (2nd Edition): A Ruby Perspective"
date:   2018-12-16
published: false
---

The second edition of Martin Fowler's Refactoring was published recently.

I'm assuming familiarity with it...

The first edition's examples were in Java, but in the new edition they're in
JavaScript.

I was curious how these would map to JavaScript, so I converted the initial code
to JavaScript and started to work through the steps.
I found some interesting things along the way.

The first refactoring involves extracting `amountFor` into a nested function
within the existing `statement` function. Although Ruby allows a `def` within
another `def`, it works in a very different way from JavaScript, so this
wouldn't be possible here.

Instead we can extract `amountFor` to be a standalone methods which sits as the
same level as `statement`.

Let's skip ahead to Replace Temp with Query where we introduce the `play_for`
function. Again we've move this to a top-level method:

```
def play_for(performance)
  plays[performance["playID"]]
end
```

But when we run the code, it now fails with:

```
Failures:

  1) statement
     Failure/Error: plays[performance["playID"]]

     NameError:
       undefined local variable or method `plays' for #<RSpec::ExampleGroups::Statement:0x007fd56828b398>
```

If `play_for` was a nested JavaScript function, it would have access to the
surrounding scope, which includes plays.

One way around this would be to pass `plays` into `play_for`. But the aim in
refactoring is to take small steps. The more we're doing at once, the more
chance of making a mistake.

Instead, we can approximate the JavaScript behaviour by using a lambda. 

(At the end maybe we can remove these)

```ruby
play_for = ->(performance) do |performance|
  plays[performance["playID"]]
end
```
We call this from within `statement` using:

```ruby
play = play_for.call(performance)
```




