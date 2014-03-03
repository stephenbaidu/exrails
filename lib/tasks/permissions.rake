namespace :app do
  desc "Setup base permissions"
  task :permissions => :environment do |t, args|
    Rails.application.eager_load!
    ActiveRecord::Base.descendants.map(&:name).select do |m|
      !m.include?(':') && !['User', 'Permission'].include?(m)
    end.each do |m|
      [:index, :create, :show, :update, :delete].each do |action|
        BaseInterop.app('base').permission.create("#{m}:#{action}")
        # Permission.where(name: "#{m}:#{action}").first_or_create
      end
    end

    # Report permissions
    Dir.glob(Rails.root.join('app', 'views', 'reports').to_s + '/*.pdf.erb') do |f|
      report_name = f.split('/').last.split('.').first.classify
      BaseInterop.app('base').permission.create("Report:#{report_name}")
      # Permission.where(name: "Report:#{report_name}").first_or_create
    end

    # User permissions
    Permission.where(name: "User:index").first_or_create
    Permission.where(name: "User:create").first_or_create
    Permission.where(name: "User:show").first_or_create
  end
end
