module("APP.ready");

test("ready", function(){

	APP.ready(function(){
		console.log("READY!");
	});

	APP.ready(function(){
		console.log("READY TO!");
	});

	expect(1);

	ok(true, "Ready!");

});
