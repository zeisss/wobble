# API v0.7.0
The API is available via JSON-RPC 2.0 at the endpoint `http://wobble.moinz.de/api/endpoint.php`.

## Datastructures
A few of the API functions use the same datastructures in their input- or return values. Thus here is a list of common datatypes:

```
string() = …
int() = …
bool() = true|false
intbool() = 1 | 0

UserId = MessageId = int()
TopicId = PostId = string()

User = {'id': UserId, 'email': Email, 'img': GravatarEmailHash, 
        'name': string(), 'online': intbool()}
GravatarEmailHash = string()
Email = string()

Message = {'message_id': MessageId, 'data': Object}

Post = {'id': PostId, 'content':string(), 'revision_no': int(),
        'parent': PostId, 'timestamp': int(), 'deleted': intbool(),
        'unread': intbool(), 'read': intbool()}
        
MetaTopic = {'id': TopicId, 'abstract': string(), 'users': [User],
             'max_last_touch': int(), 'post_count_unread': int(),
             'post_count_total': int(), 'archived': intbool()}
```


## Public

 * `wobble.api_version() => string()`
   Returns a string identifying the API version the server implements. This is currently `0.7.0`.

 * `user_login(Input) => Result`

   ```
   Input = {'email': Email, 'password': Password}
   Password = string()
   Result = {'apikey': string()}
   ```
 
   Performs a login and returns a apikey that is valid for thirty (30) days. Every
   call with this APIKEY will reset the thirty days.

 * `user_register(Input) => Result`
 
    ```
   Input = {'email': Email, 'password': Password}
   Password = string()
   Result = {'apikey': string()}
   ```

   Registers a new user and logs him in. An APIKEY is returned.

## Authentication required

All methods here require a parameter `apikey` that can be obtained by calling `user_login()` first. Since all methods in this block require it, it is not explicitly listed. An error is thrown, when no `apikey` is provided.

### Topic Listing
 * `topics_list(Input) => Result`
   ```
   Input = {'archive': intbool()}
   Result = {'topics:' [Topic], 'inbox_unread_topics': int()}
   ```
   
   Return a list of topics the user can see. Pass `archive=1` to show the archive,
   `archive=0` to show the inbox.
   
 * `topics_search(Input) => Result`
 
   ```
   Input = {'filter': string()}
   Result = {'topics:' [Topic], 'inbox_unread_topics': int()}
   ```
 
   Performs a search through all topics the user can see.
   
 * `topics_create(Input) => TopicId`
 
   ```
   Input = {'id': TopicId}
   ```
   
   Creates a new topic.

### Topic

