module ApplicationHelper
	def artist_list
	
		searches = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user))
		@results = searches.pluck(:artist, :image, :url, :spotify_id, :id).last(21).reverse
		

		# check the id of the last member of the array. call it N
		# start the next search at record N-1

		# 
		# @results is an array of strings
		#puts @results[0][1]
		# @results[0][0] gives you the first :artist, so @results[0][1] gives 
		# you :image, and @results[0][2] gives you the url
	end

	
	
		
		 


	def next_twenty
		n = @results[20][4]
		next_search = Result.where(:search_history_id == SearchHistory.where(:user_id == current_user))
		# this gives you a range starting at n, that's the next 20 descending
		next_search.find((n-21..n).to_a).reverse
		next_results = next_search.pluck(:artist, :image, :url, :spotify_id, :id).last(21).reverse

	end

	def listen
		# retrieves the spotfy artist ID
		# makes an AJAX request to get Artist's top tracks
		# extracts preview URL
		# runs function to construct a new Audio object and play it, passing in the url
	end
end
