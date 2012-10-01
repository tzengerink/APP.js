/*
 * Create Module
 * -------------
 *
 * Create a (sub)module.
 *
 *     // Create a new module
 *     createModule("APP.MyModule.MySubModule", function(){
 *         return {
 *             myProp   : "Your property value",
 *             myMethod : function( arg1, arg2 ){
 *                 // Your method contents
 *             }
 *         };
 *     });
 *
 *     // Create a single method
 *     createModule("APP.mySingleMethod", function(){
 *         return function( arg1, arg2 ){
 *             // Your method contents
 *         };
 *     });
 *
 * Copyright (c) 2012, T. Zengerink
 * Licensed under MIT License
 * See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
 */
var createModule = (function(){

	var nsDelimiter = ".";

	var extend = function( src, des ){
		for (var key in des) {
			src[key] = des[key];
		}
		return src;
	};

	var getModuleName = function( ns ){
		return ns.split(nsDelimiter).pop();
	};

	var getNameSpace = function( ns ){
		var arr = ns.split(nsDelimiter);
		arr.pop();
		return factory(arr.join(nsDelimiter));
	};

	var factory = function( ns ){
		var i = 0,
			s = ns.split(nsDelimiter),
			o = this;
		for (; i < s.length; i++) {
			o[s[i]] = o[s[i]] || {};
			o = o[s[i]];
		}
		return o;
	};

	return function( ns, fn ){
		var moduleName = getModuleName(ns),
			nameSpace = getNameSpace(ns),
			module = fn.call(this, nameSpace, moduleName);
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
