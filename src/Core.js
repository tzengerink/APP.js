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

	var Core, defaults, extend, Config, Events, Log, Url,
		getModuleName, getNameSpace, handleSubmodules, module, namespaceFactory,
		ready, start, stop;

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
		var key;

		for (key in source) {
			if (source.hasOwnProperty(key)) {
				obj[key] = source[key];
			}
		}

		return obj;
	};

	// Assist in handling application configuration. Get and set configuration
	// items.
	Config = (function(){
		var Config = {},
			config = extend({}, defaults);

		// @param   {string}  Item key
		// @return  {mixed}   Item value
		Config.get = function( key ){
			if (key === undefined) {
				return config;
			}
			return config[key];
		};

		// @param   {string}  Item key
		// @param   {mixed}   Item value
		// @return  {object}  Configuration
		Config.set = function( key, value ){
			if (typeof key === "object") {
				config = extend(config, key);
			}
			config[key] = value;
			return config;
		};

		return Config;
	})();

	// Assist in binding event listeners. Bind event listeners in a cross browser
	// compatible way.
	Events = (function(){
		var Events = {};

		// @param  {object}    Document element
		// @param  {string}    Event name
		// @param  {function}  Callback
		Events.bind = function( el, e, fn ){
			if (el.addEventListener) {
				el.addEventListener(e, fn, false);
			} else if (el.attachEvent) {
				el.attachEvent("on" + e, fn);
			}
		};

		// @param  {object}    Document element
		// @param  {string}    Event name
		// @param  {function}  Callback
		Events.unbind = function( el, e, fn ){
			if (el.removeEventListener) {
				el.removeEventListener(e, fn, false);
			} else if (el.detachEvent) {
				el.detachEvent("on" + e, fn);
			}
		};

		return Events;
	})();

	// Log application variables. It will store the variables in an history array,
	// if in debug mode the variables will be passed to the console (if possible).
	Log = (function(){
		var Log, i;

		Log = {};

		// Array containing log history.
		Log.history = [];

		// Write new arguments to the log.
		Log.write = function(){
			for (i = arguments.length; i > 0; i--) {
				Log.history.push(arguments[i - 1]);
				if (Config.get("debug") && win.console) {
					win.console.log(arguments[i - 1]);
				}
			}
		};

		return Log;
	})();

	// Assist in URL manipulation. The utility uses the `baseUri` config element
	// to determine the full site URL.
	Url = (function(){
		var Url, host, protocol, strip;

		Url      = {};
		host     = win.location.host;
		protocol = win.location.protocol;

		// Strip leading and trailing slashes
		strip = function( str ){
			return str.replace(/^\/|\/$/g, "");
		};

		// Get the base URL for the application
		Url.base = function(){
			return [
				protocol, "//", host, (strip(Config.get("baseUri")) ? "/" : ""),
				strip(Config.get("baseUri"))
			].join("");
		};

		// Get a site URL when a URI is given.
		// @param  {string}  URI
		Url.site = function( uri ){
			return [Url.base(), "/", strip(uri)].join("");
		};

		return Url;
	})();

	// @param   {string}  Namespace
	// @return  {string}  Module name
	getModuleName = function( ns ){
		return ns.split(Config.get("namespaceDelimiter")).pop();
	};

	// @param   {string}  Module string
	// @return  {object}  Namespace
	getNameSpace = function( ns ){
		return namespaceFactory(ns.split(Config.get("namespaceDelimiter"))
			.slice(0, -1).join(Config.get("namespaceDelimiter")));
	};

	// @param  {object}   Module object
	// @param  {boolean}  Start/stop all submodules (default true)
	handleSubmodules = function( module, start ) {
		var isModule, prop, method;

		// Start or stop all submodules
		method = start !== false ? Config.get("moduleStartMethod") : Config.get("moduleStopMethod");

		// @param  {mixed}    Module property
		// @param  {boolean}  Propery is a module
		isModule = function( prop ){
			return typeof module[prop] === "object" && prop.charAt(0) === prop.charAt(0).toUpperCase();
		};

		// Check all properties of a module, if it is the start/stop method, then
		// Execute it.
		for (prop in module) {
			if (module.hasOwnProperty(prop) && isModule(prop)) {
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
	module = function( ns, dep, fn ){
		if (fn === undefined) {
			fn  = dep;
			dep = [];
		}

		var moduleName = getModuleName(ns),
			namespace  = getNameSpace(ns),
			module     = (typeof fn === "function") ? fn.apply(this, dep) : fn;

		namespace[moduleName] = module;

		if (typeof module === "object") {
			namespace[moduleName] = extend((namespace[moduleName] || {}), module);
		}
	};

	// @param   {string}  Namespace string
	// @return  {object}  Namespace
	namespaceFactory = function( ns ){
		var i = 0,
			s = ns.split(Config.get("namespaceDelimiter")),
			o = this;

		for (i; i < s.length; i++) {
			o[s[i]] = o[s[i]] || {};
			o = o[s[i]];
		}

		return o;
	};

	// Execute functions when DOM is ready loading all elements. Please be aware
	// when using iframes which are not supported.
	ready = (function(){
		var check, docEl, flush, fn, fns, i, ready;

		fns   = [];
		docEl = doc.documentElement;
		ready = false;

		// Execute all functions in the list and register that the DOM is ready.
		flush = function(){
			ready = true;
			for (i = fns.length; i > 0; i--) {
				fns[i]();
			}
		};

		// Check if the document can be scrolled. This adds the ready functionality
		// for browsers that do not support the `DOMContentLoaded`-event.
		if (docEl.doScroll) {
			check = function(){
				try {
					docEl.doScroll("left");
					flush();
				} catch(e) {
					win.setTimeout(check, 10);
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
			if (ready) {
				fn();
			} else {
				fns.push(fn);
			}
		};
	})();

	// Start application and all submodules.
	// @param  {object}  Application configuration
	start = function( obj ){
		Config.set(obj);

		// Start all submodules when DOM is ready.
		ready(function(){
			handleSubmodules(APP);
		});
	};

	// Stop all submodules by calling their stop method.
	stop = function(){
		handleSubmodules(APP, false);
	};

	Core.extend = extend;
	Core.Config = Config;
	Core.Events = Events;
	Core.Log    = Log;
	Core.Url    = Url;

	APP.module  = module;
	APP.ready   = ready;
	APP.start   = start;
	APP.stop    = stop;
	APP.Core    = Core;

	win.log     = Core.Log.write;
})(APP, window, document);
