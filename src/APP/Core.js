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
		logHistory = [];

	// PUBLIC
	// ------

	Core.log = function(){
		logHistory.push(arguments);
		if (window.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
	};

	Core.init = function(){
		// TODO: finish auto initializing of submodules.
	};

	// SETUP
	// -----

	return Core;

});
