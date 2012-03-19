"use strict";

function YesNoMaybeComponent() {
  $('<link />').appendTo('head').attr({
    'media': 'all',
    'rel': 'stylesheet',
    'type': 'text/css',
    'href': 'js/yesnomaybe/yesnomaybe.css'
  });
};
YesNoMaybeComponent.prototype.render = function() {
  return '<div class="yes_no_maybe_widget">' + 
         '  <div id="yes_no_maybe_widget_yes_button" class="option_box yes">' +
         '    <div class="head">Yes</div>' + 
         '    <ul class="votes">' + 
         '      <li>Stephan</li>' + 
         '      <li>Imke</li>' + 
         '         <li>Mela</li>' + 
         '       </ul>' + 
         '     </div>' + 
         '     <div id="yes_no_maybe_widget_no_button" class="option_box no">' + 
         '       <div class="head">No</div>' + 
         '       <ul class="votes">' + 
         '         <li>Max</li>' + 
         '         <li>borg124123@googlemail.com</li>' + 
         '       </ul>' + 
         '     </div>' + 
         '     <div id="yes_no_maybe_widget_maybe_button" class="option_box maybe">' + 
         '       <div class="head">Maybe</div>' + 
         '       <ul class="votes">' + 
         '       </ul>' + 
         '     </div>' + 
         '     <div class="footer">' + 
         '     </div>' + 
         '   </div>';
}
YesNoMaybeComponent.prototype.add = function(content) {
  return content.replace(/\[yesnomaybe\]/,this.render());
};
YesNoMaybeComponent.prototype.remove = function(content) {
  return $('.yesnomaybe.component', content).replaceWith('[yesnomaybe]');
};
