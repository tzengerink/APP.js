
window.APP = (function(win, doc) {
  'use strict';

  var Config, Events, Log, Url, defaults, extend, handleSubModules, module, ready, start, stop;
  defaults = {
    baseUri: '',
    debug: true
  };
  extend = function(obj, src) {
    var key;
    for (key in src) {
      if (src.hasOwnProperty(key)) {
        obj[key] = src[key];
      }
    }
    return obj;
  };
  Config = (function() {
    var config;
    config = extend({}, defaults);
    return {
      get: function(key) {
        if (!key) {
          return config;
        }
        return config[key];
      },
      set: function(key, value) {
        if (typeof key === 'object') {
          config = extend(config, key);
        }
        config[key] = value;
        return config;
      }
    };
  })();
  Events = (function() {
    var subscriptions;
    subscriptions = {};
    return {
      bind: function(el, e, fn) {
        if (el.addEventListener) {
          return el.addEventListener(e, fn, false);
        } else if (el.attachEvent) {
          return el.attachEvent('on' + e, fn);
        }
      },
      unbind: function(el, e, fn) {
        if (el.removeEventListener) {
          return el.removeEventListener(e, fn, false);
        } else if (el.detachEvent) {
          return el.detachEvent('on' + e, fn);
        }
      },
      off: function(topic) {
        if (typeof topic !== 'string') {
          throw new Error('Topic must be a string');
        }
        return subscriptions[topic] = [];
      },
      on: function(topic, fn) {
        if (typeof topic !== 'string') {
          throw new Error('Topic must be a string');
        }
        if (typeof fn !== 'function') {
          throw new Error('Callback must be a function');
        }
        if (typeof subscriptions[topic] === 'undefined') {
          subscriptions[topic] = [];
        }
        return subscriptions[topic].push(fn);
      },
      trigger: function(topic, args) {
        var t, _results;
        if (typeof topic !== 'string') {
          throw new Error('Topic must be a string');
        }
        _results = [];
        for (t in subscriptions[topic]) {
          if (subscriptions[topic].hasOwnProperty(t)) {
            _results.push(subscriptions[topic][t](args));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  })();
  Log = (function() {
    return {
      history: [],
      write: function() {
        var arg, _i, _len;
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          Log.history.push(arg);
        }
        if (win.hasOwnProperty('console') && Config.get('debug')) {
          return win.console.log(arguments);
        }
      }
    };
  })();
  Url = (function() {
    var strip;
    strip = function(str) {
      return str.replace(/^\/|\/$/g, '');
    };
    return {
      base: function() {
        var slash;
        if (strip(Config.get('baseUri'))) {
          slash = '/';
        }
        return [win.location.protocol, '//', win.location.host, slash, strip(Config.get('baseUri'))].join('');
      },
      site: function(uri) {
        return [Url.base(), '/', strip(uri)].join('');
      }
    };
  })();
  module = (function() {
    var getModuleName, getNamespace, namespaceFactory;
    getModuleName = function(str) {
      return str.split('.').pop();
    };
    getNamespace = function(str) {
      var ns;
      ns = str.split('.').slice(0, -1);
      return namespaceFactory(ns.join('.'));
    };
    namespaceFactory = function(str) {
      var mod, obj, _i, _len, _ref;
      obj = win;
      _ref = str.split('.');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mod = _ref[_i];
        obj[mod] = obj[mod] || {};
        obj = obj[mod];
      }
      return obj;
    };
    return function(namespace, dependencies, callback) {
      var mn, ns;
      if (typeof callback === 'undefined') {
        callback = dependencies;
        dependencies = [];
      }
      ns = getNamespace(namespace);
      mn = getModuleName(namespace);
      module = callback;
      if (typeof module === 'function') {
        module = callback.apply(this, dependencies);
      }
      ns[mn] = module;
      if (typeof module === 'object') {
        return ns[mn] = extend(ns[mn] || {}, module);
      }
    };
  })();
  ready = (function() {
    var check, done, flush, fn, fns;
    done = false;
    fns = [];
    flush = function() {
      var fn, _i, _len, _results;
      done = true;
      _results = [];
      for (_i = 0, _len = fns.length; _i < _len; _i++) {
        fn = fns[_i];
        _results.push(fn.call());
      }
      return _results;
    };
    if (doc.documentElement) {
      check = function() {
        try {
          doc.documentElement('left');
          return flush();
        } catch (e) {
          return win.setTimeout(check, 10);
        }
      };
      check();
    }
    Events.bind(doc, 'DOMContentLoaded', fn = function() {
      Events.unbind(doc, 'DOMContentLoaded', fn);
      return flush();
    });
    return function(fn) {
      if (done) {
        return fn();
      } else {
        return fns.push(fn);
      }
    };
  })();
  handleSubModules = function(module, start) {
    var isModule, method, prop, _results;
    method = (start === false ? 'stop' : 'start');
    isModule = function(prop) {
      var isObject, startUpper;
      isObject = typeof module[prop] === 'object';
      startUpper = prop.charAt(0) === prop.charAt(0).toUpperCase();
      return isObject && startUpper;
    };
    _results = [];
    for (prop in module) {
      if (module.hasOwnProperty(prop) && isModule(prop)) {
        if (module[prop].hasOwnProperty(method)) {
          module[prop][method].call();
        }
        _results.push(handleSubModules(module[prop], start));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  start = function(conf) {
    Config.set(conf);
    return ready(function() {
      return handleSubModules(APP);
    });
  };
  stop = function() {
    return handleSubModules(APP, false);
  };
  return {
    log: Log.write,
    module: module,
    ready: ready,
    start: start,
    stop: stop,
    Config: Config,
    Events: Events,
    Log: Log,
    Url: Url
  };
})(window, document);
