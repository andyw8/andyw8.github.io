---
layout: post
title: "Exploring Concerns for Rails 4 (Revised)"
date: 2012-12-23 17:54
comments: true
external-url:
categories: rails, oop
draft: false
published: false
---
Update: I first published this post in 2012 and it still seems to rank highly in Google.
Since then, I've gained a better understanding of the underlying concepts, so I've update this post with my current thinking.

A [recent episode](http://railscasts.com/episodes/398-service-objects) of Railscasts Pro covered two approaches to splitting up a large Rails model – **Concerns** and **Service Objects**.

`ActiveSupport::Concern` is really just some syntactic sugar around Ruby's
module system.
[The documentation for it is very clear](http://api.rubyonrails.org/classes/ActiveSupport/Concern.html).

One other thing `ActiveSupport::Concern` adds is better support for modules depending on one another, but my gut feeling is that if you need that, take it as a warning sign that your design is flawed.

Concerns were supported by Rails 3, but is encouraged in Rails 4 by having default directories for structure when creating a new app.

There's some controversy about whether Concerns or Service Objects are the best approach.
DHH is pushing Concerns but OO proponents tend to prefer Service Objects.
I believe that both have their place and can be used together.

## An Example

I began by looking at one of my ActiveRecord model classes to see what it made sense to extract. Initially I created seperate concerns for validations, assocations, and accessors, e.g.:

``` ruby
# app/models/trader.rb
class Trader
include Accessors
include Validations
include Associations
...
end
```

But I then realised this was probably a bad idea:

* If I add new behaviour to Trader then I'd probably need to change more than one of these concerns.
* It's unlikely I'd be able to re-use any of those concerns for another model.

So instead, I tried to group the code into 'topics' and came up with the following:

``` ruby
# app/models/trader.rb
class Trader
include BasicInfo
include FriendlyURL
include Location
include OpeningHours
include Schedule
include Permissions
end
```

In general, I believe a concern should be named after a domain concept (which I think is true for all of the above, except perhaps FriendlyURL).

Let's look at the Schedule concern as an example:

``` ruby
# app/models/concerns/trader/schedule.rb
class Trader
module Schedule
extend ActiveSupport::Concern

included do
attr_accessible :market_days_ids

has_many :appearances
has_many :market_days, :through => :appearances
end

def open?
...
end

def closed?
...
end
end
end
```

As shown, it can include a mix of validations, accessibilty, associations, as well as the plain methods. This is a much better way of grouping related functionality.

## Sharing Concerns

One thing that wasn't clear from the documentation and other articles I've seen is how a concern can be shared amongst multiple models. Let's say you have two concerns with the same name:

* app/models/concerns/schedule.rb
* app/models/concerns/trader/schedule.rb

and the following model:

``` ruby
# app/models/trader.rb
class Trader
include Schedule
end
```

In this case, the concern in `app/models/concerns/trader/schedule.rb` would be used, and the other ignored.

However, if that concern was removed, the model would pick up the other concern. So a model will search in it's own `concerns` directory first, and if the concern isn't found there, it will look in the top-level concerns directory.

If you prefer a more explicit way of indicating a shared concern, you can namespace it:

``` ruby
# app/models/trader.rb
class Trader
include Shared::Schedule
end

# app/models/concerns/shared/schedule.rb
module Shared::Schedule
extend ActiveSupport::Concern
...
end
```

I hope you find this useful.
