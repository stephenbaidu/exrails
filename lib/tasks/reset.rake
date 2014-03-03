if(Rails.env.development?)
  namespace :app do
    desc "Initial reset"
    task :reset => :environment do
      Rake::Task['db:drop'].invoke
      Rake::Task['db:create'].invoke
      Rake::Task['db:migrate'].invoke
      Rake::Task['app:setup'].invoke
    end
  end
end