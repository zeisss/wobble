/*global BUS */

"use strict";

/**
 * Fires a 'window.resize' BUS event, when the window gets resized.
 */

function ResizeObserver() {
  var self = this;
  self.$window = $(window);

  $(document).ready(function() {
    // Fire initial event to setup UI
    self.old_size = self.get_size();

    window.setTimeout(function() {
      BUS.fire('window.resize', {before: self.old_size, 'to': self.old_size});
    }, 20); // Add a little delay so the UI can be constructed

    // Listen for changes
    self.$window.resize(function() {
      var new_size = self.get_size();
      BUS.fire('window.resize', {
        'before': self.old_size,
        'to':  new_size
      });
      self.old_size = new_size;
    });
  });
}

ResizeObserver.prototype.get_size = function get_size() {
  return {w: this.$window.width(), h: this.$window.height()};
};
