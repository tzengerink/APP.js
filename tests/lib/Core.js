
module('APP');

test('ready', function() {
  var testReady;
  testReady = false;
  APP.ready(function() {
    return testReady = true;
  });
  expect(1);
  return ok(testReady);
});

test('module', function() {
  APP.module('APP.TestModule', [window, document], function(win, doc) {
    return {
      docObj: doc,
      winObj: win,
      start: function() {
        return win.location.href === window.location.href;
      }
    };
  });
  APP.module('APP.TestModule.SubModule', function() {
    return {
      start: function() {
        return true;
      }
    };
  });
  APP.module('APP.TestModule.testMethod', function() {
    return function(str) {
      return str === 'test';
    };
  });
  APP.module('APP.TestModule.testVar', 1234);
  APP.module('APP.TestModule.testObject', {
    key: 'value'
  });
  expect(5);
  equal(APP.TestModule.start(), true);
  equal(APP.TestModule.SubModule.start(), true);
  equal(APP.TestModule.testMethod('test'), true);
  equal(APP.TestModule.testVar, 1234);
  return deepEqual(APP.TestModule.testObject, {
    key: 'value'
  });
});

test('start', function() {
  var moduleVar, subModuleVar;
  moduleVar = false;
  subModuleVar = false;
  APP.module('APP.Mod', function() {
    return {
      start: function() {
        return moduleVar = true;
      }
    };
  });
  APP.module('APP.Mod.Sub', function() {
    return {
      start: function() {
        return subModuleVar = true;
      }
    };
  });
  APP.start({
    key: 'value'
  });
  expect(3);
  ok(moduleVar);
  ok(subModuleVar);
  return equal(APP.Config.get('key'), 'value');
});

test('stop', function() {
  var moduleVar, subModuleVar;
  moduleVar = false;
  subModuleVar = false;
  APP.module('APP.Mod', function() {
    return {
      stop: function() {
        return moduleVar = true;
      }
    };
  });
  APP.module('APP.Mod.Sub', function() {
    return {
      stop: function() {
        return subModuleVar = true;
      }
    };
  });
  APP.stop();
  expect(2);
  ok(moduleVar);
  return ok(subModuleVar);
});

test('Config', function() {
  expect(4);
  equal(typeof APP.Config.get(), 'object');
  equal(typeof APP.Config.get('nonExisting'), 'undefined');
  equal(typeof APP.Config.set({
    key: 'value'
  }), 'object');
  return equal(APP.Config.get('key'), 'value');
});

test('Events', function() {
  var testOff, testOn, testTrigger;
  testOn = false;
  testTrigger = false;
  testOff = false;
  APP.Events.on('news', function() {
    return testOn = true;
  });
  APP.Events.trigger('news');
  APP.Events.on('news', function(str) {
    return testTrigger = str;
  });
  APP.Events.trigger('news', 'value');
  APP.Events.on('news', function() {
    return testOff = true;
  });
  APP.Events.off('news');
  APP.Events.trigger('news');
  expect(3);
  ok(testOn);
  equal(testTrigger, 'value');
  return equal(testOff, false);
});

test('Log', function() {
  log('test1');
  log('test2');
  expect(1);
  return deepEqual(APP.Log.history, ['test1', 'test2']);
});

test('Url', function() {
  var base, testUriOne, testUriTwo;
  testUriOne = 'some/long/uri';
  testUriTwo = '/some/long/uri/';
  base = window.location.protocol + '//' + window.location.host + '/' + testUriOne;
  expect(3);
  APP.Config.set({
    baseUri: testUriOne
  });
  equal(APP.Url.base(), base);
  APP.Config.set({
    baseUrl: testUriTwo
  });
  equal(APP.Url.site('/test/'), base + '/test');
  return equal(APP.Url.site('test'), base + '/test');
});
