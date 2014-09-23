class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # Session method
  private
  def current_user
  	if session[:user_id]
  		@current_user ||= User.where(id: session[:user_id]).first
  		if !@current_user
  			session[:user_id] = nil
  		end
  		@current_user
  	end
  end
  # method is available for use
  helper_method :current_user
end
