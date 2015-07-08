$(function() {
	function sendEvent(category, action, label, value) {
		if (!_.isString(category) || !_.isString(action)) {
			return;
		}

		// classic tracking
		//var args = ['_trackEvent'];
		// universal tracking
		var args = ['send', 'event'];
	
		args.push(category, category + "/" + action);
		if (_.isNumber(label) && _.isUndefined(value)) {
			value = label;
			label = "number";
		}
		else if (_.isUndefined(label) && _.isNumber(value)) {
			label = "number";
		}
		if (!_.isUndefined(label)) {
			args.push(label.toString());
		}
		if (!_.isUndefined(value)) {
			args.push(parseInt(value, 10));
		}
		// classic tracking
		//_gaq.push(args);
		// universal tracking
		ga.apply(this, args);
	}

	function attachGoogleEventToElements(selector, eventCategory, eventAction) {
		$(document.body).on("click", selector, function(e) {
			sendEvent(eventCategory, eventAction, $(this).attr("href"));
		});
	}

	attachGoogleEventToElements("a[href^='https://tv.nrk.no']", "link", "tv.nrk.no");
});
