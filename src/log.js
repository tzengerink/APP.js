/*
 * Log
 * ---
 *
 * Shorthand access to APP.Core.log()
 *
 *     // Log your variables to the console
 *     log("Your variables", ["to", "the", "console"]);
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
var log = function(){
	return APP.Core.log(arguments);
};
