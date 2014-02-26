class Api::ApiController < Api::BaseController

  before_action :validate_resource_url

  private
    # Only allow a trusted parameter "white list" through.
    def api_params
      param_key        = _RC.name.singularize.underscore.to_sym
      excluded_fields  = ["id", "created_at", "updated_at"]
      permitted_fields = (_RC.column_names - excluded_fields).map { |f| f.to_sym }
      params.fetch(param_key, {}).permit([]).tap do |wl|
        permitted_fields.each { |f| wl[f] = params[param_key][f] if params[param_key].key?(f) }
      end
    end

    def validate_resource_url
      if params[:resource_url].classify.underscore.pluralize == params[:resource_url]
        true
      else
        @response_data[:error]   = {
          type: 'routing',
          messages: ['Sorry, resource does not exist.']
        }
        render json: @response_data
        false
      end
    end

    def _RC
      params[:resource_url].classify.constantize
    end
end