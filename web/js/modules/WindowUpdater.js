function WindowUpdater(model) {
  this.model = model;

  this.model.on('update', function() {
    var unreadTopics = this.model.getInboxUnreadTopics();
    this.updateTitle(unreadTopics);
  }, this);
};

WindowUpdater.prototype.updateTitle = function(unreadTopics) {
  var user = API.user();
  if (user) {
    // If Tinycon is available, use that (else fallback)
    if (Tinycon) {
      document.title = user.name + ' - Wobble';
      Tinycon.setBubble(unreadTopics);
    }
    else if (unreadTopics == 0) {
      document.title = user.name + " - Wobble";
    } else {
      document.title = "(" + unreadTopics + ") " + user.name + " - Wobble";
    }
  }
};