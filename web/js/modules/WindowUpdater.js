function WindowUpdater(model) {
  this.model = model;

  this.model.on('update', function() {
    var topics = this.model.getTopics();
    this.updateTitle(topics);
  }, this);
};

WindowUpdater.prototype.updateTitle = function(topics) {
  var user = API.user();
  if (user && topics) {
    var unreadTopics = jQuery.grep(topics, function(topic) {
      return topic.post_count_unread > 0;
    }).length;

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