# System1 CMP Loader

The System1 CMP Loader is a shim around the [appnexus-cmp](https://github.com/appnexus/cmp); it aims to improve installation, integration, and management of the underlying CMP and to allow us to swap out the underlying CMP at a later date.

[Complete Docs Are a Work In Progress](http://s.flocdn.com/cmp/docs/#/)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Terminology](#terminology)
- [Installation](#installation)
  - [Quick Start: Install With Script tag](#quick-start-install-with-script-tag)
  - [Inline: Install with raw loader tag](#inline-install-with-raw-loader-tag)
  - [Import CMP](#import-cmp)
- [Roadmap](#roadmap)
- [System1 CMP Loader API](#system1-cmp-loader-api)
  - [Arguments](#arguments)
  - [Commands](#commands)
  - [Events](#events)
  - [Deploy](#deploy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Terminology

| Term | Description |
| --- | --- |
| CMP Loader | System1 CMP loader or container. Provides API shell, loader, initializer for actual CMP |
| CMP | Consent Management Platform implementation detail and UI ([appnexus-cmp](https://github.com/appnexus/cmp), quantcast-cmp) |

# Installation

The CMP Loader provides a shim to the CMP SDK. Use the CMP Loader to queue commands and events asynchronously to the CMP SDK.

## Quickstart

```
<html>
<body>
  <script type="text/javascript" src="https://s.flocdn.com/cmp/cmp.loader.js"></script>
  <script type="text/javascript">
		cmp('init', {
			scriptSrc: './s1.cmp.js',
			countryCode: 'us',
			logging: false,
			customPurposeListLocation: './purposes.json',
			globalVendorListLocation: 'https://vendorlist.consensu.org/vendorlist.json',
			pubVendorListLocation: 'https://s.flocdn.com/cmp/pubvendors.json',
			globalConsentLocation: './portal.html',
			storeConsentGlobally: false,
			storePublisherData: false,
			localization: {},
			forceLocale: null,
			gdprApplies: true,
			allowedVendorIds: null
		}, (result) => {
			console.log("initialization complete");
		});

		cmp('addEventListener', 'isLoaded', function(result) {
				console.log("isLoaded", result);
		});

		cmp('addEventListener', 'onSubmit', function(result) {
				console.log("onSubmit", result);
		});
  </script>
</body>
</html>
```

# Roadmap

The goal is to provide a CMP loader that acts as an SDK for integrating the CMP with your website where you might need more support listening for sideEffects.

- [x] Provide a CMP loader that maintains CMP scope after loading
- [x] Allow `import` of CMP so it can be included in another CMP project as an SDK
- [x] Allow CMP Loader to be directly inlined for immediate use.
- [x] Expose `init` function to allow for dynamic configuration
- [ ] Update `commands` to return Promises
- [ ] Publish to NPM for import support
- [x] Set cookie `gdpr_opt_in` as boolean for user consent to all Purposes/Vendors or not
- [ ] Add `consentChanged` event to trigger change in consent
- [x] Allow customization of location for `pubvendors.json`


# CMP Loader API

The CMP Loader exposes access to the underlying CMP SDK: [appnexus-cmp API](http://s.flocdn.com/cmp/docs/#/cmp-api) and externalizes configuration of the CMP SDK.

## init

You must call `init` explicitly to start the CMP. Otherwise, the CMP Loader will only queue commands and not initialize the CMP SDK.

 * `config` is REQUIRED
 * `callback` is OPTIONAL

```
cmp('init', config, callback);
```

### init: config

`config` is a required argument of `init`. It allows us to configure/customize the CMP.

Example Configuration:

```
const config = {
	scriptSrc: '//s.flocdn.com/cmp/s1.cmp.js',
  countryCode: 'ES',
	logging: false,
	customPurposeListLocation: './purposes.json',
	globalVendorListLocation: 'https://vendorlist.consensu.org/vendorlist.json',
	pubVendorListLocation: 'https://s.flocdn.com/cmp/pubvendors.json',
	globalConsentLocation: './portal.html',
	storeConsentGlobally: false,
	storePublisherData: false,
	localization: {},
	forceLocale: null,
	gdprApplies: true,
	allowedVendorIds: null
}
cmp('init', config);
```

- `scriptSrc`: Required: location of CMP SDK.
- `countryCode`: Required: This is the user's country code. CMP Loader will only load the CMP SDK if the country code is in the EU.
- `pubVendorListLocation`: OPTIONAL: location of pub vendor list
- `globalVendorListLocation`: OPTIONAL: global vendorlist is managed by the IAB.

### init: callback

Use the callback to determine if you should show the consent tool or not.

- `errorMsg`: STRING // detail on the result CMP initializing
- `consentRequired`: BOOLEAN // true if in EU, false if consent not required
- `hasConsented`: BOOLEAN // true if use has consented to all permissions
- `vendorConsents`: OBJECT
- `vendorList`: OBJECT

Callback Example

```
<script type="text/javascript" src="https://s.flocdn.com/cmp/cmp.loader.js"></script>

cmp('init', {
	  countryCode: "ES",
	  scriptSrc: '//s.flocdn.com/cmp/s1.cmp.js'
  }, (result) => {

		// Consent is required and there was an error
	  if (result.consentRequired && result.errorMsg) {
		  cmp('showConsentTool');
	  }

		// Consent is required and a user has not consented to all permissions
		if (!result.consentRequired && !result.hasConsented) {
			cmp('showConsentTool');
		}
});
```

## Arguments

```
cmp(command, [parameter], [callback])
```

- `command` (String): Name of the command to execute
- `[parameter]` (\*): Parameter to be passed to the command function
- `[callback]` (Function): Function to be executed with the result of the command

## Possible Commands

- `init` REQUIRED, can only be called once
- `addEventListener`
- `removeEventListener`
- `showConsentTool`

- `getVendorConsents`
- `getPublisherConsents`
- `getConsentData`
- `getVendorList`


## Events

- `isLoaded`
- `cmpReady`
- `onSubmit`


# Deploy

```
yarn deploy
```
