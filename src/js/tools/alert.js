var Alert_Tool = (function(inHtml, inSubmitButtonText, inCancelButtonText, inCallBack) {
	var my = {
		constructor: function(inHtml, inSubmitButtonText, inCallBack) {
			var divAlert = document.createElement("div");
			var submitButton = document.createElement("button");
			var cancelButton = document.createElement("button");
			var body = document.getElementsByTagName('body')[0];

			divAlert.classList.add('alert_pop_up');

			divAlert.innerHTML = inHtml;

			if ((inSubmitButtonText !== undefined) && (inSubmitButtonText !== '')) {
				submitButton.addEventListener('click', function() {
					if (inCallBack()) {
						body.removeChild(divAlert);
					}
				}, false);
				divAlert.appendChild(submitButton);
				submitButton.innerHTML = inSubmitButtonText;
			}

			cancelButton.addEventListener('click', function() {
				body.removeChild(divAlert);
			}, false);
			cancelButton.innerHTML = inCancelButtonText;
			divAlert.appendChild(cancelButton);

			body.appendChild(divAlert);
			console.log(divAlert);
		}
	};

	my.constructor(inHtml, inSubmitButtonText, inCallBack);
});
