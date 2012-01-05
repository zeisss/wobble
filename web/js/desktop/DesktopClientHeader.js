
function DesktopClientHeader() {
	this.e = $('<div></div>').attr('id', 'headline').prependTo('body');
	
	this.e.append('<div class="navigation">' + 
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
	
	// Welcome the user
	BUS.on('api.user', function() {
	   $(".navigation .userinfo").text("Hello " + API.user().name);
	}, this);
};
