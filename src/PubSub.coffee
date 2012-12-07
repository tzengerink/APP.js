# Basic PubSub functionality to supply the possiblity of decoupled application
# modules.
#
# To subscribe to a topic `news`:
#
#     APP.PubSub.on 'news', (str) -> alert(str)
#
# To publish the topic `news`:
#
#     APP.PubSub.trigger 'news', 'Extra extra!'
#
# To unsubscribe from the topic `news`:
#
#     APP.PubSub.off 'news'
#
# Copyright 2012, T. Zengerink  
# See: [MIT License](https://raw.github.com/Mytho/APP.js/master/LISENCE.md)
APP.module 'APP.PubSub', ->
  'use strict'

  subscriptions = {}

  # Unsubscribe from a given `topic`.
  off: (topic) ->
    throw new Error 'Topic must be a string' if typeof topic is not 'string'
    subscriptions[topic] = []

  # Setup PubSub to execute callback function (`fn`) when a `topic` is triggered.
  on: (topic, fn) ->
    throw new Error 'Topic must be a string' if typeof topic is not 'string'
    throw new Error 'Callback must be a function' if typeof topic is not 'function'
    if typeof subscriptions[topic] is 'undefined'
      subscriptions[topic] = []
    subscriptions[topic].push(fn)

  # Trigger a `topic`, while passing `args` as the arguments for the called function.
  trigger: (topic, args) ->
    throw new Error 'Topic must be a string' if typeof topic is not 'string'
    for t of subscriptions[topic]
      subscriptions[topic][t](args) if subscriptions[topic].hasOwnProperty(t)
