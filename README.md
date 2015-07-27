# eXRails

An application template based on the popular Ruby on Rails and AngularJS frameworks. [Devise](https://github.com/plataformatec/devise) and [Pundit](https://github.com/elabs/pundit) are used for authentication and authorization respectively. With Rails for the RESTful API, [Resourcify](https://github.com/stephenbaidu/resourcify) was used as a complementary gem to reduce code written in controllers.

## Installation

```
git clone https://github.com/stephenbaidu/exrails exrailsapp
cd exrailsapp
rake db:create db:migrate app:setup
```
Note that two models (Sample & SampleStatus) have been added for testing. Feel free to remove them after you are conversant with how they were used.

## Starting the rails api

You can now go ahead and run your rails server.
```
rails s
```

## Starting your grunt angular app
From another terminal, navigate to the root directory of your app, then
```
cd angular
sudo npm install && bower install
grunt serve
```

Because a defualt user was created from the `rake app:setup` task, login with `admin@exrails.com` and `admin123` as username and password respectively

### This is still work in progress, but production ready.

# License

Licensed under the MIT license, see the separate MIT-LICENSE file.