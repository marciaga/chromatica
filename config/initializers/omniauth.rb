OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
	provider :spotify, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, scope: 'playlist-read-private user-read-private user-read-email user-library-modify'
end


