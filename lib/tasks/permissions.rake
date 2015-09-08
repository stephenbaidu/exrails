namespace :app do
  desc 'Setup Permissions'
  task :permissions => :environment do |t, args|
    Rails.application.eager_load!
    excluded_models = [
      'Permission', 'ReportBuilder', 'Setting'
    ]
    model_actions = [:index, :create, :show, :update, :delete]
    
    models = ActiveRecord::Base.descendants.map(&:name)
    models = models.select { |e| !e.include?('::') && !excluded_models.include?(e) }
    
    models.each do |model|
      model_actions.each do |action|
        Permission.where(name: "#{model}:#{action}").first_or_create
      end
    end

    # Report permissions
    Dir.glob(Rails.root.join('app', 'views', 'reports').to_s + '/*.pdf.erb') do |f|
      report_name = f.split('/').last.split('.').first.classify
      Permission.where(name: "Report:#{report_name}").first_or_create
    end

    # # Exra permissions
    # Permission.where(name: "Permission:name").first_or_create
  end
end