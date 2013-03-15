# API v0.6.1
The API is available via JSON-RPC 2.0 at the endpoint `http://wobble.moinz.de/api/endpoint.php`.

## Public

 * `wobble.api_version() => string()`
   Returns a string identifying the API version the server implements. This is currently `0.6.1`.

 * `user_login(Input) => Result`
   ```
   Input = {'email': Email, 'password': Password}
   Email = Password = string()
   Result = {'apikey': string()}
   ```
   Performs a login and returns a apikey that is valid for thirty (30) days. Every
   call with this APIKEY will reset the thirty days.

 * `user_register(Input) => Result`
   ```
   Input = {'email': Email, 'password': Password}
   Email = Password = string()
   Result = {'apikey': string()}
   ```
   Registers a new user and logs him in. The APIKEY is returned.

## Authentication required
All methods here require a parameter `apikey` that can be obtained by calling `user_login()` first. Since all methods in this block require it, it is not explicitly listed. An error is thrown, when no `apikey` is provided.

### Topic Listing
 * topics_list
 * topics_search
 * topics_create

### Topic
 * topic_get_details
 * topic_add_user
 * topic_remove_user
 * topic_set_archived
 * topic_remove_message
 
 * post_create
 * post_edit
 * post_delete

 * post_change_read
 * post_change_lock
 * post_read (Deprecated, alias for `post_change_read`)

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

   ```
   User = {'id': UserId, 'email': Email, 'img': GravatarEmailHash, 
           'name': Username, 'online': 1|0}
   Username = Email = GravatarEmailHash = string()
   ```
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
   User = {'id': UserId, 'email': Email, 'img': GravatarEmailHash,
           'name': Username, 'online': 1|0}
   ```
   Returns an array of user objects describing the current list of user. It
   is sorted by the online and name.
   
 * `user_add_contact(Input) => bool()`
 
   ```
   Input = {'contact_email': Email}
   Email = string()
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