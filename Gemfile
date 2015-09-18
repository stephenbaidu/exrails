source 'http://rubygems.org'

ruby '2.2.3'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.4'

gem 'uglifier'
gem 'pg'
gem 'omniauth'
gem 'devise_token_auth', '0.1.31'
gem 'pundit'
gem 'faker'
gem 'paper_trail', '~> 4.0.0'
gem 'active_model_serializers'
gem 'resourcify', github: 'stephenbaidu/resourcify'
gem 'rails-settings-cached', '0.4.1'
gem 'awesome_nested_set'
gem 'rb-readline'
gem 'rest-client'
gem 'delayed_job_active_record'
gem 'pdfkit'
gem 'wkhtmltopdf-binary'

group :development, :test do
  gem 'sqlite3'
  gem 'rspec-rails', '~> 3.0'
  gem 'factory_girl_rails'
end

group :test do
  gem 'shoulda-matchers'
  gem 'database_cleaner'
end

group :development do
  gem 'annotate', '~> 2.6.5'
  gem 'table_print'
end

group :production do
  gem 'rails_12factor'
  gem 'newrelic_rpm'
end

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

