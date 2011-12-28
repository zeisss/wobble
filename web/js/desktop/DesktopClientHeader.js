
function DesktopClientHeader() {
	this.e = $('<div></div>').attr('id', 'headline').prependTo('body');
	
	this.e.append('<div class="navigation">' + 
			'Moinz.de Wobble | ' +
			'<a href="http://github.com/zeisss/wobble" target="_new">Source</a> | ' + 
			'<a href="." id="signout">Sign Out</a>' +
			'</div>');

	$("#signout").click(function() {
		API.signout(function(err, data) {
			if (!err) window.location.reload();
		});
		return false;				
	});
};