/* CORE
 * ----
 * Core utilities for the application.
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
define("APP.Core", function(){

	var Core = {},
		config = {
			debug             : false,
			moduleStartMethod : "start",
			moduleStopMethod  : "stop"
		},
		logHistory = [];

	// PRIVATE
	// -------

	var handleSubmodules = function( module, start ) {
		var method = start !== false ? config.moduleStartMethod : config.moduleStopMethod;
		for (prop in module) {
			if (typeof module[prop] === "object") {
				if (prop !== "Core" && module[prop].hasOwnProperty(method)) {
					module[prop][method].call();
				}
				handleSubmodules(module[prop], start);
			}
		}
	};

	// PUBLIC
	// ------

	Core.config = function( key, value ){
		if (typeof value !== "undefined") {
			config[key] = value;
		}
		if (typeof key === "object") {
			for (k in key) {
				config[k] = key[k];
			}
		} else if (typeof config[key] !== "undefined") {
			return config[key];
		}
		return config;
	};

	Core.log = function(){
		logHistory.push(arguments);
		if (config.debug && window.console) {
			for (var i = arguments.length; i > 0; i--) {
				console.log(arguments[i - 1]);
			}
		}
	};

	Core.start = function( args ){
		Core.config(args);
		handleSubmodules(APP);
	};

	Core.stop = function(){
		handleSubmodules(APP, false);
	};

	// SETUP
	// -----

	window.log = function(){
		return APP.Core.log(arguments);
	}

	define("APP.start", function(){
		return Core.start;
	});

	return Core;

});
