require 'fileutils'
require 'json'

namespace :exrails do
  desc 'Generates component files for models in the angular app'
  task :g => :environment do |t, args|
    models = []
    g_task_found = false
    ARGV.each do |arg|
      g_task_found = (arg == 'exrails:g') unless g_task_found
      next if !g_task_found || (arg == 'exrails:g')

      model_match = /^[a-zA-Z][a-zA-Z,_]+$/.match(arg)
      if model_match
        models.push(model_match[0])
      end
    end
    
    # Create fake tasks
    models.each { |model| task model.to_sym do ; end }

    # Handle all models
    if models.first == 'all'
      models = g_resourcified_models
    end

    # Generate components for models
    models.each do |model|
      begin
        klass = model.classify.constantize
        puts "Generating files for #{klass.name} ..."
        g_generate_component_files(klass)
        g_insert_component_scripts(klass)
        g_generate_controller_file(klass)
        g_add_resources_route(klass)
      rescue
      end
    end
  end

  def g_generate_component_files(klass)
    components_dir = Rails.root.join('angular', 'src', 'app', 'components').to_s

    dir = File.join(components_dir, g_model_route(klass).dasherize)
    Dir.mkdir(dir) unless File.directory?(dir)

    files_tpls = g_component_files_tpl(klass)

    # Generate views: index.html, new.html, show.html, bulk.html, uploads.html
    ['index', 'new', 'show'].each do |action|
      file_path = File.join(dir, "#{action}.html")
      File.open(file_path, 'w') do |file|
        file_content = files_tpls[action.to_sym]
        file.write(file_content)
      end unless File.exists?(file_path)
    end

    # Generate config.js
    file_path = File.join(dir, "config.js")
    File.open(file_path, 'w') do |file|
      file.write(files_tpls[:config])
    end unless File.exists?(file_path)
  end

  def g_insert_component_scripts(klass)
    index_file = Rails.root.join('angular', 'src', 'index.html')
    pattern = '<script src="app/components/roles/config.js"></script>'
    url = g_model_route(klass).dasherize
    insert_str = "#{' ' * 8}<script src=\"app/components/#{url}/config.js\"></script>\n"
    g_insert_line_into_file(index_file, pattern, insert_str)
  end

  def g_generate_controller_file(klass)
    controllers_dir = Rails.root.join('app', 'controllers').to_s

    controller_tpl = "class #{klass.name.classify.pluralize}Controller < ApplicationController\n"
    controller_tpl += "  resourcify\n"
    controller_tpl += "end\n"
    file_path = File.join(controllers_dir, "#{g_model_route(klass)}_controller.rb")
    File.open(file_path, 'w') do |file|
      file.write(controller_tpl)
    end unless File.exists?(file_path)
  end

  def g_route_exists?(routeName)
    route = Rails.application.routes.routes
              .map { |e| e.path.spec.to_s }
              .find { |e| e.starts_with? "/api/#{routeName}" }
    !route.nil?
  end

  def g_add_resources_route(klass)
    unless g_route_exists?(g_model_route(klass))
      routes_file = Rails.root.join('config', 'routes.rb')
      pattern = 'resources :roles'
      insert_str = "#{' ' * 4}resources :#{g_model_route(klass)}\n"
    
      g_insert_line_into_file(routes_file, pattern, insert_str)
    end
  end

  def g_insert_line_into_file(file, pattern, insert_str, after_pattern = true)
    lines = File.readlines(file)
    return if lines.join.include? insert_str 
    lines.each_with_index do |line, index|
      if line.include? pattern
        insert_at = (after_pattern)? index + 1 : index - 1
        insert_at = (insert_at < 0)? 0 : insert_at
        lines.insert(insert_at, insert_str)
        break
      end
    end
    File.write(file, lines.join)
  end

  def g_resourcified_models
    models = []
    excluded_models = ['Concern', 'ReportBuilder', 'User', 'Role']
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
      model = File.basename(file, ".*").classify
      unless models.include?(model) || excluded_models.include?(model)
        begin
          models << model if model.constantize.respond_to? 'resourcify_options'
        rescue
        end
      end
    end
    models
  end

  def g_component_files_tpl(klass)
    data = {}

    data[:index] = <<-eos
