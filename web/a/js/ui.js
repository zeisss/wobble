var wobble = angular.module('wobble', ['wobble.api']);
wobble.controller('ContactsCtrl', ['$scope', 'GetContacts', function ($scope, GetContacts) {
	$scope.size = 32
  $scope.contacts = [];
	GetContacts.get(function(err, data) {
		$scope.contacts = data;
	})

	$scope.contacts.forEach(function(c) {
		c.img = "http://gravatar.com/avatar/" + c.img + "?s=" + $scope.size;
	});
}]);

wobble.controller('TopicListCtrl', ['$rootScope', '$scope', 'API', function ($rootScope, $scope, API) {
	function setSelectedTopic(topicId) {
		$rootScope.selectedTopicId = topicId;
	}
	
	function onTopicListResult(result) {
		$scope.inbox_unread_topics = result.inbox_unread_topics;
		$scope.topics = result.topics.map(function(topic) {
			return {
        'id': topic.id,
        'users': topic.users.slice(0,1),
        'unread': topic.post_count_unread,
        'total': topic.post_count_total,
        'time': topic.max_last_touch,
        'abstract': topic.abstract,
        'archived': topic.archived == 1
      }
    });
	}
	function fetchTopicList(showArchived) {
		// DIsable both actions, while loading
		$scope.enableShowInbox = false;
		$scope.enableShowArchive = false;

    API.list_topics(showArchived, function(err, result) {
      onTopicListResult(result);
      $scope.enableShowInbox = showArchived;
      $scope.enableShowArchive = !showArchived;
    });
  };

	// search
	$scope.search = {
		term: "search",
		search: function() {
			console.log("Searching for ", $scope.search);
			if ($scope.search.term == "") {
				fetchTopicList(false);
			} else {
				$scope.enableShowInbox = false;
				$scope.enableShowArchive = false;

				API.topics_search($scope.search.term, function(err, result) {
					onTopicListResult(result);
					$scope.enableShowInbox = true;
					$scope.enableShowArchive = true;
				})
			}
		}
	};

	// Actions
	$scope.enableShowInbox = false;
	$scope.enableShowArchive = true;
	
	$scope.actions = {
		create: function() {
			console.log('new topic');
		},
		showArchive: function() {
			console.log('show archive')
			fetchTopicList(true);
		},
		showInbox: function() {
			console.log('show inbox');
			fetchTopicList(false);
		}
	};

	// TopicList
	$scope.topics = [];
	$scope.selectedTopic = null;
	
	$scope.inbox_unread_topics = 3;
	fetchTopicList(false);
	$scope.selectTopic = function(topicId) {
		console.log("select", topicId);
		setSelectedTopic(topicId);
	};
}]);

wobble.controller('TopicCtrl', ['$rootScope', '$scope', function($rootScope, $scope) {
	$scope.topic = {};
	
	$rootScope.$watch('selectedTopicId', function(old, newValue) {
		$scope.topic.id = newValue;
	})
}]);

wobble.controller('CurrentUserCtrl', ['$scope', 'API', function($scope, API) {
	$scope.user = null;  // unknown / no user
	API.wobble_api_version(function(err, version) {
		console.log('>>', version);
	})
	
	API.user_get(function(err, user) {
		if (err) {
			$scope.user = null;
		} else {
			$scope.user = user;
		}
	})
}]);

// niceTime renders a unix timestamp into a human readable timestring. It consists of "HH:mi" for dates from today, and "dd.mm." for everything before.
// Dates must be in the past.
wobble.filter('niceTime', function() {
  return function(timestamp) {
    if (!timestamp) {
      return "";
    }
    // NOTE: This format the date in the german way (localized): dd.mm.yyyy hh24:mi
    var createdAt = new Date(timestamp * 1000), now = new Date();
    var hours = createdAt.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    var minutes = createdAt.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var time = hours + ":" + minutes;
    
    var month = createdAt.getMonth() + 1;
    if (month < 0){
      month = "0" + month;
    }
    
    if (createdAt.getYear() === now.getYear()) {
      if (createdAt.getMonth() === now.getMonth() &&
        createdAt.getDate() === now.getDate()) { // This post is from today, only show the time
        return time;
      } else {
        // this post is at least from this year, show day + month
        return createdAt.getDate() + "." + month + ".";
      }
    } else {
      return createdAt.getDate() + "." + month + "."+ (1900 + createdAt.getYear());
    }
	};
})
