---
layout: post
title: "Setting up Zed with Ruby LSP"
date: 2025-03-31
---

(Last updated: 2025-07-05)

[Zed](https://zed.dev) is a modern, high-performance code editor that's gaining popularity. After several years of using VS Code, I've been trying it out for writing Ruby and I've been impressed. With recent rapid development in AI, Zed's [close collaboration with Anthropic](https://zed.dev/blog/zed-ai) makes it a strong contender to VS Code derived editors such as [Cursor](https://www.cursor.com).

In this post you'll learn how to set up Ruby LSP with Zed, and how to troubleshoot if things aren't working. I'll also share some alternatives for features that aren't currently available in Zed.

# Setting up Ruby Support

Zed's Ruby support comes from the [official Ruby extension](https://github.com/zed-extensions/ruby), created by [Vitaly Slobodin](https://bsky.app/profile/vitallium.bsky.social). You can enable it through `zed: extensions`.

As with all Zed extensions, it is written in Rust. Its documentation can be found [here](https://zed.dev/docs/languages/ruby), as part of the official docs.

# Configuring Ruby LSP

Zed has good built-in support for the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/), meaning there's a lot of tooling already available that can be used.

Zed defaults to using [Solargraph](https://solargraph.org) as its language server for Ruby, but my preference is to use [Ruby LSP](https://github.com/Shopify/ruby-lsp), since I'm a [contributor](https://github.com/Shopify/ruby-lsp/graphs/contributors).

You'll also be able to take advantage of Ruby LSP add-ons such as [ruby-lsp-rails](https://github.com/Shopify/ruby-lsp-rails) and [ruby-lsp-rspec](https://github.com/st0012/ruby-lsp-rspec).

It can configured in Zed's settings as follows:

```json
{
  "languages": {
    "Ruby": {
      "language_servers": ["ruby-lsp"]
    }
  }
}
```

(The docs suggest disabling each language server that you *don't* want with `!`, and using `"..."` to enable the rest, but I find it simpler to just list the ones you *do* want).

Note: I've noticed that some configuration changes don't seem to apply until you fully quit and reload the editor (`workspace: reload` isn't enough), so you may need to do that in some situations.

To verify things are working, open a Ruby file, then choose `debug: open language server logs` from the command menu. The output should look something like this:

![Ruby LSP startup](/assets/images/zed-ruby-lsp-startup.png)

If there are multiple language servers running, then you'll need to first select the `ruby-lsp` log from the menu at the top left.

If ever it seems that Ruby LSP is not running, this is the first place to check for errors.

# Enabling Diagnostics (linting)

Update: This section previously described a workaround for the lack of pull diagnostics support in Zed, but this has now been implemented and diagnostics are working.

# Disable onTypeFormatting

There is [known issue](https://github.com/Shopify/ruby-lsp/issues/2971) in Ruby LSP with cursor placement when trying to type a `|` for block arguments, so you may want to disable `onTypeFormatting` for now:

```json
{
  "lsp": {
    "ruby-lsp": {
      "initialization_options": {
        "enabledFeatures": {
          "onTypeFormatting": false,
        }
      }
    }
  }
}
```

# Global vs Local Settings

So far I've shown settings as being added to the Zed's global configuration.

If you only ever work on a single Ruby project, then it doesn't really matter if you all your settings are global. But many of us work on codebases with different configurations, such as for linting and formatting, so having more granular control is often necessary.

You can add project-specific settings to `.zed/settings.json` in your project directory. These settings will be merged with the global settings, so normally you'll only need a few lines of configuration.
For example, you might have some projects that use RuboCop but others that use Standard.

# Running tests

One very useful feature when using Ruby LSP in VS Code is [Code Lens](https://shopify.github.io/ruby-lsp/#code-lens), which adds a `Run in Terminal` link to each test, and shows the result in the integrated terminal.

This LSP feature is not supported by Zed, but we can use the powerful [Tasks](https://zed.dev/docs/tasks) feature to do something similar.

For example, to add a task for running Rails tests, we can create a `.zed/tasks.json` file:

```json
[
  {
    "label": "test $ZED_RELATIVE_FILE:$ZED_ROW",
    "command": "bundle exec rails",
    "args": ["test", "\"$ZED_RELATIVE_FILE:$ZED_ROW\""],
    "tags": ["ruby-test"]
  }
]
```

The test can be run by clicking on the `▷` in the gutter, or with the Command-Shift-R keybinding.

# Advanced LSP Troubleshooting

It can sometimes be useful see the underlying requests and responses for the language server. In the `debug: language server logs` window, click the second menu, then enable `RPC Messages`:

![Ruby LSP startup](/assets/images/zed-lsp-rpc-logging.png)

# What's Missing

- If you're coming from VS Code with Ruby LSP, you might notice some features are not available. There's two main reasons behind this:

  - Some Ruby LSP features depends on custom behaviour in the VS Code extension. Those would need to be reimplemented for Zed within the Ruby extension.

  - Some parts of the LSP specification are not yet implemented in Zed.
You can follow [this](https://github.com/zed-industries/zed/issues/26916) Zed issue to learn more.

- <s>Changes aren't indexed until Zed is restarted.</s> ([#3384](https://github.com/Shopify/ruby-lsp/issues/3384)). This is now working.

- A debugger is in [beta](https://zed.dev/debugger), and there's a [PR](https://github.com/zed-industries/zed/pull/30126) open for supporting rdbg.

- Zed supports [Snippets](https://zed.dev/docs/snippets) but the Ruby extension doesn't yet have any. I have a [PR](https://github.com/zed-extensions/ruby/pull/53) in progress to add them.

# Other Useful Resources

* For ERB linting, support for Herb has been [merged](https://github.com/zed-extensions/ruby/pull/110) and should ship soon.
* For ERB formatting, [erb-formatter](https://zed.dev/docs/languages/ruby#erb-formatter) works well.
* To toggle between a test and its implementation, try [zed-test-toggle](https://github.com/MoskitoHero/zed-test-toggle).
* For working with Hotwire, there is the [Zed Stimulus](https://github.com/vitallium/zed-stimulus) extension.
* Support for Sorbet was previously available in a [separate extension](https://github.com/notchairmk/zed-sorbet) but is now built-in as of v0.9.0 of the Ruby extension.
