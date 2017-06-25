---
title: Installing Mephisto on Heroku
layout: post
---
Since Heroku apps run in a read-only filesystem, the normal Mephisto installation method won't work. Here's how to work around that.

Begin by cloning Mephisto in the usual way:

{% highlight bash %}
$ git clone git://github.com/emk/mephisto.git
$ cd mephisto
{% endhighlight %}

And prepare the database configuration:

{% highlight bash %}
$ cp config/database.example.yml config/database.yml
{% endhighlight %}

Normally the next step would be to run `rake db:bootstrap` which modifies and creates a few files.
Since we can’t do this on Heroku, we’ll create them locally and add them to the repository.

The behaviour in the development environment differs from production, so we need to run in production mode locally.

If you have mysql running setup, create a new database named `mephisto_production`.
Alternatively, just define a sqlite connection:

{% highlight yaml %}
production:
  adapter: sqlite3
  database: db/mephisto_production
{% endhighlight %}

You can now bootstrap the app:

{% highlight bash %}
$ rake db:bootstrap RAILS_ENV=production
{% endhighlight %}

This will modify session_store.rb and create a few other files/folders, but git status won’t show them since they are excluded by .gitignore.
Use the -f flag to force add them:

{% highlight bash %}
$ git add config/initializers/session_store.rb -f
$ git add themes/ -f
$ git add public/plugin_assets/ -f
$ git commit -m "adding required files for Heroku" 
{% endhighlight %}

You’re now ready to deploy onto Heroku:

{% highlight bash %}
$ heroku create yourblogname
$ git push heroku master
$ heroku rake db:bootstrap
{% endhighlight %}

I'm not sure why, but at this point you need to restart your app or you’ll get an error message:

{% highlight bash %}
$ heroku restart
{% endhighlight %}

You can then view the site in your browser and you should see Mephisto running.

{% highlight bash %}
$ heroku open
{% endhighlight %}

**Notes**

The above instructions will deploy the edge version of Mephisto rather than the v0.8-stable branch which the official site recommends, but I haven’t yet worked out how to deploy a particular branch to Heroku.

Some features will not work on Heroku, such as installing/editing themes or uploading assets. You will need to do this locally and then add the appropriate files to the git repository.