For all of these functions, the client must be authenticated and the user must be a reader of the topic.

 * `topic_get_details(Input) => Result`
   
   ```
   Input = {'id': TopicId}
   Result = {'id':TopicId, 
             'readers': [User], 
             'messages': [Message], 
             'writers': [User], 
             'posts': [Post]}
   ```
   
   Returns the topic object which is specified by the parameter 'id'.
   
   The posts is an array of all posts of the topic.
   
   Messages is the list of unacknowledged messages for this topic. A message is
   generated when users leave or join the topic. Use `#topic_remove_message()`
   to clear them.
 
   The resulting object also contains two lists of users: Readers and Writers.
   The `readers` are the users that currently belong to a topic. Any user can
   modify this list. The `writers` are all users that have ever written anything
   into a topic. This is intended as a help for the UI to be able to show the
   user info for posts of users, that no longer belong to a post.
   
 * `topic_add_user(Input) => true`
 
   ```
   Input = {'topic_id': TopicId, 'contact_id': UserId}
   ```
    
   Adds a user to the specified topic.
   
   Upon a change,
   * a `user_added` message is generated for all current readers of the topic
   * a `topic_changed` notification is generated
   * the topic is moved back to the inbox for all users, if archived.
   
 * `topic_remove_user(Input) => true`
   
   ```
   Input = {'topic_id': TopicId, 'contact_id': UserId}
   ```
   
   Removes a user from a topic. Any read/unread message status or other user
   information regarding the topic are immediately destroyed.
   
   E.g. if the user gets later readded to the topic, all posts are marked as
   unread.
   
   Upon a change,
   * the topic will be brought back to the inbox, if archived
   * a `topic_changed` notification will be generated for all readers
   * a `user_removed` message will be generated for all other readers
 
 
 * `topic_set_archived(Input) => true`
 
   ```
   Input = {'topic_id': TopicId, 'archived': intbool()}
   ```
  
   Marks the given topic as archived or not.
   
   A `topic_changed` notification is generated for the current user.
   
 * `topic_remove_message`
 
   ```
   Input = {'topic_id': TopicId, 'message_id': MessageId}
   ```
   
   Removes the specified message from the given topic.
   
   A `topic_changed` notification is generated for the current user.

 * `topic_change_read(Input) => true`
 
   Similar to `post_change_read` this function changes the `read` status of all posts and messages of the given topic.
   
   ```
   Input = {'topic_id': TopicId, 'read': intbool()}
   Result = true
   ```

   If `read` is `1` any message for the current user is also deleted.

 * `post_create(Input) => true`
   
   ```
   Input = {'topic_id': TopicId, 'post_id': PostId, 
            'parent_post_id': PostId}
   ```
   
   Creates a new post as a child in the given topic. The post is created for the
   current user and has an empty content.
   
   Upon a change, …
   * the topic will be brought back to the inbox, if archived
   * a `topic_changed` notification will be generated for all other readers.   
   
 * `post_edit(Input) => Result`
 
   ```
   Input = {'topic_id': TopicId, 'post_id': PostId, 
            'content': string(), 'revision_no': int()}
   Result = {'revision_no': int()}
   ```
   
   Changes the content of a post. The revision_no must match the current revision
   number, otherwise an exception will be thrown. This prevents overwritting
   changes of other users. The new revision_no is returned.
   
   Validation checks
   * Revision no must match
   * No lock must exist or it must be owned by the current user
   
   Upon a change,
   * the read status of the post for all other users will resetted
   * the topic will be brought back to the inbox, if archived
   * a `post_changed` notification will be generated for all other readers.
   
   The client must be authenticated and the user must be a reader of the topic.
   
 * `post_delete(Input) => true`
 
   ```
   Input = {'topic_id': TopicId, 'post_id': PostId}
   ```
 
   Marks the post as deleted, if it has children. Otherwise delete the post
   completly. This is due the tree-like arrangement of the posts, so one can
   only delete a post storage, if it has no children which refer to it.
   
   The client must be authenticated and the user must be a reader of the topic.

 * `post_change_read(Input) => true`
 
   ```
   Input = {'topic_id': TopicId, 'post_id': PostId, 'read': 0|1}
   ```
   
   Changes the `read` flag of the given post to either "read" (`1`)
   or "unread" (`0`).
   
 * `post_change_lock(Input) => bool()`
 
   ```
   Input = {'topic_id': TopicId, 'post_id': PostId,
            'user_id': UserId, 'lock': intbool()}
   Result = true | false
   ```
   
   Creates or deletes a lock owned by the current user for the given post. Returns
   true if the lock status was changed, false if it remains as before (no change).
 
 
 * `post_read`
 
    (Deprecated, alias for `post_change_read`)

### Session / User API

 * `user_change_name(Input) => TRUE`
 
   ```
   Input = {'name': Username}
   Username = string()
   ```
   Updates the visual name of the current user.

 * `user_change_password(Input) => TRUE`
 
   ```
   Input = {'password': string()}
   ```
 
   Updates the password of the current user.

 * `user_get() => User`

   Returns a representation of the current user.

 * `user_get_id() => int()`
 
   Returns the user id of the current user. Can be used to identify posts of
   the current user in topics.

 * `user_signout() => TRUE`
 
   Kills the current session. The apikey is invalid afterwards. Any unread
   notification is deleted.

### Notifications

 * `get_notifications(Input) => Result`
 
   ```
   Input = {'next_timestamp': int()}
   Result = {'next_timestamp': int(), 'messages': [Message]}
   Message = object()
   ```

   Returns the notifications for the current user. If no notifications are
   available, this wait up to 10secs. A notification is normally an object
   with a field `type` which describes the notification further.

   `next_timestamp` It is the last time you requested the notifications and part of the response.
   Don't pass it in on your first call. For subsequent calls pass in `$last_response.next_timestamp`.
   

It is used to know which message the client already consumed by just deleting everything with that timestamp or older ;)
 
### Contacts
 * `user_get_contacts() => Contacts`
 
   ```
   Contacts = [User]
   ```
   Returns an array of user objects describing the current list of user. It
   is sorted by the online and name.
   
 * `user_add_contact(Input) => bool()`
 
   ```
   Input = {'contact_email': Email}
   ```
 
   Returns `true` if the user was successfully added as a contact. `False`
   if the contact could not be added (either because there is no such user).

 * `user_remove_contact(Input) => TRUE`
 
   ```
   Input = {'contact_id': UserId}
   ```
   
   Removes the user identified by the `UserId` from the contact list.

## Glossar

- Post = The text a user types.
- Message = The yellow bar at the top of topic, currently only used for User Added/Removed
- Notification = Any change to the data structure you have access to