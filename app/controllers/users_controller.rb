class UsersController < ApplicationController
  resourcify

  before_action :set_record, only: [:show, :update, :destroy, :lock, :unlock, :reset_password, :update_user, :delete_user]
  
  skip_before_filter :authenticate_user!, only: [:send_confirmation_instructions]
  skip_before_action :check_password_expiration, only: [:update_user, :delete_user]

  def index
    authorize _RC.new
    
    @records = _RC.includes(belongs_tos)

    # apply filter_by if present
    if @records.respond_to? "filter_by"
      @records = @records.filter_by(params.except(:controller, :action, :page, :size))
    end

    @records = policy_scope(@records)
    
    response.headers['_meta_total'] = @records.count.to_s

    page = params[:page] || 1
    size = params[:size] || 20
    @records = @records.offset((page.to_i - 1) * size.to_i).limit(size)

    render json: @records
  end

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
    @record.password_expired_at = Time.now

    unless user[:enforce_confirmation]
      @record.confirmation_sent_at = Date.today
      @record.confirmed_at = Date.today
    end

    authorize @record

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

  def send_confirmation_instructions
    email = params[:email]
    @error[:message] = 'Invalid email'
    
    if email
      user = User.where(email: email).first
      if user
        user.send_confirmation_instructions({
          redirect_url: ActionMailer::Base.default_url_options[:host]
        })
        render json: {
          success: true, 
          message: 'Confirmation instructions has been sent to ' + email.downcase
        } and return
      end
    end

    render json: @error and return
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

    data = {
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    }

    if @record.update(data)
      render json: @record and return
    else
      @error[:type]     = 'Validation'
      @error[:message]  = 'Sorry, there were errors.'
      @error[:errors]   = @record.errors.messages
      @error[:messages] = @record.errors.full_messages
    end
    
    render json: @error
  end

  def update_user
    authorize @record, :update?

    data = {}
    update_password = false

    # Set name if it exists
    data[:name] = params[:name] unless params[:name].blank?

    # Set password fields if they all exist
    if params[:current_password] && params[:password] && params[:password_confirmation]
      update_password = true
      data[:current_password] = params[:current_password]
      data[:password] = params[:password]
      data[:password_confirmation] = params[:password_confirmation]
    end

    if update_password
      if @record.valid_password?(data[:current_password])
        if @record.update_with_password(data)
          @record.update_column(:password_expired_at, nil)
          render json: @record and return
        else
          @error[:type]     = 'Validation'
          @error[:message]  = 'Sorry, there were errors.'
          @error[:errors]   = @record.errors.messages
          @error[:messages] = @record.errors.full_messages
        end
      else
        @error[:type]    = 'Validation'
        @error[:message] = 'Your current password is invalid.'
      end
    else
      if data.length > 0
        if @record.update(data)
          render json: @record and return
        else
          @error[:type]     = 'Validation'
          @error[:message]  = 'Sorry, there were errors.'
          @error[:errors]   = @record.errors.messages
          @error[:messages] = @record.errors.full_messages
        end
      else
        @error[:type]    = 'Validation'
        @error[:message] = 'Missing fields.'
      end
    end
    
    render json: @error
  end

  def delete_user
    authorize @record, :update?

    render json: @record
  end

  private
    def user_params
      param_key        = :user
      params.fetch(param_key, {}).permit(:name, :email, :password, :password_confirmation, :enforce_confirmation, role_ids: [])
    end
end
