describe('the EventBUS', function () {
  var bus = null;
  beforeEach(function () {
    bus = new EventBUS();
  })

  it('should support registering for events', function () {
    var spy = jasmine.createSpy('callback');
    bus.on('test-event', spy);
    bus.fire('test-event');
    expect(spy).toHaveBeenCalled();
  })

  it('should support passing one argument to the event/callbacks', function() {
    var spy = jasmine.createSpy('callback').andCallFake(function(arg) {
      expect(arg).toEqual(['arg1', 'arg2']);
    });
    bus.on('test-event', spy);
    bus.fire('test-event', ['arg1', 'arg2'], {a: 1}, 'another one');
    expect(spy).toHaveBeenCalled();
  });

  it('should pass the event-name as the second argument to the callback', function () {
    var spy = jasmine.createSpy('callback').andCallFake(function(arg, eventName) {
      expect(arg).toBeFalsy();
      expect(eventName).toBe('test-event');
    });
    bus.on('test-event', spy);
    bus.fire('test-event');
    expect(spy).toHaveBeenCalled();
  });

  it('should support passing a context for the callback', function() {
    var ctx = jasmine.createSpy('context');
    var spy = jasmine.createSpy('callback').andCallFake(function () {
      expect(this).toBe(ctx);
    });

    bus.on('test-event', spy, ctx);
    bus.fire('test-event');
    expect(spy).toHaveBeenCalled();
  });

  it('should support multiple callbacks for an event', function () {
    var spy1 = jasmine.createSpy('callback1');
    var spy2 = jasmine.createSpy('callback2');

    bus.on('test-event', spy1);
    bus.on('test-event', spy2);

    bus.fire('test-event');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should support clearing the callbacks', function () {
    var spy = jasmine.createSpy('callback');
    bus.on('test-event', spy);
    bus.clear();
    bus.fire('test-event');
    expect(spy).not.toHaveBeenCalled();
  });
});