(function($) {
	"use strict";

	/**
	 * Fires a 'window.resize' BUS event, when the window gets resized.
	 */

	var $window = $(window);
	function get_size() {
		return {w: $w.width(), h: $w.height()};
	};
	 
	$(document).ready(function() {
		// Fire initial event to setup UI
		var old_size = get_size();
		BUS.fire('window.resize', {before: old_size, 'to': old_size});

		// List for changes
		$w.resize(function() {
			var new_size = get_size();
			BUS.fire('window.resize', {
				'before': old_size,
				'to':  new_size
			});
			old_size = new_size;
		});
	});
})(jQuery);