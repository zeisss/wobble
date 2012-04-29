// 37 left, 38 up, 39 right, 40 down
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, ENTER = 13;
function uiClickPost(post_id) {
  var $post = $('#post-' + post_id + '>.post').click();
  console.log(post_id, $post.parent());
  expect($post.size()).toBe(1);
}
function uiKeyDown(key) {
  e = jQuery.Event("keydown", {
    keyCode: key, 
    which: key,
    shiftKey: false,
    altKey: false,
    ctrlKey: false
  });
  $('body').trigger(e);
}


describe("how the topicview works", function() {
  beforeEach(function () {
    window.BUS = new EventBUS();
    window.API = {
      user_id: function() { return 7; }
    }

    this.addMatchers({
      toBeFocused: function toBeFocused() {
        this.message = function() {
          var msg = 'Expected "post-' + this.actual + '" to be the active post.';
          var activePost = $('.post.active').parent();
          if (activePost.size() == 0) {
            msg += ' No post is active.';
          } else {
            msg += ' Instead ' + activePost.attr('id') + ' is active.';
          }
          return msg;
        }
        var $e = $('#post-' + this.actual);
        return $('>.post', $e).hasClass('active');
      }
    });
  });

  afterEach(function () {
    window.BUS.clear();
    window.BUS = null;
    window.API = null;
  });

  describe('with keyboard navigation', function() {
    var view, topic;

    beforeEach(function() {
      topic = {
        "id":"1-1335554898831-39969",
        "readers":[
          {"id":1,"name":"DEV","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}
        ]
        ,"messages":[],
        "writers":[
          {"id":1,"name":"DEV","email":"stephan.zeissler@moinz.de","img":"6b24e6790cb03535ea082d8d73d0a235","online":1}
        ],
        "posts":[
          {"id":"1","content":"ROOT POST","revision_no":5,"parent":null,"created_at":1335554899,"timestamp":1335711764,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"root-2","content":"2. Post in root thread","revision_no":4,"parent":"1","created_at":1335566903,"timestamp":1335711845,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"root-3","content":"3. Post in Root Thread","revision_no":2,"parent":"root-2","created_at":1335567128,"timestamp":1335711877,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"2-1-1","content":"2.1-1: First Intended thread of 2. post in root","revision_no":3,"parent":"root-2","created_at":1335567371,"timestamp":1335711855,"deleted":0,"intended_post":1,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1-1","content":"1-1-1: <div>First Reply to ROOT<\/div>","revision_no":3,"parent":"1","created_at":1335691351,"timestamp":1335711773,"deleted":0,"intended_post":1,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1335691353577-69833","content":"<div>Second Reply in first intended thread of root<\/div>","revision_no":3,"parent":"1-1-1","created_at":1335691353,"timestamp":1335711822,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"2-2-2", "content":"2.2-2: <div>Second intended thread of 2.post in root<\/div>","revision_no":3,"parent":"root-2","created_at":1335691356,"timestamp":1335711866,"deleted":0,"intended_post":1,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1335693605919-45347","content":null,"revision_no":2,"parent":"1-1-1","created_at":1335693605,"timestamp":1335693606,"deleted":1,"intended_post":1,"unread":1,"locked":null,"users":[]},
          {"id":"2-2-2","content":"2.2-2 - Second Post in Second intended Thread of 2. Post in Root","revision_no":3,"parent":"2-2-2","created_at":1335693655,"timestamp":1335711895,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1335693658873-5638", "content":"First intended thread of second intended thread of 2. post in root","revision_no":3,"parent":"2-2-2","created_at":1335693658,"timestamp":1335711908,"deleted":0,"intended_post":1,"unread":0,"locked":null,"users":[1]},
          {"id":"2.2-1.1-2","content":"<div>second post in first intended thread of second intended thread of 2.post in root<\/div>","revision_no":3,"parent":"1-1335693658873-5638","created_at":1335693684,"timestamp":1335711923,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1-1-2-1","content":"2.1-1.2-1: <div>2. Intended Thread Post to First Reply<\/div><div>1. intended thread is deleted \/ empty.<\/div><div>Next Sibling is deleted<\/div>","revision_no":5,"parent":"1-1-1","created_at":1335693699,"timestamp":1335711835,"deleted":0,"intended_post":1,"unread":0,"locked":null,"users":[1]},
          {"id":"1-1335708624955-50040","content":null,"revision_no":2,"parent":"1-1-1-2-1","created_at":1335708624,"timestamp":1335708626,"deleted":1,"intended_post":0,"unread":1,"locked":null,"users":[]},
          {"id":"1-1335708627604-75821","content":"<div>Previous Sibling is deleted<\/div>","revision_no":1,"parent":"1-1335708624955-50040","created_at":1335708627,"timestamp":1335711808,"deleted":0,"intended_post":0,"unread":0,"locked":null,"users":[1]},
          
          {"id":"2-3-1","parent":"root-2","content":"2.3-1","revision_no":1,"timestamp":3,"deleted":0,"intended_post":1,"unread":0,"users":[1]},
          {"id":"2-3-2","parent":"2-3-1","content":"2.3-2","revision_no":1,"timestamp":3,"deleted":0,"intended_post":1,"unread":0,"users":[1]},
          
          {"id":"3-1-1","parent":"root-3","content":"3.1-1","revision_no":1,"timestamp":1335711808,"deleted":1,"intended_post":1,"unread":0,"users":[1]},
          {"id":"3-1-1-1-1","parent":"3-1-1","content":"3.1-1.1-1","revision_no":1,"timestamp":2,"deleted":0,"intended_post":1,"unread":0,"users":[1]},
          
          {"id":"root-4", "parent":"root-3", "content": "4", revision_no:1, timestamp: 1, deleted: 0, intended_post:0,unread:0,users:[1]},
        ],
        "archived":0,
        "created_at":1335554899
      };
    
      view = new JQueryTopicView();
      view.renderTopic(topic);
    });
    
    afterEach(function() {
      view.destroy();
      view = null;
    });
    describe('using the UP key', function () {
      it('should support navigating to the previous post', function selectNextPost() {
        uiClickPost('root-2');
        uiKeyDown(UP);
        expect('1').toBeFocused();
      });

      it('should ignore the prev post, if it is deleted and focus the one before', function selectNextUndeletedPost() {
        uiClickPost('1-1335708627604-75821');
        uiKeyDown(UP);
        expect('1-1-1-2-1').toBeFocused();
        expect('1-1335708624955-50040').not.toBeFocused();
      });

      it('should keep the focus, if there is no prev post', function keepFocusOnEnd() {
        uiClickPost('1');
        uiKeyDown(UP);
        expect('1').toBeFocused();
      });
    
      it('should focus the last post in the prev reply_thread, if exists', function focusPrevReplyThread() {
        uiClickPost('2-2-2');
        uiKeyDown(UP);
        expect('2-1-1').toBeFocused();
      });
      
      it('should focus the last element of the previous reply_thread', function () {
        uiClickPost('2-3-1');
        uiKeyDown(UP);
        expect('2-2-2').toBeFocused();
      })
      
      it('should ignore the previous reply_thread, if it contains no post and focus the parent', function () {
        uiClickPost('1-1-1-2-1');
        uiKeyDown(UP);
        expect('1-1-1').toBeFocused();
      })
    });
    describe('using the DOWN key', function () {
      it('should support navigating to the next post when pressing down', function selectNextPost() {
        uiClickPost('1');
        uiKeyDown(DOWN);
        expect('root-2').toBeFocused();
      });

      it('should ignore the next post, if it is deleted and focus the one following after', function selectNextUndeletedPost() {
        uiClickPost('1-1-1-2-1');
        uiKeyDown(DOWN);
        expect('1-1335708627604-75821').toBeFocused();
        expect('1-1335708624955-50040').not.toBeFocused();
      });

      it('should keep the focus, if there is no following post', function keepFocusOnEnd() {
        uiClickPost('root-4');
        uiKeyDown(DOWN);
        expect('root-4').toBeFocused();
      });

      it('should focus the first post in the next reply_thread, if exists', function focusPrevReplyThread() {
        uiClickPost('2-1-1');
        uiKeyDown(DOWN);
        expect('2-2-2').toBeFocused();
      });
    });

    describe('using the LEFT key', function () {
      it('should focus the post on the next upper level', function () {
        uiClickPost('1-1335693658873-5638');
        uiKeyDown(LEFT);
        expect('2-2-2').toBeFocused();
      });
      
      it('should focus the parent-parent post, if the parent is deleted', function focusParentsOnDeleted() {
        uiClickPost('3-1-1-1-1');
        uiKeyDown(LEFT);
        expect('root-3').toBeFocused();
      });
    });

    describe('using the RIGHT key', function () {
      it('shoudl focus the first post in a reply_thread', function () {
        uiClickPost('1');
        uiKeyDown(RIGHT);
        expect('1-1-1').toBeFocused();
      });

      it('should focus the first valid post in any reply_thread', function () {
        uiClickPost('1-1-1');
        uiKeyDown(RIGHT);
        // 1-1-1 has a deleted post in the first reply_thread, so use the 2.
        expect('1-1-1-2-1');
      });

      it('should focus the child of the first reply, if the first reply is deleted', function () {
        uiClickPost('root-3');
        uiKeyDown(RIGHT);
        expect('3-1-1-1-1').toBeFocused();
      })
    });

    describe('using the ENTER key', function () {
      beforeEach(function () {
        spyOn(view, 'onReplyPost');
        spyOn(view, 'onIntendedReplyPost');
      });

      it('should call onIntendedReplyPost, if a non-intended reply exists', function () {
        uiClickPost('1');
        uiKeyDown(ENTER);
        expect(view.onIntendedReplyPost).toHaveBeenCalled();
        expect(view.onReplyPost).not.toHaveBeenCalled();
      });

      it('should call onReplyPost, if no non-intended reply exists', function () {
        uiClickPost('root-4');
        uiKeyDown(ENTER);
        expect(view.onReplyPost).toHaveBeenCalled();
        expect(view.onIntendedReplyPost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Content Editing', function () {
    var view;
    beforeEach(function () {
      view = new JQueryTopicView();
    });
    afterEach(function () {
      view.destroy();
      view = null;
    });

    it('should rewrite the target attribute of links', function () {
      var topic = {
        readers: [],
        writers: [],
        posts: [
          {users:[], deleted:0, id:"no-id", content: "<a id='testlink' href='http://example.org'>Click me!</a>"}
        ]
      };
      view.renderTopic(topic);
      expect($("#testlink").attr('target')).toBe('_new', 'Target attribute was fixed.');
    });

    it('should rewrite the target attribute of links', function () {
      var topic = {
        readers: [],
        writers: [],
        posts: [
          {users:[], deleted:0, id:"no-id", content: "<a id='testlink' href='http://example.org' target='top'>Click me!</a>"}
        ]
      };
      view.renderTopic(topic);
      expect($("#testlink").attr('target')).toBe('_new', 'Target attribute was fixed.');
    });
  });
});