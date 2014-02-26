namespace :app do
  desc "Initial data setup"
  task :setup => :environment do
    Rake::Task['app:permissions'].execute
    Rake::Task['app:lookups'].execute
    Rake::Task['app:setup_admin'].execute
  end
end