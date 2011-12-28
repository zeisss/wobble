/**
 * Fires a 'window.resize' BUS event, when the window gets resized.
 */
(function($) {
	"use strict";

	var $window = $(window);
	function get_size() {
		return {w: $window.width(), h: $window.height()};
	};
	 
	$(document).ready(function() {
		// Fire initial event to setup UI
		var old_size = get_size();
		BUS.fire('window.resize', {before: old_size, 'to': old_size});

		// List for changes
		$window.resize(function() {
			var new_size = get_size();
			BUS.fire('window.resize', {
				'before': old_size,
				'to':  new_size
			});
			old_size = new_size;
		});
	});
})(jQuery);


function JQueryClientHeader() {
	this.e = $('<div></div>').attr('id', 'headline').appendTo('body');
	
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