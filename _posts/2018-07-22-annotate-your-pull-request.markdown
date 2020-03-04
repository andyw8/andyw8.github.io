---
layout: post
title:  "Annotate Your Pull Request"
date:   2018-07-22
published: true
---

When I open a new pull request, there's something I do before I ask anyone else
to review it.

I go through it and try to anticipate what questions might be asked, or what
might be confusing for the review.

I'll comment on my own PR.

Here's some common things I'll often comment about:

* When code is moved from one file to another, it's often hard to see that. I'll
  add comments such as "this method moved exactly from OtherClass", or "the only
thing that's changed here is the input field name".

* I'll leave comment to other tickets or PRs.

* I'll link to reference materials, e.g. documentation for a library. This make
  it more convenient for the reviewer.
