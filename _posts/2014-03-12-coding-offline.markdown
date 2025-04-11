---
layout: post
title: "Coding Offline"
date: 2014-03-12 11:02
comments: true
external-url:
categories: tools
published: false
---

Looking things up online while coding is now so common that we take it for granted. Need to check the parameters for that method call? Just Google it. How do you configure that library? Check the README on GitHub. What does that obscure error mean? Look it up on StackOverflow, someone else has probably already solved it.

But there will be times when you want to code, and you don't have an Internet connection. You might be on a 14-hour plane trip – what a great way to do some coding without distractions! But then you discover there's some critical piece of documentation you need, and you can't make any progress without it.

So the next next day, you head to a local coffee shop, and connect to their WiFi. But you soon discover it's slow and unreliable. You return to your hotel, and discover there's a huge surcharge for in-room WiFi because it's priced at business travellers with expense accounts.

So in desperation you buy a local SIM card, add some credit, and tether your phone to your laptop. But you discover the 3G network doesn't have good coverage in the part of town you're in. Web pages keep timing out causing endless frustration.

But it doesn't have to be this way. In this post, I'll show some practical tools and techniques to turn coding offline into a viable practice. Even if the above situations don't apply to you, it can sometimes be good to disconnect on purpose to avoid all the interruptions and distractions that being online brings.

- - -

# Dash

[Dash](http://kapeli.com/dash) is a paid app published by Kapeli which lets you download documentation for offline use. It's US$19.99 but can occasionally be found at a discount. It covers virtually every language and framework you might want refer to, and the content is updated automatically. It has document sets for dozens of languages, and it you can also download docs for packages on sources such as rubygems.org or Maven.org.

# Dependency Management Tools

A dependency manager such as Bundler or npm will download all the libraries your projects needs, based on a manifest file. If you add a dependency, it will need to fetch that from the Internet, unless it's already on your system (and is at the correct version number).

You'll probably find that most dependencies are added or changed near the beginning of a project, and that changes become less frequent over time. So this is a case where preparing beforehand is key, while you still have a fast Internet connection. If you're beginning a new project, start by building a [walking skeleton](http://blog.codeclimate.com/blog/2014/03/20/kickstart-your-next-project-with-a-walking-skeleton/) that touches all layers of the system, so that you can discover any missing dependencies.

Once you have the dependencies installed, you may need to refer to their documentation. People tend to jump straight to the project's web site, but all the documentation is usually already contained with the packages you've downloaded. For example, if you're using Ruby you can simply run `yard server -G Gemfile` within your project, then visit [http://0.0.0.0:8808](http://0.0.0.0:8808) to browse it.

# Distributed Version Control

We take it for granted, but Git is a huge help when working offline. Older systems such as Subversion require a connection to a server to view a file's history, or create a new branch. When you clone a Git repo, you'll have the full history of every change that's been made.

Feature branches are particularly useful. If you get stuck on a problem due to not being online, you can commit what you've have so far, then check out a separate branch from master to work on something else.

# Books

I use to have a fairly large collection of paper books, but I've given that up now for the convenience of having everything just a click away.

While technology-based books do tend to be become outdated fairly quick, they can be a useful addition or replacement for the standard documentation.

I'm a big fan of companies which allow you to download their books in mulitple formats (usually PDF, epub and mobi), without DRM. This includes Pragmatic Programmers, Leanpub, Manning and O'Reilly.

I store my eBooks in Dropbox, and use GoodReader to keep them in sync with my iPad. I prefer to read PDF versions on the iPad since it preserves the author's intended layout. Code samples can be difficult to read on a Kindle.

eBooks don't take up much disk space, so you carry every book you own without having to be concerned about disk space.

# Email

If you're working on a project with other people, you might need to refer to information contained in emails. Unfortunately web-based mail such as GMail are no use when offline. So consider using a native email client which can download and store all your mail offline, such as Apple's Mail app for Mac.

Even if you have many years of email, it shouldn't take up too much space as long as you periodically prune any mail with large attachments. I have around five years of mail in GMail which consumes only around 3GB.

# StackOverflow

StackOverflow has become indispensible to many developers. The entire question and answer database is available under a Creative Commons license on [The Internet Archive](https://archive.org/details/stackexchange).

The raw data probably isn't much use, so check out [StackStash](http://stackstash.com/) (US$1.99), an iOS app which allows browsing of the entire StackOverflow site offline.

# Evernote

I love Evernote for keeping notes organised, but one of its most useful features is the Web Clipper. Whenever I look-up something which I think I might need to refer to later, I clip the page into Evernote. This allows me to view it offline, with all formatting intact. It's indexed by Evernote so I can easily find what I'm looking for, even within thousands of notes.

I also recommend maintaining 'cheat sheets' of common commands you use, or things you have trouble remembering without Googling them.

# Video Content

I'm a big fan of screencast tutorial sites such as Railscasts and Codeschool. These can be streamed online but I like to have them available to refer to offline.

Videos can take up a lot of space, so you may want not want to fill up your drive, especially if you're using an SSD with limited storage.

Instead, store the videos on a secondary device whch you can carry with you. A 128GB flash drive or card can be bought for around US$60. If you want more space, a portable 2TB USB hard drive is only around $100, and sturdy enough to carry around in your bag.

**Did you find this post useful? I'm writing a [book on Travel Technology](https://leanpub.com/travel-tech). Sign up to learn more.**
