/**
  * @author: Alonso Vidales <alonso.vidales@tras2.es>
  * @date: 2012-03-05
  *
  * This is a singleton class used to control all the player tasks
  * 
  * @see config.maxSongTrackNameLengthForPlayer
  */

var Player_Controller = (function () {
	var playPauseStopButt = null; // The DOM elem from the play-pause button
	var rewindButt = null; // The DOM elem for the rewind button
	var forwardButt = null; // The DOM elem for the forward button
	var timerEl = null; // The DOM elem for the timmer
	var trackNameEl = null; // The DOM elem to where the name will be rendered

	var currentPlaylistId = null; // The unique ID of the current playlist
	var currentTrackId = null; // The unique ID of the current track
	var currentTrackInfo = null; // The completer current track info
	var timeLeft = null; // Time to finish the current track
	var currentTimmer = null; // The setTimeout whofor the loop who controls the time
	var playBackwards = false; // true change the direction of the reproduction to Backwards
	var totalTrackLength = 0; // The total time in seconds of the current track
	var playList = null; // The current playlist
	var rewFord = false; // A flag to know if the user do a click o maintain the click
	var timmerInterval = 1000; // The interval by default for the timmer loop in milisecond, by default 1s

	/**
	  * This is a loop that will be called each second
	  * to decrease the remaining time of the track
	  * Is controlled by the currentTimmer
	  */
	var updateTimmer = function() {
		// If the track finish, play the next one
		if (timeLeft < 1) {
			my.playNext();
		}

		// The user may be rewinding, if we are at the begging of the
		// track, play the previous one
		if (timeLeft > totalTrackLength) {
			my.playPrev();
		}

		// Update the timmer element
		timerEl.innerHTML = timeManagerObj_Tool.getMinSec(timeLeft);

		// Check if the track is playing forward or backward, and increase
		// or decrease the remaining time depending
		if (playBackwards) {
			timeLeft++;
		} else {
			timeLeft--;
		}

		// if was another timmer running, remove it, we only can have one
		if (currentTimmer !== null) {
			clearTimeout(currentTimmer);
		}
		currentTimmer = setTimeout(updateTimmer, timmerInterval);
	};

	/**
	  * This method resume the play at the same point where was stopped.
	  * and change the class for the play pause image
	  */
	var resume = function() {
		playPauseStopButt.classList.remove('play');
		playPauseStopButt.classList.add('pause');
		updateTimmer();
	};
i
	/**
	  * This method stop the current play and change the class for the
	  * play pause image
	  */
	var pause = function() {
		playPauseStopButt.classList.add('play');
		playPauseStopButt.classList.remove('pause');
		if (currentTimmer !== null) {
			clearTimeout(currentTimmer);
		}
	};

	// Public
	var my = {
		/**
		  * Play the previous track on the playlist, if the current track is the
		  * first one play the last one of the list
		  */
		playPrev: function() {
			if (playList.getTracksInfo(currentTrackId - 1) !== null) {
				my.playTrack(currentPlaylistId, currentTrackId - 1);
			} else {
				my.playTrack(currentPlaylistId, playList.getNumTracks() - 1);
			}
		},

		/**
		  * Play the next track on the playlist, if the current track is the
		  * last one play the first one of the list
		  */
		playNext: function() {
			if (playList.getTracksInfo(currentTrackId + 1) !== null) {
				my.playTrack(currentPlaylistId, currentTrackId + 1);
			} else {
				my.playTrack(currentPlaylistId, 0);
			}
		},

		/**
		  * This  method is called when a track with an identiffier smller than the
		  * id of the current track is removed, to adapt the id the current track keeping
		  * the coherence
		  */
		updateCurrentTrack: function(inTrackId) {
			if (inTrackId < currentTrackId) {
				currentTrackId--;
			}
		},

		/**
		  * Returns an object with the unique id of the current playlist and the unique 
		  * id of the current track
		  *
		  * @return <object>:
		  * 	{
		  * 		'playlist': <int>, // The ID of the playlist
		  * 		'track': <int> // The ID of the track
		  *	}
		  */
		getCurrentTrackList: function () {
			return {
				'playlist': currentPlaylistId,
				'track': currentTrackId
			};
		},

		/**
		  * Stop the current play, and remove all the info
		  * about the current track.
		  * Change the icons and texts of the player
		  */
		resetPlayer: function() {
			if (currentTimmer !== null) {
				clearTimeout(currentTimmer);
			}
			trackNameEl.innerHTML = ' -- -- ';
			timerEl.innerHTML = '--:--';
	
			rewindButt.classList.add('disabled');
			forwardButt.classList.add('disabled');
			playPauseStopButt.classList.add('disabled');
		},

		/**
		  * Start the reproduction od a track, if another track is playing, stop it before.
		  *
		  * @param inPlaylistId <int>: The unique id of the playlist
		  * @param inTrackId <int>: The unique id of the track to play
		  */
		playTrack: function(inPlaylistId, inTrackId) {
			var oldPlayListId = currentPlaylistId;
			var oldTrackId = currentTrackId;
			currentPlaylistId = inPlaylistId;
			currentTrackId = parseInt(inTrackId, 10);

			// Create the playlist object, and get all the information
			// about the track to play
			playList = new Playlist_Controller(inPlaylistId);
			currentTrackInfo = playList.getTracksInfo(currentTrackId);
			if (currentTrackInfo === null) {
				this.resetPlayer();

				return false;
			}

			// If we was playing another track previously, remove the icos from the
			// old playlist
			if (oldPlayListId !== null) {
				var oldPlayList = new Playlist_Controller(oldPlayListId);
				oldPlayList.unsetSpeackerIcon();
				oldPlayList.unsetTrackSpeackerIcon(oldTrackId);
			}
			// Set the speaker icons into the playlist and track
			playList.setSpeackerIcon();
			playList.setTrackSpeackerIcon(inTrackId);

			// Show the track name
			var name = currentTrackInfo.name;
			if (name.length > config.maxSongTrackNameLengthForPlayer) {
				name = name.substr(0, config.maxSongTrackNameLengthForPlayer) + '...';
			}

			trackNameEl.innerHTML = name;
			timeLeft = currentTrackInfo.length;
			totalTrackLength = currentTrackInfo.length;

			// Stat the repdoction
			updateTimmer();

			// Enable the buttons of the player
			playPauseStopButt.classList.remove('disabled');
			forwardButt.classList.remove('disabled');
			rewindButt.classList.remove('disabled');

			playPauseStopButt.classList.remove('play');
			playPauseStopButt.classList.add('pause');
		},

		/**
		  * This method pepare the player and should be called after the page is loaded
		  */
		bootstrap: function() {
			var my = this;

			playPauseStopButt = document.getElementById('player_play_pause_stop_div');
			rewindButt = document.getElementById('player_rewind_div');
			forwardButt = document.getElementById('player_forward_div');
			timerEl = document.getElementById('player_timmer_div');
			trackNameEl = document.getElementById('player_title_div');

			this.resetPlayer();

			// The rewind button will trigger the previous track for a click and if
			// the user maintains the click, will rewind
			var revFordTimeout = null;
			rewindButt.addEventListener('mousedown', function(inEvent) {
				revFordTimeout = setTimeout(function() {
					playBackwards = true;
					timmerInterval = 200;
					rewFord = true;
				}, 800);
			}, false);

			// The forward button will trigger the previous track for a click and if
			// the user maintains the click, will forward
			forwardButt.addEventListener('mousedown', function(inEvent) {
				revFordTimeout = setTimeout(function() {
					timmerInterval = 200;
					rewFord = true;
				}, 800);
			}, false);

			rewindButt.addEventListener('click', function(inEvent) {
				if (revFordTimeout !== null) {
					clearTimeout(revFordTimeout);
				}
				if (!rewFord) {
					if (!this.classList.contains('disabled')) {
						my.playPrev();
					}
				}

				timmerInterval = 1000;
				playBackwards = false;
				rewFord = false;
			}, false);

			forwardButt.addEventListener('click', function(inEvent) {
				if (revFordTimeout !== null) {
					clearTimeout(revFordTimeout);
				}
				if (!rewFord) {
					if (!this.classList.contains('disabled')) {
						my.playNext();
					}
				}

				timmerInterval = 1000;
				rewFord = false;
			}, false);

			// The button to play or stop the player
			playPauseStopButt.addEventListener('click', function(inEvent) {
				if (this.classList.contains('play')) {
					resume();
				} else {
					pause();
				}
			}, false);
		}
	};

	return my;
})();
