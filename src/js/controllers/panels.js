var PanelsObj_Controller = (function () {
	return {
		createLinks: function(inHtml) {
			var divContainer = document.createElement("div");
			divContainer.innerHTML = inHtml;

			var links = divContainer.getElementsByClassName('info_link');

			for (link in links) {
				if (links[link].addEventListener !== undefined) {
					if (
						(links[link].getAttribute('type') == 'track') ||
						(links[link].getAttribute('type') == 'album') ||
						(links[link].getAttribute('type') == 'playlist')) {

						links[link].setAttribute('draggable', 'true');

						links[link].addEventListener('dragstart', function(inEvent) {
							var dt = inEvent.dataTransfer;
							var dragIcon = document.createElement('img');

							switch (this.getAttribute('type')) {
								case 'track':
									dragIcon.src = '/img/drag_track.png';
									break;

								case 'playlist':
									dragIcon.src = '/img/drag_album.png';
									break;

								case 'album':
									dragIcon.src = '/img/drag_album.png';
									break;
							}

							dt.effectAllowed = 'copy';	
							dt.setData('Text', JSON.stringify({
								'type': this.getAttribute('type'),
								'href': this.getAttribute('href')}));

							dt.setDragImage(dragIcon, 20, 20);
						}, false);
					}

					if (links[link].getAttribute('type') == 'playlist') {
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

							try {
								var info = JSON.parse(inEvent.dataTransfer.getData('Text'));

								switch (info.type) {
									case 'playlist':
										PlaylistManager_Controller.addPlayListToPlayList(info.href, this.getAttribute('href'));
										break;

									case 'track':
										PlaylistManager_Controller.addTrackToPlaylist(info.href, this.getAttribute('href'));
										break;

									case 'album':
										PlaylistManager_Controller.addAlbumToPlaylist(info.href, this.getAttribute('href'));
										break;
								}
							} catch(inError) {
								if (config.debug) {
									console.log('Element not allowed');
								}
							}

							return false;
						});
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
					paginatorLinks[paginator].addEventListener('click', function(inEvent) {
						inEvent.preventDefault();

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
