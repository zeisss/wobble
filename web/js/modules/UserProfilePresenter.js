/*global BUS API */
"use strict";

function UserProfilePresenter() {
  var that = this;
  BUS.on('ui.profile.show', function() {
    that.openProfilePopup();
  });  
}

UserProfilePresenter.prototype.openProfilePopup = function() {
  var that = this;
  BUS.fire('contact.clicked', {
      'contact': API.user(),
      'actions': [
        {title: 'Change my name', callback: function() {
            var newName = window.prompt("What should your new name be?");
            if (newName !== null) {
              that.onNameChange(newName);
            }
        }},
        {title: 'Change password', callback: function() {
           var p1 = window.prompt('What should your new password be?');
           if (p1 !== null) {
             var p2 = window.prompt('And once again to be sure:');
             if (p2 !== null) {
               if (p1 === p2) {
                   that.onPasswordChange(p1);
               } else {
                   window.alert('Your two passwords do not match. Try again.');   
               }
             }
           }
        }}
      ]
   });
};

UserProfilePresenter.prototype.onNameChange = function(newName) {
  API.user_change_name(newName, function(err, result) {
    API.refreshUser();
  });
};
UserProfilePresenter.prototype.onPasswordChange = function(newPassword) {
   API.user_change_password(newPassword, function(err, result) {
       if (result) {
           window.alert('Password changed successfully.');
       }
   });
};