---
title: Treating ActiveRecord as a private interface with FigLeaf
layout: post
---
In [Objects on Rails], [Avdi Grimm] talks about treating ActiveRecord as a
[private implementation detail].

I've been aiming to do this in my own code for some time now.
And I've worked for clients on many struggling, legacy Rails projects where following this simple guideline would have saved a lot of pain.

I was curious to see if I could programatically enforce this convention on a real project, using the [fig-leaf] gem introduced by the book.

- - -

I applied the example code from the FigLeaf README to my models and ran my test suite.

Straight away, FigLeaf identified several places where I was calling another model's finder, e.g.:

{% highlight ruby %}
Widget.find_by(uuid: uuid, owner: current_user)
{% endhighlight %}

This isn't a terrible case, but if the `owner` `belongs_to` association in `Widget` was changed, I'd have to change all the
places that call it.

Instead, I can introduce an interface which hides the underlying ActiveRecord implementation:

{% highlight ruby %}
Widget.lookup(uuid, owned_by: current_user)
{% endhighlight %}

This new method is defined simply as:

{% highlight ruby %}
# app/models/widget.rb
def self.lookup(uuid, owned_by:)
  find_by(uuid: uuid, owner: owned_by)
end
{% endhighlight %}

I was happy with the improvements this brought:

* It abstracts away the underlying ActiveRecord implementation
* It gives the behaviour a name, (*'lookup'*)
* It will complain loudly if `nil` is accidentally passed in `owned_by` due to the
  use of keyword arguments.

But there were two things that were causing my test suite to fail.

### Calling ActiveRecord from within a test

Many of my tests directly call ActiveRecord finders, such as `Widget.last` to
obtain the most recently created record. I had a dilemma:

Should I introduce a new finder, `Widget.most_recently_created`, which is only
used in the test? In generally I'm uncomfortable having implementation code which
is only ever executed by tests.

Or should I temporarily disable FigLeaf in the context of these tests, for example:

{% highlight ruby %}
# spec/controllers/widgets_controller_spec.rb
it "..." do
  ...
  FigLeaf.disable do
    result = Widget.last
  end
  ...
end
{% endhighlight %}

(FigLeaf doesn't currently have such a method).

### Third Party Gems

The other issue is that some gems directly call various ActiveRecord methods. In
my case, this was [factory_girl] and [shoulda-matchers].

I was able to work around this with a little bit of monkeypatching. Using
`send` will circumvent FigLeaf's checks. But this isn't a sustainable approach.

A better approach would be if FigLeaf could be given a whitelist of classes
which are allow to call ActiveRecord methods, which could probably be
implemented by analysing the call stack with [`Kernel#caller`]

## Conclusion

FigLeaf isn't quite mature enough to be used on a production Rails project.
However, there's a great opportunity to build something based on it.

Alternatively, perhaps these kind of checks could be made using a static analysis tool
such as [rails_best_practices], [reek] or [RuboCop].

[Avdi Grimm]: http://about.avdi.org
[Objects on Rails]: http://objectsonrails.com
[fig-leaf]: https://github.com/objects-on-rails/fig-leaf
[factory_girl]: https://github.com/thoughtbot/factory_girl
[shoulda-matchers]: https://github.com/thoughtbot/shoulda-matchers
[FigLeaft README]: https://github.com/objects-on-rails/fig-leaf
[`Kernel#caller`]: http://ruby-doc.org/core-2.2.2/Kernel.html
[rails_best_practices]: https://github.com/railsbp/rails_best_practices
[reek]: https://github.com/troessner/reek
[RuboCop]: https://github.com/bbatsov/rubocop
[private implementation detail]: http://objectsonrails.com/#ID-5e701b05-6b1a-4cdf-9e4b-254b8f6c110d
