class Api::UsersController < Api::BaseController

  def create
    @record = _RC.new(user_params)

    # set default password
    @record.password = "password"
    @record.password_confirmation = @record.password

    authorize @record

    if @record.save
      @response_data[:success] = true
      @response_data[:data]    = @record
    else
      @response_data[:error]   = {
        type: 'validation',
        errors: @record.errors.messages,
        messages: @record.errors.full_messages
      }
    end

    render json: @response_data
  end

  def update
    authorize @record

    if @record.update(user_params.except!(:username))
      @response_data[:success] = true
      @response_data[:data]    = @record
    else
      @response_data[:error]   = {
        type: 'validation',
        errors: @record.errors.messages,
        messages: @record.errors.full_messages
      }
    end

    render json: @response_data
  end

  private
    # Only allow a trusted parameter "white list" through.
    def user_params
      param_key        = :user
      excluded_fields  = ["id", "created_at", "updated_at"]
      permitted_fields = (_RC.column_names - excluded_fields).map { |f| f.to_sym }

      params.fetch(param_key, {}).permit([]).tap do |wl|
        permitted_fields.each { |f| wl[f] = params[param_key][f] if params[param_key].key?(f) }
      end
    end

    def _RC
      User
    end
end