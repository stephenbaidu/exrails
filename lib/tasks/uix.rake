require 'fileutils'
require 'json'

namespace :uix do
  desc 'Creates the angular app'
  task :create => :environment do |t, args|
    uix_create
  end
  task :c => :create # alias

  desc 'Generates module/component files in the angular app'
  task :generate => :environment do |t, args|
    uix_generate
  end
  task :g => :generate # alias

  desc 'Destroys module/component files in the angular app'
  task :destroy => :environment do |t, args|
    uix_destroy
  end
  task :d => :destroy # alias

  def uix_create
    puts "Not yet implemented"
  end

  def uix_generate
    tasks = ARGV

    # Move to uix generate task
    while !['uix:generate', 'uix:g'].include?(tasks.shift) do ; end

    # Create fake tasks
    tasks.each { |arg| task arg.to_sym do ; end }

    sub_task = tasks.shift

    if uix_component_task?(sub_task) # component task
      uix_g_component_task(tasks)
    elsif uix_module_task?(sub_task) # module task
      uix_g_module_task(tasks.shift, tasks)
    else                              # no task found
      puts "#{'*' * 25}\nNo compatible task found\n#{'*' * 25}\n"
    end
  end

  def uix_destroy
    tasks = ARGV

    # Move to uix destroy task
    while !['uix:destroy', 'uix:d'].include?(tasks.shift) do ; end

    # Create fake tasks
    tasks.each { |arg| task arg.to_sym do ; end }

    sub_task = tasks.shift

    if uix_component_task?(sub_task) # component task
      uix_d_component_task(tasks)
    elsif uix_module_task?(sub_task) # module task
      uix_d_module_task(tasks.shift)
    else                              # no task found
      puts "#{'*' * 25}\nNo compatible task found\n#{'*' * 25}\n"
    end
  end

  def uix_component_task?(task_name)
    ['component', 'c'].include?(task_name)
  end

  def uix_module_task?(task_name)
    ['module', 'm'].include?(task_name)
  end

  def uix_g_component_task(components)
    # Generate components files
    components.each do |component|
      begin
        klass = component.underscore.classify.constantize
        puts "Generating files for #{klass.name} ..."
        uix_generate_component_files(klass)
        uix_insert_component_scripts(klass)
        uix_resourcify_model_file(klass)
        uix_generate_controller_file(klass)
        uix_add_resources_route(klass)
      rescue
      end
    end
  end

  def uix_d_component_task(components)
    # Destroy components files
    components.each do |component|
      begin
        klass = component.underscore.classify.constantize
        puts "Deleting files for #{klass.name} ..."
        uix_destroy_component(klass)
      rescue
      end
    end
  end

  def uix_g_module_task(module_name, routes)
    module_route = uix_module_route(module_name)
    puts "Generating files for module: #{module_route} ..."

    begin
      dir = File.join(uix_modules_directory, module_route)
      FileUtils.mkdir(dir) unless File.directory?(dir)
      files_tpls = uix_tpl_module_files(module_route, routes)

      # Generate layout.html and dashboard.html files
      ['layout', 'dashboard'].each do |view|
        file_path = File.join(dir, "#{view}.html")
        File.open(file_path, 'w') do |file|
          file_content = files_tpls[view.to_sym]
          file.write(file_content)
        end unless File.exists?(file_path)
      end

      # Generate config.js
      file_path = File.join(dir, "config.js")
      File.open(file_path, 'w') do |file|
        file.write(files_tpls[:config])
      end unless File.exists?(file_path)

      # Insert script tag
      pattern = '<script src="app/modules/reports/config.js"></script>'
      uix_insert_line_into_file(uix_index_file, pattern, uix_module_script_tag(module_route), true)
    rescue
    end
  end

  def uix_d_module_task(module_name)
    module_route = uix_module_route(module_name)
    puts "Deleting files for module: #{module_route} ..."

    begin
      # Destroy module files
      dir = File.join(uix_modules_directory, module_route)
      FileUtils.rm_rf(dir) if File.directory?(dir)

      # Remove script tag
      uix_delete_line_from_file(uix_index_file, uix_module_script_tag(module_route))
    rescue
    end
  end

  def uix_components_directory
    Rails.root.join('angular', 'src', 'app', 'components').to_s
  end

  def uix_modules_directory
    Rails.root.join('angular', 'src', 'app', 'modules').to_s
  end

  def uix_index_file
    Rails.root.join('angular', 'src', 'index.html').to_s
  end

  def uix_routes_file
    Rails.root.join('config', 'routes.rb').to_s
  end

  def uix_model_file(klass)
    model_dir = Rails.root.join('app', 'models').to_s
    File.join(model_dir, "#{uix_model_key(klass)}.rb").to_s
  end

  def uix_controller_file(klass)
    controller_dir = Rails.root.join('app', 'controllers').to_s
    File.join(controller_dir, "#{uix_model_route(klass)}_controller.rb").to_s
  end

  def uix_generate_component_files(klass)
    component_dir = File.join(uix_components_directory, uix_model_route(klass).dasherize)
    FileUtils.mkdir(component_dir) unless File.directory?(component_dir)

    files_tpls = uix_tpl_component_files(klass)

    # Generate views: index.html, new.html, show.html, bulk.html, uploads.html
    ['index', 'new', 'show'].each do |action|
      file_path = File.join(component_dir, "#{action}.html")
      File.open(file_path, 'w') do |file|
        file_content = files_tpls[action.to_sym]
        file.write(file_content)
      end unless File.exists?(file_path)
    end

    # Generate config.js
    file_path = File.join(component_dir, "config.js")
    File.open(file_path, 'w') do |file|
      file.write(files_tpls[:config])
    end unless File.exists?(file_path)
  end

  def uix_destroy_component(klass)
    # Delete component directory
    component_dir = File.join(uix_components_directory, uix_model_route(klass).dasherize)
    FileUtils.rm_rf(component_dir) if File.directory?(component_dir)

    # Remove component script
    uix_delete_line_from_file(uix_index_file, uix_component_script_tag(klass))

    # Delete controller
    controller_file = uix_controller_file(klass)
    File.delete(controller_file) if File.read(controller_file).include?('# This file was created by uix.');

    # Remove resourcify line
    model_file = uix_model_file(klass)
    if File.readlines(model_file).grep(/# The line below was inserted by uix./).size > 0
      uix_delete_line_from_file(model_file, '  # The line below was inserted by uix.')
      uix_delete_line_from_file(model_file, '  resourcify')
    end

    # Remove resources route
    uix_delete_line_from_file(uix_routes_file, uix_model_resources_route(klass))
  rescue
  end

  def uix_insert_component_scripts(klass)
    pattern = '<script src="app/components/roles/config.js"></script>'
    uix_insert_line_into_file(uix_index_file, pattern, uix_component_script_tag(klass))
  end

  def uix_resourcify_model_file(klass)
    # No resourcify
    model_file = uix_model_file(klass)
    if File.readlines(model_file).grep(/\sresourcify\n/).size == 0
      pattern = "class #{klass.name} < ActiveRecord::Base"
      insert_str = "  # The line below was inserted by uix.\n  resourcify\n"
      uix_insert_line_into_file(model_file, pattern, insert_str)
    end
  end

  def uix_controller_template(klass)
    [
      "# This file was created by uix. Keep this line to allow uix to modify this file.\n",
      "class #{klass.name.classify.pluralize}Controller < ApplicationController\n",
      "  resourcify\n",
      "end\n"
    ].join
  end

  def uix_generate_controller_file(klass)
    controller_file = uix_controller_file(klass)
    File.open(controller_file, 'w') do |file|
      file.write(uix_controller_template(klass))
    end unless File.exists?(controller_file)
  end

  def uix_route_exists?(routeName)
    route = Rails.application.routes.routes
              .map { |e| e.path.spec.to_s }
              .find { |e| e.starts_with? "/api/#{routeName}" }
    !route.nil?
  end

  def uix_add_resources_route(klass)
    unless uix_route_exists?(uix_model_route(klass))
      pattern = 'resources :roles'
      uix_insert_line_into_file(uix_routes_file, pattern, uix_model_resources_route(klass))
    end
  end

  def uix_insert_line_into_file(file, pattern, insert_str, before_pattern = false)
    lines = File.readlines(file)
    return if lines.join.include? insert_str 
    lines.each_with_index do |line, index|
      if line.include? pattern
        insert_at = (before_pattern)? index : index + 1
        lines.insert(insert_at, insert_str)
        break
      end
    end
    File.write(file, lines.join)
  end

  def uix_delete_line_from_file(file, delete_str)
    lines = File.readlines(file)
    return unless lines.join.include? delete_str 
    lines = lines.reject { |line| line.strip == delete_str.strip }
    File.write(file, lines.join)
  end

  def uix_model_resources_route(klass)
    "#{' ' * 4}resources :#{uix_model_route(klass)}\n"
  end

  def uix_component_script_tag(klass)
    route = uix_model_route(klass).dasherize
    "#{' ' * 8}<script src=\"app/components/#{route}/config.js\"></script>\n"
  end

  def uix_module_script_tag(module_route)
    "#{' ' * 8}<script src=\"app/modules/#{module_route}/config.js\"></script>\n"
  end

  def uix_fa_icon
    file = Rails.root.join('angular', 'bower_components', 'font-awesome', 'scss', '_icons.scss')
    lines = File.readlines(file)
    blacklist1 = [
      'twitter', 'facebook', 'github', 'linkedin', 'pinterest', 'google', 'skype',
      'foursquare', 'trello', 'whatsapp', 'vimeo', 'youtube', 'android', 'windows',
      'bitbucket', 'tumblr', 'instagram', 'tumblr', 'apple', 'linux', 'dribbble',
      'weibo', 'renren', 'wordpress', 'yahoo', 'spotify'
    ]
    icons = lines.select { |line| line.include? ':before' }
                 .map { |e| e.split(':before').first.gsub!('.#{$fa-css-prefix}', 'fa') }
                 .reject { |e|  blacklist1.include?(e.split('-').second) }
    icons[(rand * icons.length).to_i]
  end

  def uix_material_color
    file = Rails.root.join('angular', 'src', 'styles', 'material-colors.scss')
    lines = File.readlines(file)
    blacklist1 = ['50', '100', 'a100', '200', 'a200']
    blacklist2 = ['amber', 'yellow']
    colors = lines.select { |line| line.include? '.color-' }
                  .map { |e| e.split(' ').first.gsub!('.color-', 'color-') }
                  .reject { |e| blacklist1.include?(e.split('-').last) }
                  .reject { |e| blacklist2.include?(e.split('-').second) }
    colors[(rand * colors.length).to_i]
  end

  def uix_module_route(module_name)
    module_name.underscore.dasherize
  end

  def uix_model_route(klass)
    klass.name.underscore.pluralize
  end

  def uix_model_name(klass)
    klass.name
  end

  def uix_model_key(klass)
    klass.name.underscore
  end

  def uix_model_title(klass)
    klass.name.singularize.titleize
  end

  def uix_model_columns(klass)
    exclusion_list = ['deleted_at', 'lft', 'rgt', 'depth']
    klass.columns.select { |e| !exclusion_list.include?(e.name) }
  end

  def uix_column_form_visible?(column)
    exclusion_list = ['id', 'created_at', 'updated_at', 'details', 'blocked_at']
    !exclusion_list.include?(column.name)
  end

  def uix_column_grid_visible?(column)
    exclusion_list = ['id', 'created_at', 'updated_at', 'details', 'blocked_at']
    !exclusion_list.include?(column.name)
  end

  def uix_column_json_schema_property(klass, column)
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

  def uix_json_schema_config(klass)
    properties = uix_model_columns(klass)
                  .select { |e| uix_column_form_visible?(e) }
                  .map { |e| uix_column_json_schema_property(klass, e) }
                  .reduce({}){ |m, e| m.merge!(e) and m}

    json_schema = {}
    json_schema[:type]  = 'object'
    json_schema[:title] = uix_model_title(klass)
    json_schema[:required] = klass.validators.map { |e| e.presence.attributes }.flatten.uniq
    json_schema[:properties] = properties

    json_schema = JSON.pretty_generate(json_schema, {})
    json_schema.gsub! /\[\s+\]/, '[]'
    json_schema.gsub! /\}\n\n/, "}\n"
    json_schema.gsub! /\n/, "\n      "
    json_schema
  end

  def uix_grid_field_html(field)
    html = ''
    input_type = field[:type]
    name = field[:key]
    title = field[:templateOptions][:label]

    if input_type == 'ex-input'
      html = "<div ng-init=\"vm.column('#{name}', '#{title}')\"></div>"
    elsif input_type == 'ex-checkbox'
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

  def uix_grid_config(klass)
    uix_model_columns(klass)
      .select { |e| uix_column_grid_visible?(e) }
      .take(5)
      .map { |e| uix_formly_field(klass, e) }
      .map { |e| uix_grid_field_html(e) }
      .join("\n\t\t")
  end

  def uix_formly_field(klass, column)
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

    # Check if boolean
    if column.type == :boolean
      field[:type] = 'ex-checkbox'
    
    # Check if date
    elsif column.type == :date || column.type == :datetime
      field[:type] = 'ex-datepicker'

    # Check if lookup
    elsif foreign_keys.keys.include?(column.name) || (klass.respond_to?(:acts_as_nested_set) && column.name == 'parent_id')
      
      lookup = foreign_keys[column.name]

      if foreign_keys[column.name] == :children
        lookup = 'parent'
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

  def uix_form_field_config(klass)
    ctrl_fn = <<-eos
