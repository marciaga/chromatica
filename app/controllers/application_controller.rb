class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include HTTParty 
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
  def auth_token_check
    # check whether the current user's oauth token is expired
    if User.where(:user_id == current_user && :oauth_expires_at.to_s <= Time.now.to_s) 
      r_token = User.find(current_user).refresh_token
      #use the current user's refresh token to obtain a new oauth_token
      client_id = "a9a892d4e1ea43a2a63b80bcc835450b"
      client_secret = "b8574ffc10514d6eb6064a18277437ba"
      client_id_and_secret = Base64.strict_encode64("#{client_id}:#{client_secret}")
      result = HTTParty.post(
        "https://accounts.spotify.com/api/token",
        :body => {:grant_type => "refresh_token",
        :refresh_token => r_token},
        :headers => {"Authorization" => "Basic #{client_id_and_secret}"}
      )
      a_token = result['access_token']
      # update the oauth token in the db
      current_user.oauth_token = a_token
      current_user.save  
    else
      return
    end
  end
  helper_method :auth_token_check
end
