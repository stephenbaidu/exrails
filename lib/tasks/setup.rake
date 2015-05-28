namespace :app do
  desc "Initial data setup"
  task :setup => :environment do
    Rake::Task['app:permissions'].invoke
    Rake::Task['app:lookups'].invoke
    Rake::Task['app:setup_admin'].invoke
    # Rake::Task['app:setup_roles'].invoke
  end
end