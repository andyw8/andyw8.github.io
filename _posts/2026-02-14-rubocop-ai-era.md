---
layout: post
title: "RuboCop in the AI Era: From Style Cop to Essential Infrastructure"
date: 2026-02-14
published: false
---

*Note: I used AI to help write this article. The irony isn't lost on me.*

### The Problem You Might Not See Yet

If you're using AI to generate Ruby code, the productivity gains are real. You're shipping features faster than you ever did writing code manually. Tests pass. Everything seems fine. But unless you're running structural analysis on that code, you're likely accumulating technical debt faster than you realize, and you won't notice until months later when modification becomes painful.

I'm not speculating. I've watched this happen repeatedly in my own work with AI coding tools, and the pattern is consistent enough to be predictable. AI generates code that works and passes tests, but it has specific failure modes that compound over time. The question isn't whether you'll hit these problems—it's whether you'll catch them early or deal with them later when they're *prohibitively* expensive to fix.

### This Is Not About Style

Before we go further, let's be clear about what this article isn't arguing. This is not about style cops. I'm not saying you need RuboCop to enforce spaces vs tabs, quote styles, or trailing commas. AI handles formatting consistency well enough. If your codebase uses double quotes, AI will use double quotes.

This is about structural cops that catch maintainability problems tests don't catch. Specifically, complexity metrics like `Metrics/MethodLength`, `Metrics/CyclomaticComplexity`, `Metrics/AbcSize`, and `Metrics/ClassLength`. Code smell detection through cops like `Lint/DuplicateMethods` and `Style/MutableConstant`.

The distinction matters because if you think RuboCop is just "the tool that complains about my quote marks," you're missing what it actually does. Style cops make code look consistent. Structural cops catch the problems that make code hard to change six months from now. That's what we're discussing.

### What Tests Don't Catch

Here's the fundamental issue: tests validate behavior, not structure. A method can pass every test and still be a maintenance problem.

Consider a method that's 200 lines long with seven levels of nested conditionals. It returns the right result. It handles edge cases. It has 100% coverage. Your tests are green. But six months later when you need to add a feature, you can't understand what the method does without spending hours tracing through the logic. That's when you realize the code works but isn't maintainable.

Tests won't flag that you're using `where.first` instead of the more efficient `find_by`. They won't notice you've accidentally defined the same method twice in a class. They won't catch that your constant is mutable and could cause bugs in threaded code. They won't tell you that your method has a cyclomatic complexity of 12, making it nearly impossible to reason about all the code paths.

These aren't hypothetical problems. They're code smells that predict future maintenance costs. And AI, optimizing exclusively for passing tests, generates them systematically.

### AI's Specific Failure Mode: Systematic Appending

Here's what I've observed repeatedly, and you can verify this yourself: when you ask AI to add functionality, its default behavior is to append code to existing methods and classes rather than refactor.

The pattern is predictable. You ask AI to add a feature. It finds an existing method that does something similar and adds 10 lines. Seems reasonable. Later you ask for a related feature. AI returns to the same method and adds 15 more lines. The method is now 25 lines. You ask for another enhancement. AI adds 20 more lines. Now it's 45 lines, probably violating SRP, and getting hard to understand. But each individual addition seemed fine in isolation.

This isn't occasional—it's systematic. AI optimizes for minimal disruption to existing code. Its pattern matching says "this method handles user updates, so I'll add more user update logic here." It has no sense that the method is becoming unwieldy because it doesn't experience cognitive load the way humans do.

Try this yourself: ask an AI to add three related features one at a time to the same area of code. Watch what happens to method length. I'll bet you see the same append behavior. And this is the problem: without external pressure to refactor, AI will happily create 60-line methods or 300-line classes. I've seen it happen many times.

### The Pattern Replication Problem

There's a second issue that's more insidious: AI learns patterns from your existing codebase, and it can't distinguish good patterns from bad ones.

