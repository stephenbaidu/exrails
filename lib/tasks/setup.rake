namespace :app do
  desc "Initial data setup"
  task :setup => :environment do
    Rake::Task['app:permissions'].invoke
    Rake::Task['app:lookups'].invoke
    Rake::Task['app:setup_admin'].invoke
    # Rake::Task['app:setup_roles'].invoke
  end
end

# Some helpful commands
# rake db:drop db:create db:migrate app:setup app:test_data
# rake db:migrate VERSION=0
# rake db:migrate app:setup app:test_data
# sudo docker ps -a | grep Exit | cut -d ' ' -f 1 | xargs sudo docker rm