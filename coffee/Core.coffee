# CORE
# ----
# Core utilities for an application.
# 
# Copyright (c) 2012, T. Zengerink
# Licensed under MIT License.
# See: https://raw.github.com/Mytho/APP.js/master/LISENCE.md
window.APP = ((win, doc) ->
	"use strict"

	defaults =
		baseUri:     ""
		debug:       false
		stopMethod:  "start"
		startMethod: "stop"
		delimiter:   "."

	# @param   object  Destination object
	# @param   object  Source object
	# @return  object  Extended object
	extend = (obj, src) ->
		for key of src
			obj[key] = src[key] if src.hasOwnProperty(key)
		return obj

	# Assist in handling application configuration. Get and set config items.
	Config = (->
		config = extend {}, defaults
		return {} =

			# @param   string  Configuration key
			# @return  mixed   Configuration value or entire object
			get: (key) -> 
				return config if not key
				return config[key]

			# @param   string  Configuration key
			# @param   mixed   Configuration value
			# @return  object  Configuration object
			set: (key, value) ->
				config = extend config, key if typeof key == "object"
				config[key] = value
				return config
	)()

	# Assist in binding event listeners. Bind event listeners in a cross browser
	# compatible way.
	Events = (->
		return {} =

			# @param  object    Document element
			# @param  string    Event name
			# @param  function  Callback
			bind: (el, e, fn) ->
				if el.addEventListener
					el.addEventListener e, fn, false
				else if el.attachEvent
					el.attachEvent "on" + e, fn

			# @param  object    Document element
			# @param  string    Event name
			# @param  function  Callback
			unbind: (el, e, fn) ->
				if el.removeEventListener
					el.removeEventListener e, fn, false
				else if el.detachEvent
					el.detachEvent "on" + e, fn
	)()

	# Log application variables. It will store the variables in an history array,
	# if in debug mode the variables will be passed to the console (if possible).
	Log = (->
		return {} =
			history: []
			write: ->
				for arg in arguments
					Log.history.push(arg)
				win.console.log(arguments) if win.hasOwnProperty(console)
	)()

	# Assist in URL manipulation. The utility uses the `baseUri` config element
	# to determine the full site URL.
	Url = (->
		strip = (str) ->
			return str.replace /^\/|\/$/g, ""
		return {} =
			base: ->
				slash = "/" if strip Config.get "baseUri"
				return [
					win.location.protocol, "//", win.location.host,
					slash, strip Config.get "baseUri"
				].join("")
			site: (uri) ->
				return [Url.base(), "/", strip(uri)].join("")
	)()

	# Quick reference to log
	win.log = Log.write

	return {} =
		Core: {} =
			Config: Config
			Events: Events
			Log:    Log
			Url:    Url

)(window, document)
