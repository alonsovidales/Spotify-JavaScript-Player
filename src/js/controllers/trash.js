var Trash_Controller = (function () {
	var trashEl = null;
	return {
		bootstrap: function() {
			trashEl = document.getElementById('trash_img');

			trashEl.addEventListener('dragover', function(inEvent) {
				if (inEvent.preventDefault) {
					inEvent.preventDefault();
				}
			});

			trashEl.addEventListener('drop', function(inEvent) {
				var elemInfo = JSON.parse(inEvent.dataTransfer.getData('Text'));

				switch (elemInfo.type) {
					case 'playlist':
						var current = Player_Controller.getCurrentTrackList();
						if (current.playlist == elemInfo.href) {
							Player_Controller.resetPlayer();
						}

						var controller = new Playlist_Controller(elemInfo.href);
						controller.del();
						break;

					case 'track':
						if (elemInfo.playlist !== undefined) {
							var controller = new Playlist_Controller(elemInfo.playlist);

							var current = Player_Controller.getCurrentTrackList();

							if (current.playlist == elemInfo.playlist) {
								Player_Controller.updateCurrentTrack(elemInfo.trackId);
							}

							controller.removeTrack(elemInfo.trackId);

							if ((current.playlist == elemInfo.playlist) && (current.track == elemInfo.trackId)) {
								Player_Controller.playNext();
								Player_Controller.playPrev();
							}
						}
						break;
				}
			});
		}
	};
})();
