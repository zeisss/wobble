/*global API BUS */

function OfflineBarPartial($parent) {
  this.e = $('<div></div>').addClass('offline_bar').appendTo($parent);
  this.offline = false;
  this.render();

  BUS.on('rpc.connectionerror', function () {
    var self = this;
    self.offline = true;
    self.intervalId = window.setInterval(function () {
      self.render();
    }, 1000);
  }, this);
  BUS.on('api.notification', function () {
    this.offline = false;
    window.clearInterval(this.intervalId);
    this.render();
  }, this);
}

OfflineBarPartial.prototype.render = function () {
  if (this.offline) {
    this.e.css('display', '');
    this.e.text('Offline!');
  }
  else {
    this.e.css('display', 'none');
  }
};

function DesktopClientHeader() {
  this.e = $('<div></div>').attr('id', 'headline').prependTo('body');

  this.e.append('<div class="navigation">' +
      '<span class="rpc_queue_state"></span> ' +
      '<span class="action userinfo">Moinz.de Wobble</span> ' +
      '<a class="action" href="http://github.com/zeisss/wobble" target="_new">Source</a> ' +
      '<a class="action" href="#" id="signout">Logout</a>' +
      '</div>'
      );
  this.offlineBar = new OfflineBarPartial(this.e);

  // Button Handler
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
    var pos = $(this).offset();
    pos.top += $(this).outerHeight() * 1.2;
    pos.left -= 50;
    BUS.fire('ui.profile.show', pos);
  });

  // Welcome the user
  function ui_username() {
    var user = API.user();
    if (user) {
      return user.name;
    } else {
      return "";
    }
  }
  BUS.on('api.user', function() {
     $(".navigation .userinfo").text(ui_username());
  }, this);
  $(".navigation .userinfo").text(ui_username());

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
}

