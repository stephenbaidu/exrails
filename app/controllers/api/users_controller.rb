module Api
  class UsersController < ApplicationController
    resourcify actions: [:index]
    
    def create
      @record = _RC.new(permitted_params)

      # set default password
      @record.password = "password"
      @record.password_confirmation = @record.password

      authorize @record

      if @record.save
        render json: @record
      else
        @error[:type]     = 'Validation'
        @error[:errors]   = @record.errors.messages
        @error[:messages] = @record.errors.full_messages

        render json: @error
      end
    end

    def update
      authorize @record

      if @record.update(permitted_params.except!(:username))
        render json: @record
      else
        @error[:type]     = 'Validation'
        @error[:errors]   = @record.errors.messages
        @error[:messages] = @record.errors.full_messages

        render json: @error
      end
    end
  end
end