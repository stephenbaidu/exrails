require 'fileutils'
require 'json'

namespace :exrails do
  desc 'Generates component files for models in the angular app'
  task :ng => :environment do |t, args|
    models = []
    ng_task_found = false
    ARGV.each do |arg|
      ng_task_found = (arg == 'exrails:ng') unless ng_task_found
      next if !ng_task_found || (arg == 'exrails:ng')

      model_match = /^[a-zA-Z][a-zA-Z,_]+$/.match(arg)
      if model_match
        models.push(model_match[0])
      end
    end
    
    # Create fake tasks
    models.each { |model| task model.to_sym do ; end }

    # Generate components for models
    models.each do |model|
      begin
        ng_generate_component_files(model.classify.constantize)
      rescue
      end
    end
  end

  namespace :ng do
    desc 'Generates component files for all resourcified models in the angular app'
    task :all => :environment do |t, args|
      # Generate components for models
      resourcified_models.each do |model|
        begin
          ng_generate_component_files(model.classify.constantize)
        rescue
        end
      end
    end
  end

  def ng_generate_component_files(klass)
    puts "Generating component for #{klass.name} ..."
    components_dir = Rails.root.join('angular', 'src', 'app', 'components').to_s

    dir = File.join(components_dir, klass.name.pluralize.underscore.dasherize)
    Dir.mkdir(dir) unless File.directory?(dir)

    # Generate views: index.html, new.html, show.html, edit.html
    ['index', 'new', 'show', 'edit'].each do |action|
      file_path = File.join(dir, "#{action}.html")
      File.open(file_path, 'w') do |file|
        file.write(ng_component_files_tpl[action.to_sym])
      end unless File.exists?(file_path)
    end

    # Generate config.js
    file_path = File.join(dir, "config.js")
    File.open(file_path, 'w') do |file|
      config_tpl = ng_component_files_tpl[:config]
      
      @model_class = klass
      config_tpl.gsub! '/* FORMCONFIG */', ng_schema_form.to_s
      config_tpl.gsub! '/* FIELDCONFIG */', ng_fields.to_s

      config_tpl.gsub! '/* MODELNAME */', klass.name
      config_tpl.gsub! '/* MODELKEY */', klass.name.underscore
      file.write(config_tpl)
    end unless File.exists?(file_path)
  end

  def resourcified_models
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

  def ng_component_files_tpl
    data = {}

    data[:index] = <<-eos
<div ng-include="partials.header"></div>
<div ng-if="state.isIndex">
  <div ng-include="partials.searchForm"></div>
</div>
<div class="row model-container">
  <div ng-show="state.isIndex" class="col-md-12">
    <div ng-include="partials.indexGrid"></div>
    <div ng-include="partials.loadMoreButton"></div>
  </div>
  <div ng-hide="state.hideNameGrid" class="col-md-4 hidden-sm hidden-xs">
    <div ng-include="partials.nameGrid"></div>
    <div ng-include="partials.loadMoreButton"></div>
  </div>
  <div ng-hide="state.isIndex" ng-class="{'col-md-8': !state.isBulk, 'col-md-12': state.isBulk}">
    <div ng-if="!state.hideFormNav" ng-include="partials.formNav" style="margin-bottom: 6px;"></div>
    <div ui-view></div>
  </div>
</div>
    eos

    data[:new] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formNewButtons"></div>
  </div>
</div>
    eos

    data[:show] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formShowButtons"></div>
  </div>
</div>
    eos

    data[:edit] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formEditButtons"></div>
  </div>
</div>
    eos

    data[:config] = <<-eos

angular.module('angularApp')
  .controller('/* MODELNAME */Ctrl', function ($scope) {
    var vm = $scope;

    vm.$on('model:index-config-loaded', function (evt, modelName, config, scope) {
      // Do something
    });

    vm.$on('model:form-config-loaded', function (evt, modelName, config, scope) {
      // Do something
    });
  });

