var ready;
ready = function() {
	var isPlaying;
	var a;
  function playSound(url) {
  	if (!isPlaying) {
  		a = new Audio(url);
  		a.play();
  		isPlaying = true;
  	} else {
  		a.pause();
			isPlaying = false;
			if (!isPlaying) {
				a = new Audio(url);
				a.play();
				isPlaying = true;
			}
		};
	};
	// get the top tracks for the given artist
	// and play the top track
	window.listen = function(val) {
		var spot_id = val
		$.getJSON("https://api.spotify.com/v1/artists/" + spot_id + "/top-tracks?country=us", function(result) {
		var trackPreview = result.tracks[0].preview_url;
		playSound(trackPreview);
		});
	};
	// find the top tracks for the given artist
	// add the top track to the user's spotify library
	window.addTrack = function(u, t) {
		// u is current_user's oauth token
		// t is the id of the artist
		spotifyAuth = u;
		spotifyTrack= t;
		$.getJSON("https://api.spotify.com/v1/artists/" + spotifyTrack + "/top-tracks?country=us", function(result) {
			var trackId = result.tracks[0].id;
			// save the top track to the user's library
			$.ajax({
				url: 'https://api.spotify.com/v1/me/tracks?ids=' + trackId,
				type: 'PUT',
				headers: {
          'Authorization': 'Bearer ' + spotifyAuth
        },
				success: function(data) {
				}
			});
		});
	};
}; // closes out the document ready
$(document).ready(ready);
$(document).on('page:load', ready);