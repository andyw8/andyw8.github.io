---
layout: post
title: "Using puma-dev with Conductor"
date: 2026-08-25
published: true
---
[puma-dev](https://github.com/puma/puma-dev) is a useful tool for Rails developers. It's a successor to [pow](https://github.com/basecamp/pow), an older tool by Basecamp.

puma-dev makes it easy to switch between working on multiple Rails apps in a local environment, without dealing with port conflicts. It also spins down idle apps to save resources.

Let's say you're working on an app in `~/src/myapp`. If you run `puma-dev link`, it will create a new symlink in `~/.puma-dev/`. You can then access your app on your local machine at `https://myapp.test`, without having to manually start a Rails instance.


With the emergence of AI agents, it's becoming more common to be working on multiple features concurrently in isolated workspaces by using Git worktrees.

In [Conductor](https://conductor.build) you can specify [scripts](https://www.conductor.build/docs/reference/scripts) to run when setting up a new workspace or archiving an existing one. We can make use of these to set up puma-dev automatically.

Conductor assigns random names to workspaces (from a list of city names). For the hostname, I prefer to prefix the workspace name with my repo name, e.g. `https://myapp-toronto.test`.

When a workspace is longer needed, e.g. the feature has been merged, the workspace can be archived, and the symlink will be removed from `~/.puma-dev/`.

Here are the scripts that I'm using:

## `bin/conductor-setup`

```ruby
#!/usr/bin/env ruby
workspace_path = ENV.fetch("CONDUCTOR_WORKSPACE_PATH")
project = File.basename(File.dirname(workspace_path))
name = "#{project}-#{File.basename(workspace_path)}"
system("puma-dev link -n #{name}") or abort "puma-dev link failed"
puts "puma-dev link succeeded: https://#{name}.test"
```

## `bin/conductor-archive`

```ruby
#!/usr/bin/env ruby
workspace_path = ENV.fetch("CONDUCTOR_WORKSPACE_PATH")
project = File.basename(File.dirname(workspace_path))
name = "#{project}-#{File.basename(workspace_path)}"
symlink = File.expand_path("~/.puma-dev/#{name}")
File.delete(symlink)
```

You'll also need to make each script executable using `chmod +x`.

To learn more about using Conductor with Rails, check out:
- [Using Conductor.build with Ruby on Rails](https://afomera.dev/posts/2026-02-03-using-conductor-with-ruby-on-rails) by Andrea Fomera.
- [Conducting Rails](https://www.johnnunemaker.com/conducting-rails/) by John Nunemaker.
