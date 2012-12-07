module 'APP.PubSub'

test 'on', ->
  testOn = false
  APP.PubSub.on 'news', -> testOn = true
  APP.PubSub.trigger 'news'
  expect 1
  ok testOn

test 'trigger', ->
  testTrigger = false
  APP.PubSub.on 'news', (str) -> testTrigger = str
  APP.PubSub.trigger 'news', 'value'
  expect 1
  equal testTrigger, 'value'

test 'off', ->
  testOff = false
  APP.PubSub.on 'news', -> testOff = true
  APP.PubSub.off 'news'
  APP.PubSub.trigger 'news'
  expect 1
  equal testOff, false
