
function DesktopClientHeader() {
  this.e = $('<div></div>').attr('id', 'headline').prependTo('body');

  this.e.append('<div class="navigation">' +
      '<span class="rpc_queue_state"></span> ' +
      '<span class="userinfo">Moinz.de Wobble</span> | ' +
      '<a href="http://github.com/zeisss/wobble" target="_new">Source</a> | ' +
      '<a href="#" id="signout">Sign Out</a>' +
      '</div>');

    // 
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
     $(".navigation .userinfo").text("Hello " + API.user().name);
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
