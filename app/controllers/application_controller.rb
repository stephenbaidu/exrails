class ApplicationController < ActionController::Base
  
  # Disable layout
  layout -> {
    # Exempt Devise from disabled layout
    return (self.class.to_s.deconstantize == "Devise")? "application" : false
  }

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # before_filter :configure_permitted_parameters, if: :devise_controller?
  before_filter :authenticate_user!

  protect_from_forgery with: :exception

  def init
    render "layouts/init", layout: "application"
  end

  def configure_permitted_parameters
    # devise_parameter_sanitizer.for(:sign_in) do |u|
    #   u.permit(:username, :password, :remember_me)
    # end
    # devise_parameter_sanitizer.for(:account_update) do |u|
    #   u.permit(:password, :password_confirmation, :current_password)
    # end
    # devise_parameter_sanitizer.for(:user) { |u| u.permit(:username, :password, :remember_me ) }
    # devise_parameter_sanitizer.for(:user) { |u| u.permit(:username, :password, :remember_me, :password_confirmation, :current_password) }
  end
end
