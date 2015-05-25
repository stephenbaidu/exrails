class UsersController < ApplicationController
  resourcify

  before_action :set_record, only: [:show, :update, :destroy, :lock, :unlock, :reset_password, :permissions]

  def create
    user = user_params
    @record = User.new
    @record.name = user[:name]
    @record.email = user[:email]
    @record.role_ids = user[:role_ids] || []
    @record.uid = @record.email
    @record.provider = 'email'
    @record.password = user[:password]
    @record.password_confirmation = user[:password_confirmation]

    unless user[:enforce_confirmation]
      @record.confirmation_sent_at = Date.today
      @record.confirmed_at = Date.today
    end

    if @record.save
      if user[:enforce_confirmation]
        begin
          @record.send_confirmation_instructions
        rescue Exception => e
        end
      end
      render json: @record
    else
      @error[:type]     = 'Validation'
      @error[:message]  = 'Sorry, there were validation errors.'
      @error[:errors]   = @record.errors.messages
      @error[:messages] = @record.errors.full_messages

      render json: @error
    end
  end

  def lock
    authorize @record, :update?

    if @record.lock_access!({send_instructions: false})
      render json: @record
    else
      @error[:type]    = 'Failure'
      @error[:message] = 'Sorry, lock action failed.'

      render json: @error
    end
  end

  def unlock
    authorize @record, :update?
    
    if @record.unlock_access!
      render json: @record
    else
      @error[:type]    = 'Failure'
      @error[:message] = 'Sorry, unlock action failed.'

      render json: @error
    end
  end

  def reset_password
    authorize @record, :update?
    
    # if @record.unlock_access!
    #   render json: @record
    # else
      @error[:type]    = 'Failure'
      @error[:message] = 'Sorry, password reset action failed.'

      render json: @error
    # end
  end

  def permissions
    authorize @record, :update?

    render json: @record.roles.map(&:permissions).flatten
  end

  private
    def user_params
      param_key        = :user
      params.fetch(param_key, {}).permit(:name, :email, :password, :password_confirmation, :enforce_confirmation, role_ids: [])
    end
end