If you have a god object violating SRP, AI will keep adding to the god object. It sees that pattern as "how we do things here" and replicates it. I've personally observed AI replicating SRP violations from existing code. Once you have several examples of a bad pattern, AI treats it as increasingly canonical and replicates it more aggressively.

The feedback loop accelerates: one bad pattern spreads to five files, AI sees five examples and creates ten more, now fifteen examples make it seem like the standard approach. This happens at machine speed. A pattern that would have spread slowly over months with human developers spreads across your codebase in days.

You might think code review would catch this, but at AI velocity—potentially thousands of lines per day—code review becomes a bottleneck. The volume is too high for careful architectural review of every change. Things slip through.

### Why "It's Been Fine So Far" Isn't Enough

I anticipate the skeptical response: "We've been using AI and haven't had these problems." Maybe you haven't noticed yet. Technical debt has a long fuse. Code that's hard to maintain doesn't announce itself—it reveals itself gradually when velocity starts dropping, when bugs crop up in unexpected places, when simple changes take longer than they should.

The cost isn't immediate. It's three months later when someone needs to modify that 60-line method and has to spend hours understanding it first. It's six months later when a bad pattern has propagated through 40 files and fixing it requires a major refactoring effort. It's a year later when your codebase has become noticeably harder to work with and you can't pinpoint exactly when it happened.

Without measurement, you won't see this coming. You'll just notice that changes are taking longer, bugs are appearing in places they shouldn't, and new developers are struggling to understand the code. By then, the problem is expensive to fix.

### The Senior Engineer's Dilemma

If you're a senior engineer or tech lead, you're probably feeling this acutely. You're responsible for code quality and architectural health. That's your job. When the codebase becomes unmaintainable, you're the one who has to answer for it.

And now you're watching AI generate code at a rate that's impossible to review thoroughly. Hundreds or thousands of lines per week. Your traditional mechanisms for maintaining quality—careful code review, pairing sessions, architectural oversight—don't scale to this velocity. You can't personally review every method for structural soundness when the volume is this high. But you also can't ignore it, because you know what happens when code quality slips.

This creates a genuine professional dilemma. You see the productivity benefits of AI. You don't want to be the person who slows everything down. But you also see the technical debt accumulating and you know you'll be responsible for dealing with it later. You're watching a problem build in real time and the traditional tools you'd use to prevent it—your time, your attention, your architectural judgment—can't keep pace with machine-speed code generation.

That feeling of helplessness is justified. Without automated enforcement, you genuinely can't maintain quality at AI velocity. Manual review doesn't scale. The math doesn't work. And that's not a personal failing—it's a structural problem that requires a structural solution.

### The Concrete Solution: Pre-Commit Enforcement

Here's what I do, and I'm suggesting this because it works, not because it's theoretical: I use a Husky pre-commit hook that runs RuboCop on every commit.

The workflow is simple. AI generates code. I attempt to commit. Husky runs RuboCop automatically. If there are violations, the commit is blocked. AI sees the violations, fixes them, and the commit succeeds. The code that enters my repository has already been filtered for structural problems.

This solves several issues at once. First, it's automatic—I don't have to remember to run RuboCop. Second, it's immediate—problems are caught before they enter the codebase, not discovered weeks later. Third, AI can fix issues in the same session where it generated the code, seeing what it did wrong and learning from it. Fourth, it prevents the pattern replication feedback loop because bad patterns never make it into the repository to be replicated.

The key insight is that AI doesn't mind this enforcement at all. When RuboCop flags a violation, AI just fixes it. There's no ego, no frustration, no pushback. This is very different from human developers, who often find RuboCop's pickiness annoying. With AI, the feedback loop is completely frictionless.

### Addressing the "But I Review the Code" Objection

You might be thinking "I review all AI-generated code before committing it, so I'd catch these problems." I'm skeptical of that for two reasons.

First, structural problems are often subtle. A method that's 30 lines long doesn't scream "too long" when you're reviewing it. Cyclomatic complexity of 8 doesn't look obviously wrong. But these things compound. Five 30-line methods in a class add up to 150 lines. Three methods with complexity 8 make a class very hard to reason about. The problems are easier to catch with measurement than with intuition.

