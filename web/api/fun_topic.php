<?php
	/*
		setTimeout(function() {
			callback(undefined,  {
				id: topic.id,
				users: [
					{userid: '1', name: 'ZeissS', img: 'http://0.gravatar.com/avatar/6b24e6790cb03535ea082d8d73d0a235'},
					{userid: '2', name: 'Calaelen', img: 'http://1.gravatar.com/avatar/5d669243ec0bd7524d50cf4bb5bf28d8'}
				],
				posts: [
					{id: '1', content: '<b>Hello World</b><br />Hi there! This is topic with id=' + topic.id, users:['1']},
					{id: '2', content: 'Moar!', users:['2']}, 
					{id: '3', parent: '1', content: 'Intended Comment!', users:['1', '2']}
				]
			});
		}, 1000);
	*/
	function topic_get_details($param) {
		global $USERS;
		return array(
			'id' => $param['id'],
			'users' => $USERS,
			'posts' => array(
				array('id' => '1', 'content' =>  '<b>Hello World</b><br />Hi there! This is topic with id=' . $param['id'], 'users' => array('1')),
				array('id' => '2', 'content' =>'Moar!', 'users' => array('2')), /* first reply, no indentation */
				array('id' => '3', 'parent' => '1', 'content' => 'Intended Comment!', 'users' => array('1', '2'))
			)
		);
	}