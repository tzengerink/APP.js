module 'APP.KeyHandler'

test 'on', ->
  testOn = false
  APP.KeyHandler.on 'r', -> testOn = true
  APP.KeyHandler.trigger 'r'
  expect 1
  ok testOn

test 'trigger', ->
  testTrigger = false
  APP.KeyHandler.on 'r', (str) -> testTrigger = str
  APP.KeyHandler.trigger 'r', 'value'
  equal testTrigger, 'value'

test 'off', ->
  testOff = false
  APP.KeyHandler.on 'r', -> testOff = true
  APP.KeyHandler.off 'r'
  APP.KeyHandler.trigger 'r'
  expect 1
  equal testOff, false
