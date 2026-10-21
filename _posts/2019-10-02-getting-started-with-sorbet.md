---
layout: post
title:  "Getting started with Sorbet"
date:   2019-10-02
published: true
---

[Sorbet] is a new tool from Stripe to enable 'gradual type checking' for Ruby
code.

The Getting Started guide illustrates how to adopt Sorbet to an existing codebase,
but it's perhaps easier to grasp with some simple examples.

We'll start with a single-file Ruby script:

```ruby
def greeting(name)
  "Hello, #{name}"
end

greeting("Andy")
greeting("Andy", "John")
```

The `greeting` method accepts one argument only. If we try to call it with no
arguments, or more than one argument, we'll get an `ArgumentError`, e.g.:

```
greeting.rb:3:in `greeting': wrong number of arguments (given 2, expected 1)
(ArgumentError)
        from greeting.rb:8:in `<main>'
```

In a compiled language such as Java or C#, we'd get an error from the compiler
if we tried this. In fact, the IDE may highlight the problem before we even
attempt to compile it.

Since Ruby is not a compiled language, we may not encounter this error until the
program is running in a production environment.

We can take steps to reduce the risk of such mistakes. We typically write
automated tests to exercise various code paths, and these should catch _most_ of
these problems. But these kind of tests take time to write, and sometimes have gaps.

Let's see how Sorbet can help us. We'll install the Sorbet gem:

`gem install sorbet`

And we'll use a special comment to 'opt-in' to checking:

```ruby
# typed: true

def greeting(name)
  "Hello, #{name}"
end

greeting("Andy")
greeting("Andy", "John")
```

To run the type checking:

`srb tc`

And we'll see this output:

```
% srb tc
greeting.rb:9: Too many arguments provided for method Object#greeting. Expected:
1, got: 2 https://srb.help/7004
     9 |greeting("Andy", "John")
        ^^^^^^^^^^^^^^^^^^^^^^^^
    greeting.rb:4: greeting defined here
     4 |def greeting(name)
        ^^^^^^^^^^^^^^^^^^
Errors: 1
```

This may look similar to the previous error, but there's a big difference: We
haven't executed any code. Sorbet has detected the problem by analyzing the code.
We've caught a bug before production, without having to write any tests, and even without running the code.

We could use this as part of development workflow or Continuous Integration
service to scan the code for problems automatically. On a large and complex
project, this can help give us confidence in difficult refactorings.

This is only scratching the surface of what Sorbet is capable of. The real power
comes once we start specifying the types of object using a new syntax called
_sigils_.

[Sorbet]: https://sorbet.org/
