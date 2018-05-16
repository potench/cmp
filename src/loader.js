
/**
 * creates and manages global cmp and __cmp objects on window
 * cmp queues incoming requests
 * once loaded, cmp invokes cmp.processCommand()
 */
(function() {
	var countries = [
		'AT',
		'BE',
		'BG',
		'HR',
		'CY',
		'CZ',
		'DK',
		'EE',
		'FI',
		'FR',
		'DE',
		'GR',
		'HU',
		'IE',
		'IT',
		'LV',
		'LT',
		'LU',
		'MT',
		'NL',
		'PL',
		'PT',
		'RO',
		'SK',
		'SI',
		'ES',
		'SE',
		'GB',
		'US' // FIXME @charden remove
	];
	var log = function(shouldLog, msg) {
		return shouldLog && window.console && window.console.log && window.console.log(msg);
	};

	var cmpLoader = (function(cmp, __cmp) {
		var countryCode = 'countryCode',
				logging = 'logging',
				scriptSrc = 'scriptSrc';

		return function(isModule) {
			// 1. already exists, start queueing requests
			if (window[cmp] && window[__cmp]) {
				// window[cmp] = window[__cmp];
				return window[cmp];
			}

			// 2. create global cmp / __cmp request queues
			return (function(
				window,
				document,
				script,
				commandQueue,
				scriptEl,
				scriptParentEl
			) {
				window[__cmp] = window[cmp] =
					window[cmp] ||
					function(command, parameter, callback) {
						if (window[__cmp] !== window[cmp]) {
							// __cmp takes over here
							window[cmp] = window[__cmp];
							return window[cmp].apply(this, arguments);
						}

						// initialization is done update processCommand
						if (
							window[cmp]['processCommand'] &&
							typeof window[cmp]['processCommand'] === 'function'
						) {
							window[cmp]['processCommand'].apply(this, arguments);
						} else {
							// if 'init', then we need to load the seed file
							if (command === 'init') {
								if (scriptEl) {
									return log(parameter[logging], "CMP Error: Only call init once.");
								}
								if (!parameter || !parameter[scriptSrc]) {
									return log(parameter[logging], "CMP Error: Provide src to load CMP. cmp('init', { scriptSrc: './cmp.js'})");
								}
								if (parameter[countryCode] && countries.indexOf(parameter[countryCode].toUpperCase()) === -1) {
									var errorMsg = "CMP Log: \"" + (parameter[countryCode] ? parameter[countryCode].toUpperCase() : "NA") + "\": Country Code provided does not need CMP";
									if (callback && typeof callback === "function") {
										callback.apply(this, [{
											errorMsg: errorMsg,
											hasConsented: false,
											consentRequired: false
										}]);
									}
									return log(parameter[logging], errorMsg);
								}
								(scriptEl = document.createElement(script)),
								scriptEl.async = 1;
								scriptEl.src = parameter[scriptSrc];
								document.body.appendChild(scriptEl);
							}
							(window[cmp][commandQueue] =
								window[cmp][commandQueue] || []).push({
								command,
								parameter,
								callback
							});
						}
					};
				// 4. return temporay cmp command queue
				return window[cmp];
			})(window, document, 'script', 'commandQueue');
		};
	})('cmp', '__cmp');

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = cmpLoader(true);
	} else if (typeof define === 'function' && define.amd) {
		define([], () => {
			return cmpLoader(true);
		});
	} else {
		cmpLoader(false); // External script defined here for ease of use
	}
})();
