module "APP.Core"

APP.Core.Config.set "debug", true

test "module", ->
  APP.module "APP.TestModule", [window, document], (win, doc) ->
    return {} =
      docObj: doc,
      winObj: win,
      start: -> return win.location.href == window.location.href
  APP.module "APP.TestModule.SubModule", ->
    return {} =
      start: ->
        return true
  #APP.module "APP.TestModule.testMethod", -> return (str) -> return str == "test"
  #APP.module "APP.TestModule.testVar", 1234
  #APP.module "APP.TestModule.testObject", key: "value"
  expect 1
  equal APP.TestModule.start(), true
  equal APP.TestModule.SubModule.start(), true
  #equal APP.TestModule.testMethod("test"), true
  #equal APP.TestModule.testVar, 1234
  #deepEqual APP.TestModule.testObject, key: "value"
  return

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
