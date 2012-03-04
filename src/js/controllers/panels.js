var PanelsObj_Controller = (function () {
	var createLinks = function(inHtml) {
		var divContainer = document.createElement("div");
		divContainer.innerHTML = inHtml;

		var links = divContainer.getElementsByClassName('info_link');

		for (link in links) {
			links[link].onclick = function() {
				PanelsObj_Controller.showDetails(this.getAttribute('type'), this.getAttribute('href'));

				return false;
			};
		}

		return divContainer;
	};

	return {
		showDetails: function(inType, inId) {
			var controller = null;

			switch (inType) {
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

			view = createLinks(controller.getDetailView());

			document.getElementById('details_div').innerHTML = '';
			document.getElementById('details_div').appendChild(view);
		},

		bootstrap: function() {
			SearchBox_Controller.bootstrap();
		}
	};
})();
