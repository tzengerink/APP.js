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
		config = {
			debug              : false,
			moduleStartMethod  : "start",
			moduleStopMethod   : "stop",
			nameSpaceDelimiter : "."
		};

	// @param  {string}    Namespace
	// @param  {array}     Dependancies (optional)
	// @param  {function}  Module
	var define = (function(){
		var extend = function( src, des ){
			for (var key in des) {
				src[key] = des[key];
			}
			return src;
		};
		var getModuleName = function( ns ){
			return ns.split(config.nameSpaceDelimiter).pop();
		};
		var getNameSpace = function( ns ){
			var arr = ns.split(config.nameSpaceDelimiter);
			arr.pop();
			return factory(arr.join(config.nameSpaceDelimiter));
		};
		var factory = function( ns ){
			var i = 0,
				s = ns.split(config.nameSpaceDelimiter),
				o = this;
			for (; i < s.length; i++) {
				o[s[i]] = o[s[i]] || {};
				o = o[s[i]];
			}
			return o;
		};
		return function( ns, dep, fn ){
			if (typeof fn === "undefined") {
				fn = dep;
				dep = [];
			}
			var moduleName = getModuleName(ns),
				nameSpace = getNameSpace(ns),
				module = (typeof fn === "function") ? fn.apply(this, dep) : fn;
			switch (typeof module) {
				case "object":
					nameSpace[moduleName] = extend((nameSpace[moduleName] || {}), module)
					break;
				default:
					nameSpace[moduleName] = module;
					break;
			}
		}
	})();

	// @param  {object}   Module object
	// @param  {boolean}  Start/stop all submodules (default true)
	var handleSubmodules = function( module, start ) {
		var method = start !== false ? config.moduleStartMethod : config.moduleStopMethod;
		for (var prop in module) {
			if (typeof module[prop] === "object" && prop.charAt(0) === prop.charAt(0).toUpperCase()) {
				if (prop !== "Core" && module[prop].hasOwnProperty(method)) {
					module[prop][method].call();
				}
				handleSubmodules(module[prop], start);
			}
		}
	};

	// PUBLIC
	// ------

	// @param   {string}  Key (optional)
	// @param   {mixed}   Value (optional)
	// @return  {mixed}   Value for requested key or entire object
	Core.config = function( key, value ){
		if (typeof value !== "undefined") {
			config[key] = value;
		}
		if (typeof key === "object") {
			for (var k in key) {
				config[k] = key[k];
			}
		} else if (typeof config[key] !== "undefined") {
			return config[key];
		}
		return config;
	};

	// Log application variables. It will store the variables in an history array,
	// if in debug mode the variables will be passed to the console (if possible).
	Core.Log = (function(){
		var log = {};
		log.history = [];
		log.write = function(){
			for (var i = arguments.length; i > 0; i--) {
				log.history.push(arguments[i - 1]);
				if (config.debug && win.console) {
					console.log(arguments[i - 1]);
				}
			}
		};
		return log;
	})();

	// Start or stop all submodules, passing the given arguments to the
	// configuration method.
	Core.start = function(){
		Core.config(arguments);
		handleSubmodules(APP);
	};

	Core.stop = function(){
		handleSubmodules(APP, false);
	};

	// SETUP
	// -----

	win.define = define;
	win.log = Core.Log.write;

	define("APP.start", function(){
		return Core.start;
	});

	define("APP.stop", function(){
		return Core.stop;
	});

	APP.Core = Core;

})(APP, window);
