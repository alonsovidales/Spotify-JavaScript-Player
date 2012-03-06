/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-03
  *
  * Global Api Connecctior object: This object will be
  * used to do all the request to the API in order to keep
  * all the different kind of request and reponses centralized,
  * and in case of need a fast modification (due to a change on the
  * API specification) be able to do it only working on this file.
  * The parret used is a Adapter pattern, and a singleton to have only
  * one instance of this object
  *
  * @see config.apiBaseUrl
  */

var apiConnectorObj_Tool = (function () {
	var cachedQueries = {}; // Cache var to store the API results

	/**
	  * The formaters are defined in order to keep the coherence between the 
	  * information that we get from the API and the data structure that we need
	  * "Adapter Pattern"
	  *
	  * Each value of the dictionary will be a function that will reciebe as input the
	  * an object with the API structure and should to return the structure to be used
	  * internally
	  *
	  * @see: http://developer.spotify.com/en/metadata-api/
	  */	
	var adapters = {
		/**
		  * Must return the next structure:
		  * 	{
		  *		'type': 'album',
		  *		'href': <str>, // The unique id of the album
		  *		'name': <str> // The title of the album
		  *	}
		  * @see config.autocompleteListLength
		  */
		autocompleteAlbumSearch: function(inParams) {
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

		/**
		  * Must return the next structure:
		  * 	{
		  *		'type': 'artist',
		  *		'href': <str>, // The unique id of the artist
		  *		'name': <str> // The name artist
		  *	}
		  */
		autocompleteArtistSearch: function(inParams) {
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

		/**
		  * Must return the next structure:
		  * 	{
		  *		'type': 'track',
		  *		'href': <str>, // The unique id of the track
		  *		'name': <str> // The title of the track
		  *	}
		  */
		autocompleteTrackSearch: function(inParams) {
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

		/**
		  * Must return the next structure:
		  * 	{
		  *		'name': <str>, // The title of the album
		  *		'popularity': <int>, // The popularity in parts per unit
		  *		'popularityUpToFive': <int>, // The popularity in a 0-5 scale
		  *		'href': <str>, // The unique id of the album
		  *		'artists': [{
		  *			'href': <str>, // The unique id of the artist,
		  *			'name': <str> // The artist name
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		searchAlbum: function(inParams) {
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
			}

			return result;
		},

		/**
		  * Must return the next structure:
		  * 	{
		  *		'numResults': <int>, // The total number of results
		  *		'artists': [{
		  *			'href': <str>, // The unique id of the artist,
		  *			'name': <str> // The artist name
		  *			'popularity': <int>, // The popularity in parts per unit
		  *			'popularityUpToFive': <int>, // The popularity in a 0-5 scale
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		searchArtist: function(inParams) {
			var result = {
				'numResults': inParams.info.num_results,
				'artists': []
			};

			for (var artist in inParams.artists) {
				result.artists.push({
					'href': inParams.artists[artist].href,
					'name': inParams.artists[artist].name,
					'popularity': inParams.artists[artist].popularity,
					'popularityUpToFive': Math.round(inParams.artists[artist].popularity * 5)
				});
			}

			return result;
		},

		/**
		  * Must return the next structure:
		  * 	{
		  *		'numResults': <int>, // The total number of results
		  *		'tracks': [{
		  *			'albumReleased': <int>, // The year when the album was released
		  *			'albumHref': <str>, // The unique id of the album,
		  *			'albumName': <str> // The title of the album
		  *			'name': <str>, // The name of the track
		  *			'href': <str>, // The unique id of the track,
		  *			'popularity': <int>, // The popularity in parts per unit
		  *			'popularityUpToFive': <int>, // The popularity in a 0-5 scale
		  *			'minSec': <str>, // The total time in a mm:ss format
		  *			'length': <int>, // The total time in seconds
		  *			'artists': [{
		  *				'href': <str>, // The unique id of the artist
		  *				'name': <str> // The name of the artist
		  *			},
		  *				...
		  *			]
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		searchTrack: function(inParams) {
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
					'minSec': timeManagerObj_Tool.getMinSec(inParams.tracks[track].length),
					'length': inParams.tracks[track].length,
					'artists': artists
				});
			}

			return result;
		},

		/**
		  * Must return the next structure:
		  * 	{
		  *		'name': <int>, // The title of the album
		  *		'artistName': <str>, // The name of the artis
		  *		'artistHref': <str>, // The unique id of the artist,
		  *		'released': <int>, // The year when the album was released
		  *		'tracks': [{
		  *			'available': <bool>, // True if the track is aviable, false if not
		  *			'href': <str>, // The unique id of the track,
		  *			'name': <str> // The title of the track
		  *			'minSec': <str>, // The total time in a mm:ss format
		  *			'length': <int>, // The total time in seconds
		  *			'popularity': <int>, // The popularity in parts per unit
		  *			'popularityUpToFive': <int>, // The popularity in a 0-5 scale
		  *			'artists': [{
		  *				'href': <str>, // The unique id of the artist
		  *				'name': <str> // The name of the artist
		  *			},
		  *				...
		  *			]
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		album: function(inParams) {
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
					'minSec': timeManagerObj_Tool.getMinSec(inParams.album.tracks[track].length),
					'length': inParams.album.tracks[track].length,
					'popularity': inParams.album.tracks[track].popularity,
					'popularityUpToFive': Math.round(inParams.album.tracks[track].popularity * 5),
					'artists': artists
				});
			}

			return result;
		},

		/**
		  * Must return the next structure:
		  * 	{
		  *		'name': <int>, // The title of the album
		  *		'albums': [{
		  *			'href': <str>, // The unique id of the track,
		  *			'name': <str> // The title of the track
		  *			'artists': <str>, // The name of the artist
		  *			'artistHref': <str> // The unique id of the artist
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		artist: function(inParams) {
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

		/**
		  * Must return the next structure:
		  * 	{
		  *		'available': <bool>, // True if the track is aviable, false if not
		  *		'popularity': <int>, // The popularity in parts per unit
		  *		'popularityUpToFive': <int>, // The popularity in a 0-5 scale
		  *		'length': <int>, // The total time in seconds
		  *		'minSec': <str>, // The total time in a mm:ss format
		  *		'name': <str>, // The title of the album
		  *		'albumReleased': <int>, // The year when the album was released
		  *		'albumHref': <str>, // The unique indentifier of the album
		  *		'albumName': <str>, // The album title
		  *		'artists': [{
		  *			'href': <str>, // The unique id of the artist,
		  *			'name': <str> // The title of the artist
		  *		},
		  *			...
		  *		]
		  *	}
		  */
		track: function(inParams) {
			var result = {
				'available': inParams.track.available,
				'popularity': inParams.track.popularity,
				'popularityUpToFive': Math.round(inParams.track.popularity * 5),
				'length': inParams.track.length,
				'minSec': timeManagerObj_Tool.getMinSec(inParams.track.length),
				'name': inParams.track.name,
				'albumReleased': inParams.track.album.released,
				'albumHref': inParams.track.album.href,
				'albumName': inParams.track.album.name,
				'artists': []
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

	/**
	  * This method is used to do the queries to the API server, handle the possible
	  * exceptions, and return the result if success as an object.
	  * A dictionary is used as cache to don't do more than a time the same query
	  *
	  * @param inUrl <string>: The API url to be called
	  * @param inCacheKey <string>: The unique cache key to be used in order to
	  *	distinct the results from the API
	  * @param inAdapter <string>: The name of the adapter to be used, see local adapters var
	  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
	  * @param inCallBack <function>: The function to be called when the request success
	  *
	  * @return <mixed>:
	  *	XMLHttpRequest object: If the query is not cached
	  *	null: The query is cached, and we don't need to do the request again
	  */
	var doAjaxRequest = function(inUrl, inCacheKey, inAdapter, inAsync, inCallBack) {
		// Check if we have cached the query, and is we have it, return the info directly
		if (cachedQueries[inCacheKey] !== undefined) {
			inCallBack(cachedQueries[inCacheKey]);

			return null;
		}

		// The image to indicate to the user that the system is working
		document.getElementById('api_loading_img').classList.remove('hd');

		var xhr = new XMLHttpRequest();
		xhr.open('GET', inUrl, inAsync);
		xhr.addEventListener('abort', function(e) {
			document.getElementById('api_loading_img').classList.add('hd');
		});

		xhr.addEventListener('load', function(e) {
			switch (this.status) {
				case 200:
				case 304:
					// Parse the result, call to the adapter, store the result in the
					// cache, and call to the callback function
					var data = JSON.parse(this.response);
					cachedQueries[inCacheKey] = adapters[inAdapter](data);

					inCallBack(cachedQueries[inCacheKey]);
					break;

				case 503:
					Alert_Tool('Service Unavailable, sorry :(', '', 'Close');
					break;

				case 403:
					Alert_Tool('Sorry, you can\'t do more than 10 queries per second', '', 'Close');
					break;

				default:
					Alert_Tool('Internal server error', '', 'Close');
					break;
			}

			document.getElementById('api_loading_img').classList.add('hd');
		}, false);

		xhr.send();

		return xhr;
	};

	/**
	  * Perare and do the lookup request to eh API.
	  * @see http://developer.spotify.com/en/metadata-api/lookup/
	  *
	  * @param inTypeAdapter <string>: The adapter to be used, see local var adapters
	  * @param inId <string>: The unique identifier for the element that we want to obtain
	  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
	  * @param inCallBack <function>: The function to be called when the request success
	  *
	  * @return <mixed>:
	  *	XMLHttpRequest object: If the query is not cached
	  *	null: The query is cached, and we don't need to do the request again
	  */
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
	  * Perare and do the search request to eh API.
	  * @see http://developer.spotify.com/en/metadata-api/search/
	  *
	  * @param inCallBack <string>: The type of search that we are doing, used only for the cache key
	  * @param inQuery <string>: Query string that we want to do
	  * @param inPage <int>: The number of page to be loaded
	  * @param inAdapter <string>: The name of the adapter to be used, see local var adapters
	  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
	  * @param inCallBack <function>: The function to be called when the request success
	  *
	  * @return <mixed>:
	  *	XMLHttpRequest object: If the query is not cached
	  *	null: The query is cached, and we don't need to do the request again
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
		/**
		  * Used to get a list of albums from a given string
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.searchAlbum to know the structure used on the callback function
		  *
		  * @param inSearchStr <str>: The search string
		  * @param inPage <int>: The page number to be loaded
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		searchAlbums: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('album', inSearchStr, inPage, 'searchAlbum', inAsync, inCallBack);
		},

		/**
		  * Used to get a list of artists from a given string
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.searchArtist to know the structure used on the callback function
		  *
		  * @param inSearchStr <str>: The search string
		  * @param inPage <int>: The page number to be loaded
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		searchArtists: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('artist', inSearchStr, inPage, 'searchArtist', inAsync, inCallBack);
		},

		/**
		  * Used to get a list of tracks from a given string
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.searchTrack to know the structure used on the callback function
		  *
		  * @param inSearchStr <str>: The search string
		  * @param inPage <int>: The page number to be loaded
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		searchTracks: function(inSearchStr, inPage, inAsync, inCallBack) {
			return doApiSearchRequest('track', inSearchStr, inPage, 'searchTrack', inAsync, inCallBack);
		},

		/**
		  * Factory method, depends of the inType parameter loads a kind of info, the structure used for the
		  * inCallBack function will be always the same, this methos id always asynchronous
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.autocompleteAlbumSearch, adapter.autocompleteArtistSearch,
		  *	adapter.autocompleteTrackSearch to know the structure used on the callback function
		  *
		  * @param inType <str>: The type of item to be searched for
		  * @param inSearchStr <str>: The search string
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
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

		/**
		  * Returns the complete information about the album with the unique identifier inAlbumId
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.album to know the structure used on the callback function
		  *
		  * @param inAlbumId <str>: Unique identifier of the album
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		getAlbumInfo: function(inAlbumId, inAsync, inCallBack) {
			return doApiLookupRequest('album', inAlbumId, inAsync, inCallBack);
		},

		/**
		  * Returns the complete information about the artist with the unique identifier inArtistId
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.artist to know the structure used on the callback function
		  *
		  * @param inArtistId <str>: Unique identifier of the artist
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		getArtistInfo: function(inArtistId, inAsync, inCallBack) {
			return doApiLookupRequest('artist', inArtistId, inAsync, inCallBack);
		},

		/**
		  * Do the query to the API and after process all call to the passed inCallBack function
		  * @see local var adapter.track to know the structure used
		  *
		  * @param inTrackId <str>: Unique identifier of the track
		  * @param inAsync <bool>: If true the call will be asynchronous, if false synchronous
		  * @param inCallBack <function>: The function to be called when the request success
		  *
		  * @return <mixed>:
		  *	XMLHttpRequest object: If the query is not cached
		  *	null: The query is cached, and we don't need to do the request again
		  */
		getTrackInfo: function(inTrackId, inAsync, inCallBack) {
			return doApiLookupRequest('track', inTrackId, inAsync, inCallBack);
		}
	};
})();
