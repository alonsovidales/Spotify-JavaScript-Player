var PanelsObj_Controller = (function () {
	var currentMainContentView = null;
	var mainContentEl = null;

	return {
		createLinks: function(inHtml) {
			var divContainer = document.createElement("div");
			divContainer.innerHTML = inHtml;

			var directPlaylistLinks = divContainer.getElementsByClassName('direct_play_list_button');

			for (link in directPlaylistLinks) {
				if (directPlaylistLinks[link].addEventListener !== undefined) {
					directPlaylistLinks[link].addEventListener('click', function(inEvent) {
						inEvent.preventDefault();

						Player_Controller.playTrack(this.getAttribute('href'), 0);
	
						return false;
					}, false);
				}
			}

			var editPlaylistLinks = divContainer.getElementsByClassName('edit_playlist_link');

			for (link in editPlaylistLinks) {
				if (editPlaylistLinks[link].addEventListener !== undefined) {
					editPlaylistLinks[link].addEventListener('click', function(inEvent) {
						inEvent.preventDefault();

						PlaylistManager_Controller.editPlayList(this.getAttribute('href'));
	
						return false;
					}, false);
				}
			}

			var playTrackLinks = divContainer.getElementsByClassName('play_track');

			for (link in playTrackLinks) {
				if (playTrackLinks[link].addEventListener !== undefined) {
					playTrackLinks[link].addEventListener('click', function(inEvent) {
						inEvent.preventDefault();

						Player_Controller.playTrack(this.getAttribute('playlist'), this.getAttribute('trackid'));
	
						return false;
					}, false);
				}
			}

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
							var dragIcon = null;

							switch (this.getAttribute('type')) {
								case 'track':
									dragIcon = document.getElementById('drag_track_icon');
									break;

								case 'playlist':
									dragIcon = document.getElementById('drag_playlist_icon');
									break;

								case 'album':
									dragIcon = document.getElementById('drag_album_icon');
									break;
							}
							dragIcon.classList.remove('hd');

							dt.effectAllowed = 'copy';

							var infoToSend = {
								'type': this.getAttribute('type'),
								'href': this.getAttribute('href')};

							if (this.getAttribute('playlist')) {
								infoToSend.playlist = this.getAttribute('playlist');
								infoToSend.trackId = this.getAttribute('trackid');
							}

							dt.setData('Text', JSON.stringify(infoToSend));

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

		getCurrentView: function() {
			return currentMainContentView;
		},

		cleanCurrentView: function() {
			mainContentEl.innerHTML = '';
		},

		showDetails: function(inType, inId, inAppend, inPage) {
			// Create the view, links, etc in a new thread for a better user experience
			var my = this;
			setTimeout(function () {
				currentMainContentView = {
					'type': inType,
					'id': inId,
					'append': inAppend,
					'page': inPage};
	
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

				view = my.createLinks(controller.getDetailView(inPage));

				if (!inAppend) {
					mainContentEl.innerHTML = '';
				}

				mainContentEl.appendChild(view);
	
				if (controller.getDetailViewPostProcessor !== undefined) {
					controller.getDetailViewPostProcessor();
				}
			}, 1);
		},

		bootstrap: function() {
			mainContentEl = document.getElementById('details_div');

			SearchBox_Controller.bootstrap();
			Trash_Controller.bootstrap();
			PlaylistManager_Controller.bootstrap();
			Player_Controller.bootstrap();
		}
	};
})();
