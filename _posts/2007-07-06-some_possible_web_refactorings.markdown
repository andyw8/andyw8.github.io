---
layout: post
title: Some Possible Web Refactorings
---
Sticking with Martin Fowler's style, I've tried to use the naming convention of [verb] [subject].

**Extract Common HTML**

Use SSI (Server Side Includes) to remove markup duplicated over several pages

**Separate Business Logic and Markup**

Use templating systems (such as Perl's HTML::Template) to avoid having lengthy HTML strings embedded within code.

**Replace JavaScript Validation with Ajax**

Most validation has to be carried out on the server as well as the browser, causing duplication of effort.
Ajax can be used to call the same validation code on the server as each form field is completed.

**Extract In-line Style Attributes**

Having style attributes scattered through a page makes maintainance difficult. 
It is normally better to reference elements from a stylesheet using *class* and *id*.

Next, I'll discuss how these refactoring can be applied in a safe and systematic fashion.
