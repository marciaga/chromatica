class PagesController < ApplicationController
	skip_before_action :verify_authenticity_token
	def index
	  @results = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user)).paginate(:page => params[:page], :per_page => 21).order(id: :desc)

	 puts @results
	 return @results

	   
	end

	
	# initialize the offset for the search history method
	# @@n=0
	# # query that obtains search results from the database
 #  def next_page
	# 	searches = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user.id))
	# 	# gives you 21 records in descending order by :id with offset n
	# 	@results = searches.limit(21).order(id: :desc ).offset(0 + @@n).pluck(:artist, :image, :url, :spotify_id, :id)
	# 	# now increment n each time this function is called
	# 	@@n += 21
	# 	render 'partials/_sidebar'
	# 	puts @@n
	# 	return @results
	# end

	# def previous_page
	# 	@@n -= 21
	# 	searches = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user.id))
	# 	# gives you 21 records in descending order by :id with offset n
	# 	@results = searches.limit(21).order(id: :desc ).offset(0 + @@n).pluck(:artist, :image, :url, :spotify_id, :id)
	# 	# now increment n each time this function is called
		
	# 	puts @@n
	# 	render 'partials/_sidebar'
	# 	return @results
	# end	

	# def reset_count
	# 	@@n = 0
	# 	puts @@n
	# 	render 'partials/_sidebar'
	# end
end