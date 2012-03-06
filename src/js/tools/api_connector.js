var apiConnectorObj_Tool = (function () {
	// This var will be used to store the information processed in order to don't
	// need process it again
	var cachedQueries = {};

	var pad = function(inNumber, inLen) {
		var str = '' + inNumber;

		while (str.length < inLen) {
			str = '0' + str;
		}
		return str;
	};

	var getMinSec = function(inTime) {
		return pad(Math.round(inTime / 60), 2) + ':' + pad(Math.floor(inTime % 60), 2);
	};

	/**
	  * The formaters will be used in order to keep the coherence between the 
	  * information that we get from the API and the data structure that we use,
	  * according to an "Adapter Pattern"
	  *
	  * Each value of the dictionari will be a function that will reciebe as input the
	  * an object with the API structure and should to return the structure to be used
	  * internally
	  */	
	var adapters = {
		'autocompleteAlbumSearch': function(inParams) {
			var results = [];

			for (var count = 0; ((count < config.autocompleteListLength) && (count < inParams.albums.length)); count++) {
				results.push({
					'type': 'album',
					'href': inParams.albums[count].href,
					'name': inParams.albums[count].name
				});
			}

			return results;
		},

		'autocompleteArtistSearch': function(inParams) {
			var results = [];

			for (var count = 0; ((count < config.autocompleteListLength) && (count < inParams.artists.length)); count++) {
				results.push({
					'type': 'artist',
					'href': inParams.artists[count].href,
					'name': inParams.artists[count].name
				});
			}

			return results;
		},

		'autocompleteTrackSearch': function(inParams) {
			var results = [];

			for (var count = 0; ((count < config.autocompleteListLength) && (count < inParams.tracks.length)); count++) {
				results.push({
					'type': 'track',
					'href': inParams.tracks[count].href,
					'name': inParams.tracks[count].name
				});
			}

			return results;
		},

		'searchAlbum': function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'albums': []
			};

			for (var album in inParams.albums) {
				var albumArtists = [];

				for (var artist in inParams.albums[album].artists) {
					albumArtists.push({
						'href': inParams.albums[album].artists[artist].href,
						'name': inParams.albums[album].artists[artist].name
					});
				}

				// We will not use the availability
				result.albums.push({
					'name': inParams.albums[album].name,
					'popularity': inParams.albums[album].popularity,
					'popularityUpToFive': Math.round(inParams.albums[album].popularity * 5),
					'href': inParams.albums[album].href,
					'artists': albumArtists
				});

				console.log(result);
			}

			return result;
		},

		'searchArtist': function(inParams) {
			console.log(inParams);
			var result = {
				'numResults': inParams.info.num_results,
				'artists': []
			};

			for (var artist in inParams.artists) {
				result.artists.push({
					'href': inParams.artists[artist].href,
					'name': inParams.artists[artist].name,
					'popularity': inParams.artists[artist].popularity,
					'popularityUpToFive': Math.round(inParams.artists[artist].popularity * 5),
				});
			}

			return result;
		},

		'searchTrack': function(inParams) {
			console.log(inParams);
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
					'albumReleased': inParams.tracks[track].album.released,
					'albumHref': inParams.tracks[track].album.href,
					'albumName': inParams.tracks[track].album.name,
					'name': inParams.tracks[track].name,
					'href': inParams.tracks[track].href,
					'popularity': inParams.tracks[track].popularity,
					'popularityUpToFive': Math.round(inParams.tracks[track].popularity * 5),
					'minSec': getMinSec(inParams.tracks[track].length),
					'length': inParams.tracks[track].length,
					'artists': artists
				});
			}

			return result;
		},

		'album': function(inParams) {
			var result = {
				'name': inParams.album.name,
				'artistName': inParams.album.artist,
				'artistHref': inParams.album['artist-id'],
				'released': inParams.album.released,
				'tracks': []
			};

			for (track in inParams.album.tracks) {
				var artists = [];

				for (artist in inParams.album.tracks[track].artists) {
					artists.push({
						'href': inParams.album.tracks[track].artists[artist].href,
						'name': inParams.album.tracks[track].artists[artist].name
					});
				}

				result.tracks.push({
					'available': inParams.album.tracks[track].available,
					'href': inParams.album.tracks[track].href,
					'name': inParams.album.tracks[track].name,
					'artists': artists,
					'minSec': getMinSec(inParams.album.tracks[track].length),
					'length': inParams.album.tracks[track].length,
					'popularity': inParams.album.tracks[track].popularity,
					'popularityUpToFive': Math.round(inParams.album.tracks[track].popularity * 5)
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
					'name': inParams.artist.albums[album].album.name,
					'artist': inParams.artist.albums[album].album.artist,
					'artistHref': inParams.artist.albums[album].album['artist-id']
				});
			}

			return result;
		},

		'track': function(inParams) {
			var result = {
				'available': inParams.track.available,
				'popularity': inParams.track.popularity,
				'popularityUpToFive': Math.round(inParams.track.popularity * 5),
				'length': inParams.track.length,
				'minSec': getMinSec(inParams.track.length),
				'name': inParams.track.name,
				'artists': [],
				'albumReleased': inParams.track.album.released,
				'albumHref': inParams.track.album.href,
				'albumName': inParams.track.album.name
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

	var doAjaxRequest = function(inUrl, inCacheKey, inAdapter, inAsync, inCallBack) {
		if (cachedQueries[inCacheKey] !== undefined) {
			inCallBack(cachedQueries[inCacheKey]);

			return null;
		}

		var xhr = new XMLHttpRequest();
		xhr.open('GET', inUrl, inAsync);
		xhr.addEventListener('load', function(e) {
			switch (this.status) {
				case 200:
				case 304:
					var data = JSON.parse(this.response);
					cachedQueries[inCacheKey] = adapters[inAdapter](data);

					inCallBack(cachedQueries[inCacheKey]);
					break;

				case 503:
					new Alert_Tool('Service Unavailable, sorry :(', '', 'Close');
					break;

				case 403:
					new Alert_Tool('Sorry, you can\'t do more than 10 queries per second', '', 'Close');
					break;

				default:
					new Alert_Tool('Internal server error', '', 'Close');
					break;
			}
		}, false);

		xhr.send();

		return xhr;
	};

	var doApiLookupRequest = function(inTypeAdapter, inId, inAsync, inCallBack) {
		if (inId === '') {
			return null;
		}

		var cacheKey = 'lookup_' + inId + '_' + inTypeAdapter;
		var extras = '';

		if (inTypeAdapter == 'album') {
			// I'll need the detailed view, to be able to add albums to a playlist
			// without do a call for each track
			extras = '&extras=trackdetail';
		}

		if (inTypeAdapter == 'artist') {
			extras = '&extras=album';
		}

		var url = config.apiBaseUrl + 'lookup/1/.json?uri=' + inId + extras;

		return doAjaxRequest(url, cacheKey, inTypeAdapter, inAsync, inCallBack);
	};

	/**
	  * This method encapsulates all the search requests,
	  * all have the same structure, only changes the type
	  * and the response from the server, that should be 
	  * processed by the methos who calls this
	  */
	var doApiSearchRequest = function(inType, inQuery, inPage, inAdapter, inAsync, inCallBack) {
		if (inQuery === '') {
			return null;
		}

		var cacheKey = 'search_' + inType + '_' + inQuery + '_' + inPage + '_' + inAdapter;
		var url = config.apiBaseUrl + 'search/1/' + inType + '.json?q=' + inQuery + '&page=' + inPage;

		return doAjaxRequest(url, cacheKey, inAdapter, inAsync, inCallBack);
	};

	return {
		searchAlbums: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('album', inSearchStr, inPage, 'searchAlbum', inAsync, inCallBack);
		},

		searchArtists: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('artist', inSearchStr, inPage, 'searchArtist', inAsync, inCallBack);
		},

		searchTracks: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('track', inSearchStr, inPage, 'searchTrack', inAsync, inCallBack);
		},

		autocompleteSearch: function(inType, inSearchStr, inCallBack) {
			switch (inType) {
				case 'album':
					adapter = 'autocompleteAlbumSearch';
					break;

				case 'artist':
					adapter = 'autocompleteArtistSearch';
					break;

				case 'track':
					adapter = 'autocompleteTrackSearch';
					break;
			}

			return doApiSearchRequest(inType, inSearchStr, 1, adapter, true, inCallBack);
		},

		getAlbumInfo: function(inAlbumId, inAsync, inCallBack) {
			return doApiLookupRequest('album', inAlbumId, inAsync, inCallBack);
		},

		getArtistInfo: function(inArtistId, inAsync, inCallBack) {
			return doApiLookupRequest('artist', inArtistId, inAsync, inCallBack);
		},

		getTrackInfo: function(inTrackId, inAsync, inCallBack) {
			return doApiLookupRequest('track', inTrackId, inAsync, inCallBack);
		}
	};
})();