/* @ngInject */ function($scope, lookupService) {
          lookupService.load('#{uix_model_key(klass)}').then(function() {
            $scope.to.options = lookupService.get($scope.to.lookup);
          });
        }
    eos

    config = uix_model_columns(klass)
               .select { |e| uix_column_form_visible?(e) }
               .map { |e| uix_formly_field(klass, e) }
               .each_slice(2)
               .map { |e| {'fieldGroup': e} }
    
    config = JSON.pretty_generate(config, {})
    config.gsub! '"CONTROLLERFUNCTION"', ctrl_fn
    config.gsub! /\[\s+\]/, '[]'
    config.gsub! /\}\n\n/, "}\n"
    config.gsub! /\n/, "\n      "

    config
  end

  def uix_tpl_module_files(module_name, routes)
    data = {}

    data[:layout] = <<-eos
<div id="sidebar" class="sidebar">
  <ul class="nav nav-pills nav-stacked">
    <li ng-repeat="l in modules.#{module_name}.links" ng-class='{ active: hasUrl("#/#{module_name}/{{ l.url }}") }' ng-show="hasAccess(l.url)">
      <a href="#/#{module_name}/{{ l.url }}">
        <span class="link-icon {{ l.icon }}"></span>
        <br><span class="link-text">{{ l.text }}</span>
      </a>
    </li>
  </ul>
