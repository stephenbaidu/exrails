namespace :app do
  desc "Initial data setup"
  task :setup => :environment do
    Rake::Task['app:permissions'].invoke
    Rake::Task['app:lookups'].invoke
  end
end