create table topic_messages(
    message_id int primary key auto_increment not null,
    topic_id varchar(255) not null,
    user_id int not null,
    data text not null
);

create index i_topic_messages on topic_messages (topic_id, user_id);
