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

There are 3 ways to install and use the System1 CMP Loader depending on your needs.

## Quickstart / Synchronous Loading

```
<html>
<body>
  <script type="text/javascript" src="https://s.flocdn.com/cmp/s1.cmp.js"></script>
  <script type="text/javascript">
    cmp('addEventListener', 'cmpReady', function(result) {
      console.log("cmpReady", result);
      cmp("showConsentTool");
    });
  </script>
</body>
</html>
```

## Inline Install / Async Loading

Inline just the CMP Loader

*Work In Progress*
*(note)* this code may change to include support for Promise chaining

```html
<script>!function(){let e=function(e){return window.cmp&&window.__cmp?(window.cmp=window.__cmp,window.cmp):function(m,c,n,p,o,t){return m.__cmp=m.cmp=m.cmp||function(e,c,n){if(m.__cmp!==m.cmp)return m.cmp=m.__cmp,m.cmp.apply(this,arguments);m.cmp.processCommand&&"function"==typeof m.cmp.processCommand?m.cmp.processCommand.apply(this,arguments):(m.cmp.commandQueue=m.cmp.commandQueue||[]).push({command:e,parameter:c,callback:n})},e&&(o=c.createElement("script"),t=c.getElementsByTagName("script")[0],o.async=1,o.src=e,t.parentNode.insertBefore(o,t)),m.cmp}(window,document)};"undefined"!=typeof module&&void 0!==module.exports?module.exports=e():"function"==typeof define&&define.amd?define([],()=>e()):e("./s1.cmp.js")}();</script>
```
```
// now you can immediately queue CMP API calls
cmp('init', {
  logging: false
}, function(result) {
    console.log("init complete", result);
    cmp('showConsentTool');
});

cmp('addEventListener', 'onSubmit', function(result) {
  console.log("onSubmit", result);
});

cmp('addEventListener', 'cmpReady', function(result) {
  console.log("cmpReady", result);
});
</script>
```

## Import CMP

*Work in Progress*
*(note)* System1 CMP not published to NPM yet, will update docs when ready.

```shell
yarn add system1-cmp  
```

```js
import cmp from 'system1-cmp';

cmp("init", {
  logger: true
}, () => {
  cmp("showConstentTool");
})
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
- [ ] Allow customization of location for `pubvendors.json`


# System1 CMP Loader API

The CMP Loader API exposes access to the underlying [appnexus-cmp API](http://s.flocdn.com/cmp/docs/#/cmp-api) and externalizes configuration of the CMP.

The [underlying appnexus-cmp docs](http://s.flocdn.com/cmp/docs/#/cmp-api) contain more information on the CMP API and Event system. The docs also provide interactive demos.

## Arguments

```
cmp(command, [parameter], [callback])
```

- `command` (String): Name of the command to execute
- `[parameter]` (\*): Parameter to be passed to the command function
- `[callback]` (Function): Function to be executed with the result of the command

## Commands

- `init`
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
aws s3 cp --recursive build/  s3://s1-layout-cdn/cmp
```