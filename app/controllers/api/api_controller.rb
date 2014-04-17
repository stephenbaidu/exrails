module Api
  class ApiController < ApplicationController
    resourcify

    before_action :validate_resource

    private
      def permitted_params
        param_key        = _RC.name.split('::').last.singularize.underscore.to_sym
        excluded_fields  = ["id", "created_at", "updated_at", "lft", "rgt", "depth"]
        permitted_fields = (_RC.column_names - excluded_fields).map { |f| f.to_sym }
        params.fetch(param_key, {}).permit([]).tap do |wl|
          permitted_fields.each { |f| wl[f] = params[param_key][f] if params[param_key].key?(f) }
        end
      end

      def validate_resource
        if !_RC.respond_to? 'resourcified?'
          @error[:type]    = 'Routing'
          @error[:message] = 'Sorry, no route exists'
          render json: @error and return false
        elsif _RC.name.underscore.pluralize != params[:resource_url]
          @error[:type]    = 'Routing'
          @error[:message] = 'Sorry, resource does not exist.'
          render json: @error and return false
        end
        true
      rescue
        render json: @error
        false
      end

      def _RC
        "#{params[:resource_url].classify}".constantize
      end
  end
end