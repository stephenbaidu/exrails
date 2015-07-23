require 'fileutils'
require 'json'

namespace :ng do
  desc "Creates fields for angular formly"
  task :formly_fields => :environment do |t, args|
    models = []
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
       model = File.basename(file, ".*").classify
       models << model unless models.include?(model)
    end
    
    scripts_dir = Rails.root.join('angular', 'app', 'scripts', 'services').to_s
    file_path = File.join(scripts_dir, '_field_service.js')
    file_content = ''

    models.each do |model|
      if ['Concern', 'PdfBuilder', 'User'].include? model
        next
      end

      model_fields = ''
      begin
        @model_class = model.constantize

        if !@model_class.respond_to? "resourcify_options"
          next
        end

        model_fields = fields.to_s
        model_fields.gsub! '"controller_function"', controller_function
        model_fields.gsub! 'model-key', model.underscore

      rescue Exception => e
        p e
      end

      file_content += "\n\nfields['#{model.underscore}'] = "  + model_fields + ';'
    end
    file_content = field_service_template.gsub 'fields-here', file_content
    File.open(file_path, 'w') do |file|
      file.write(file_content)
    end
  end

  def fields
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    required_fields = @model_class.validators.map {|e| e.presence.attributes }.flatten

    columns = @model_class.columns.select {|c| !_excluded? c.name }
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
          field[:controller] = 'controller_function'
        elsif multiselect_field?(col.name)
          klass = get_multiselect_class(col.name)
          label = klass.name.titleize

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:label] = label
          field[:templateOptions][:placeholder] = "Select #{label.pluralize.downcase} ..."
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'controller_function'
        elsif tag_field?(col.name)
          klass = get_tag_class(col.name)

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:placeholder] = 'Select tags ...'
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'controller_function'
        end

        fields << field
      end

      json_form << {
        fieldGroup: fields
      }
    end
    JSON.pretty_generate(json_form, {})
  end

  def field_service_template
    <<-eos
'use strict';

/**
 * @ngdoc service
 * @name angularApp.fieldService
 * @description
 * # fieldService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('fieldService', function () {
    var fields = {};

    var fieldSVC = {
      get: function (modelInSnakeCase) {
        return fields[modelInSnakeCase] || [];
      }
    };
fields-here

    return fieldSVC;
  });
    eos
  end

  def _excluded?(field)
    [
      'id', 'created_at', 'updated_at', 'details',
      'lft', 'rgt', 'depth'
    ].include? field
  end

  def is_nested_set
    @model_class.respond_to? 'acts_as_nested_set_options'
  end

  def lookup_array(klass, blanks = false)
    result = []
    begin
      result = klass.all.map { |e| {value: e.id, name: e.name} }
      result.unshift({ value: '', name: '' }) if blanks
    rescue
    end
    result
  end

  def multiselect_field?(field_name)
    return false unless field_name.ends_with? '_ids'

    begin
      field_name.name[0, field_name.name.length - 4].classify.constantize
      return true
    rescue
    end
    return false
  end

  def get_multiselect_class(field_name)
    return field_name.name[0, field_name.name.length - 4].classify.constantize
  end

  def tag_field?(field_name)
    return false unless field_name == 'tags'

    begin
      "#{@model_class.name}Tag".constantize
      return true
    rescue
    end
    return false
  end

  def get_tag_class(field_name)
    return "#{@model_class.name}Tag".constantize
  end

  def controller_function
    <<-eos
/* @ngInject */ function($scope, lookupService) {
          lookupService.load('model-key').then(function() {
            $scope.to.options = lookupService.get('model-key', $scope.to.lookup);
          });
        }
    eos
  end
end
