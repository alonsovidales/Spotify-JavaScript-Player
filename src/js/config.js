/**
  * @author: Alonso Vidales <alonso.vidales@tras2.es>
  * @date: 2012-03-03
  *
  * Global config object, this object will be present in all the javascript code of the app
  */

var config = {
	apiBaseUrl: 'http://ws.spotify.com/', // The base URL of the Spotify API
	templatesDir: 'views/', // The directory from where the views will be loaded
	resultsByPage: 100, // The number of results that the Spotify API provides by page
	autocompleteListLength: 15, // The max number of elements to render on the autocomplete list
	maxSongTrackNameLengthForPlayer: 18, // The max length for the track string name
	debug: false // Debug var
};
