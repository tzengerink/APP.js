// DEFINE
// ------

module("define");

test("define", function(){

	expect(5);

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

	equal(APP.TestModule.start(), true, "Module successfully defined.");
	equal(APP.TestModule.SubModule.start(), true, "Submodule successfully defined.");
	equal(APP.TestModule.testMethod("test"), true, "Method successfully defined.");
	equal(APP.TestModule.testVar, 1234, "Variable successfully defined.");
	deepEqual(APP.TestModule.testObject, { "key" : "value" }, "Object successfully defined.");

});

// APP.Core
// --------

module("APP.Core");

test("config", function(){

	expect(4);

	equal(APP.Core.config("test", "string"), "string", "Config variable successfully set.");
	equal(APP.Core.config("test"), "string", "Config variable successfully requested.");
	equal(typeof APP.Core.config({ "key" : "value" }), "object", "Config object successfully set.");
	equal(APP.Core.config("key"), "value", "Config variable successfully requested.");

});
