"use strict";

function MobileNavigation(app) {
	this.e = $('<div></div>').attr('id', 'navigator').appendTo('body');

	var template = '<button id="navOverview">Overview</button>' + 
				   '<button id="navContacts">Contacts</button>' + 				   
				   '<button id="navLogout">Logout</button>'
	this.e.append(template);

	$('button', this.e).click(function() {
		var $b = $(this);
		app.onNavigation($b.attr('id'));
	});
}