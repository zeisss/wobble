;(function (exports) {
  /*global BUS EventBUS API */
  "use strict";

  /**
   * Events:
   * - updated
   */
  function WhoAmIModel(api) {
    this.api = api || API;
    this.user = api.user();

    BUS.on('api.user', function (user) {
      this.user = user;
      this.fire('updated', this.user);
    }, this);
  }
  _.extend(WhoAmIModel.prototype, EventBUS.prototype); // Make the model an eventbus
  exports.WhoAmIModel = WhoAmIModel;

  WhoAmIModel.prototype.getUser = function getUser() {
    return this.user;
  };




  exports.WhoAmIView = Backbone.View.extend({
    tagName: 'div',
    
    events: {
      'click div.whoami': 'click',
      'click .actions button#show_my_profile': 'click'
    },
    
    options: {
      imgprefix: 'http://gravatar.com/avatar/',
      profileLabel: 'Show my profile'
    },

    initialize: function () {
      _.bindAll(this, 'render', 'click');

      this.model.on('updated', this.render);
      this.render();

      $('<button id="show_my_profile"></button>').text(this.options.profileLabel).appendTo(this.$('.actions'))
    },

    render: function () {
      var $el = this.$('div.whoami');
      $el.empty();
      var user = this.model.getUser();
      if (!user) {
        return;
      }

      var template = "<img title='That is you!' src='{{{img}}}?s=32' width=32 height=32> <span class=name>{{name}}</span>";
      $el.append(Mustache.to_html(template, {
        img: this.options.imgprefix + user.img,
        name: user.name
      }));
    },

    click: function () {
      var $el = this.$('div.whoami');
      var pos = $el.offset();
      pos.top += $el.outerHeight() + 5;
      pos.left += 5;
      BUS.fire('ui.profile.show', pos);
    }
  });
})(window);