angular.module('angularApp')
  .run(function (formService, fieldService) {
    // Set config for angular-schema-form
    formService.set('/* MODELKEY */', formConfig());

    // Set config for angular-formly
    fieldService.set('/* MODELKEY */', fieldConfig());

    function formConfig () {
      return /* FORMCONFIG */;
    }
    
    function fieldConfig () {
      return /* FIELDCONFIG */;
    }
  });
    eos

    data
  end

  def ng_schema_form
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    columns = @model_class.columns.select {|c| !ng_schema_form_excluded? c.name }
    columns.each_slice(2) do |cols|
      section = {
        type: "section",
        htmlClass: "row",
        items: []
      }
      cols.each do |col|
        field = { key: col.name.to_sym }
        field[:fieldHtmlClass] = "input-lg"

        # Check if date
        if col.type == :date
          field[:type] = "datepicker"
          field[:pickadate] = {
            selectYears: true,
            selectMonths: true
          }
        elsif col.type == :datetime
          field[:type] = "datepicker"
          # field[:format] = "yyyy-mm-dd"
          field[:pickadate] = {
            selectYears: true,
            selectMonths: true,
            format: "yyyy-mm-dd"
          }
        end

        # Is it a lookup
        if foreign_keys.keys.include?(col.name) ||
          (@model_class.respond_to?(:acts_as_nested_set) && col.name == 'parent_id')
          
          lookup = foreign_keys[col.name]
          field[:fieldHtmlClass] = "input-lg selectpicker"

          if foreign_keys[col.name] == :children
            lookup = :parent
          end

          field[:lookup] = lookup
        end

        section[:items] << {
          type: "section",
          htmlClass: "col-sm-6 col-xs-12",
          items: [field]
        }
      end

      json_form << section
    end
    json = JSON.pretty_generate(json_form, {})
    json = json.split("\n").join("\n      ")
    json
  end

  def ng_schema_form_excluded?(field)
    [
      'id', 'created_at', 'updated_at', 'deleted_at', 'details',
      'lft', 'rgt', 'depth'
    ].include? field
  end

  def ng_fields
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    required_fields = @model_class.validators.map {|e| e.presence.attributes }.flatten

    columns = @model_class.columns.select {|c| !ng_schema_form_excluded? c.name }
    columns.each_slice(2) do |cols|
      fields = []
      cols.each do |col|
        field = {
          className: 'col-xs-6',
          key: col.name,
          type: 'input',
          templateOptions: {
            required: required_fields.include?(col.name.to_sym),
            label: col.name.titleize
          }
        }

        # Check if date
        if col.type == :date|| col.type == :datetime
          field[:type] = "datepicker"
        
        # Is it a lookup
        elsif foreign_keys.keys.include?(col.name) ||
          (@model_class.respond_to?(:acts_as_nested_set) && col.name == 'parent_id')
          
          lookup = foreign_keys[col.name]

          if foreign_keys[col.name] == :children
            lookup = :parent
          end

          field[:type] = "ui-select"
          field[:templateOptions][:lookup] = lookup
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'CONTROLLERFUNCTION'
        elsif ng_multiselect_field?(col.name)
          klass = ng_get_multiselect_class(col.name)
          label = klass.name.titleize

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:label] = label
          field[:templateOptions][:placeholder] = "Select #{label.pluralize.downcase} ..."
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'CONTROLLERFUNCTION'
        elsif ng_tag_field?(col.name)
          klass = ng_get_tag_class(col.name)

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:placeholder] = 'Select tags ...'
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'CONTROLLERFUNCTION'
        end

        fields << field
      end

      json_form << {
        fieldGroup: fields
      }
    end
    json = JSON.pretty_generate(json_form, {})
    json.gsub! '"CONTROLLERFUNCTION"', ng_controller_function
    json.gsub! /\[\s+\]/, '[]'
    json.gsub! /\}\n\n/, "}\n"
    json.gsub! /\n/, "\n      "
    json
  end

  def ng_multiselect_field?(field_name)
    return false unless field_name.ends_with? '_ids'

    begin
      field_name.name[0, field_name.name.length - 4].classify.constantize
      return true
    rescue
    end
    return false
  end

  def ng_get_multiselect_class(field_name)
    return field_name.name[0, field_name.name.length - 4].classify.constantize
  end

  def ng_tag_field?(field_name)
    return false unless field_name == 'tags'

    begin
      "#{@model_class.name}Tag".constantize
      return true
    rescue
    end
    return false
  end

  def ng_get_tag_class(field_name)
    return "#{@model_class.name}Tag".constantize
  end

  def ng_controller_function
    <<-eos
/* @ngInject */ function($scope, lookupService) {
          lookupService.load('/* MODELKEY */').then(function() {
            $scope.to.options = lookupService.get('/* MODELKEY */', $scope.to.lookup);
          });
        }
    eos
  end
end
