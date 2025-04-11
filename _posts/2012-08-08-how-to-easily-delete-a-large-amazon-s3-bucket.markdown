---
layout: post
title: "How to easily delete a large Amazon S3 Bucket"
date: 2012-08-08 14:32
comments: true
categories: s3 aws
published: false
---
I recently had to delete an S3 bucket containing over 200,000 objects. S3 prevents deletion of non-empty buckets, and deleting this many objects is virtually impossible using any GUI. I looked into an API-based approach but support for [multi-object delete](http://aws.amazon.com/about-aws/whats-new/2011/12/07/amazon-s3-announces-multi-object-delete/) still seems limited.

If you don't mind waiting 24 hours for your bucket to be cleared, there's a very simple solution using S3's lifecycle feature:

* Log into the [S3 Management Console](https://console.aws.amazon.com/s3/home)
* Select the bucket you want to clear
* Select Properties from the toolbar
* Click the Lifecycle tab in the Properties panel
* Add a rule with no prefix and expiration of 1 day
* Save the rule

Check back 24 hours later you'll find all your objects have been deleted.
