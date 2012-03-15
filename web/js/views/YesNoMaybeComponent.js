"use strict";

function YesNoMaybeComponent() {
};
YesNoMaybeComponent.prototype.render = function() {
  return "<div class='yesnomaybe component'>" +
         "<div class='option yes'><div class='header'>Yes</div><ul class='list'><li>Stephan</li><li>Miro</li></ul></div>" +
         "<div class='option no'><div class='header'>No</div><ul class='list'><li>Waldemar</li></ul></div>" +
         "<div class='option maybe'><div class='header'>Maybe</div><ul class='list'></ul></div>" +
         "</div>";
}
YesNoMaybeComponent.prototype.add = function(content) {
  return content.replace(/\[yesnomaybe\]/,this.render());
};
YesNoMaybeComponent.prototype.remove = function(content) {
  return $('.yesnomaybe.component', content).replaceWith('[yesnomaybe]');
};
