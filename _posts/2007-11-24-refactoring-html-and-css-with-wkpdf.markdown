---
title: "Dissertation: Refactoring HTML and CSS with help from wkpdf"
layout: post
tags: dissertation
published: false
---
I've been thinking about how wkpdf could be useful when refactoring code in order
to avoid inadvertently changing the appearance of a page.

Say you want to move some in-line HTML styles into a CSS block. Since a PDF
represents only the rendered content, and not the underlying structure,
comparing the PDFs of the before and after state should be a reliable way to
confirm the page layout hasn't been changed.

You'd start by creating a reference copy of the page before the refactoring.

{% highlight bash %}
wkpdf --source http://localhost/sample --output before.pdf
{% endhighlight %}

You'd then carry out the refactoring and run the same command to create an
`after.pdf`.

A quick visual check should show that both look identical, but the aim is to do
this programatically.

My first thought was to compare the MD5 hashes of the before and after pages:

{% highlight bash %}
$ md5 before.pdf after.pdf
MD5 (before.pdf) = 2eff7c7a874397a3e12a197a723faecb
MD5 (after.pdf) = 61924f53d8455cb0054116f7af2d23e9
{% endhighlight %}

So it seems these PDF files must have some subtle difference.

I then tried converting each to images:

{% highlight bash %}
$ convert before.pdf before.png
{% endhighlight %}

But I was suprised to see they still differ:

{% highlight bash %}
$ md5 before.png after.png
MD5 (before.png) = da6e6e433e3fbd3b6fb6ea05f33f06c8
MD5 (after.png) = ae8cd4dd05ff109f610c21022562c8ba
{% endhighlight %}

I looked for others way to compare PDFs and found i-net PDFC

That can be run from the command line as:

{% highlight bash %}
java -cp CCLib.jar:.:log4j-1.2.15.jar:PDFC.jar:PDFParser.jar com.inet.pdfc.PDFC
before.pdf after.pdf
INFO      XMLConfiguration 24.11.2010 20:41:52,235: Loading properties from
config.xml
INFO          ReportRunner 24.11.2010 20:41:52,335: Scanning before.pdf...
INFO  ConsoleResultHandler 24.11.2010 20:41:53,927: before.pdf: No differences
found!
INFO  ConsoleResultHandler 24.11.2010 20:41:53,928: ------
INFO  ConsoleResultHandler 24.11.2010 20:41:53,928: Result Summary
INFO  ConsoleResultHandler 24.11.2010 20:41:53,929: ------
INFO  ConsoleResultHandler 24.11.2010 20:41:53,929: File Name
| # of Differences
INFO  ConsoleResultHandler 24.11.2010 20:41:53,929: ----------------------------
INFO  ConsoleResultHandler 24.11.2010 20:41:53,930: before.pdf
| 0
{% endhighlight %}

So that demonstrates that the pages layout is unchanged.

I'm still thinking of how this would fit into a refactoring workflow but it
feels like a useful start.