</div>
<div id="content" class="content">
  <ui-view></ui-view>
</div>
<div ng-include="partials.fab"></div>
    eos

    data[:dashboard] = <<-eos
<br/>
    eos

    routes = routes.map do |route|
      "{ text: '#{route.titleize}', url: '#{route}', icon: 'fa #{uix_fa_icon} #{uix_material_color}' }"
    end

    data[:config] = <<-eos
// Module config setup
angular.module('angularApp')
  .run(function run(APP) {
    APP.setModule('#{module_name}', {
      title: '#{module_name.titleize}',
      icon: 'fa #{uix_fa_icon}', 
      links: links(),
      hasAccess: hasAccess
    });
    
    function links () {
      return [
        #{routes.join(",\n" + (' ' * 8))}
      ];
    }

    function hasAccess (user) {
      return true;
    }
  });
    eos

    data
  end

  def uix_tpl_component_files(klass)
    data = {}

    data[:index] = <<-eos
<div ng-controller="IndexCtrl as vm" ng-init="vm.initRoute('#{uix_model_route(klass)}', {})">
  <div ng-include="partials.header"></div>
  <div ng-include="partials.searchForm"></div>
  <div class="row model-container">
    <div ng-init="vm.config({openable: true, popable: true})"></div>
    <!-- <div ng-init="vm.classes('field-here', {1: 'warning', 2: 'info', 3: 'success', 4: 'danger'})"></div> -->
    #{uix_grid_config(klass)}
    <div ng-show="state.showGrid" ng-class="{'col-md-12': !state.collapsedGridMode, 'col-md-4': state.collapsedGridMode}">
      <div ng-include="partials.indexGrid"></div>
      <div ng-include="partials.loadMoreButton"></div>
    </div>
    <div ng-hide="state.isIndex" ng-class="{'col-md-8': state.collapsedGridMode, 'col-md-12': !state.collapsedGridMode}">
      <div ui-view></div>
    </div>
  </div>
