class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken

  before_action :configure_permitted_parameters, if: :devise_controller?

  before_action :authenticate_user!, :unless => :devise_controller?

  
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  protected

    def configure_permitted_parameters
      devise_parameter_sanitizer.for(:sign_up) << :name
    end
end
