var ApiConnector_Tool = (function () {
	// This var will be used to store the information processed in order to don't
	// need process it again
	var cachedQueries = {};

	/**
	  * The formaters will be used in order to keep the coherence between the 
	  * information that we get from the API and the data structure that we use,
	  * according to an "Adapter Pattern"
	  *
	  * Each value of the dictionari will be a function that will reciebe as input the
	  * an object with the API structure and should to return the structure to be used
	  * internally
	  */	
	var formatters = {
		'searchAlbum': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'albums': {}
			};

			for (album in inParams.albums) {
				var albumArtists = {};

				for (artist in album.artists) {
					albumArtists.append({
						'href': artist.href,
						'name': artist.name
					});
				}

				// We will not use the availability
				result.albums.append({
					'name': album.name,
					'popularity': album.popularity,
					'href': album.href,
					'artists': albumArtists
				});
			}

			return result;
		},

		'searchArtist': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'artists': {}
			};

			for (artist in inParams.artists) {
				result.artists.append({
					'href': artist.href,
					'name': artist.name,
					'popularity': artist.popularity
				});
			}

			return result;
		},

		'searchTrack': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'tracks': {}
			};

			for (track in inParams.tracks) {
				var artists = {};
				for (artist in track.artists) {
					artists.append({
						'href': artist.href,
						'name': artist.name
					});
				}

				result.tracks.append({
					'album': {
						'released': track.album.released,
						'href': track.album.href,
						'name': track.album.name
					},
					'name': track.name,
					'popularity': track.popularity,
					'length': track.popularity,
					'trackNumber': track.track-number,
					'artists': artists
				});
			}

			return result;
		}
	};

	/**
	  * This method encapsulates all the search requests,
	  * all have the same structure, only changes the type
	  * and the response from the server, that should be 
	  * processed by the methos who calls this
	  */
	var doApiSearchRequest = function(inType, inQuery, inPage, inFormatter, inCallBack) {
		var url = config.apiBaseUrl + 'search/1/' + inType + '.json?q=' + inQuery + '&page=' + inPage;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.onload = function(e) {
			var data = null;

			switch (this.status) {
				case 200:
					data = JSON.parse(this.response);
					cachedQueries[inType + '_' + inQuery + '_' + inPage] = formatters[inFormatter](data);
					break;

				// Get the info from the cache to don't need parse the JSON again
				case 304:
					inCallBack(cachedQueries[inType + '_' + inQuery + '_' + inPage]);
					break;

				case 503:
					new Alert_Tool('Service Unavailable, sorry :(');
					break;

				case 403:
					new Alert_Tool('Sorry, you can\'t do more than 10 queries per second');
					break;

				default:
					new Alert_Tool('Internal server error');
					break;
			}
		}
		xhr.send();

		return xhr;
	};

	return {
		searchAlbums: function(inSearchStr, inPage, inCallBack) {
			var result = doApiSearchRequest('album', inSearchStr, inPage, 'searchAlbum', inCallBack);

			console.log(result);
		},

		searchArtists: function(inSearchStr, inPage, inCallBack) {
			var result = doApiSearchRequest('artist', inSearchStr, inPage, 'searchArtist', inCallBack);

			console.log(result);
		},

		searchTracks: function(inSearchStr, inPage, inCallBack) {
			var result = doApiSearchRequest('track', inSearchStr, inPage, 'searchTrack', inCallBack);

			console.log(result);
		},

		getAlbumInfo: function(inAlbumId) {
		},

		getArtistInfo: function(inArtistId) {
		},

		getTrackInfo: function(inTrackId) {
		}
	};
})();
