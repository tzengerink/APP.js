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
		config = {},
		logHistory = [];

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
		// TODO: finish auto initializing of submodules.
	};

	// SETUP
	// -----

	return Core;

});
