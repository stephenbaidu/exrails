namespace :app do
  desc "Initial data setup"
  task :setup => :environment do
    Rake::Task['app:permissions'].invoke
    Rake::Task['app:lookups'].invoke
    Rake::Task['app:setup_admin'].invoke
    # Rake::Task['app:setup_roles'].invoke
  end
end

# rake db:drop db:create db:migrate app:setup test:load_test_data
# rake db:migrate VERSION=0
# rake db:migrate app:setup test:load_test_data