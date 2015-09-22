class ConfigController < ApplicationController

  layout false
  
  before_action -> {
    @model = params[:model]

    if @model
      # Sanitization
      @model.gsub!('-', '_')
      @model = @model.underscore.pluralize

      # Implied model resource class
      @model_class = "#{@model.classify}".constantize
    end
  }

  def show
    json_data = {}
    json_data[:lookups] = lookups(true)
    json_data[:schema]  = schema(true)

    render json: json_data
  end

  def lookups(get = false)
    json_lookups = {}

    @model_class.reflect_on_all_associations(:belongs_to).each do |association|
      json_lookups[association.name] = association.klass.all.map { |e| {value: e.id, name: e.name} }
      json_lookups[association.name].unshift({ value: '', name: '' })
    end

    if is_nested_set
      json_lookups['parent'] = @model_class.all.map { |e| {value: e.id, name: e.name} }
    end

    begin
      params[:models].to_s.split(',').each do |model|
        klass = model.classify.constantize
        key   = model.singularize.underscore
        json_lookups[key] = klass.all.map { |e| {value: e.id, name: e.name} }
        json_lookups[key].unshift({ value: '', name: '' })
      end
    rescue
    end

    if get
      json_lookups
    else
      render json: json_lookups
    end
  end
  
  def schema(get = false)
    json_schema = {}
    lookup_list = lookups(true)

    if @model_class.respond_to? "filter_by"
      json_schema[:type]  = "object"
      json_schema[:title] = @model.singularize.titleize
      json_schema[:properties] = {}
      json_schema[:required] = @model_class.validators.map {|e| e.presence.attributes }.flatten

      foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

      columns = @model_class.columns.select {|c| !excluded_field? c.name }
      columns.each do |col|
        prop = {
          title: col.name.titleize,
          type:  col.type.to_s
        }

        if col.type == :date || col.type == :datetime
          prop[:type] = 'string'
          prop[:format] = 'date'
        end

        prop[:type] = 'string' if col.type == :text
        prop[:type] = 'string' if col.type == :decimal
        prop[:type] = 'number' if col.type == :integer

        if col.name == 'email' || col.name.ends_with?('_email')
          prop[:pattern] = '^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$'
          prop[:validationMessage] = 'Should be a correct Email Address'
        end

        # Is it a lookup
        if foreign_keys.keys.include?(col.name)
          lookup = foreign_keys[col.name]

          # includes acts_as_nested_set
          if lookup == :children
            lookup = :parent
            prop[:title]  = "Parent #{@model_class.name.split('::').last.singularize.titleize}"
          end
          prop[:lookup] = lookup
          # prop[:format] = 'uiselect'
          # prop[:placeholder] = "Select #{prop[:title]} ..."
          prop[:items] = lookup_list[lookup].map { |e| {value: e[:value], label: e[:name]} }
        elsif col.name == 'tags'
          # Assumes there is a model with the name "model_name + _tag"
          begin
            tag_model_class = "#{@model_class.name}Tag".constantize
            prop[:type] = 'array'
            prop[:default] = []
            # prop[:format] = 'uiselect'
            # prop[:placeholder] = 'Select tags ...'
            prop[:items] = tag_model_class.all.map { |e| {value: e.id, label: e.name} }
          rescue Exception => e
            
          end
        elsif col.name.ends_with? '_ids'
          begin
            title = col.name[0, col.name.length - 4].classify
            tag_model_class = title.constantize
            prop[:title] = title.titleize.pluralize
            prop[:type] = 'array'
            prop[:default] = []
            # prop[:format] = 'uiselect'
            # prop[:placeholder] = "Select #{title.pluralize.underscore} ..."
            prop[:items] = tag_model_class.all.map { |e| {value: e.id, label: e.name} }
          rescue Exception => e
            pp e
          end
        end

        json_schema[:properties][col.name.to_sym] = prop
      end
    end

    if get
      json_schema
    else
      render json: json_schema
    end
  end

  private
    def excluded_field?(field)
      # ["id", "created_at", "updated_at"].include? field
      [
        'id', 'created_at', 'updated_at', 'deleted_at',
        'details', 'lft', 'rgt', 'depth'
      ].include? field
    end

    def is_nested_set
      @model_class.respond_to? 'acts_as_nested_set_options'
    end
end
