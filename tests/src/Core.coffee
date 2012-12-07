module "APP.Core"

test "Config", ->
	expect 4
	equal typeof APP.Core.Config.get(), "object"
	equal typeof APP.Core.Config.get("nonExisting"), "undefined"
	equal typeof APP.Core.Config.set(key: "value"), "object"
	equal APP.Core.Config.get("key"), "value"
	return

test "Log", ->
	log("test1")
	log("test2")
	expect(1)
	deepEqual APP.Core.Log.history, ["test1", "test2"]
	return

test "Url", ->
	testUriOne = "some/long/uri"
	testUriTwo = "/some/long/uri/"
	base = window.location.protocol + "//" + window.location.host + "/" + testUriOne
	expect 3
	APP.Core.Config.set(baseUri: testUriOne)
	equal APP.Core.Url.base(), base
	APP.Core.Config.set(baseUrl: testUriTwo)
	equal APP.Core.Url.site("/test/"), base + "/test"
	equal APP.Core.Url.site("test"), base + "/test"
	return
