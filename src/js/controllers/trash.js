/**
  * @author: Alonso Vidales <alonso.vidales@tras2.es>
  * @date: 2012-03-05
  *
  * This is a singleton class used to control the trash
  * 
  */

var Trash_Controller = (function () {
	var trashEl = null; // The DOM element for the trash image

	return {
		/**
		  * Add the corresponding listeners to the elements this
		  * method should be called after the load of the document
		  */
		bootstrap: function() {
			trashEl = document.getElementById('trash_img');

			trashEl.addEventListener('dragover', function(inEvent) {
				if (inEvent.preventDefault) {
					inEvent.preventDefault();
				}
			});

			// Add the listener for the drop event, to catch the information
			// of the element that the user want to delete
			trashEl.addEventListener('drop', function(inEvent) {
				var elemInfo = JSON.parse(inEvent.dataTransfer.getData('Text'));

				// Check if this element can be removed
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

							// If it is showing the playlist, update it
							if (current.playlist == elemInfo.playlist) {
								Player_Controller.updateCurrentTrack(elemInfo.trackId);
							}

							controller.removeTrack(elemInfo.trackId);

							// If we are playing this track, play the next one
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
