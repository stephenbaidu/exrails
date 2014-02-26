namespace :app do
  desc "Initial reset"
  task :reset => :environment do
    Rake::Task['db:drop'].execute
    Rake::Task['db:create'].execute
    Rake::Task['db:migrate'].execute
    Rake::Task['app:setup'].execute
  end
end