alter table posts
  add intended_post int(1) default 0;

alter table topic_readers add created_at int(13) not null;

update topic_readers set created_at = unix_timestamp();