/*global BUS */

/**
 * Fires a 'window.resize' BUS event, when the window gets resized.
 */
(function($) {
  "use strict";
  var $window = $(window);
  function get_size() {
    return {w: $window.width(), h: $window.height()};
  }

  $(document).ready(function() {
    // Fire initial event to setup UI
    var old_size = get_size();

    window.setTimeout(function() {
      BUS.fire('window.resize', {before: old_size, 'to': old_size});
    }, 10); // Add a little delay so the UI can be constructed

    // Listen for changes
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

