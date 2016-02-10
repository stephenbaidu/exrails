namespace :app do
  desc 'Load test data'
  task :test_data => :environment do |t, args|

    if Rails.env != 'development'
      break
    end

    # Add some data for testing
  end
end
