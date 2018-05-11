# System1 CMP Loader

The System1 CMP Loader is a shim around the [appnexus-cmp](https://github.com/appnexus/cmp); it aims to improve installation, integration, and management of the underlying CMP and to allow us to swap out the underlying CMP at a later date.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Terminology](#terminology)
- [System1 CMP Loader API](#system1-cmp-loader-api)
  - [Arguments](#arguments)
  - [Commands](#commands)
  - [Events](#events)
- [CMPJS Installation](#cmpjs-installation)
  - [Inline JS Installation](#inline-js-installation)
    - [1. Bootstrap CMPJS with a small inline script](#1-bootstrap-cmpjs-with-a-small-inline-script)
    - [2. Start calling commands and integrating](#2-start-calling-commands-and-integrating)
  - [CMPJS Imports](#cmpjs-imports)
- [Contributing](#contributing)
  - [Deploy](#deploy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Terminology

| Term | Description |
| --- | --- |
| CMP Loader | System1 CMP loader or container. Provides API shell, loader, initializer for actual CMP |
| CMP | Consent Management Platform implementation detail and UI ([appnexus-cmp](https://github.com/appnexus/cmp), quantcast-cmp) |

# Installation

There are 3 ways to install and use the System1 CMP Loader depending on your needs.

## Quick Start: Install With Script tag

```
<script type="text/javascript" src="https://s.flocdn.com/cmp/s1.cmp.bundle.js"></script>
```

## Inline: Install with raw loader tag

```html
<script>!function(){let e=function(e){return window.cmp&&window.__cmp?(window.cmp.loaded=!0,window.cmp=window.__cmp,window.cmp):function(o,c,n,m,p,d){return console.log(0),o.__cmp=o.cmp=o.cmp||function(e,c,n){return o.__cmp!==o.cmp?(console.log(1),o.__cmp.loaded=!0,o.cmp=o.__cmp,o.cmp.apply(this,arguments)):o.cmp.processCommand&&"function"==typeof o.cmp.processCommand?(console.log(2),void o.cmp.processCommand.apply(this,arguments)):(console.log(3),new Promise(m=>{(o.cmp.commandQueue=o.cmp.commandQueue||[]).push({command:e,parameter:c,callback:()=>m(n())})}))},e&&(p=c.createElement("script"),d=c.getElementsByTagName("script")[0],p.async=1,p.src=e,d.parentNode.insertBefore(p,d)),o.cmp}(window,document)};"undefined"!=typeof module&&void 0!==module.exports?module.exports=e():"function"==typeof define&&define.amd?define([],()=>e()):e("./s1.cmp.bundle.js")}();</script>

<script>

</script>

```


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

# CMPJS Installation

## Inline JS Installation

### 1. Bootstrap CMPJS with a small inline script

You can drop the following `<script>` on your project to create a loader and placeholder that will queue commands until the CMP loads.

```
// In an HTML File

<script>!function(){let e=function(e){return window.cmp&&window.__cmp?(window.cmp.loaded=!0,window.cmp=window.__cmp,window.cmp):function(o,c,n,m,p,d){return console.log(0),o.__cmp=o.cmp=o.cmp||function(e,c,n){return o.__cmp!==o.cmp?(console.log(1),o.__cmp.loaded=!0,o.cmp=o.__cmp,o.cmp.apply(this,arguments)):o.cmp.processCommand&&"function"==typeof o.cmp.processCommand?(console.log(2),void o.cmp.processCommand.apply(this,arguments)):(console.log(3),new Promise(m=>{(o.cmp.commandQueue=o.cmp.commandQueue||[]).push({command:e,parameter:c,callback:()=>m(n())})}))},e&&(p=c.createElement("script"),d=c.getElementsByTagName("script")[0],p.async=1,p.src=e,d.parentNode.insertBefore(p,d)),o.cmp}(window,document)};"undefined"!=typeof module&&void 0!==module.exports?module.exports=e():"function"==typeof define&&define.amd?define([],()=>e()):e("./s1.cmp.bundle.js")}();</script>

```

### 2. Start calling commands and integrating

GDPR requires the CMP API to be accessible through `window.__cmp`. We've found the dangling `__` breaks most ESLINT rules, so we've made the API available in `__cmp` and `cmp` interchangeably.

```
<script>
cmp("init", {
  logging: true
}, function () {
  console.log("callback fires after initialization is complete.")
  cmp("showConstentTool");
})

cmp("addEventListener", "isLoaded", () => {
  console.log("callback after isLoaded event");
});
</script>
```


## CMPJS Imports

Alternatively, you can import CMPJS into your JavaScript project.
```shell
$ yarn add system1-cmp
```

```js
import {cmp} from "system1-cmp";

cmp("init", {
  logger: true
}, () => {
  cmp("showConstentTool");
})
```

# Contributing

## Deploy

```
aws s3 cp --recursive build/  s3://s1-layout-cdn/cmp
```
