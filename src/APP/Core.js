/*! CORE */
/* --------
 * Core utilities for the application.
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
createModule("APP.Core", function(){

	var Core = {},
		config = {
			"moduleInitMethod" : "init"
		},
		logHistory = [];

	// PRIVATE
	// -------

	var initSubmodules = function( module ) {
		for (prop in module) {
			if (typeof module[prop] === "object") {
				if (prop !== "Core" && module[prop].hasOwnProperty(config.moduleInitMethod)) {
					module[prop][config.moduleInitMethod].call();
				}
				initSubmodules(module[prop]);
			}
		}
	};

	// PUBLIC
	// ------

	Core.config = function( key, value ){
		if (typeof value !== "undefined") {
			config[key] = value;
		}
		if (typeof config[key] !== "undefined") {
			return config[key];
		}
		return config;
	};

	Core.log = function(){
		logHistory.push(arguments);
		if (window.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};

	Core.init = function( args ){
		for (k in args) {
			Core.config(k, args[k]);
		}
		initSubmodules(APP);
	};

	// SETUP
	// -----

	return Core;

});
