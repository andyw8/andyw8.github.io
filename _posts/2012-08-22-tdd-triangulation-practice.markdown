---
layout: post
title: "TDD Triangulation Practice"
date: 2012-08-22 13:50
comments: true
external-url: 
categories: tdd
published: true
draft: false
---
After attending [Jason Goreman's Intensive TDD workshop][2], I decided to have some practice at the triangulation aspect of Test-Driven Development. I strictly kept to the TDD mantra of:

* **Red**: Write a failing test
* **Green**: Make the test pass with the simplest implementation possible
* **Refactor**: Remove duplication or improve the design
* **Repeat**

I based my effort on the [Scoring Project][1] from RubyKoans. This already includes some tests but I wrote mine from scratch.

To recap the rules:

1. A set of three ones is 1000 points
2. A set of three numbers (other than ones) is worth 100 times the number. (e.g. three fives is 500 points).
3. A one (that is not part of a set of three) is worth 100 points.
4. A five (that is not part of a set of three) is worth 50 points.
5. Everything else is worth 0 points.

I started with what seemed like the simplest test possible:

{% highlight ruby %}
describe "#score" do
  it "is 0 for an empty list" do
    score([]).should == 0
  end
end
{% endhighlight %}

Let's make it green:

{% highlight ruby %}
def score(dice)
  0
end
{% endhighlight %}

So, how do you decide what test to write next? It seems that rules 3 and 4 are dependent on rules 1 and 2, so let's postpone those for later and write a failing test for rule 1:

{% highlight ruby %}
it "is 1000 for a set of three ones" do
  score([1,1,1]).should == 1000
end
{% endhighlight %}

Sticking the rule of only writing the minimum code needed to pass the test:

{% highlight ruby %}
def score(dice)
  if dice == [1,1,1]
    1000
  else
    0
  end
end
{% endhighlight %}

A confession here: This is how I initially approached the problem, but I found I got stuck at a 'deadlock' position where it wasn't possible to make progress with small, simple refactorings. Looking at the set of rules from a distance, we can see this the end result is an accumulation of the scores from each rule. Therefore, having a series of branches for alternative conditions probably isn't going to work.

Let's refactor the code to this to give a better base to build upon:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice == [1,1,1]
  total
end
{% endhighlight %}

Write another failing test for rule 1:

{% highlight ruby %}
it "is 1000 for a set including three ones" do
  score([1,2,1,1]).should == 1000
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice == [1,1,1] || dice == [1,2,1,1]
  total
end
{% endhighlight %}

At this point we can see duplication starting to appear, so it's time to refactor and generalise the solution:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  total
end
{% endhighlight %}

Now let's write a failing test for rule 2:

{% highlight ruby %}
def score(dice)
it "is 600 for a set of three sixes" do
  score([6,6,6]).should == 600
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  total += 600 if dice == [6,6,6]
  total
end
{% endhighlight %}

Write another failing test for rule 2:

{% highlight ruby %}
it "is 600 for a set including three sixes" do
  score([6,6,6,1]).should = 600
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  total += 600 if dice == [6,6,6] || dice == [6,6,6,1]
  total
end
{% endhighlight %}

Refactor to remove duplication:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  total += 600 if dice.count(6) == 3
  total
end
{% endhighlight %}

Write another failing test for rule 2:

{% highlight ruby %}
it "is 200 for a set including three twos" do
  score(3,2,2,2,4]).should = 200
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  total += 600 if dice.count(6) == 3
  total += 200 if dice.count(2) == 3
  total
end
{% endhighlight %}

We can see some duplication creeping in - we would need five lines to cover three twos up to three sixes, so let's refactor to generalise:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) == 3
  end
  total
end
{% endhighlight %}

We also need to consider the case of more than three of the same value:

{% highlight ruby %}
it "is 200 for a set including three twos" do
  score(2,2,2,2]).should = 200
end
{% endhighlight %}

A simple change makes this green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) >= 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) == 3
  end
  total
end
{% endhighlight %}

Let's add a failing test for Rule 3:

{% highlight ruby %}
it "is 100 for a one (that is not part of a set of three)" do
  score([1]).should = 100
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) >= 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) == 3
  end
  total += 100 if score == [1]
  total
end
{% endhighlight %}

And another failing test for Rule 3:

{% highlight ruby %}
it "is 200 for two ones (that are not part of a set of three)" do
  score([1,1]).should = 200
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) >= 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) == 3
  end
  total += 100 if score == [1]
  total += 200 if score == [1,1]
  total
end
{% endhighlight %}

Another failing test:

{% highlight ruby %}
it "is 200 for a set including two ones (that are not part of a set of three)" do
  score([1,3,1]).should = 200
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) == 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) == 3
  end
  total += 100 if score == [1]
  total += 200 if score == [1,1]
  total += 200 if score == [1,3,1]
  total
end
{% endhighlight %}

Refactor and generalise:

{% highlight ruby %}
def score(dice)
  total = 0
  total += 1000 if dice.count(1) >= 3
  2.upto(6).each do |i|
    total += i * 100 if dice.count(i) >= 3
  end
  total += 100 * dice.count(1)
  total
end
{% endhighlight %}

Which can be further improved:

{% highlight ruby %}
def score(dice)
  total = 0
  dice.uniq.each do |i|
    next if dice.count(i) < 3
    total += i == 1 ? 1000 : i * 100
  end
  total += 100 * dice.count(1)
end
{% endhighlight %}

Write a failing test for rule 4:

{% highlight ruby %}
it "is 100 for a set including two fives (that are not part of a set of three)" do
  score([5,3,5]).should = 100
end
{% endhighlight %}

Make it green:

{% highlight ruby %}
def score(dice)
  total = 0
  dice.uniq.each do |i|
    next if dice.count(i) < 3
    total += i == 1 ? 1000 : i * 100
  end
  total += 100 * dice.count(1)
  total += 50 * dice.count(5)
end
{% endhighlight %}

Now let's consider the slightly tricker case of interdependent rules:

{% highlight ruby %}
it "is 550 for a set including three fives along with a single five" do
  score([5,5,5,5]).should == 550
end
{% endhighlight %}

The current implementation will give an incorrect answer of 700 because it's counting the fives as a triple and then counting them again as single fives. We need to make sure they aren't counted twice.

A simple way of doing that is to sort the array and then drop the first 3 values of the array:

{% highlight ruby %}
def score(dice)
  total = 0
  dice.sort!
  dice.uniq.each do |i|
    next if dice.count(i) < 3
    total += i == 1 ? 1000 : i * 100
    dice = dice.drop(3)
  end
  total += 100 * dice.count(1)
  total += 50 * dice.count(5)
end
{% endhighlight %}

I'm happy with that final solution, and it also passes the RubyKoans tests.

## What I Learned

Triangulation is a useful technique but doesn't bypass the need for the analysis and thinking required to solve tricky problems. If you try to do it on 'autopilot' you probably won't succeed. The order you choose to write the tests, and the code you write early on can have a significant impact in how much effort is required discover to the algorithm. 

[1]: http://koans.heroku.com/about_scoring_project
[2]: http://www.codemanship.co.uk/tddworkshop.html
