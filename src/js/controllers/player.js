var Player_Controller = (function () {
	var playPauseStopButt = null;
	var rewindButt = null;
	var fordwareButt = null;
	var timerEl = null;
	var trackNameEl = null;

	var currentPlaylistId = null;
	var currentTrackId = null;
	var currentTrackInfo = null;
	var timeLeft = null;
	var currentTimmer = null;
	var playFordware = false;
	var totalTrackLength = 0;
	var playList = null;
	var rewFord = false;

	var timmerInterval = 1000;

	var updateTimmer = function() {
		if (timeLeft < 1) {
			my.playNext();
		}
		if (timeLeft > totalTrackLength) {
			my.playPrev();
		}

		timerEl.innerHTML = timeManagerObj_Tool.getMinSec(timeLeft);

		if (playFordware) {
			timeLeft++;
		} else {
			timeLeft--;
		}

		if (currentTimmer !== null) {
			clearTimeout(currentTimmer);
		}
		currentTimmer = setTimeout(updateTimmer, timmerInterval);
	};

	var resume = function() {
		playPauseStopButt.classList.remove('play');
		playPauseStopButt.classList.add('pause');
		updateTimmer();
	};

	var pause = function() {
		playPauseStopButt.classList.add('play');
		playPauseStopButt.classList.remove('pause');
		if (currentTimmer !== null) {
			clearTimeout(currentTimmer);
		}
	};

	var my = {
		playPrev: function() {
			if (playList.getTracksInfo(currentTrackId - 1) !== null) {
				my.playTrack(currentPlaylistId, currentTrackId - 1);
			} else {
				my.playTrack(currentPlaylistId, playList.getNumTracks() - 1);
			}
		},

		playNext: function() {
			if (playList.getTracksInfo(currentTrackId + 1) !== null) {
				my.playTrack(currentPlaylistId, currentTrackId + 1);
			} else {
				my.playTrack(currentPlaylistId, 0);
			}
		},

		updateCurrentTrack: function(inTrackId) {
			if (inTrackId < currentTrackId) {
				currentTrackId--;
			}
		},

		getCurrentTrackList: function () {
			return {
				'playlist': currentPlaylistId,
				'track': currentTrackId
			};
		},

		resetPlayer: function() {
			if (currentTimmer !== null) {
				clearTimeout(currentTimmer);
			}
			trackNameEl.innerHTML = ' -- -- ';
			timerEl.innerHTML = '--:--';
	
			rewindButt.classList.add('disabled');
			fordwareButt.classList.add('disabled');
			playPauseStopButt.classList.add('disabled');
		},

		playTrack: function(inPlaylistId, inTrackId) {
			var oldPlayListId = currentPlaylistId;
			var oldTrackId = currentTrackId;
			currentPlaylistId = inPlaylistId;
			currentTrackId = parseInt(inTrackId, 10);

			playList = new Playlist_Controller(inPlaylistId);
			currentTrackInfo = playList.getTracksInfo(currentTrackId);
			if (currentTrackInfo === null) {
				this.resetPlayer();

				return false;
			}

			if (oldPlayListId !== null) {
				var oldPlayList = new Playlist_Controller(oldPlayListId);
				oldPlayList.unsetSpeackerIcon();
				oldPlayList.unsetTrackSpeackerIcon(oldTrackId);
			}
			playList.setSpeackerIcon();
			playList.setTrackSpeackerIcon(inTrackId);

			var name = currentTrackInfo.name;
			if (name.length > config.maxSongTrackLengthForPlayer) {
				name = name.substr(0, config.maxSongTrackLengthForPlayer) + '...';
			}

			trackNameEl.innerHTML = name;
			timeLeft = currentTrackInfo.length;
			totalTrackLength = currentTrackInfo.length;

			updateTimmer();

			playPauseStopButt.classList.remove('disabled');
			fordwareButt.classList.remove('disabled');
			rewindButt.classList.remove('disabled');

			playPauseStopButt.classList.remove('play');
			playPauseStopButt.classList.add('pause');
		},

		bootstrap: function() {
			var my = this;

			playPauseStopButt = document.getElementById('player_play_pause_stop_div');
			rewindButt = document.getElementById('player_rewind_div');
			fordwareButt = document.getElementById('player_fordware_div');
			timerEl = document.getElementById('player_timmer_div');
			trackNameEl = document.getElementById('player_title_div');

			this.resetPlayer();

			var revFordTimeout = null;
			rewindButt.addEventListener('mousedown', function(inEvent) {
				revFordTimeout = setTimeout(function() {
					playFordware = true;
					timmerInterval = 200;
					rewFord = true;
				}, 800);
			}, false);

			fordwareButt.addEventListener('mousedown', function(inEvent) {
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
				playFordware = false;
				rewFord = false;
			}, false);

			fordwareButt.addEventListener('click', function(inEvent) {
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
