var ready;
ready = function() {

	var isPlaying;
	var a;
  function playSound(url) {
  	if (!isPlaying) {
  		a = new Audio(url);
  		a.play();
  		isPlaying = true;
  		console.log('playing');
  	} else {
  		// pause what's playing
  		a.pause();
			isPlaying = false;
			console.log('paused');
			if (!isPlaying) {
				a = new Audio(url);
				a.play();
				isPlaying = true;
				console.log('playing again');
			}
		};
	};
	window.showValue = function(val) {
		var spot_id = val
		console.log(spot_id);
		$.getJSON("https://api.spotify.com/v1/artists/" + spot_id + "/top-tracks?country=us", function(result) {
		console.log(result.tracks[0].preview_url);
		var trackPreview = result.tracks[0].preview_url;
		playSound(trackPreview);
		});
	};
};

$(document).ready(ready);
$(document).on('page:load', ready);