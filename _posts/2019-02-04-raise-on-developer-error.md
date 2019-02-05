---
layout: post
title: "Raise on Developer Error"
date: 2018-04-28
comments: true
published: false
categories: 
---
When a running program detects that it's in an unexpected state, it can do one
of two things:

- Raise an error and stop processing
- Attempt to handle the error and continue

I've observed that developers with more experience tend to favor the first
option, and newer developers tend to favor the second.

Here's an example:

```
def over_18?(date_of_birth)
  date_of_birth - 18.years > 0
end
```

```
def over_18?(date_of_birth)
  raise "Missing date of birth" if date_of_birth.nil?

  date_of_birth - 18.years > 0
end
```

```
def over_18?(date_of_birth)
  return if date_of_birth.nil?

  date_of_birth - 18.years > 0
end
```

This is equivalent to returning nil.

In Ruby `nil` is falsey.

Will this work? It depends on the calling code.

```
if over_18?(user.date_of_birth)
  puts "Allowed"
else
  puts "Not allowed"
end
```

But let's say we then want to persist that value to a datebase column with a
non-null constraint:

```
over18 = over_18(user.date_of_birth)
user.update!(over_18: over18)
```