<div ng-controller="IndexCtrl as vm" ng-init="vm.initRoute('#{g_model_route(klass)}', {})">
  <div ng-include="partials.header"></div>
  <div ng-include="partials.searchForm"></div>
  <div class="row model-container">
    <div ng-init="vm.configure({openable: true, popable: true})"></div>
    #{g_grid_config(klass)}
    <div ng-show="state.showGrid" ng-class="{'col-md-12': !state.collapsedGridMode, 'col-md-4': state.collapsedGridMode}">
      <div ng-include="partials.indexGrid"></div>
      <div ng-include="partials.loadMoreButton"></div>
    </div>
    <div ng-hide="state.isIndex" ng-class="{'col-md-8': state.collapsedGridMode, 'col-md-12': !state.collapsedGridMode}">
      <div ui-view></div>
    </div>
  </div>
</div>
<div ng-controller="#{g_model_name(klass)}Ctrl"></div>
    eos

    data[:new] = <<-eos
<div ng-controller="FormCtrl as vm" ng-init="vm.initRoute('#{g_model_route(klass)}', {})">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      {{ vm.model.title }}
    </h4>
  </div>
  <div class="modal-body">
    <div ng-include="partials.formlyForm"></div>
  </div>
  <div class="modal-footer">
    <div ng-include="partials.formNewButtons"></div>
  </div>
</div>
    eos

    data[:show] = <<-eos
<div ng-controller="FormCtrl as vm" ng-init="vm.initRoute('#{g_model_route(klass)}', {})">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      {{ vm.model.title }}
    </h4>
  </div>
  <div class="modal-body">
    <div ng-include="partials.formlyForm"></div>
  </div>
  <div class="modal-footer">
    <div ng-include="partials.formShowButtons"></div>
  </div>
</div>
    eos

    data[:uploads] = <<-eos
<div class="panel panel-default" ng-controller="UploadsCtrl">
  <div class="panel-heading">
    <h3 class="panel-title">File Upload</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.uploadsGrid"></div>
  </div>
</div>
    eos

    data[:bulk] = <<-eos
<div ng-controller="BulkCtrl as vm" ng-init="vm.initRoute('#{g_model_route(klass)}')">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      {{ vm.model.title }} Data Upload
    </h4>
  </div>
  <div class="modal-body">
    <div ng-include="partials.bulkGrid"></div>
  </div>
  <div class="modal-footer">
      <div ng-include="partials.bulkNav"></div>
  </div>
</div>
    eos

    data[:config] = <<-eos

angular.module('angularApp')
  .controller('#{g_model_name(klass)}Ctrl', function ($scope, APP, $http, exMsg) {
    
    $scope.$on('exui:index-ready', function (evt, modelName, config, scope) {
      if (modelName !== '#{g_model_name(klass)}') return;
      // Do something
    });

    $scope.$on('exui:form-ready', function (evt, modelName, config, scope) {
      if (modelName !== '#{g_model_name(klass)}') return;
      // Do something
    });

    $scope.$on('exui:record-loaded', function (evt, modelName, record, scope) {
      if (modelName !== '#{g_model_name(klass)}') return;
      // Do something
    });
  });

angular.module('angularApp')
  .run(function (fieldService) {
    // Set config for angular-formly
    fieldService.set('#{g_model_key(klass)}', fieldConfig());
    
    function fieldConfig () {
      return #{g_form_field_config(klass)};
    }
  });

