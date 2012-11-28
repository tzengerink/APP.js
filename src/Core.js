/*!
 * APP.js
 * ------
 * Copyright (c) 2012, T. Zengerink
 * https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
var APP = APP || {};

/* CORE
 * ----
 * Core utilities for the application.
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
(function(APP, win, doc){

	var Core = {},
		cnf = {
			baseUri            : "",
			debug              : false,
			moduleStartMethod  : "start",
			moduleStopMethod   : "stop",
			namespaceDelimiter : "."
		};

	// @param   {object}  Destination object
	// @param   {object}  Source object
	// @return  {object}  Extended object
	var extend = function( obj, source ) {
		for (var key in source) {
			obj[key] = source[key];
		}
		return obj;
	};

	// @param   {mixed}  Key if getting data, object when setting data
	// @return  {mixed}  Value for requested key or entire object
	var config = function( data ){
		if (typeof data === "string") {
			return cnf[data];
		} else if (typeof data === "object") {
			return extend(cnf, data);
		}
		return cnf;
	};

	// @param   {string}  Namespace
	// @return  {string}  Module name
	var getModuleName = function( ns ){
		return ns.split(cnf.namespaceDelimiter).pop();
	};

	// @param   {string}  Module string
	// @return  {object}  Namespace
	var getNameSpace = function( ns ){
		var arr = ns.split(cnf.namespaceDelimiter);
		arr.pop();
		return namespaceFactory(arr.join(cnf.namespaceDelimiter));
	};

	// @param  {object}   Module object
	// @param  {boolean}  Start/stop all submodules (default true)
	var handleSubmodules = function( module, start ) {
		var method = start !== false ? cnf.moduleStartMethod : cnf.moduleStopMethod;
		for (var prop in module) {
			if (typeof module[prop] === "object" && prop.charAt(0) === prop.charAt(0).toUpperCase()) {
				if (prop !== "Core" && module[prop].hasOwnProperty(method)) {
					module[prop][method].call();
				}
				handleSubmodules(module[prop], start);
			}
		}
	};

	// @param   {string}  Namespace string
	// @return  {object}  Namespace
	var namespaceFactory = function( ns ){
		var i = 0,
			s = ns.split(cnf.namespaceDelimiter),
			o = this;
		for (; i < s.length; i++) {
			o[s[i]] = o[s[i]] || {};
			o = o[s[i]];
		}
		return o;
	};

	// @param  {string}    Namespace
	// @param  {array}     Dependancies (optional)
	// @param  {function}  Module
	var module = (function(){
		return function( ns, dep, fn ){
			if (typeof fn === "undefined") {
				fn = dep;
				dep = [];
			}
			var moduleName = getModuleName(ns),
				namespace = getNameSpace(ns),
				module = (typeof fn === "function") ? fn.apply(this, dep) : fn;
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

	// Start application and all submodules.
	// @param  {object}  Application configuration
	var start = function( obj ){
		config(obj);
		handleSubmodules(APP);
	};

	// Stop all submodules by calling their stop method.
	var stop = function(){
		handleSubmodules(APP, false);
	};

	// Assist in binding event listeners. Bind event listeners in a cross browser
	// compatible way.
	Core.Events = (function(){
		var Events = {};
		Events.addListener = function( el, e, fn ){
			if (el.addEventListener) {
				el.addEventListener(e, fn, false);
			} else if (el.attachEvent) {
				el.attachEvent("on" + e, fn);
			}
		};
		Events.removeListener = function( el, e, fn ){
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
	Core.Log = (function(){
		var Log = {};
		Log.history = [];
		Log.write = function(){
			for (var i = arguments.length; i > 0; i--) {
				Log.history.push(arguments[i - 1]);
				if (cnf.debug && win.console) {
					console.log(arguments[i - 1]);
				}
			}
		};
		return Log;
	})();

	// Assist in URL manipulation. The utility uses the `baseUri` config element
	// to determine the full site URL.
	Core.Url = (function(){
		var Url = {},
			host = win.location.host,
			protocol = win.location.protocol;
		Url.base = function(){
			return protocol + "//" + host + (cnf.baseUri.replace(/^\/|\/$/g, "") && "/" + cnf.baseUri.replace(/^\/|\/$/g, ""));
		};
		Url.site = function( uri ){
			return Url.base() + "/" + uri.replace(/^\/|\/$/g, "");
		};
		return Url;
	})();

	Core.config = config;
	Core.extend = extend;

	// Execute functions when DOM is ready loading all elements. Please be aware
	// when using iframes which are not supported.
	APP.ready = (function(){
		var fns = [],
			fn,
			docEl = doc.documentElement,
			ready = false;
		var flush = function(){
			ready = true;
			while (f = fns.shift()) f();
		};
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
		Core.Events.addListener(doc, "DOMContentLoaded", fn = function(){
			Core.Events.removeListener(doc, "DOMContentLoaded", fn);
			flush();
		});
		return function( fn ){
			ready ? fn() : fns.push(fn);
		};
	})();

	APP.module = module;
	APP.start = start;
	APP.stop = stop;
	APP.Core = Core;

	win.log = Core.Log.write;

})(APP, window, document);
