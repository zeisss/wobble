beforeEach(function () {
  this.addMatchers({
    toBeCallable: function toBeCallable() {
      this.message = function() {
        return 'Expected ' + this.actual + ' to be a function';
      }
      return typeof this.actual === 'function';
    }
  })
});
describe('localcache', function () {
  it('should provide getters and setter', function () {
    var cache = localcache.getCache();
    expect(cache).toBeTruthy();
    expect(cache.get).toBeCallable();
    expect(cache.set).toBeCallable();
  });

  it('should return the value, that was written with set', function () {
    var cache = localcache.getCache();
    var testObject = {adam: 'riese', names: ['Adam', 'Eva']};
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');

    cache.set('object', testObject);
    var testObjectResult = cache.get('object');
    expect(testObjectResult).toEqual(testObject);
    expect(testObjectResult).not.toBe(testObject);
  });

  it('should cache the value, so that other instances can access it later', function () {
    var cache = localcache.getCache();
    cache.set('key', 'value');

    cache = null;
    cache = localcache.getCache();
    expect(cache.get('key')).toBe('value');
  });

  it('should be able to provide an expire parameter when writing', function () {
    var cache = localcache.getCache();
    cache.set('key', 'value', 1); // Key is only valid for 1s

    waits(1100);

    runs(function () {
      expect(cache.get('key')).toBe(null);
    });
  })
});