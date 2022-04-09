---
layout: post
title: "Using the app:update command"
date: 2022-03-12
published: true
---

The [Upgrading Ruby on Rails page](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html) in Rails Guides mentions of the `rails app:update` command, but doesn't say much.

This command iterates over the files created by Rails when a new app is created. If any difference is found, you'll be prompted on what do do.

Running this starts an interactive session:

```
$ bin/rails app:update
    conflict  config/boot.rb
Overwrite [...]/config/boot.rb? (enter "h" for help) [Ynaqdhm]
```

This somewhat cryptic looking `Ynaqdhm` is a list of options to pick from.

Choose the help option `h` shows:

```
        Y - yes, overwrite
        n - no, do not overwrite
        a - all, overwrite this and all others
        q - quit, abort
        d - diff, show the differences between the old and the new
        h - help, show this help
        m - merge, run merge tool
Overwrite [...]/config/boot.rb? (enter "h" for help) [Ynaqdhm]
```

The intention is that you will work through you the changes file by file. j

From experience in upgrading a range of apps, I've found a better way to work through this.

Start by ensuring you have a clean working branch in git, i.e. with no uncommitted changes.

Run `rails app:update` and choose the `a` ('all') option.

Run `git status` and you'll see that several files will have changed. Some may have changes which definitely don't want so don't commit anything yet.

We'll now tackle these one by one.

Note: If you use RuboCop, now is a good time to run `rubocop --autocorrect` to eliminate any minor formatting differences such as single vs double quotes.

We'll start at a high-level and then get into the more granular. Browse through each file and examine the changes.

You can use Git on the CLI for this but I would recommend a visual tool.

If you're happy with all the changes, stage the changes for that file.

If you don't want any of the changes, discard the modifications.

You should now be left with a set of files where you want _some_ of the changes but you're not yet sure if you want them all.

You can think of files that are staged as 'done', and those with uncommitted changes as your 'todo' list.

One useful technique is use Git's `patch` option. This will break a change into sections, and prompt you whether to add each.

(if a chunk contains multiple changes, you can choose `s` to split it into smaller sections)

...

Run the test suite and sure everything passes.