angular.module('angularApp')
  .run(function (schemaService) {
    // Set config for json-schema
    schemaService.set('#{g_model_key(klass)}', schemaConfig());
    
    function schemaConfig () {
      return #{g_json_schema_config(klass)};
    }
  });
    eos

    data
  end

  def g_model_route(klass)
    klass.name.underscore.pluralize
  end

  def g_model_name(klass)
    klass.name
  end

  def g_model_key(klass)
    klass.name.underscore
  end

  def g_model_title(klass)
    klass.name.singularize.titleize
  end

  def g_model_columns(klass)
    exclusion_list = ['deleted_at', 'lft', 'rgt', 'depth']
    klass.columns.select { |e| !exclusion_list.include?(e.name) }
  end

  def g_column_form_visible?(column)
    exclusion_list = ['id', 'created_at', 'updated_at', 'details', 'blocked_at']
    !exclusion_list.include?(column.name)
  end

  def g_column_grid_visible?(column)
    exclusion_list = ['id', 'updated_at', 'details', 'blocked_at']
    !exclusion_list.include?(column.name)
  end

  def g_column_json_schema_property(klass, column)
    type_mappings = { string: 'string', text: 'string', decimal: 'string', integer: 'number'}
    foreign_keys = klass.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }
    
    prop = {}
    prop[:key] = column.name
    prop[:title] = column.name.titleize
    prop[:type]  = type_mappings[column.type] || column.type.to_s

    # Email fields
    if column.name == 'email' || column.name.ends_with?('_email')
      prop[:pattern] = '^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$'
      prop[:validationMessage] = 'Should be a correct Email Address'
    end

    # Is it a lookup
    if foreign_keys.keys.include?(column.name) || (klass.respond_to?(:acts_as_nested_set) && column.name == 'parent_id')
      lookup = foreign_keys[column.name]

      # Includes acts_as_nested_set
      if lookup == :children
        lookup = :parent
        prop[:title]  = "Parent #{prop[:title]}"
      end
      prop[:lookup] = lookup
      prop[:items] = []
    elsif column.name.ends_with? '_ids'
      begin
        title = column.name[0, column.name.length - 4].classify
        lookup_klass = title.constantize
        prop[:title] = title.titleize.pluralize
        prop[:type] = 'array'
        prop[:default] = []
        prop[:lookup] = lookup_klass.name.underscore
        prop[:items] = []
      rescue
      end
    elsif column.name == 'tags' # Assumes there is a model with the name "ModelName + Tag"
      begin
        lookup_klass = "#{klass.name}Tag".constantize
        prop[:type] = 'array'
        prop[:default] = []
        prop[:lookup] = lookup_klass.name.underscore
        prop[:items] = []
      rescue
      end
    end

    # Set input type
    prop[:format] = (prop[:lookup])? 'select': ((['date', 'datetime'].include?(prop[:type]))? 'date' : 'text')
    { column.name => prop }
  end

  def g_json_schema_config(klass)
    properties = g_model_columns(klass)
                  .select { |e| g_column_form_visible?(e) }
                  .map { |e| g_column_json_schema_property(klass, e) }
                  .reduce({}){ |m, e| m.merge!(e) and m}

    json_schema = {}
    json_schema[:type]  = 'object'
    json_schema[:title] = g_model_title(klass)
    json_schema[:required] = klass.validators.map { |e| e.presence.attributes }.flatten.uniq
    json_schema[:properties] = properties

    json_schema = JSON.pretty_generate(json_schema, {})
    json_schema.gsub! /\[\s+\]/, '[]'
    json_schema.gsub! /\}\n\n/, "}\n"
    json_schema.gsub! /\n/, "\n      "
    json_schema
  end

  def g_grid_field_html(field)
    html = ''
    input_type = field[:type]
    name = field[:key]
    title = field[:templateOptions][:label]

    if input_type == 'ex-input'
      html = "<div ng-init=\"vm.column('#{name}', '#{title}')\"></div>"
    elsif input_type == 'ex-datepicker'
      html = "<div ng-init=\"vm.column('#{name}', '#{title}', 'date', 'yyyy-MM-dd HH:mm:ss')\"></div>"
    elsif input_type == 'ex-select'
      html = "<div ng-init=\"vm.column('#{field[:templateOptions][:lookup]}_name', '#{title}')\"></div>"
    elsif input_type == 'ex-select-multiple'
      html = "<div ng-init=\"vm.column('#{field[:templateOptions][:lookup]}_names', '#{title}')\"></div>"
    end

    html
  end

  def g_grid_config(klass)
    g_model_columns(klass)
      .select { |e| g_column_grid_visible?(e) }
      .take(5)
      .map { |e| g_formly_field(klass, e) }
      .map { |e| g_grid_field_html(e) }
      .join("\n\t\t")
  end

  def g_formly_field(klass, column)
    foreign_keys = klass.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }
    required_fields = klass.validators.map {|e| e.presence.attributes }.flatten

    field = {
      className: 'col-xs-6',
      key: column.name,
      type: 'ex-input',
      templateOptions: {
        required: required_fields.include?(column.name.to_sym),
        label: column.name.titleize
      }
    }

    # Check if date
    if column.type == :date|| column.type == :datetime
      field[:type] = 'ex-datepicker'
    
    # Is it a lookup
    elsif foreign_keys.keys.include?(column.name) || (klass.respond_to?(:acts_as_nested_set) && column.name == 'parent_id')
      
      lookup = foreign_keys[column.name]

      if foreign_keys[column.name] == :children
        lookup = :parent
      end

      field[:type] = 'ex-select'
      field[:templateOptions][:lookup] = lookup
      field[:templateOptions][:valueProp] = 'value'
      field[:templateOptions][:labelProp] = 'name'
      field[:templateOptions][:options] = []
      field[:controller] = 'CONTROLLERFUNCTION'
    elsif column.name.ends_with? '_ids'
      begin
        lookup_klass = column.name[0, column.name.length - 4].classify.constantize
        label = lookup_klass.name.titleize.pluralize
        field[:type] = 'ex-select-multiple'
        field[:templateOptions][:lookup] = lookup_klass.name.underscore
        field[:templateOptions][:label] = label
        field[:templateOptions][:placeholder] = "Select #{label.pluralize.downcase} ..."
        field[:templateOptions][:valueProp] = 'value'
        field[:templateOptions][:labelProp] = 'name'
        field[:templateOptions][:options] = []
        field[:controller] = 'CONTROLLERFUNCTION'
      rescue
      end
    elsif column.name == 'tags'
      begin
        lookup_klass = "#{klass.name}Tag".constantize
        field[:type] = 'ex-select-multiple'
        field[:templateOptions][:lookup] = lookup_klass.name.underscore
        field[:templateOptions][:placeholder] = 'Select tags ...'
        field[:templateOptions][:valueProp] = 'name'
        field[:templateOptions][:labelProp] = 'name'
        field[:templateOptions][:options] = []
        field[:controller] = 'CONTROLLERFUNCTION'
      rescue
      end
    end

    field
  end

  def g_form_field_config(klass)
    ctrl_fn = <<-eos
/* @ngInject */ function($scope, lookupService) {
          lookupService.load('#{g_model_key(klass)}').then(function() {
            $scope.to.options = lookupService.get($scope.to.lookup);
          });
        }
    eos

    config = g_model_columns(klass)
               .select { |e| g_column_form_visible?(e) }
               .map { |e| g_formly_field(klass, e) }
               .each_slice(2)
               .map { |e| {'fieldGroup': e} }
    
    config = JSON.pretty_generate(config, {})
    config.gsub! '"CONTROLLERFUNCTION"', ctrl_fn
    config.gsub! /\[\s+\]/, '[]'
    config.gsub! /\}\n\n/, "}\n"
    config.gsub! /\n/, "\n      "

    config
  end
end
