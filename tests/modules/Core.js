module("APP.Core");

// define
// ------

test("define", function(){

	define("APP.TestModule", [window, document], function(win, doc){
		return {
			"docObj" : doc,
			"winObj" : win,
			"start" : function(){
				return win.self === window;
			}
		};
	});

	define("APP.TestModule.SubModule", function(){
		return {
			"start" : function(){
				return true;
			}
		};
	});

	define("APP.TestModule.testMethod", function(){
		return function(str){
			return str == "test";
		};
	});

	define("APP.TestModule.testVar", 1234);
	define("APP.TestModule.testObject", { "key" : "value" });

	expect(5);

	equal(APP.TestModule.start(), true, "Define module.");
	equal(APP.TestModule.SubModule.start(), true, "Define submodule.");
	equal(APP.TestModule.testMethod("test"), true, "Define method.");
	equal(APP.TestModule.testVar, 1234, "Define variable.");
	deepEqual(APP.TestModule.testObject, { "key" : "value" }, "Define object.");

});

// config
// ------

test("config", function(){

	expect(4);

	equal(typeof APP.Core.config(), "object", "Get configuration object");
	equal(typeof APP.Core.config("nonExistingKey"), "undefined", "Get undefined config key.");
	equal(typeof APP.Core.config({ "key" : "value" }), "object", "Set config object.");
	equal(APP.Core.config("key"), "value", "Get config variable.");

});

// Log
// ---

test("Log", function(){

	log("test1");
	log("test2");

	expect(1);

	deepEqual(APP.Core.Log.history, ["test1", "test2"], "Append log history.");

});

// URL
// ---

test("Url", function(){

	var testUri = "some/long/uri",
		protocol = window.location.protocol;
		host = window.location.host,
		base = protocol + "//" + host + "/" + testUri + "/";

	APP.Core.config({ baseUri:testUri });

	expect(3);

	equal(APP.Core.Url.base(), base);
	equal(APP.Core.Url.site("/test/"), base + "test/");
	equal(APP.Core.Url.site("test"), base + "test/");

});

// start
// -----

test("start", function(){

	var moduleVar = false,
		subModuleVar = false;

	define("APP.Mod", function(){
		return {
			start : function(){
				moduleVar = true;
			}
		}
	});

	define("APP.Mod.Sub", function(){
		return {
			start : function(){
				subModuleVar = true;
			}
		}
	});

	APP.start({ "key" : "value" });

	expect(3);

	ok(moduleVar, "Start modules.");
	ok(subModuleVar, "Start submodules.");
	equal(APP.Core.config("key"), "value", "Set configuration.");

});

// stop
// ----

test("stop", function(){

	var moduleVar = false,
		subModuleVar = false;

	define("APP.Mod", function(){
		return {
			stop : function(){
				moduleVar = true;
			}
		}
	});

	define("APP.Mod.Sub", function(){
		return {
			stop : function(){
				subModuleVar = true;
			}
		}
	});

	APP.stop();

	expect(2);

	ok(moduleVar, "Stop modules.");
	ok(subModuleVar, "Stop submodules.");

});
