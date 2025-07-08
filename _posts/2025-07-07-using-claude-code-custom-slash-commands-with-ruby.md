---
layout: post
title: "Using Claude Code custom slash commands with Ruby"
date: 2025-07-07
---
For the past few weeks I've been using Claude Code extensively in my Ruby development workflow and find it incredibly powerful, especially since the launch of the Sonnet 4 model.

Anthropic recently added support for [custom slash commands][1], allowing you to define commonly used prompts as reusable macros.

Based on my experience as a Ruby developer, I've created several specialized [commands][3] for typical Ruby project workflows, such as:

* Configuring CI with GitHub Actions (including Ruby matrix builds)
* Adding RuboCop or Standard
* Bumping the Ruby version across gemspecs, Gemfiles, and CI configs
* Adding common Ruby gems with appropriate configuration

Although Claude does a reasonable job for these with a zero-shot prompt, the custom commands allow for better adherence to modern best practices, which are often preferable over what the model was trained on.

Each command has iteratively refined based on real-world usage across different Ruby projects. (I've found that using bullet-point checklists makes Claude more systematic about following instructions).

As these patterns may be valuable to the broader Ruby community, I've published a [claude_code_slash_commands][2] gem (mostly written by Claude Code of course).

The gem provides a simple `install` command that copies the slash commands to your local `~/.claude/commands` directory. The commands are designed with Ruby development expertise in mind, incorporating common patterns and approaches.

If you have ideas for additional Ruby-focused slash commands, I'd love to see them! Feel free to open a PR on the [repository][2] to contribute your own commands that could benefit the Ruby community.

[1]: https://docs.anthropic.com/en/docs/claude-code/slash-commands#custom-slash-commands
[2]: https://github.com/andyw8/claude_code_slash_commands
[3]: https://github.com/andyw8/claude_code_slash_commands/tree/main/commands
