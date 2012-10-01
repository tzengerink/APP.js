/*
 * Log
 * ---
 *
 *     // Log your variables to the console
 *     log("Your variables", ["to", "the", "console"]);
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
var log = function(){
		if (win.console) {
			console.log(Array.prototype.slice.call(arguments));
		}
};
