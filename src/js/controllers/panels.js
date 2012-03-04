var PanelsObj_Controller = (function () {
	return {
		createLinks: function(inHtml) {
			var divContainer = document.createElement("div");
			divContainer.innerHTML = inHtml;

			var links = divContainer.getElementsByClassName('info_link');

			for (link in links) {
				links[link].onclick = function() {
					PanelsObj_Controller.showDetails(this.getAttribute('type'), this.getAttribute('href'), false, 1);
	
					return false;
				};
			}

			var paginatorLinks = divContainer.getElementsByClassName('show_more');

			for (paginator in paginatorLinks) {
				paginatorLinks[paginator].onclick = function() {
					PanelsObj_Controller.showDetails(this.getAttribute('type'), this.getAttribute('href'), true, this.getAttribute('nextpage'));
	
					return false;
				};
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
			}

			view = this.createLinks(controller.getDetailView(inPage));

			if (!inAppend) {
				document.getElementById('details_div').innerHTML = '';
			}

			document.getElementById('details_div').appendChild(view);
		},

		bootstrap: function() {
			SearchBox_Controller.bootstrap();
		}
	};
})();