Second, at AI velocity, thorough review becomes impractical. If AI is generating hundreds of lines per day and you're carefully reviewing all of it for structural issues, you're spending significant time on something RuboCop can do automatically in seconds. That's not a good use of your time.

The better approach is to use RuboCop to catch structural issues automatically and focus your review time on business logic, architecture decisions, and things humans are actually better at evaluating.

### "But AI Can Understand Complex Code Fine"

Here's another objection I expect: "If AI can generate and understand complex code that humans find hard to read, and AI is doing more of the maintenance work anyway, why optimize for human readability? Let AI write dense code and let AI maintain it."

The flaw in this argument is the assumption that what helps humans understand code is different from what helps AI understand code. It isn't. The same things that make code easier for humans to reason about make it easier for LLMs to reason about correctly.

A 60-line method with deeply nested conditionals isn't just hard for humans—it's hard for AI. More complexity means more tokens to process, more context to track, more branches to reason about, more opportunities to lose track of state. When you ask AI to modify a complex method, it has to hold the entire control flow in context. The more complex that flow, the more likely AI makes mistakes.

Simple, well-structured code is easier for AI to work with. A method that does one thing is easier to modify correctly than a method that does five things. A class with clear responsibilities is easier to extend than a god object. Low cyclomatic complexity means fewer code paths to track. These aren't just human preferences—they're what makes code reliably modifiable by anyone, including AI.

There's also a practical issue: AI doesn't maintain context indefinitely. The AI that generated code six months ago isn't available to explain it. You're working with a fresh AI session that has to reconstruct understanding from scratch. If the code is a complex tangle, that reconstruction is harder and more error-prone. Simple, well-structured code is easier for new AI sessions to understand, just like it's easier for new human developers.

And you're still responsible for the codebase. When something breaks in production, when requirements change, when you need to explain the system to stakeholders—you need to understand what the code does. AI can assist, but you're making the judgment calls. Optimizing exclusively for AI readability while sacrificing human comprehension doesn't work because the things that help AI are the same things that help humans.

The point isn't "keep code simple for humans at AI's expense." The point is "keep code simple because it helps everyone, including AI."

### "Why Not Just Ask AI to Check for These Problems?"

Another reasonable objection: "If the problem is structural quality, why not just ask AI to review the code for complexity, long methods, and code smells? We don't need RuboCop when AI can do the analysis."

There's some truth to this. You can ask AI "Does this code have any structural problems?" and it will often identify issues. It might flag a long method, notice high complexity, or point out SRP violations. AI can do structural analysis.

But AI is probabilistic and RuboCop is deterministic. That difference matters for enforcement.

AI might catch a 200-line method, or it might not, depending on what else is in context, how you phrased the prompt, what it's focusing on, and random variation in how it processes the request. Run the same code through AI twice and you might get different feedback. Ask it to review 50 files and it might flag complexity in 40 of them while missing 10 others. It's inconsistent by nature.

RuboCop catches every violation, every time, with no variation. A method over 10 lines always triggers `Metrics/MethodLength`. Cyclomatic complexity over the threshold always gets flagged. There's no "it depends on the prompt" or "maybe it'll notice." The enforcement is consistent and predictable.

For quality gates, that determinism is essential. You can't have a pre-commit hook that probabilistically enforces standards. You need to know that if code violates your structural rules, it will be caught 100% of the time, not 85% of the time depending on how AI feels about it that day. Automated enforcement requires deterministic tools.

AI is excellent for analysis, explanation, and generating fixes. But for reliable, consistent enforcement of structural standards, you need deterministic rules. That's what RuboCop provides.

### Configuration: You'll Probably Want Stricter Limits

I'm still exploring optimal configurations, but here's what I'm finding: RuboCop's default thresholds were calibrated for human developers who self-regulate. Humans feel when a method is getting too long and instinctively split it up. AI has no such instinct.

