(->
  'use strict'

  module 'APP'

  test 'ready', ->
    testReady = false
    APP.ready ->
      testReady = true
      return
    expect 1
    ok testReady

  test 'module', ->
    APP.module 'APP.TestModule', [window, document], (win, doc) ->
      docObj: doc,
      winObj: win,
      start: -> return win.location.href == window.location.href
    APP.module 'APP.TestModule.SubModule', ->
      start: -> true
    APP.module 'APP.TestModule.testMethod', ->
      (str) -> str == 'test'
    APP.module 'APP.TestModule.testVar', 1234
    APP.module 'APP.TestModule.testObject', key: 'value'
    expect 5
    equal APP.TestModule.start(), true
    equal APP.TestModule.SubModule.start(), true
    equal APP.TestModule.testMethod('test'), true
    equal APP.TestModule.testVar, 1234
    deepEqual APP.TestModule.testObject, key: 'value'

  test 'start', ->
    moduleVar = false
    subModuleVar = false
    APP.module 'APP.Mod', ->
      start: ->
        moduleVar = true
        return
    APP.module 'APP.Mod.Sub', ->
      start: ->
        subModuleVar = true
        return
    APP.start(key: 'value')
    expect 3
    ok moduleVar
    ok subModuleVar
    equal APP.Config.get('key'), 'value'

  test 'stop', ->
    moduleVar = false
    subModuleVar = false
    APP.module 'APP.Mod', ->
      stop: ->
        moduleVar = true
        return
    APP.module 'APP.Mod.Sub', ->
      stop: ->
        subModuleVar = true
        return
    APP.stop()
    expect 2
    ok moduleVar
    ok subModuleVar

  test 'Config', ->
    expect 4
    equal typeof APP.Config.get(), 'object'
    equal typeof APP.Config.get('nonExisting'), 'undefined'
    equal typeof APP.Config.set(key: 'value'), 'object'
    equal APP.Config.get('key'), 'value'

  test 'Events', ->
    testOn = false
    testTrigger = false
    testOff = false
    APP.Events.on 'news', ->
      testOn = true
      return
    APP.Events.trigger 'news'
    APP.Events.on 'news', (str) ->
      testTrigger = str
      return
    APP.Events.trigger 'news', 'value'
    APP.Events.on 'news', ->
      testOff = true
      return
    APP.Events.off 'news'
    APP.Events.trigger 'news'
    expect 3
    ok testOn
    equal testTrigger, 'value'
    equal testOff, false

  test 'KeyHandler', ->
    testOn = false
    testTrigger = false
    testOff = false
    APP.KeyHandler.on 'r', ->
      testOn = true
      return
    APP.KeyHandler.trigger 'r'
    APP.KeyHandler.on 'r', (str) ->
      testTrigger = str
      return
    APP.KeyHandler.trigger 'r', 'value'
    APP.KeyHandler.on 'r', ->
      testOff = true
      return
    APP.KeyHandler.off 'r'
    APP.KeyHandler.trigger 'r'
    expect 3
    equal testTrigger, 'value'
    ok testOn
    equal testOff, false

  test 'Log', ->
    APP.log('test1')
    APP.log('test2')
    expect(1)
    deepEqual APP.Log.history, ['test1', 'test2']

  test 'Url', ->
    testUriOne = 'some/long/uri'
    testUriTwo = '/some/long/uri/'
    base = window.location.protocol + '//' + window.location.host + '/' + testUriOne
    expect 3
    APP.Config.set(baseUri: testUriOne)
    equal APP.Url.base(), base
    APP.Config.set(baseUrl: testUriTwo)
    equal APP.Url.site('/test/'), base + '/test'
    equal APP.Url.site('test'), base + '/test'
)()
