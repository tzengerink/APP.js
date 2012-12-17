# KeyHandler
# ----------
# KeyHandler is a lightweight module, with **mimimum** key binding 
# functionality. A function can be bound to a key like this:
#
#     APP.KeyHandler.bind 'R', ->
#         window.location.reload() # Reload the window for example
#
# To trigger a keyup event:
#
#     APP.KeyHandler.trigger 'R'
#
# And to unbind:
#
#     APP.KeyHandler.unbind 'R'
APP.module 'APP.KeyHandler', [document, APP.Events], (doc, Events) ->
  'use strict'

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

  # Only handle event `e` if focus not on input, textarea or select.
  handle = (e) -> 
    if not /input|textarea|select/i.test((e.target or e.srcElement).nodeName) 
      Events.trigger([prefix, keys[e.keyCode]].join(''), e)

  Events.bind(doc, 'keyup', handle)

  off: (key) -> Events.off([prefix, key.toLowerCase()].join(''))
  on: (key, fn) -> Events.on([prefix, key.toLowerCase()].join(''), fn)
  trigger: (key, args) -> Events.trigger([prefix, key.toLowerCase()].join(''), args)
