"use strict";

$(document).ready(function() {
	function get_size() {
		return {w: $(window).width(), h: $(window).height()};
	};
	var old_size = get_size();
	BUS.fire('window.resize', {before: old_size, 'to': old_size});
	$(window).resize(function() {
		var new_size = get_size();
		BUS.fire('window.resize', {
			'before': old_size,
			'to':  new_size
		});
		old_size = new_size;
	});
});

