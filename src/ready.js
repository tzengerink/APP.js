/* ready
 * -----
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
APP.module("APP.ready", [document], function(doc){

	var fns = [],
		fn,
		ready = false;

	// Execute all functions in list
	var flush = function(){
		ready = true;
		while (f = fns.shift()) f();
	};

	// @param  {object}    Element to remove from
	// @param  {string}    Name of the event
	// @param  {function}  Function to execute on event
	var removeEvent = function( el, e, fn ){
		if (el.removeEventListener) {
			el.removeEventListener(e, fn, false);
		} else if (el.detachEvent) {
			el.detachEvent("on" + e, fn);
		}
	};

	// @param  {object}    Element to add to
	// @param  {string}    Name of the event
	// @param  {function}  Function to execute on event
	var addEvent = function( el, e, fn ){
		if (el.addEventListener) {
			el.addEventListener(e, fn, false);
		} else if (el.attachEvent) {
			el.attachEvent("on" + e, fn);
		}
	};

	// Start checking if DOM is fully loaded
	addEvent(doc, "DOMContentLoaded", fn = function(){
		removeEvent(doc, "DOMContentLoaded", fn);
		flush();
	});

	// @param  {function}  To execute when DOM is ready
	return function( fn ){
		ready ? fn() : fns.push(fn);
	};

});
