# Core utilities for an application.
#
# Copyright &copy; 2012, T. Zengerink  
# See: [MIT License](https://raw.github.com/Mytho/APP.js/master/LISENCE.md)
window.APP = ((win, doc) ->
  "use strict"

  defaults =
    baseUri:     ""
    debug:       false
    stopMethod:  "start"
    startMethod: "stop"
    delimiter:   "."

  # Extend the `obj` with all properties of `src`.
  extend = (obj, src) ->
    for key of src
      obj[key] = src[key] if src.hasOwnProperty(key)
    return obj

  # ### MODULES

  # Assist in handling application configuration. Get and set configuration 
  # items.
  Config = (->
    config = extend {}, defaults

    return {} =

      # Get configuration value for `key`, if not a valid `key` the entire 
      # `config` object will be returned.
      get: (key) -> 
        return config if not key
        return config[key]

      # Set the `value` of a configuration `key`, the entire `config` object 
      # will be returned.
      set: (key, value) ->
        config = extend config, key if typeof key == "object"
        config[key] = value
        return config
  )()

  # Assist in binding event listeners. Bind event listeners in a cross browser
  # compatible way.
  Events = (->
    return {} =

      # Bind an event listener to element `el`.
      bind: (el, e, fn) ->
        if el.addEventListener
          el.addEventListener e, fn, false
        else if el.attachEvent
          el.attachEvent "on" + e, fn

      # Unbind an event listener from element `el`.
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

      # Array containing the entire log history.
      history: []

      # Adds `arguments` to the history array and if present logs them in the 
      # console.
      write: ->
        for arg in arguments
          Log.history.push(arg)
        win.console.log(arguments) if win.hasOwnProperty(console) and Config.get "debug"
  )()

  # Assist in URL manipulation. The utility uses the `baseUri` config element
  # to determine the full site URL.
  Url = (->
    strip = (str) ->
      return str.replace /^\/|\/$/g, ""

    return {} =

      # Get the base URL for the application.
      base: ->
        slash = "/" if strip Config.get "baseUri"
        return [
          win.location.protocol, "//", win.location.host,
          slash, strip Config.get "baseUri"
        ].join("")

      # Get a full application URL for a given `uri`.
      site: (uri) ->
        return [Url.base(), "/", strip(uri)].join("")
  )()

  # Get the module name when the entire `namespace` is given as a string.
  getModuleName = (str) -> return str.split(Config.get "delimiter").pop()

  # Get the namespace object without the module part when the `namespace`
  # is given as a string.
  getNamespace = (namespace) ->
    return namespaceFactory namespace.split(Config.get "delimiter")
      .slice(0, 1).join(Config.get "delimiter")

  # Get the namespace object when the `namespace` string is given.
  namespaceFactory = (namespace) ->
    obj = win
    for module in namespace.split Config.get "delimiter"
      obj[module] = obj[module] or {}
      obj = obj[module]
    return obj

  # Define a new module when a `namespace` string is given. The return
  # value of the `callback` function will be assigned to the module and
  # any dependencies will be passed as arguments to the `callback`.
  module = (namespace, dependencies, callback) ->
    if typeof callback == "undefined"
      callback = dependencies
      dependencies = []
    ns = getNamespace(namespace)
    mn = getModuleName(namespace)
    if typeof callback == "function"
      module = callback.apply this, dependencies
    else
      module = callback
    ns[mn] = module
    if typeof module == "object"
      ns[mn] = extend ns[mn] or {}, module 
    return ns[mn]

  # ### PUBLIC

  # Quick reference to log
  win.log = Log.write

  # Return the object that will be assigned to `APP`.
  return {} =
    module: module
    Core: {} =
      Config: Config
      Events: Events
      Log:    Log
      Url:    Url

)(window, document)
