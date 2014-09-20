class SearchHistoriesController < ApplicationController	

	def create 
		if current_user
			user = User.where(params[:user_id])
			search = SearchHistory.new(search_histories_params.merge(user_id: current_user.id))
		else
			search = SearchHistory.new(search_histories_params)			
		end
		search.save
		render nothing: true
	end
private
	def search_histories_params
		params.require(:search_history).permit(:results_attributes => [:artist, :url, :image, :id])
	end	
end

