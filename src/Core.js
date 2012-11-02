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
(function(APP, win){

	var Core = {},
		cnf = {
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
		if (typeof data === "undefined") {
			return cnf;
		} else if (typeof data === "object") {
			cnf = extend(cnf, data);
			return cnf;
		} else {
			return cnf[data];
		}
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

	// Start all submodules, passing the given arguments to the
	// configuration method.
	var start = function( obj ){
		config(obj);
		handleSubmodules(APP);
	};

	// Stop all submodules by calling their stop method.
	var stop = function(){
		handleSubmodules(APP, false);
	};

	// PUBLIC
	// ------

	// Log application variables. It will store the variables in an history array,
	// if in debug mode the variables will be passed to the console (if possible).
	Core.Log = (function(){
		var log = {};
		log.history = [];
		log.write = function(){
			for (var i = arguments.length; i > 0; i--) {
				log.history.push(arguments[i - 1]);
				if (cnf.debug && win.console) {
					console.log(arguments[i - 1]);
				}
			}
		};

		return log;
	})();

	// Utilities for core and common operations.
	Core.Utils = (function(){
		var utils = {};
		utils.extend = extend;
		return utils;
	})();

	// @param  {string}    Namespace
	// @param  {array}     Dependancies (optional)
	// @param  {function}  Module
	Core.define = (function(){
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

	// SETUP
	// -----

	win.define = Core.define;
	win.log = Core.Log.write;

	APP.config = config;
	APP.start = start;
	APP.stop = stop;

	APP.Core = Core;

})(APP, window);
