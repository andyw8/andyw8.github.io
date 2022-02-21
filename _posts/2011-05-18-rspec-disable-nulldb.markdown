---
title: How to disable NullDB for a particular RSpec example
layout: post
---
I recently discovered the [nulldb] gem which prevents tests from hitting the database, meaning they run much faster.

However, I have a few tests which need to hit the database, e.g. for custom SQL logic, so I wanted to be able to disable the nulldb gem for particular tests.

The docs demonstrate how to selectively include nulldb, but not how to exclude it.
Since the vast majority of my tests will use nulldb, I didn't want to have to add it in to each one.

I managed this by making use of an RSpec example group filter:

{% highlight ruby %}
context "using the real database", use_real_database: true do
  it "should do something requiring the real database" do
    ...
  end
end
{% endhighlight %}

To make this work, just add the following to the `RSpec.configure` block in
`spec_helper.rb`:

{% highlight ruby %}
config.before(:each) do |example_group|
  unless example_group.example.metadata[:use_real_database]
    include NullDB::RSpec::NullifiedDatabase
  end
end
{% endhighlight %}

[nulldb]: "http://github.com/nulldb/nulldb"
