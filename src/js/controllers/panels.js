var PanelsObj_Controller = (function () {
	return {
		createLinks: function(inHtml) {
			var divContainer = document.createElement("div");
			divContainer.innerHTML = inHtml;

			var links = divContainer.getElementsByClassName('info_link');

			for (link in links) {
				if (links[link].addEventListener !== undefined) {
					switch (links[link].getAttribute('type')) {
						case 'track':
							links[link].setAttribute('draggable', 'true');

							links[link].addEventListener('dragstart', function(inEvent) {
								var dt = inEvent.dataTransfer;
								var dragIcon = document.createElement('img');
	
								dragIcon.src = '/img/add-track.jpg';

								dt.effectAllowed = 'copy';	
								dt.setData('Text', JSON.stringify({
									'type': 'track',
									'href': this.getAttribute('href')}));
	
								dt.setDragImage(dragIcon, -10, -10);
							}, false);
							break;

						case 'playlist':
							links[link].addEventListener('dragover', function(inEvent) {
								if (inEvent.preventDefault) {
									inEvent.preventDefault();
								}
								this.classList.add('over');
							});

							links[link].addEventListener('dragleave', function(inEvent) {
								this.classList.remove('over');
							});

							links[link].addEventListener('drop', function(inEvent) {
								inEvent.preventDefault();

								this.classList.remove('over');
								var info = JSON.parse(inEvent.dataTransfer.getData('Text'));

								PlaylistManager_Controller.addTrackToPlaylist(info.href, this.getAttribute('href'));

								return false;
							});
							
							break;
					}

					links[link].addEventListener('click', function(inEvent) {
						inEvent.preventDefault();

						PanelsObj_Controller.showDetails(this.getAttribute('type'), this.getAttribute('href'), false, 1);
	
						return false;
					}, false);
				}
			}

			var paginatorLinks = divContainer.getElementsByClassName('show_more');

			for (paginator in paginatorLinks) {
				if (paginatorLinks[paginator].addEventListener !== undefined) {
					paginatorLinks[paginator].addEventListener('click', function() {
						var linkElem = this;
	
						this.innerHTML = '<img src="img/loading.gif" />';
	
						setTimeout(function() {
							PanelsObj_Controller.showDetails(linkElem.getAttribute('type'), linkElem.getAttribute('href'), true, linkElem.getAttribute('nextpage'));
	
							linkElem.classList.add('hd');
						}, 1);
	
						return false;
					}, false);
				}
			}
	
			return divContainer;
		},

		showDetails: function(inType, inId, inAppend, inPage) {
			console.log(inType, inId);
			var controller = null;

			switch (inType) {
				case 'searchResult_album':
					controller = new SearchAlbumResult_Controller(inId);
					break;

				case 'searchResult_track':
					controller = new SearchTrackResult_Controller(inId);
					break;

				case 'searchResult_artist':
					controller = new SearchArtistResult_Controller(inId);
					break;

				case 'album':
					controller = new Album_Controller(inId);
					break;

				case 'track':
					controller = new Track_Controller(inId);
					break;

				case 'artist':
					controller = new Artist_Controller(inId);
					break;

				case 'playlist':
					controller = new Playlist_Controller(inId);
					break;
			}

			view = this.createLinks(controller.getDetailView(inPage));

			if (!inAppend) {
				document.getElementById('details_div').innerHTML = '';
			}

			document.getElementById('details_div').appendChild(view);
		},

		bootstrap: function() {
			SearchBox_Controller.bootstrap();

			PlaylistManager_Controller.bootstrap();
		}
	};
})();
