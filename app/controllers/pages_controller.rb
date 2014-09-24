class PagesController < ApplicationController
	# skip_before_action :verify_authenticity_token
	def index
	  @results = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user)).paginate(:page => params[:page], :per_page => 21).order(id: :desc)
	 return @results
	end
end