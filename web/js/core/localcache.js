(function(exports){
  // A cache object. Must support set(key, value, timeout) and get(key)

  /**
   * A dummy cache which does not write or return any values ever.
   */
  function DevNullCache() {}
  DevNullCache.prototype.set = function set(key, value, timeout) {};
  DevNullCache.prototype.get = function get(key) { return null; };


  function LocalStorageCache() {}
  LocalStorageCache.prototype._now = function _now() {
    return Math.ceil(new Date().getTime() / 1000);
  };

  LocalStorageCache.prototype.set = function set(key, value, timeout) {
    window.localStorage.setItem(key, JSON.stringify({
      'timestamp': this._now() + timeout,
      'value': value
    }));
  };

  LocalStorageCache.prototype.get = function get(key) {
    var value = window.localStorage.getItem(key);
    if (value) {
      var object = JSON.parse(value);
      if (object && object.timestamp && this._now() < object.timestamp) {
        return object.value;
      }
    }
    return null;
  };

  exports.getCache = function getCache() {
    if (window.localStorage) {
      return new LocalStorageCache();
    } else {
      return new DevNullCache();
    }
  };
})(window.localcache = {});