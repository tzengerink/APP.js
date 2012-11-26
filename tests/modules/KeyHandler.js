module("APP.KeyHandler");

// on
// --

test("on", function(){

	var testVar = false;

	APP.KeyHandler.on("r", function(){ testVar = true; });
	APP.KeyHandler.trigger("r");

	expect(1);

	ok(testVar, "Bind key.");

});

// trigger
// -------

test("trigger", function(){

	var testVar = false;

	APP.KeyHandler.on("r", function(str){ testVar = str; });
	APP.KeyHandler.trigger("r", "value");

	equal(testVar, "value", "Trigger key.");

});

// off
// ---

test("off", function(){

	var testVar = false;

	APP.KeyHandler.on("r", function(){ testVar = true; });
	APP.KeyHandler.off("r");
	APP.KeyHandler.trigger("r");

	expect(1);

	equal(testVar, false, "Unbind key.");

});
