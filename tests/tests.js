// DEFINE
// ------

module("define");

test("define", function(){

	define("APP.TestModule", function(){
		return {
			"start" : function(){
				return true;
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

// APP.CORE
// --------

module("APP.Core");

test("config", function(){

	expect(4);

	equal(APP.Core.config("test", "string"), "string", "Set config variable.");
	equal(APP.Core.config("test"), "string", "Get config variable.");
	equal(typeof APP.Core.config({ "key" : "value" }), "object", "Set config object.");
	equal(APP.Core.config("key"), "value", "Get config variable.");

});

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

// APP.PUBSUB
// ----------

module("APP.PUBSUB");

test("on", function(){

	var testVar = false;

	APP.PubSub.on("news", function(){ testVar = true; });
	APP.PubSub.trigger("news");

	expect(1);

	ok(testVar, "Subscribe to channel.");

});

test("trigger", function(){

	var testVar = false;

	APP.PubSub.on("news", function(str){
		testVar = str;
	});

	APP.PubSub.trigger("news", "value");

	equal(testVar, "value", "Trigger channel.");

});

test("off", function(){

	var testVar = false;

	APP.PubSub.on("news", function(){ testVar = true; });
	APP.PubSub.off("news");
	APP.PubSub.trigger("news");

	expect(1);

	equal(testVar, false, "Unsubscribe from channel.");

});
