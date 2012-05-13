describe('the JSONRPC api', function () {
  var rpc;

  beforeEach(function () {
    rpc = new JSONRPC('//localhost');
  })

  describe('retries', function () {
    it('should call the retry_call function when doing normal calls', function () {
      spyOn(rpc, '_retry_call');
      rpc.doRPC('echo', 'Hi there', function () {});

      expect(rpc._retry_call).toHaveBeenCalled();
    });
    it('should call the retry_call function when doing normal notifications', function () {
      spyOn(rpc, '_retry_call');
      rpc.doNotification('echo', 'Hi there');

      expect(rpc._retry_call).toHaveBeenCalled();
    });
    it('should retry a call on a connection error three times', function () {
      var error, result, calls = 0, cbCalled = false;
      spyOn(rpc, '_call').andCallFake(function(requestId, name, args, callback) {
        calls++;
        expect(typeof callback).toBe('function');
        callback({type:'connectionerror'});
      });
      rpc.doRPC('echo', 'Hello World', function (_err, _result) {
        error = _err;
        result = _result;
        cbCalled = true;
      });

      waitsFor(function () { return cbCalled;}, 'Waiting for RPC callbacks');
      runs(function () {
        expect(error).toBeTruthy();
        expect(error.type).toBe('connectionerror');
        expect(result).toBeUndefined();
        expect(calls).toBe(3);
      });
    });
  });
});