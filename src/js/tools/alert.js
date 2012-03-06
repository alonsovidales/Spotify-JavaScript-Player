/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-05
  *
  * Creates a pop-up with the inHtml rendered as content,
  * and a pair of optional buttons
  *
  * @param inHtml <string>: The html content to render inside the window
  * @param inSubmitButtonText Optional <string>: The text for the submit button,
  *	if is omited, don't render the button
  * @param inCancelButtonText <string>: The text for the cancel button
  * @param inCallBack <function>: The funciton to be called when the user do click
  *	on the submit button
  */

var Alert_Tool = (function(inHtml, inSubmitButtonText, inCancelButtonText, inCallBack) {
	var my = {
		constructor: function(inHtml, inSubmitButtonText, inCallBack) {
			var divAlert = document.createElement("div");
			var submitButton = document.createElement("button");
			var cancelButton = document.createElement("button");
			var body = document.getElementsByTagName('body')[0];

			divAlert.classList.add('alert_pop_up');

			divAlert.innerHTML = inHtml;

			// Check if the submit text is defined, and if it is, create the button
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
		}
	};

	my.constructor(inHtml, inSubmitButtonText, inCallBack);
});
