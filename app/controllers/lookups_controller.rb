class LookupsController < ApplicationController

  layout false

  def show
    json_lookups = {}

    @model_class = "#{params[:model].classify}".constantize

    @model_class.reflect_on_all_associations(:belongs_to).each do |association|
      json_lookups[association.name] = association.klass.all.map { |e| {value: e.id, name: e.name} }
      json_lookups[association.name].unshift({ value: '', name: '' })
    end

    # Nested set lookup
    if @model_class.respond_to? 'acts_as_nested_set_options'
      json_lookups['parent'] = @model_class.all.map { |e| {value: e.id, name: e.name} }
    end

    # Multi-select lookups
    @model_class.columns.each do |column|
      if column.name.ends_with? '_ids'
        begin
          klass = column.name[0, column.name.length - 4].classify.constantize
          json_lookups[klass.name.singularize.underscore] = klass.all.map { |e| {value: e.id, name: e.name} }
        rescue
        end
      elsif column.name == 'tags'
        begin
          klass = "#{@model_class.name}Tag".constantize
          json_lookups[klass.name.singularize.underscore] = klass.all.map { |e| {value: e.id, name: e.name} }
        rescue
        end
      end
    end

    begin
      params[:lookups].to_s.split(',').each do |model|
        key = model.singularize.underscore
        next if json_lookups[key]

        klass = model.classify.constantize

        json_lookups[key] = klass.all.map { |e| {value: e.id, name: e.name} }
        json_lookups[key].unshift({ value: '', name: '' })
      end
    rescue
    end

    render json: json_lookups
  rescue
    render json: {}
  end
end
