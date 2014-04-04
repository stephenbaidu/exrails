module Api
  class UsersController < ApplicationController
    resourcify

    def create
      @record = _RC.new(permitted_params)

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
      sleep 3

      if @record.update(permitted_params.except!(:username))
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
  end
end