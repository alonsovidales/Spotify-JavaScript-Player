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
			console.log(inParams);
			var result = {
				'numResults': inParams.info.num_results,
				'albums': []
			};

			for (var album in inParams.albums) {
				var albumArtists = [];

				for (var artist in inParams.albums[album].artists) {
					console.log(inParams.albums[album].artists[artist]);
					albumArtists.push({
						'href': inParams.albums[album].artists[artist].href,
						'name': inParams.albums[album].artists[artist].name
					});
				}

				// We will not use the availability
				result.albums.push({
					'name': inParams.albums[album].name,
					'popularity': inParams.albums[album].popularity,
					'href': inParams.albums[album].href,
					'artists': albumArtists
				});
			}

			return result;
		},

		'searchArtist': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'artists': []
			};

			for (var artist in inParams.artists) {
				result.artists.push({
					'href': inParams.artists[artist].href,
					'name': inParams.artists[artist].name,
					'popularity': inParams.artists[artist].popularity
				});
			}

			return result;
		},

		'searchTrack': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'tracks': []
			};

			for (var track in inParams.tracks) {
				var artists = [];
				for (var artist in inParams.tracks[track].artists) {
					artists.push({
						'href': inParams.tracks[track].artists[artist].href,
						'name': inParams.tracks[track].artists[artist].name
					});
				}

				result.tracks.push({
					'album': {
						'released': inParams.tracks[track].album.released,
						'href': inParams.tracks[track].album.href,
						'name': inParams.tracks[track].album.name
					},
					'name': inParams.tracks[track].name,
					'popularity': inParams.tracks[track].popularity,
					'length': inParams.tracks[track].popularity,
					'trackNumber': inParams.tracks[track]['track-number'],
					'artists': artists
				});
			}

			return result;
		},

		'album': function(inParams) {
			var result = {
				'name': inParams.album.name,
				'artistName': inParams.album.artist,
				'artistId': inParams.album['artist-id'],
				'released': inParams.album.released,
				'tracks': []
			};

			for (track in inParams.album.tracks) {
				var artists = [];
				for (artist in inParams.album.tracks[track].artist) {
					artists.push({
						'href': inParams.album.tracks[track].artist[artist].href,
						'name': inParams.album.tracks[track].artist[artist].name
					});
				}

				result.tracks.push({
					'available': inParams.album.tracks[track].available,
					'href': inParams.album.tracks[track].href,
					'artists': artists
				});
			}

			return result;
		},

		'artist': function(inParams) {
			var result = {
				'name': inParams.artist.name,
				'albums': []};

			for (album in inParams.artist.albums) {
				result.albums.push({
					'href': inParams.artist.albums[album].album.href,
					'artist': inParams.artist.albums[album].album.artist,
					'artistId': inParams.artist.albums[album].album['artist-id'],
					'name': inParams.artist.albums[album].album.name
				});
			}

			return result;
		},

		'track': function(inParams) {
			var result = {
				'available': inParams.track.available,
				'popularity': inParams.track.popularity,
				'length': inParams.track.length,
				'name': inParams.track.name,
				'artists': [],
				'album': {
					'released': inParams.track.album.released,
					'href': inParams.track.album.href,
					'name': inParams.track.album.name
				}
			};

			for (artist in inParams.track.artists) {
				result.artists.push({
					'name': inParams.track.artists[artist].name,
					'href': inParams.track.artists[artist].href
				});
			}

			return result;
		}
	};

	var doAjaxRequest = function(inUrl, inCacheKey, inFormatter, inCallBack) {
		if (cachedQueries[inCacheKey] !== undefined) {
			inCallBack(cachedQueries[inCacheKey]);

			return false;
		}

		var xhr = new XMLHttpRequest();
		xhr.open('GET', inUrl);
		xhr.onload = function(e) {
			switch (this.status) {
				case 200:
				case 304:
					var data = JSON.parse(this.response);
					cachedQueries[inCacheKey] = formatters[inFormatter](data);

					inCallBack(cachedQueries[inCacheKey]);
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

	var doApiLookupRequest = function(inTypeFormatter, inId, inCallBack) {
		var cacheKey = 'lookup_' + inId + '_' + inTypeFormatter;

		var extras = '';
		if (inTypeFormatter == 'album') {
			extras = '&extras=track';
		}
		if (inTypeFormatter == 'artist') {
			extras = '&extras=album';
		}

		var url = config.apiBaseUrl + 'lookup/1/.json?uri=' + inId + extras;

		return doAjaxRequest(url, cacheKey, inTypeFormatter, inCallBack);
	};

	/**
	  * This method encapsulates all the search requests,
	  * all have the same structure, only changes the type
	  * and the response from the server, that should be 
	  * processed by the methos who calls this
	  */
	var doApiSearchRequest = function(inType, inQuery, inPage, inFormatter, inCallBack) {
		var cacheKey = 'search_' + inType + '_' + inQuery + '_' + inPage + '_' + inFormatter;
		var url = config.apiBaseUrl + 'search/1/' + inType + '.json?q=' + inQuery + '&page=' + inPage;

		return doAjaxRequest(url, cacheKey, inFormatter, inCallBack);
	};

	return {
		searchAlbums: function(inSearchStr, inPage, inCallBack) {
			return doApiSearchRequest('album', inSearchStr, inPage, 'searchAlbum', inCallBack);
		},

		searchArtists: function(inSearchStr, inPage, inCallBack) {
			return doApiSearchRequest('artist', inSearchStr, inPage, 'searchArtist', inCallBack);
		},

		searchTracks: function(inSearchStr, inPage, inCallBack) {
			return doApiSearchRequest('track', inSearchStr, inPage, 'searchTrack', inCallBack);
		},

		getAlbumInfo: function(inAlbumId, inCallBack) {
			return doApiLookupRequest('album', inAlbumId, inCallBack);
		},

		getArtistInfo: function(inArtistId, inCallBack) {
			return doApiLookupRequest('artist', inArtistId, inCallBack);
		},

		getTrackInfo: function(inTrackId, inCallBack) {
			return doApiLookupRequest('track', inTrackId, inCallBack);
		}
	};
})();
