/*! INIT */
/* --------
 * Initialize the application (Shorthand access to APP.Core.init).
 *
 *     APP.init({
 *         "your"     : "configuration",
 *         "elements" : "here"
 *     });
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
createModule("APP.init", function(){
	return APP.Core.init;
})();
