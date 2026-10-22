---
title: Installing Mephisto on Heroku
layout: post
published: false
---
Since Heroku apps run in a read-only filesystem, the normal Mephisto installation method won't work. Here's how to work around that.

Begin by cloning Mephisto in the usual way:

```bash
$ git clone git://github.com/emk/mephisto.git
$ cd mephisto
```

And prepare the database configuration:

```bash
$ cp config/database.example.yml config/database.yml
```

Normally the next step would be to run `rake db:bootstrap` which modifies and creates a few files.
Since we can’t do this on Heroku, we’ll create them locally and add them to the repository.

The behaviour in the development environment differs from production, so we need to run in production mode locally.

If you have mysql running setup, create a new database named `mephisto_production`.
Alternatively, just define a sqlite connection:

```yaml
production:
  adapter: sqlite3
  database: db/mephisto_production
```

You can now bootstrap the app:

```bash
$ rake db:bootstrap RAILS_ENV=production
```

This will modify session_store.rb and create a few other files/folders, but git status won’t show them since they are excluded by .gitignore.
Use the -f flag to force add them:

```bash
$ git add config/initializers/session_store.rb -f
$ git add themes/ -f
$ git add public/plugin_assets/ -f
$ git commit -m "adding required files for Heroku"
```

You’re now ready to deploy onto Heroku:

```bash
$ heroku create yourblogname
$ git push heroku master
$ heroku rake db:bootstrap
```

I'm not sure why, but at this point you need to restart your app or you’ll get an error message:

```bash
$ heroku restart
```

You can then view the site in your browser and you should see Mephisto running.

```bash
$ heroku open
```

**Notes**

The above instructions will deploy the edge version of Mephisto rather than the v0.8-stable branch which the official site recommends, but I haven’t yet worked out how to deploy a particular branch to Heroku.

Some features will not work on Heroku, such as installing/editing themes or uploading assets. You will need to do this locally and then add the appropriate files to the git repository.
