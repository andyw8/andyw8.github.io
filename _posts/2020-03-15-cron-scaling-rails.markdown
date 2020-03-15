---
layout: post
title:  "Avoiding cron pitfalls when scaling Rails"
date:   2020-03-15
published: true
---
A common theme in business applications is the need for some kind of periodic task to run at a fixed interval, such as daily or weekly.
This is often for be for activities such as billing, pushing data to other systems, or integrating with an third-party API.

The de facto tool to use for this is cron. It's somewhat archaic, but provides a reliable mechanism to declaratively define job schedules.
The popular [whenever] gem provides an DSL to make this easy to use with Ruby.

[whenever]: https://github.com/javan/whenever

Simple tasks such as clearing a cache are a great match for cron.
They run quickly and don't require significant system resources.

The difficulty comes when cron is used to execute tasks which rely on the Rails application.
It's easy to make use of cron for this, because we call the `rails runner` command to invoke a method on a class.

On a small app, this approach may be fine, but when scaling there are some serious drawbacks.

Whenever we use `rails runner`, we're launching a completely separate instance of the application.
Let's say your Rails app typically uses around 200MB of memory.
To allow for some growth, we provision a server with 512MB of memory.

If you schedule a cron job, the server's memory usage will temporarily spike to to 400MB.

This might not even be noticed at first.
Even if the machine runs short on memory, it can temporarily make use swap space on disk to temporarily.
This might happen in the middle of night, when traffic is already low.

But consider what happens once you have more scheduled jobs:

- `CalculateUsage` runs daily at 2am
- `GenerateReports` runs weekly at 2am (every Monday)
- `CreateInvoices` runs monthly at 2am (1st of each month)

This means that once a month, all three jobs will be triggered at the same time.
Your system needs to have enough capacity to run three instances, in addition to the main app.

This could mean you need to over-provision your servers by 4x. That extra capacity
will be idle most of the time. On a large site, you could be spending thousands
of extra dollars per month. Or if you don't sufficiently provision, then you risk crashing your site.

This risk is often exacerbated by the nature of schedule jobs.
A web request typically lasts only for a few seconds at most.
But a job may run for a much longer period, causing a large spike in memory use.

## A First Approach

Let's take a step back, and consider how we schedule jobs. Is it critical that
each jobs runs at 2am? Probably not. The key thing probably that the job is
complete by the beginning of the business day.

A common first reaction to this problem is to try 'pad out' the jobs to prevent them overlapping.
For example, instead of running each job at 2am, you run the first at 2.00am, the next at 2.05am, and the next at 2.10am.

While this may provide a short term fix, it's not a sustainable solution.
As your data grows, the time it takes to run each job will creep up, and will start to overlap again.
You'll end up playing [Whac-A-Mole] shifting jobs around.

[Whac-A-Mole]: https://en.wikipedia.org/wiki/Whac-A-Mole

## A Better Approach

As with many scaling problems, we can handle growth better if we can scale horizontally and add additional machines.

We can achieve this with a distributed queue.
In Rails, we typically use tools such as Sidekiq, Resque or Delayed Job.

We could even configure this to auto-scale to handle varying workloads.

Instead of using cron to execute the jobs, we'll use it to only enqueue them.

```ruby
job = MonthlyReport.new(Date.today)
Delayed::Job.enqueue(job, queue: 'cron')
```

This still involves booting up a separate Rails instance, but it's a fast operation.
Spacing jobs one minute apart should be sufficient.

You may later run into another problem of timeouts from jobs being too large.
That can often be handled with a map-reduce approach, but that's beyond the scope of this post.

## Further Improvement

Instead of having to boot up an instance of the app to enqueue a job, there's another approach we can take.

We can add an internal API endpoint, such as `/api/internal/jobs`. We can make an HTTP post, specifying the job to be queued.
That means cron only need to execute a call to something like curl, which uses vastly less resources.
Obviously you should add some kind of authentication or restriction on that end point avoid any possibility of a DOS attack.

[//]: # "Error handling"
[//]: # "Heroku Scheduler"
[//]: # "system cron to call a script that will either (a) poke a secure/private webhook API to invoke the required task in the background or (b) directly enqueue a task on your queuing system of choice"
[//]: # "ombining entries, &&"
[//]: # "ODO: write about using REST API to trigger"
