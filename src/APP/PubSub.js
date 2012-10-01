/*! PUBSUB */
/* ----------
 * Basic PubSub functionality to supply the possiblity of decoupled application
 * modules.
 *
 * To subscribe to a topic `news`:
 *
 *    APP.PubSub.on("news", function(str){
 *        alert(str);
 *    });
 *
 * To publish the topic `news`:
 *
 *    APP.PubSub.trigger("news", "Extra extra!");
 *
 * To unsubscribe from the topic `news`:
 *
 *    APP.PubSub.off("news");
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License.
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
createModule("APP.PubSub", function(){

	var PubSub = {},
		subscriptions = {};

	// Unsubscribe
	PubSub.off = function( topic ){
		if (typeof topic !== "string") {
			throw new Error("Topic must be a string");
		}
		subscriptions[topic] = [];
	};

	// Subscribe
	PubSub.on = function( topic, fn ){
		if (typeof topic !== "string") {
			throw new Error("Topic must be a string");
		}
		if (typeof fn !== "function") {
			throw new Error("Callback must be a function");
		}
		if (typeof subscriptions[topic] === "undefined") {
			subscriptions[topic] = [];
		}
		subscriptions[topic].push(fn);
	};

	// Publish
	PubSub.trigger = function( topic, args ){
		if (typeof topic !== "string") {
			throw new Error("Topic must be a string");
		}
		for (t in subscriptions[topic]) {
			subscriptions[topic][t](args);
		}
	};

	return PubSub;

})();
