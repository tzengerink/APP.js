/*!
 * APP.js
 * ------
 * Copyright (c) 2012, T. Zengerink
 * https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
var APP = APP || {};

/* CORE
 * ----
 * Core utilities for an application.
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
(function(APP, win, doc){
	"use strict";

	var Config, Core, Events, defaults, extend,
		getModuleName, getNameSpace, handleSubmodules, module, namespaceFactory, ready, start, stop;

	Core = {};

	defaults = {
		baseUri            : "",
		debug              : false,
		moduleStartMethod  : "start",
		moduleStopMethod   : "stop",
		namespaceDelimiter : "."
	};

	// @param   {object}  Destination object
	// @param   {object}  Source object
	// @return  {object}  Extended object
	extend = function( obj, source ) {
		for (var key in source) {
			obj[key] = source[key];
		}
		return obj;
	};

	// Assist in handling application configuration. Get and set configuration
	// items.
	Config = (function(){
		var Config, configuration;

		Config        = {};
		configuration = extend({}, defaults);

		// @param   {string}  Item key
		// @return  {mixed}   Item value
		Config.get = function( key ){
			if (typeof key === "undefined") {
				return configuration;
			} else {
				return configuration[key];
			}
		};

		// @param   {string}  Item key
		// @param   {mixed}   Item value
		// @return  {object}  Configuration
		Config.set = function( key, value ){
			if (typeof key === "object") {
				configuration = extend(configuration, key);
			}
			configuration[key] = value;
			return configuration;
		};

		return Config;
	})();

	// Assist in binding event listeners. Bind event listeners in a cross browser
	// compatible way.
	Events = (function(){
		var Events = {};

		// Add an event listener to an element
		Events.bind = function( el, e, fn ){
			if (el.addEventListener) {
				el.addEventListener(e, fn, false);
			} else if (el.attachEvent) {
				el.attachEvent("on" + e, fn);
			}
		};

		// Remove an event listener from an element
		Events.unbind = function( el, e, fn ){
			if (el.removeEventListener) {
				el.removeEventListener(e, fn, false);
			} else if (el.detachEvent) {
				el.detachEvent("on" + e, fn);
			}
		};

		return Events;
	})();

	// @param   {string}  Namespace
	// @return  {string}  Module name
	getModuleName = function( ns ){
		return ns.split(Config.get("namespaceDelimiter")).pop();
	};

	// @param   {string}  Module string
	// @return  {object}  Namespace
	getNameSpace = function( ns ){
		var arr = ns.split(Config.get("namespaceDelimiter"));
		arr.pop();
		return namespaceFactory(arr.join(Config.get("namespaceDelimiter")));
	};

	// @param  {object}   Module object
	// @param  {boolean}  Start/stop all submodules (default true)
	handleSubmodules = function( module, start ) {
		var method = start !== false ? Config.get("moduleStartMethod") : Config.get("moduleStopMethod");
		for (var prop in module) {
			if (typeof module[prop] === "object" && prop.charAt(0) === prop.charAt(0).toUpperCase()) {
				if (prop !== "Core" && module[prop].hasOwnProperty(method)) {
					module[prop][method].call();
				}
				handleSubmodules(module[prop], start);
			}
		}
	};

	// @param  {string}    Namespace
	// @param  {array}     Dependancies (optional)
	// @param  {function}  Module
	module = (function(){
		return function( ns, dep, fn ){
			var module, moduleName, namespace;

			if (typeof fn === "undefined") {
				fn = dep;
				dep = [];
			}

			moduleName = getModuleName(ns);
			namespace  = getNameSpace(ns);
			module     = (typeof fn === "function") ? fn.apply(this, dep) : fn;

			switch (typeof module) {
				case "object":
					namespace[moduleName] = extend((namespace[moduleName] || {}), module)
					break;
				default:
					namespace[moduleName] = module;
					break;
			}
		}
	})();

	// @param   {string}  Namespace string
	// @return  {object}  Namespace
	namespaceFactory = function( ns ){
		var i, s, o;

		i = 0;
		s = ns.split(Config.get("namespaceDelimiter"));
		o = this;

		for (; i < s.length; i++) {
			o[s[i]] = o[s[i]] || {};
			o = o[s[i]];
		}

		return o;
	};

	// Execute functions when DOM is ready loading all elements. Please be aware
	// when using iframes which are not supported.
	ready = (function(){
		var check, docEl, flush, fn, fns, ready;

		fns   = [];
		docEl = doc.documentElement;
		ready = false;

		// Execute all functions in the list and register that the DOM is ready.
		flush = function(){
			ready = true;
			while (f = fns.shift()) f();
		};

		// Check if the document can be scrolled. This adds the ready functionality
		// for browsers that do not support the `DOMContentLoaded`-event.
		if (docEl.doScroll) {
			var check = function(){
				try {
					docEl.doScroll("left");
					flush();
				} catch(e) {
					setTimeout(check, 10);
				}
			};
			check();
		}

		// Add an event listener to the document that watches for the
		// `DOMContentLoaded`-event.
		Events.bind(doc, "DOMContentLoaded", fn = function(){
			Events.unbind(doc, "DOMContentLoaded", fn);
			flush();
		});

		return function( fn ){
			ready ? fn() : fns.push(fn);
		};
	})();

	// Start application and all submodules.
	// @param  {object}  Application configuration
	start = function( obj ){
		Config.set(obj);
		ready(function(){
			handleSubmodules(APP);
		});
	};

	// Stop all submodules by calling their stop method.
	stop = function(){
		handleSubmodules(APP, false);
	};

	// Log application variables. It will store the variables in an history array,
	// if in debug mode the variables will be passed to the console (if possible).
	Core.Log = (function(){
		var Log = {};

		// Array containing log history.
		Log.history = [];

		// Write new arguments to the log.
		Log.write = function(){
			for (var i = arguments.length; i > 0; i--) {
				Log.history.push(arguments[i - 1]);
				if (Config.get("debug") && win.console) {
					console.log(arguments[i - 1]);
				}
			}
		};

		return Log;
	})();

	// Assist in URL manipulation. The utility uses the `baseUri` config element
	// to determine the full site URL.
	Core.Url = (function(){
		var host, protocol, Url;

		host     = win.location.host;
		protocol = win.location.protocol;
		Url      = {};

		// Get the base URL for the application
		Url.base = function(){
			return protocol + "//" + host + (Config.get("baseUri").replace(/^\/|\/$/g, "") && "/" + Config.get("baseUri").replace(/^\/|\/$/g, ""));
		};

		// Get a site URL when a URI is given.
		// @param  {string}  URI
		Url.site = function( uri ){
			return Url.base() + "/" + uri.replace(/^\/|\/$/g, "");
		};

		return Url;
	})();

	Core.extend = extend;
	Core.Config = Config;
	Core.Events = Events;

	APP.module = module;
	APP.ready = ready;
	APP.start = start;
	APP.stop = stop;
	APP.Core = Core;

	win.log = Core.Log.write;
})(APP, window, document);
