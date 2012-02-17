create table user_archived_topics (
	user_id int(11),
	topic_id varchar(32)
);

create unique index ui_user_archived_topics on user_archived_topics(user_id, topic_id);