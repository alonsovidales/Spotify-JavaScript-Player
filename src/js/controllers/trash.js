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
				var controller = null;
				console.log(elemInfo);

				switch (elemInfo.type) {
					case 'playlist':
						controller = new Playlist_Controller(elemInfo.href);
						controller.del();
						break;

					case 'track':
						if (elemInfo.playlist !== undefined) {
							controller = new Playlist_Controller(elemInfo.playlist);
							controller.removeTrack(elemInfo.trackId);
						}
						break;
				}
			});
		}
	};
})();
