function doRpcRequest(method, arguments) {
  var response = {}
    , finished = false;

  var rpc = new JSONRPC('http://wobble/api/endpoint.php', new EventBUS());
  rpc.doRPC(method, arguments, function (err, result) {
    if (err) {
      response.error = err;
    } else {
      response.json = result;
    }
    finished = true;
  });
  waitsFor(function () { return finished; }, 'Waiting for RPC response', 500);
  return response;
};

describe("API Basics", function () {
  describe("generic functions (non-wobble)", function () {
    it('should reply with the echo result', function () {
      var response = doRpcRequest('echo', ['Hello', 'World']);
      runs(function () {
        expect(typeof response.json).toBe('object');
      });
    });

    it('should respond to system.listMethods', function () {
      var response = doRpcRequest('system.listMethods', []);
      runs(function () {
        expect(typeof response.json).toBe('object');
        expect(response.json).toContain('system.listMethods');
      });
    });
  });

  describe("as unauthenticated user", function () {
    it('should return null as the current user (user_get)', function () {
      var res = doRpcRequest('user_get');
      runs(function () {
        expect(res.json).toBe(null);
      });
    });

    it('should return null for the current user_id (user_get_id)', function () {
      var res = doRpcRequest('user_get_id');
      runs(function () {
        expect(res.json).toBe(null);
      });
    });
  });

  describe("as authenticated app", function () {
    var apikey
      , app_email = 'stephan.zeissler@moinz.de'
      , app_key = 'test';

    beforeEach(function () {
      var authRes = doRpcRequest('user.authenticate_app', {email: app_email, user_app_key: app_key});
      runs(function () {
        expect(authRes.error).toBeFalsy();
        apikey = authRes.json.apikey;
      });
    });

    it('should return the users id on user_get_id', function () {
      var res = doRpcRequest('user_get_id', {apikey: apikey});
      runs(function () {
        expect(res.json).toBe(1);
      });
    });

    it('should return a user representation (user_get)', function () {
      var res = doRpcRequest('user_get', {apikey: apikey});
      runs(function () {
        expect(res.json).toBeTruthy();
        expect(res.json.email).toEqual(app_email);
        expect(res.json.user_app_key).toBeUndefined();
      });
    });
  });

  describe('as authenticated user', function () {
    var apikey
      , usr_email = 'stephan.zeissler@moinz.de'
      , usr_password = 'stephan99';

    beforeEach(function () {
      var authRes = doRpcRequest('user.authenticate_user', {email: usr_email, password: usr_password});
      runs(function () {
        expect(authRes.error).toBeFalsy();
        apikey = authRes.json.apikey;
      });
    });

    it('should return the users id on user_get_id', function () {
      var res = doRpcRequest('user_get_id', {apikey: apikey});
      runs(function () {
        expect(res.json).toBe(1);
      });
    });

    it('should return a user representation (user_get)', function () {
      var res = doRpcRequest('user_get', {apikey: apikey});
      runs(function () {
        expect(res.json).toBeTruthy();
        expect(res.json.id).toBe(1);
        expect(res.json.email).toEqual(usr_email);
        expect(res.json.user_app_key).toBeTruthy();
      });
    });
  });
});