/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-03
  *
  * Main Global Object, This object is used to:
  *	- Control all the links actions to coordinate the relations between
  *	  the different elements
  *	- Control all the panels and the elements to be rendered in each one
  *	- Control the central view
  *	- Launch the rest of the components, this is the bootstrap of the app
  */
var SpotifyPlayerObj_Controller = (function () {
	/**
	  * Will contain a object with the information of the current view at the "details_div" div
	  * The structure is:
	  *	{
	  *		'type': <str>, // The string with the type of the view
	  *		'id': inId, // The uniq identifier of the content rendered
	  *		'append': inAppend, // If the view was appendid to a previous one
	  *		'page': inPage // The last page loaded
	  *	}
	  */
	var currentMainContentView = null;
	var mainContentEl = null; // The div element "details_div" to render the main info

	return {
		/**
		  * Parse an HTML string and create all the nexessary links and connections deppending of the
		  * used css classes and attributes of the tags.
		  * Possible tags:
		  *	- direct_play_list_button: Play the first track of the list
		  *		- necessary attributes:
		  *			- href: The uniq ID of the playlist
		  *
		  *	- edit_playlist_link: Edit the Playlist
		  *		- necessary attributes:
		  *			- href: The uniq ID of the playlist
		  *
		  *	- play_track: Play a track
		  *		- necessary attributes:
		  *			- href: The uniq ID of the track
		  *			- playlist: The uniq ID of the playlist who contains this track
		  *			- trackid: The if of this track inside the list
		  *
		  *	- info_link: Is a link to a file of a element
		  *		- necessary attributes:
		  *			- href: The uniq ID of the element
		  *			- type: The type of the element, the possible types are:
		  *				- artist
		  *				- album
		  *				- track
		  *				- playlist
		  *			- trackid: The if of this track inside the list
		  *
		  *	- show_more: Show a new page of the current information
		  *		- necessary attributes:
		  *			- href: The searched string
		  *			- nextpage: The page to add
		  *			- type: The type of search, the possible types are:
		  *				- searchResult_track
		  *				- searchResult_artist
		  *				- searchResult_album
		  *
		  * @return <div DOM element>: A div element who contains the processed HTML
		  */
		createLinks: function(inHtml) {
			// Create the div and parse the string on HTML elements
			var divContainer = document.createElement("div");
			divContainer.innerHTML = inHtml;

			// Add the click event to the direct play of a playlist buttons
			var directPlaylistLinks = divContainer.getElementsByClassName('direct_play_list_button');
			for (link in directPlaylistLinks) {
				if (directPlaylistLinks[link].addEventListener !== undefined) {
					directPlaylistLinks[link].addEventListener('click', (function(inEvent) {
						inEvent.preventDefault();

						Player_Controller.playTrack(this.getAttribute('href'), 0);
	
						return false;
					}), false);
				}
			}

			// Add the click event to edit the playlist names
			var editPlaylistLinks = divContainer.getElementsByClassName('edit_playlist_link');
			for (link in editPlaylistLinks) {
				if (editPlaylistLinks[link].addEventListener !== undefined) {
					editPlaylistLinks[link].addEventListener('click', (function(inEvent) {
						inEvent.preventDefault();

						PlaylistManager_Controller.editPlayList(this.getAttribute('href'));
	
						return false;
					}), false);
				}
			}

			// Add the click event to play a track
			var playTrackLinks = divContainer.getElementsByClassName('play_track');
			for (link in playTrackLinks) {
				if (playTrackLinks[link].addEventListener !== undefined) {
					playTrackLinks[link].addEventListener('click', (function(inEvent) {
						inEvent.preventDefault();

						Player_Controller.playTrack(this.getAttribute('playlist'), this.getAttribute('trackid'));
	
						return false;
					}), false);
				}
			}

			// Add the click and drag and drop events for the information links
			var links = divContainer.getElementsByClassName('info_link');
			for (link in links) {
				if (links[link].addEventListener !== undefined) {
					// Add the drag events fro the track, album and playlists links
					if (
						(links[link].getAttribute('type') == 'track') ||
						(links[link].getAttribute('type') == 'album') ||
						(links[link].getAttribute('type') == 'playlist')) {

						links[link].setAttribute('draggable', 'true');

						links[link].addEventListener('dragstart', (function(inEvent) {
							var dt = inEvent.dataTransfer;
							var dragIcon = null;

							// Set the corresponding icon for the drag event
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
							dt.setDragImage(dragIcon, 20, 20);

							dt.effectAllowed = 'copy';

							// Create the information to send to the target element, and send it
							// as a JSON string
							var infoToSend = {
								'type': this.getAttribute('type'),
								'href': this.getAttribute('href')};

							if (this.getAttribute('playlist')) {
								infoToSend.playlist = this.getAttribute('playlist');
								infoToSend.trackId = this.getAttribute('trackid');
							}

							dt.setData('Text', JSON.stringify(infoToSend));
						}), false);
					}

					// Add the drop events for the playlists
					if (links[link].getAttribute('type') == 'playlist') {
						links[link].addEventListener('dragover', (function(inEvent) {
							if (inEvent.preventDefault) {
								inEvent.preventDefault();
							}
							this.classList.add('over');
						}), false);

						links[link].addEventListener('dragleave', (function(inEvent) {
							this.classList.remove('over');
						}), false);

						links[link].addEventListener('drop', (function(inEvent) {
							inEvent.preventDefault();

							this.classList.remove('over');

							try {
								var info = JSON.parse(inEvent.dataTransfer.getData('Text'));

								// Call the corresponding methods to add the information recived to the list
								switch (info.type) {
									case 'playlist':
										PlaylistManager_Controller.addPlayListToPlayList(
											info.href,
											this.getAttribute('href'));
										break;

									case 'track':
										PlaylistManager_Controller.addTrackToPlaylist(
											info.href,
											this.getAttribute('href'));
										break;

									case 'album':
										PlaylistManager_Controller.addAlbumToPlaylist(
											info.href,
											this.getAttribute('href'));
										break;
								}
							} catch(inError) {
								if (config.debug) {
									console.log('Element not allowed');
								}
							}

							return false;
						}), false);
					}

					// Add the click event to the information links
					links[link].addEventListener('click', (function(inEvent) {
						inEvent.preventDefault();

						SpotifyPlayerObj_Controller.showDetails(this.getAttribute('type'), this.getAttribute('href'), false, 1);
	
						return false;
					}), false);
				}
			}

			// Paginator links
			var paginatorLinks = divContainer.getElementsByClassName('show_more');

			for (paginator in paginatorLinks) {
				if (paginatorLinks[paginator].addEventListener !== undefined) {
					paginatorLinks[paginator].addEventListener('click', (function(inEvent) {
						inEvent.preventDefault();

						var linkElem = this;
	
						this.innerHTML = '<img src="img/loading.gif" />';
	
						setTimeout(function() {
							SpotifyPlayerObj_Controller.showDetails(linkElem.getAttribute('type'), linkElem.getAttribute('href'), true, linkElem.getAttribute('nextpage'));
	
							linkElem.classList.add('hd');
						}, 1);
	
						return false;
					}), false);
				}
			}

			return divContainer;
		},

		/**
		  * Return the current view information
		  *
		  * @return <object>:
		  *	{
		  *		'type': <str>, // The string with the type of the view
		  *		'id': inId, // The uniq identifier of the content rendered
		  *		'append': inAppend, // If the view was appendid to a previous one
		  *		'page': inPage // The last page loaded
		  *	}
		  */
		getCurrentView: function() {
			return currentMainContentView;
		},

		/**
		  * Remove all the content of the main view "details_div" div
		  */
		cleanCurrentView: function() {
			currentMainContentView = null;
			mainContentEl.innerHTML = '';
		},

		/**
		  * This method is a factory that depending of the inType parameter, calls to the
		  * corresponding controller and the method getDetailView of the object, the result
		  * of the getDetailView will be processed by the this.createLinks method and the
		  * result will replace or added to the mainContentEl div container
		  *
		  * @param inType <str>: The type of view to render
		  * @param inId <str>: The unique ID of the content
		  * @param inAppend <bool>: If true, the new content will be appended to the existing
		  * @param inPage <int>: The number of page to be rendered
		  *
		  */
		showDetails: function(inType, inId, inAppend, inPage) {
			// Create the view, links, etc in a new thread for a better user experience
			var my = this;
			setTimeout(function () {
				var controller = null;
	
				currentMainContentView = {
					'type': inType,
					'id': inId,
					'append': inAppend,
					'page': inPage};

				// Factory: Create the controller depending of the inType parameter	
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

				// Get the corresponding HTML code to render from the controller, and
				// create the corresponding links, and actions for the new elements
				view = my.createLinks(controller.getDetailView(inPage));

				if (!inAppend) {
					mainContentEl.innerHTML = '';
				}

				mainContentEl.appendChild(view);

				// Launch the controller post processor if exists	
				if (controller.getDetailViewPostProcessor !== undefined) {
					controller.getDetailViewPostProcessor();
				}
			}, 1);
		},

		/**
		  * Main bootstrap of the application, will launch the rest of components
		  */
		bootstrap: function() {
			mainContentEl = document.getElementById('details_div');

			SearchBox_Controller.bootstrap();
			Trash_Controller.bootstrap();
			PlaylistManager_Controller.bootstrap();
			Player_Controller.bootstrap();
		}
	};
})();
