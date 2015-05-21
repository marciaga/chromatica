class PagesController < ApplicationController
	def index
	 @results = Result.joins(:search_history).merge(SearchHistory.where(:user_id => current_user)).paginate(:page => params[:page], :per_page => 21).order(id: :desc)
	 return @results
	end
end