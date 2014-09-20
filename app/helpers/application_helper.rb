module ApplicationHelper
	def artist_list
	
		searches = Result.where(:search_history_id == SearchHistory.where(:user_id == 1))
		@results = searches.pluck(:artist, :image, :url)
		# @results is an array of strings
		puts @results
	
	end
end