This suggests that while RuboCop's defaults are generally reasonable, you should monitor which violations occur frequently with AI-generated code and adjust accordingly. The right thresholds depend on your codebase and team, but it's worth paying attention to where AI consistently struggles.

What's definitely important: enable all Metrics cops (they catch append behavior), enable Rails-specific cops if you're using Rails (AI doesn't automatically know current idioms), enable Lint cops (they catch actual problems), and de-emphasize style cops (AI handles those fine).

One critical point: if you're adding RuboCop to a codebase that already has violations—perhaps from AI-generated code that's already been committed—don't just disable the cops that are failing. Use RuboCop's auto-generate todo feature (`rubocop --auto-gen-config`). This creates a `.rubocop_todo.yml` file that documents all existing violations and excludes them from enforcement, while still enforcing the rules on all new code. This "stops the bleeding"—you're not allowing new violations while you work through the backlog. Simply disabling cops means new code can continue adding the same problems.

Start with defaults, generate significant AI code, observe which violations occur frequently, and tighten cops where AI consistently struggles. This is emerging practice and I'm sharing what I'm learning, not claiming to have definitive answers.

### The Training Data Problem

There's one more issue worth understanding: AI learned from billions of lines of code written between 2010 and its training cutoff. That includes deprecated patterns, old Stack Overflow answers, and code that worked but wasn't idiomatic. AI can't distinguish "this was current in Rails 3" from "this is current in Rails 7."

You'll occasionally see AI suggest patterns like `before_filter` (deprecated in favor of `before_action`) or `update_attributes` (removed in Rails 6). These aren't common, but they happen. RuboCop's Rails cops catch them automatically. Without that enforcement, outdated patterns from AI's training data will slip into your codebase.

### Better Violation Messages: An Opportunity

One thing I haven't fully explored but see potential in: RuboCop's violation messages could be more helpful for AI. Currently they say things like "Method has too many lines [45/10]" without explaining how to fix it. For experienced humans, that's enough—we know to extract helper methods. But AI takes instructions literally and benefits from explicit guidance.

If violation messages said "Method has too many lines [45/10]. This method appears to handle user validation, email sending, and database updates. Consider extracting each concern into its own method," AI could fix issues more effectively. This could be built into core RuboCop cops or implemented through custom cops with enhanced messages. I'm confident this would improve AI's fixes, though I haven't tested it extensively.

### Why This Matters: The Maintenance Cost

Let me be direct about the stakes. The cost of not enforcing structural quality with AI-generated code is that your codebase becomes progressively harder to maintain. Methods grow longer. Classes accumulate responsibilities. Complexity compounds. Bad patterns spread. And because this happens gradually, you won't notice a single moment when things went wrong—you'll just realize six months later that your codebase is harder to work with than it should be.

At that point, fixing it requires significant refactoring effort. You're essentially paying the cost you avoided upfront, plus interest, because now the problems are widespread and interconnected. Better to catch them at the source, file by file, commit by commit, when fixes are cheap.

RuboCop provides that enforcement automatically. It catches structural problems before they enter your codebase. It prevents bad patterns from propagating. It keeps AI-generated code maintainable without requiring manual vigilance. And because AI doesn't resist the feedback, the enforcement is frictionless.

### The Bottom Line

If you're skeptical, I encourage you to try this: set up a pre-commit hook running RuboCop with Metrics cops enabled. Generate some significant AI code and see what gets flagged. Pay attention to append behavior—watch what happens to method length when you ask AI to add features incrementally. Notice whether AI replicates patterns from your existing code without judging their quality.

You'll likely see the same patterns I've described. And once you see them, the value of automated enforcement becomes obvious. This isn't about being pedantic—it's about preventing technical debt from accumulating at machine speed.

RuboCop isn't competing with AI. It's complementary infrastructure that makes AI-generated code sustainable. AI generates quickly, RuboCop validates structure, and together they let you maintain velocity without sacrificing maintainability. That's the proposition, and it's worth testing yourself if you're skeptical.
