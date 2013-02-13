# Core
# ----
# Core utilities for an application.
window.APP = ((win, doc) ->
  'use strict'

  defaults =
    baseUri: ''
    debug:   true

  # Concatinate a series of strings to a single string.
  cat = -> Array.prototype.slice.call(arguments).join('')

  # Extend the `obj` with all properties of `src`.
  extend = (obj, src) ->
    for key of src
      obj[key] = src[key] if src.hasOwnProperty(key)
    obj

  # ### APP.Config

  # Assist in handling application configuration. Get and set configuration 
  # items.
  Config = (->
    config = extend {}, defaults
    # Get configuration value for `key`, if not a valid `key` the entire 
    # `config` object will be returned.
    get: (key) -> 
      return config if not key
      config[key]
    # Set the `value` of a configuration `key`, the entire `config` object 
    # will be returned.
    set: (key, value) ->
      config = extend config, key if typeof key is 'object'
      config[key] = value
      config
  )()

  # ### APP.Events

  # Assist in binding event listeners. Bind event listeners in a cross browser
  # compatible way. The module also helps with basic Publish/Subscribe 
  # functionality.
  Events = (->
    subscriptions = {}
    # Bind an event listener to element `el`.
    bind: (el, e, fn) ->
      if el.addEventListener
        el.addEventListener e, fn, false
      else if el.attachEvent
        el.attachEvent 'on' + e, fn
    # Unbind an event listener from element `el`.
    unbind: (el, e, fn) ->
      if el.removeEventListener
        el.removeEventListener e, fn, false
      else if el.detachEvent
        el.detachEvent 'on' + e, fn
    # Unsubscribe from a given `topic`.
    off: (topic) ->
      throw new Error 'Topic must be a string' if typeof topic isnt 'string'
      subscriptions[topic] = []
    # Setup PubSub to execute callback function (`fn`) when a `topic` is triggered.
    on: (topic, fn) ->
      throw new Error 'Topic must be a string' if typeof topic isnt 'string'
      throw new Error 'Callback must be a function' if typeof fn isnt 'function'
      if typeof subscriptions[topic] is 'undefined'
        subscriptions[topic] = []
      subscriptions[topic].push(fn)
    # Trigger a `topic`, while passing `args` as the arguments for the called function.
    trigger: (topic, args) ->
      throw new Error 'Topic must be a string' if typeof topic isnt 'string'
      for t of subscriptions[topic]
        subscriptions[topic][t](args) if subscriptions[topic].hasOwnProperty(t)
  )()

  # ### APP.KeyHandler

  # Assist in handling key bindings. A function can be bound:
  #
  #     APP.KeyHandler.on 'R', -> alert('R is pressed');
  #
  # To trigger a keyup event:
  #
  #     APP.KeyHandler.trigger 'R'
  #
  # And to unbind:
  #
  #     APP.KeyHandler.off 'R'
  #
  KeyHandler = (->
    prefix = 'KeyHandler-'

    keys =
      # Special keys
      8:'backspace', 9:'tab', 13:'enter', 16:'shift', 17:'ctrl', 18:'alt',
      # Arrow keys
      37:'left', 38:'up', 39:'right', 40:'down',
      # Numbers
      48:'0', 49:'1', 50:'2', 51:'3', 52:'4', 53:'5', 54:'6', 55:'7', 56:'8',
      57:'9',
      # Alpha
      65:'a', 66:'b', 67:'c', 68:'d', 69:'e', 70:'f', 71:'g', 72:'h', 73:'i',
      74:'j', 75:'k', 76:'l', 77:'m', 78:'n', 79:'o', 80:'p', 81:'q', 82:'r',
      83:'s', 84:'t', 85:'u', 86:'v', 87:'w', 88:'x', 89:'y', 90:'z',
      # Function keys
      112:'f1', 113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7',
      119:'f8', 120:'f9', 121:'f10', 122:'f11', 123:'f12',
      # Numpad
      96:'num0', 97:'num1', 98:'num2', 99:'num3', 100:'num4', 101:'num5',
      102:'num6', 103:'num7', 104:'num8', 105:'num9'

    # Only handle event `e` if focus not on input, textarea or select
    Events.bind doc, 'keyup', (e) -> 
      if not /input|textarea|select/i.test((e.target or e.srcElement).nodeName) 
        Events.trigger(cat(prefix, keys[e.keyCode]), e)

    off: (key) -> Events.off(cat(prefix, key.toLowerCase()))
    on: (key, fn) -> Events.on(cat(prefix, key.toLowerCase()), fn)
    # Prevent default scroll movement when arrow keys are pressed
    preventScrollMovement: -> 
      Events.bind doc, 'keydown', (e) ->
        if e.keyCode >= 37 and e.keyCode <= 40
          e.preventDefault()
          return false
    trigger: (key, args) -> Events.trigger(cat(prefix, key.toLowerCase()), args)
  )()

  # ### APP.Log

  # Log application variables. It will store the variables in an history array,
  # if in debug mode the variables will be passed to the console (if possible).
  Log = (->
      history: []
      # Adds `arguments` to the history array and if present logs them in the 
      # console.
      write: ->
        for arg in arguments
          Log.history.push(arg)
        if Config.get('debug') and win.console
          win.console.log(arguments)
  )()

  # ### APP.Url

  # Assist in URL manipulation. The utility uses the `baseUri` config element
  # to determine the full site URL.
  Url = (->
    strip = (str) -> str.replace /^\/|\/$/g, ''
    # Get the base URL for the application.
    base: ->
      slash = '/' if strip Config.get('baseUri')
      cat(win.location.protocol, '//', win.location.host, slash, 
       strip Config.get('baseUri'))
    # Get a full application URL for a given `uri`.
    site: (uri) -> cat(Url.base(), '/', strip(uri))
  )()

  # ### Methods

  # Define a new module when a `namespace` string is given. The return
  # value of the `callback` function will be assigned to the module and
  # any dependencies will be passed as arguments to the `callback`.
  module = (->
    getModuleName = (str) -> str.split('.').pop()
    # Get the namespace object without the module part when the namespace
    # is given as a string.
    getNamespace = (str) ->
      ns = str.split('.').slice(0, -1)
      namespaceFactory(ns.join('.'))
    # Create the namespace object when the namespace string is given.
    namespaceFactory = (str) ->
      obj = win
      for mod in str.split('.')
        obj[mod] = obj[mod] or {}
        obj = obj[mod]
      obj
    (namespace, dependencies, callback) ->
      if typeof callback == 'undefined'
        callback = dependencies
        dependencies = []
      ns = getNamespace(namespace)
      mn = getModuleName(namespace)
      module = callback
      module = callback.apply(this, dependencies) if typeof module is 'function'
      ns[mn] = module
      if typeof module is 'object'
        ns[mn] = extend ns[mn] or {}, module
  )()

  # Execute functions when DOM is ready loading all elements. Please be aware
  # when using iframes which are not supported.
  ready = (->
    done = false
    fns = []
    t = false
    # Execute all functions in the list and register that the DOM is ready.
    flush = ->
      clearTimeout t
      done = true
      for fn in fns
        fn.call()
    # Check if the document can be scrolled. This adds the ready functionality
    # for browsers that do not support the `DOMContentLoaded`-event.
    if doc.documentElement
      check = ->
        try
          doc.documentElement.doScroll 'left'
          flush()
        catch e
          t = win.setTimeout check, 20
        false
      check()
    # Add an event listener to the document that watches for the
    # `DOMContentLoaded`-event.
    Events.bind(doc, 'DOMContentLoaded', fn = ->
      Events.unbind doc, 'DOMContentLoaded', fn
      flush()
    )
    (fn) ->
      if done
        fn()
      else
        fns.push fn
  )()

  # Recursively check all submodules of `module` and execute it's start/stop
  # method if it has one.
  handleSubModules = (module, start) ->
    method = (if start is false then 'stop' else 'start')
    # Check if given property is truly a module.
    isModule = (prop) ->
      isObject = typeof module[prop] is 'object'
      startUpper = prop.charAt(0) is prop.charAt(0).toUpperCase()
      isObject and startUpper
    # Check all properties of the module, if it is a proper start/stop method,
    # then execute it.
    for prop of module
      if module.hasOwnProperty(prop) and isModule(prop)
        if module[prop].hasOwnProperty(method)
          module[prop][method].call() 
        handleSubModules(module[prop], start)

  # Start application and all submodules. The `conf` object parameter will
  # be used to extend the default configuration.
  start = (conf) ->
    Config.set(conf)
    ready -> handleSubModules(APP)

  # Stop all submodules.
  stop = -> handleSubModules(APP, false)

  # ### Setup

  # Return the object that will be assigned to the `APP`-namespace.
  Config: Config
  Events: Events
  KeyHandler: KeyHandler
  Log: Log
  Url: Url
  log: Log.write
  module: module
  ready: ready
  start: start
  stop: stop
)(window, document)
