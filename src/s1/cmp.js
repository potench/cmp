// __cmp('setConsentUiCallback', callback) QUANTCAST
import cmp from '../loader';
import {init} from '../lib/init';
import log from '../lib/log';
import {readCookie, writeCookie} from "../lib/cookie/cookie";

const GDPR_OPT_IN_COOKIE = "gdpr_opt_in";
const GDPR_OPT_IN_COOKIE_MAX_AGE = 33696000;

const defaultConfig = {
	logging: false
};

const initialize = (config, callback) => {
	init(config, cmp).then(() => {
		checkConsent(callback); //
	});
};

const checkHasConsentedAll = ({ purposeConsents } = {}) => {
	const hasAnyPurposeDisabled = Object.keys(purposeConsents).find(key => {
		return purposeConsents[key] === false;
	});
	return !hasAnyPurposeDisabled;
};

const checkConsent = (callback = () => {}) => {
	if (!cmp.isLoaded) {
		log.error('CMP failed to load');
		handleConsentResult({
			errorMsg: 'CMP failed to load'
		});
	} else if (!window.navigator.cookieEnabled) {
		handleConsentResult({
			errorMsg: 'Cookies are disabled. Ignoring CMP consent check'
		});
	} else {
		cmp('getVendorList', null, vendorList => {
			cmp('getVendorConsents', null, vendorConsents => {
				handleConsentResult({
					vendorList,
					vendorConsents,
					callback
				});
			});
		});
	}
};

const handleConsentResult = ({
	vendorList = {},
	vendorConsents = {},
	callback,
	errorMsg = ""
}) => {
	const hasConsentedCookie = readCookie(GDPR_OPT_IN_COOKIE);
	const { vendorListVersion: listVersion } = vendorList;
	const { created, vendorListVersion } = vendorConsents;

	if (!created) {
		errorMsg = 'No consent data found. Showing consent tool';
	} else if (!listVersion) {
		errorMsg =
			'Could not determine vendor list version. Not showing consent tool';
	} else if (vendorListVersion !== listVersion) {
		errorMsg = `Consent found for version ${vendorListVersion}, but received vendor list version ${listVersion}. Showing consent tool`;
	}
	if (errorMsg) {
		log.debug(errorMsg);
	}

	if (callback && typeof callback === "function") {
		// store as 1 or 0
		const hasConsented = checkHasConsentedAll(vendorConsents) ? "1" : "0";
		writeCookie(GDPR_OPT_IN_COOKIE, hasConsented, GDPR_OPT_IN_COOKIE_MAX_AGE);
		const consent = {
			hasConsented: hasConsented === "1", // flip back to boolean
			vendorList,
			vendorConsents,
			errorMsg
		};

		callback(consent);

		if (hasConsented !== hasConsentedCookie) {
			cmp.notify('consentChanged', consent);
		}
	}
};

// initialize CMP
(() => {
	const initIndex = cmp.commandQueue && cmp.commandQueue.findIndex(({ command }) => {
		return command === 'init';
	});

	// 1. initialize call was queued from global scope (inline cmpLoader)
	if (initIndex >= 0 && cmp.commandQueue[initIndex]) {
		console.log("initalize direct");
		const [{ parameter: config, callback }] = cmp.commandQueue.splice(
			initIndex,
			1
		); // remove "init" from command list because it doesn't exist
		initialize(config, callback);

		// 2. initialize call never queued, so initialize with default Config
	} else {
		console.log("initalize auto");
		initialize(defaultConfig, result => {
			const { errorMsg } = result;
			console.log("initialzie complete", result);
			if (errorMsg) {
				log.debug(errorMsg);
				cmp('showConsentTool');
			}
		});
	}
})();
