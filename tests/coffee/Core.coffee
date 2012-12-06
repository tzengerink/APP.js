module "APP.Core"

test "Config", () ->
	expect 4
	equal typeof APP.Core.Config.get(), "object"
	equal typeof APP.Core.Config.get("nonExisting"), "undefined"
	equal typeof APP.Core.Config.set(key: "value"), "object"
	equal APP.Core.Config.get("key"), "value"
	return
