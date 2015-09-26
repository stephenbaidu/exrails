namespace :app do
  desc 'Setup Permissions'
  task :permissions => :environment do |t, args|
    Rails.application.eager_load!
    excluded_models = [
      'Permission',
      'ReportBuilder',
      'Setting'
    ]
    model_actions = [:index, :create, :show, :update, :delete]

    models = []
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
      model = File.basename(file, ".*").classify
      unless models.include?(model) || excluded_models.include?(model)
        begin
          models << model if model.constantize.respond_to? 'resourcify_options'
        rescue
        end
      end
    end
    models = models.select { |e| !e.include?('::') && !excluded_models.include?(e) }
    
    models.each do |model|
      klass = "#{model.pluralize.camelize}Controller".constantize
      model_actions.each do |action|
        begin
          if klass.new.respond_to?(action) || (klass.new.respond_to?(:destroy) and action == :delete)
            Permission.where(name: "#{model}:#{action}").first_or_create
          end
        rescue
        end
      end
    end

    # Report permissions
    Dir.glob(Rails.root.join('app', 'views', 'reports').to_s + '/*.html.erb') do |f|
      report_name = f.split('/').last.split('.').first.classify
      next if report_name == 'Layout'
      Permission.where(name: "Report:#{report_name}").first_or_create
    end

    # # Exra permissions
    # Permission.where(name: "Permission:name").first_or_create
  end
end