namespace :test do
  desc 'Load test data'
  task :load_test_data => :environment do |t, args|

    if Rails.env != 'development'
      break
    end

    # Add some data for testing
  end
end
