# eXRails

An application template based on the popular Ruby on Rails and AngularJS frameworks. [Devise](https://github.com/plataformatec/devise) and [Pundit](https://github.com/elabs/pundit) are used for authentication and authorization respectively. With Rails for the RESTful API, [Resourcify](https://github.com/stephenbaidu/resourcify) was used as a complementary gem to reduce code written in controllers.

## Installation

```
git clone https://github.com/stephenbaidu/exrails exrailsapp
cd exrailsapp
rake db:create db:migrate app:setup
```

## Starting the rails api

You can now go ahead and run your rails server.
```
rails s
```

## Starting the angular app
The angular app is located in `_uix` directory in your rails root.
From another terminal, navigate to the root directory of your app, then
```
cd _uix
npm install && bower install
grunt serve
```

## Generating components
After adding a model, you can generate a component (in _uix/src/app/components) like below
```
rake uix:g component customer # _uix/src/app/components/customers
rake uix:g component order    # _uix/src/app/components/orders
```

## Generating modules
Modules represent major menus on the top navigation bar. You can generate a module called `sales` (in _uix/src/app/modules) like below
```
rake uix:g module sales customers orders # _uix/src/app/modules/sales
# `customers` and `orders` (pluralized), represent models that will constitute the `sales` module.
```

There are several tasks in `uix.rake` that will help simplify the generation of views for the angular app

Because a defualt user was created from the `rake app:setup` task, login with `exrails@example.com` and `admin123` as username and password respectively

# License

Licensed under the MIT license, see the separate MIT-LICENSE file.