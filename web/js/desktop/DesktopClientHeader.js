
function DesktopClientHeader() {
  this.e = $('<div></div>').attr('id', 'headline').prependTo('body');
  this.renderExtendedUser = true;

  this.e.append('<div class="navigation">' +
      '<span class="rpc_queue_state"></span> ' +
      '<span class="userinfo">Moinz.de Wobble</span> | ' +
      '<a href="http://github.com/zeisss/wobble" target="_new">Source</a> | ' +
      '<a href="#" id="signout">Sign Out</a>' +
      '</div>');

  this.$userinfo = $(".navigation .userinfo");

  // Handlers
  $("#signout").click(function() {
    console.log("Signout => Bye bye!");
    API.signout(function(err, data) {
      if (!err) {
        window.location.reload();
      }
    });
    return false;
  });

  $(".userinfo", this.e).on('click', function() {
    BUS.fire('ui.profile.show');
  });

  // Welcome the user
  BUS.on('api.user', function() {
    this.doRenderUser(API.user());
  }, this);

  // Show a queue status
  var $rpcQueueState = $(".rpc_queue_state", this.e);
  var isDev = localStorage && localStorage.getItem('WOBBLE_DEV');
  BUS.on('rpc.queue.length', function(stateWaitingLength) {
    if (stateWaitingLength <= 1) {
      $rpcQueueState.removeClass('active').text('');
    } else {
      $rpcQueueState.addClass('active');
      
      if (isDev) {
        $rpcQueueState.text("" + stateWaitingLength);
      }
    }
  }, this);
};

DesktopClientHeader.prototype.setRenderUser = function(shouldRender) {
  this.renderExtendedUser = shouldRender;
  this.doRenderUser(API.user());
};
DesktopClientHeader.prototype.doRenderUser = function(user) {
  if (this.renderExtendedUser) {
    var template = "<img style='border:1px black solid' width='{{size}}' height='{{size}}' src='http://gravatar.com/avatar/{{img}}?s={{size}}' title='{{name}}'/> {{name}}";
    this.$userinfo.empty().append(Mustache.to_html(template, {
      'img': user.img,
      'name': user.name,
      'size': 12
    }));
  } else {
    var label = "Hello " + user.name;
    this.$userinfo.text(label);
  }
};