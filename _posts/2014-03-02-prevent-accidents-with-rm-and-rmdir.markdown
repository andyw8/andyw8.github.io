---
layout: post
title: "Preventing Accidental File Deletions"
date: 2014-03-02 15:10
comments: true
external-url:
categories: shell
published: false
---
Many of us learned the hard way that `rm` and `rmdir` are unforgiving. There's no Trash to recover from, and there's no undo.

There are [many legendary stories](http://www.quora.com/Linux/What-are-some-crazy-rm-rf-stories-you-have-heard-about) involving `rm -rf` disasters.

In time you learn to be wary of using those commands, but once in a while you'll screw up and delete something you shouldn't have.

There are a few articles about how to alter the behaviour of `rm` so that it moves to the trash instead of permanently deleting. But this is dangerous if you happen to be using a different machine which doesn't have this behaviour enabled.

A better option is to install [rmtrash](http://www.nightproductions.net/cli.htm) (also available via Homebrew). The `rmtrash` command can be use to delete both files and directories, and as the name suggests it moves the files to the Trash instead of parmanently deleting them.

If you really need to call `rm` or `rmdir` then just provide the full path, e.g. `/bin/rm` or `/bin/rmdir`.

You can then alias the actual `rm` commands to give you a reminder warning, for example add this to your `.bashrc`:

{% highlight bash %}
alias rm="echo 'Use rmtrash, or full path name for rm'"
alias rmdir="echo 'Use rmtrash, or full path name for rmdir'"
{% endhighlight %}

Over time this should get you into the habit of typing `rmtrash`.

This change might cause problems with shell scripts which use `rm`. I'm not really sure how to deal with that. It may be sensible for the alias to return false to indicate the command failed.

Reference: [Apple StackExchange post](http://apple.stackexchange.com/a/17637)
