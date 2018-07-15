---
layout: post
title:  "Preventing false positives in RSpec"
date:   2018-07-15
published: true
---

Let's imagine we're writing a test to ensure an error is raised:

```ruby
# spec/hello_spec.rb
require "spec_helper"

describe Hello do
  it "greets" do
    result = Hello.run("Andy")

    expect(result).to eq("Hello, Andy")
  end

  it "raises an error if no name is supplied" do
    expect do
      Hello.new.run("")
    end.to raise_error
  end
end
```

The implementation is simple:

```ruby
# lib/hello.rb
class Hello
  def self.run(name)
    raise ArgumentError, "No name given" if name.blank?

    "Hello, #{name}"
  end
end
```

We push the branch, see it passes in Travis or whatever CI is in use, then merge it into master.

# We just introduced a bug

Do you see it? We're calling `run` as a instance method, but it's actually a class method.

An error _is_ being raised, but it's not the we were expecting.

If we were using RSpec 3 or newer, you might have spotted a lengthy warning displayed as part of the test output:

```
WARNING: Using the `raise_error` matcher without providing a specific error or
message risks false positives, since `raise_error` will match when Ruby raises
a `NoMethodError`, `NameError` or `ArgumentError`, potentially allowing the
expectation to pass without even executing the method you are intending to call.
Actual error raised was #<NoMethodError: undefined method `run' for
#<Hello:0x007fdc39b50118>>. Instead consider providing a specific error class or
message. This message can be suppressed by setting:
`RSpec::Expectations.configuration.on_potential_false_positives = :nothing`.
Called from spec/hello_spec.rb:11:in `block (2 levels) in <top (required)>'.
```

But on a large test suite which already outputs a lot of warnings, it's easy to miss that.

Let's read the error output carefully. It's saying the actual error raised was `NoMethodError`, rather than `InvalidArgument`.
We can improve the test so it checks for the correct error type:

```
  it "raises an error if no name is supplied" do
    expect do
      Hello.new.run("")
    end.to raise_error ArgumentError, "No name given"
  end
```

Re-running the test now results in a proper failure:

```
expected ArgumentError with "No name given", got #<NoMethodError: undefined method `run' for #<Hello:0x007f8868b8d0d8>> with backtrace:
  # ./spec/hello_spec.rb:12:in `block (3 levels) in <top (required)>'
  # ./spec/hello_spec.rb:11:in `block (2 levels) in <top (required)>'
```

# Configuration

You might have noticed that the RSpec output also describes how to suppress these warning messages.
This is dangerous and you shouldn't do that.
You could miss genuine bugs in the code.

The default behaviour of `on_potential_false_positives` is `:warn`, which displays a message like we saw above.

However, there's a better way to configure this.
By setting it to `:raise`, your test will fail unless unless you specify the error type when using `raise_error`.

This will help to prevent future problems. If you have a large test suite, it might take some effort to update your test suite, but it's worth it.

# Conclusion

Pay attention to the warnings emitted from your code or test suite, and try to eliminate them.
They exist to help you, not to annoy you.
