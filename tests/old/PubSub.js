module("APP.PubSub");

test("on", function(){
	var testVar = false;
	APP.PubSub.on("news", function(){ testVar = true; });
	APP.PubSub.trigger("news");
	expect(1);
	ok(testVar, "Subscribe to channel.");
});

test("trigger", function(){
	var testVar = false;
	APP.PubSub.on("news", function(str){ testVar = str; });
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