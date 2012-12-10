
module('APP.KeyHandler');

test('on', function() {
  var testOn;
  testOn = false;
  APP.KeyHandler.on('r', function() {
    return testOn = true;
  });
  APP.KeyHandler.trigger('r');
  expect(1);
  return ok(testOn);
});

test('trigger', function() {
  var testTrigger;
  testTrigger = false;
  APP.KeyHandler.on('r', function(str) {
    return testTrigger = str;
  });
  APP.KeyHandler.trigger('r', 'value');
  return equal(testTrigger, 'value');
});

test('off', function() {
  var testOff;
  testOff = false;
  APP.KeyHandler.on('r', function() {
    return testOff = true;
  });
  APP.KeyHandler.off('r');
  APP.KeyHandler.trigger('r');
  expect(1);
  return equal(testOff, false);
});
