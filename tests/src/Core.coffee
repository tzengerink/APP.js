module "APP.Core"

APP.Core.Config.set "debug", true

test "module", ->
  APP.module "APP.TestModule", [window, document], (win, doc) ->
    {} =
      docObj: doc,
      winObj: win,
      start: -> return win.location.href == window.location.href
  APP.module "APP.TestModule.SubModule", ->
    start: -> true
  APP.module "APP.TestModule.testMethod", ->
    (str) -> str == "test"
  APP.module "APP.TestModule.testVar", 1234
  APP.module "APP.TestModule.testObject", key: "value"
  expect 5
  equal APP.TestModule.start(), true
  equal APP.TestModule.SubModule.start(), true
  equal APP.TestModule.testMethod("test"), true
  equal APP.TestModule.testVar, 1234
  deepEqual APP.TestModule.testObject, key: "value"

test "start", ->
  moduleVar = false
  subModuleVar = false
  APP.module "APP.Mod", ->
    start: -> moduleVar = true
  APP.module "APP.Mod.Sub", ->
    start: -> subModuleVar = true
  APP.start(key: "value")
  expect 3
  ok moduleVar
  ok subModuleVar
  equal APP.Core.Config.get("key"), "value"

test "Config", ->
	expect 4
	equal typeof APP.Core.Config.get(), "object"
	equal typeof APP.Core.Config.get("nonExisting"), "undefined"
	equal typeof APP.Core.Config.set(key: "value"), "object"
	equal APP.Core.Config.get("key"), "value"

test "Log", ->
	log("test1")
	log("test2")
	expect(1)
	deepEqual APP.Core.Log.history, ["test1", "test2"]

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