</div>
<div ng-controller="#{uix_model_name(klass)}IndexCtrl"></div>
    eos

    data[:new] = <<-eos
<div ng-controller="FormCtrl as vm" ng-init="vm.initRoute('#{uix_model_route(klass)}', {})">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      #{uix_model_title(klass)}
    </h4>
  </div>
  <div class="modal-body">
    <div ng-include="partials.formlyForm"></div>
  </div>
  <div class="modal-footer">
    <div ng-include="partials.formNewButtons"></div>
  </div>
</div>
<div ng-controller="#{uix_model_name(klass)}FormCtrl"></div>
    eos

    data[:show] = <<-eos
<div ng-controller="FormCtrl as vm" ng-init="vm.initRoute('#{uix_model_route(klass)}', {})">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      #{uix_model_title(klass)}
    </h4>
  </div>
  <div class="modal-body">
    <div ng-include="partials.formlyForm"></div>
  </div>
  <div class="modal-footer">
    <div ng-include="partials.formShowButtons"></div>
  </div>
</div>
<div ng-controller="#{uix_model_name(klass)}FormCtrl"></div>
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
<div ng-controller="BulkCtrl as vm" ng-init="vm.initRoute('#{uix_model_route(klass)}')">
  <div class="modal-header">
    <div ng-include="partials.closeButton"></div>
    <h4 class="modal-title">
      #{uix_model_title(klass)} Data Upload
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
  .controller('#{uix_model_name(klass)}IndexCtrl', function ($scope, $rootScope, APP, $http, exMsg) {
    
    $scope.$on('uix:index-ready', function (evt, modelName, config, scope) {
      if (modelName !== '#{uix_model_name(klass)}') return;
      // Do something
    });
  });

angular.module('angularApp')
  .controller('#{uix_model_name(klass)}FormCtrl', function ($scope, $rootScope, APP, $http, exMsg) {
    
    $scope.$on('uix:form-ready', function (evt, modelName, config, scope) {
      if (modelName !== '#{uix_model_name(klass)}') return;
      // Do something
    });

    $scope.$on('uix:record-loaded', function (evt, modelName, record, scope) {
      if (modelName !== '#{uix_model_name(klass)}') return;
      // Do something
    });
  });

angular.module('angularApp')
  .run(function (fieldService) {
    // Set config for angular-formly
    fieldService.set('#{uix_model_key(klass)}', fieldConfig());
    
    function fieldConfig () {
      return #{uix_form_field_config(klass)};
    }
  });

angular.module('angularApp')
  .run(function (schemaService) {
    // Set config for json-schema
    schemaService.set('#{uix_model_key(klass)}', schemaConfig());
    
    function schemaConfig () {
      return #{uix_json_schema_config(klass)};
    }
  });
    eos

    data
  end
end
