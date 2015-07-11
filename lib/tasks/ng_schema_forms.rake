require 'fileutils'
require 'json'

namespace :ng do
  desc "Creates forms for angular schema form"
  task :schema_forms => :environment do |t, args|
    models = []
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
       model = File.basename(file, ".*").classify
       models << model unless models.include?(model)
    end
    
    scripts_dir = Rails.root.join('angular', 'app', 'scripts', 'services').to_s
    file_path = File.join(scripts_dir, '_form_service.js')
    file_content = ''

    models.each do |model|
      if ['Concern', 'PdfBuilder', 'User'].include? model
        next
      end

      model_form = ''
      begin
        @model_class = model.constantize

        if !@model_class.respond_to? "resourcify_options"
          next
        end

        model_form = form.to_s
        model_form.gsub! 'model-key', model.underscore

      rescue
      end

      file_content += "\n\nforms['#{model.underscore}'] = "  + model_form + ';'
    end
    file_content = form_service_template.gsub 'forms-here', file_content
    File.open(file_path, 'w') do |file|
      file.write(file_content)
    end
  end

  def form
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    columns = @model_class.columns.select {|c| !_excluded? c.name }
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
    JSON.pretty_generate(json_form, {})
  end

  def form_service_template
    <<-eos
'use strict';

/**
 * @ngdoc service
 * @name angularApp.formService
 * @description
 * # formService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('formService', function () {
    var forms = {};

    var formSVC = {
      get: function (modelInSnakeCase) {
        return forms[modelInSnakeCase] || [];
      }
    };
forms-here

    return formSVC;
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
end
