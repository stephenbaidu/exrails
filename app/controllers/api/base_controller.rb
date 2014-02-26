class Api::BaseController < ApplicationController
  require 'active_record/serializer_override'
  ActiveRecord::Base.send(:include, ActiveRecord::SerializerOverride)

  include Pundit
  
  layout false
  respond_to :json
  
  before_action :set_response_data
  before_action :set_record, only: [:show, :update, :destroy]
  
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Pundit::NotAuthorizedError,   with: :user_not_authorized
  rescue_from Resourcify::UndefinedError, with: :resource_not_resourcified

  private
    # Set JSON response data
    def set_response_data
      @response_data = { 
        success: false,
        data: { total: 0, rows: [] },
        error: { type: '', errors: {}, messages: [] } 
      }
      raise Resourcify::UndefinedError unless _RC.respond_to? 'resourcified?'
    end
 
    def resource_not_resourcified
      @response_data[:success] = false
      @response_data[:error]   = { 
        type: 'resource_not_resourcified',
        messages: [ 'Resourcify::UndefinedError. Resource route not defined' ]
      }
      
      render json: @response_data
    end
 
    def record_not_found
      @response_data[:success] = false
      @response_data[:error]   = { 
        type: 'record_not_found',
        messages: [ 'Sorry, the record was not found.' ]
      }
      
      render json: @response_data
    end
 
    def user_not_authorized
      @response_data[:success] = false
      @response_data[:error]   = { 
        type: 'user_not_authorized',
        messages: [ 'Sorry, you do not have the permission.' ]
      }
      
      render json: @response_data
    end

    def _RC
      controller_name.classify.constantize
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_record
      @record = _RC.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def safe_params
      self.send("#{controller_name.singularize}_params")
    end

  public
    def index
      authorize _RC

      recs = policy_scope(_RC.all)

      # apply filter if query is present
      recs = recs.filter(params[:query]) if params[:query].present?

      recs_total = recs.count

      page = params[:page] || 1
      size = params[:size] || 25
      recs = recs.offset((page.to_i - 1) * size.to_i).limit(size)

      if recs
        @response_data[:success] = true
        @response_data[:data]    = {
          total: recs_total,
          rows:  recs
        }
      end

      render json: @response_data
    end

    def create
      @record = _RC.new(safe_params)

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

    def show
      authorize @record

      @response_data[:success] = true
      @response_data[:data]    = @record

      render json: @response_data
    end

    def update
      authorize @record

      if @record.update(safe_params)
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

    def destroy
      authorize @record

      if @record.destroy
        @response_data[:success] = true
        @response_data[:data]    = @record
      else
        @response_data[:error]   = {
          type: 'other',
          errors: @record.errors.messages,
          messages: @record.errors.full_messages
        }
      end

      render json: @response_data
    end
end
