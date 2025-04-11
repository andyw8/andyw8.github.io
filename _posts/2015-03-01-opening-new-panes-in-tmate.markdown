---
layout: post
title: "Opening new panes in tmate"
date: 2015-03-01 10:35
comments: true
external-url:
categories: remote-pairing
published: false
---
[tmate][1] is a fork of tmux for easily setting up a remote pairing session.
When using normal tmux, I have the following configuration so that new panes and windows remember the previous working path:

{% highlight bash %}
bind-key - split-window -v  -c '#{pane_current_path}'
bind-key \ split-window -h  -c '#{pane_current_path}'
bind c new-window -c '#{pane_current_path}'
{% endhighlight %}

I recently tried remote pairing in tmate for the first time.
It was confused as to why my new panes and windows were opening in the top level `/` instead of the previous pane's path.

It turns out that `pane_current_path` is a tmux 1.9 feature, but tmate is based on tmux 1.8.
There's some talk of a 1.9 version, but it seems to have been delayed.

The workaround I've found is to use `-c "$PWD"` instead.
Make sure to use double quotes so that it gets interpolated.
You can add that to `~/.tmate.conf` to override the existing setting in `~/.tmux.conf`.

[1]: http://tmate.io/
