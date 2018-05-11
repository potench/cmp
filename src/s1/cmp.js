// __cmp('setConsentUiCallback', callback) QUANTCAST
import cmp from './embed';
import log from '../lib/log';
import { init } from '../lib/init';

const config = {
	logging: true
};

const checkConsentAll = ({ purposeConsents } = {}) => {
	const hasPurposeDisabled = Object.keys(purposeConsents).find(key => {
		return purposeConsents[key] === false;
	});
	log.debug("hasPurposeDisabled", hasPurposeDisabled);
	return !hasPurposeDisabled;
};

const handleConsentResult = ({
	vendorList = {},
	vendorConsents = {},
	callback,
	errorMsg = ""
}) => {
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
		callback({
			hasConsented: checkConsentAll(vendorConsents),
			vendorList,
			vendorConsents,
			errorMsg
		});
	}
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
		cmp('getVendorList', undefined, vendorList => {
			cmp('getVendorConsents', undefined, vendorConsents => {
				handleConsentResult({
					vendorList,
					vendorConsents,
					callback
				});
			});
		});
	}
};

const initialize = (config, callback) => {
	init(config, cmp).then(() => {
		checkConsent(callback); //
	});
};

// initialize CMP
(() => {
	const initIndex = cmp.commandQueue && cmp.commandQueue.findIndex(({ command }) => {
		return command === 'init';
	});

	// 1. initialize call was queued from global scope
	if (initIndex >= 0 && cmp.commandQueue[initIndex]) {
		const [{ parameter: config, callback }] = cmp.commandQueue.splice(
			initIndex,
			1
		); // remove "init" from command list
		initialize(config, callback);

		// 2. initialize call never queued, so initialize with default Config
	} else {
		initialize(config, result => {
			const { errorMsg } = result;
			if (errorMsg) {
				log.debug(errorMsg);
				cmp('showConsentTool');
			}
		});
	}
})();
