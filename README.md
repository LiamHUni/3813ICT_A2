GitHub Link: https://github.com/LiamHUni/3813ICT_A2/
# s5333819 - 3813ICTA2

## Use of git repo
During the development of this project, git and GitHub were used to create backups after every new function was added to ensure a stable version was available. Branching was used when implementing new features to ensure the main branch only contained complete working versions. Each branch will be explained below. Both the frontend (angular application) and backend (node server) were stored under the same directory, so only one git repo was required for the entire project.

### channel-modal-testing:
This was part of A1 development, used when adding the modal to create channels. This branch was made as a new component had to be installed, ensuring main branch was safe from any errors this could cause.

### mongodbMigration:
The first branch for A2. Used when transfering the data storage to mongodb. This mainly focused around server side scripts, changing account.js and group.js (sub-routing scripts) to query mongodb directly instead of using json storage. For the mongodb functions, a mongoFunctions.js containing functions for read, add, remove, removeMany, update and updateMany was used.

### profileImage:
Used when adding the ability for users to upload custom profile pictures. This branch added a new profile page, accessible from the bottom left account drop down. This page contains users information (username, email and roles), with a preview of their profile picture and a button to upload an image file to set as their profile picture. These images are converted to a Base64 string that allows for them to be stored directly in the database without the need to download and reference an image path.

### socketMessages:
This branch focused on implementing server sockets. A socket.js file was added to the server to handle all socket functions (roomJoin, sendMessage, and roomLeave). On the client side a new service was added to handle all socket messages to and from the server. Saving messages to mongodb was also added in this branch, allowing for saving and retrieval of messages for future use. Image upload in messages was also added, using the same Base64 image storage method as user profiles pictures did.

### cleanUp:
This branch was used to clean up code, which included removing unneeded console.log calls, old files (all files used for JSON data storage), and unneeded code. Commenting was adding to all functions and scripts for easier understanding of the code. The README.md was also updated to reflect the changes made in A2.

## Data Structure
Data storage has been migrated from json storage to mongodb storage. There is now six tables which data is stored in. All interactions to the mongodb server are done on the server sides subroute scripts; account.js and group.js. The data structures for each table, and the links between the table are shown below:

### users:
```
username: string
email: string
password: string
roles: string[]
pfpImage: string
```
username is unique
pfpImage is stored as Base64 string, an image converted to a string

### groups:
```
id: number
name: string
```

### userGroup:
```
userID: string
groupID: number
```
userID is a user's username
groupID is a groups id

### channels:
```
_id: ObjectID
name: string
groupID: number
```
_id is the unique idenitfier given by mongodb
groupID is a groups id

### messages:
```
channelID: string
userID: string
message: string
image: string
order: number
```
channelID is the string component of a channels _id ObjectID
userID is a user's username
image is stored as Base64 string, an image converted to a string
order is used determine what messages should be kept, deleting all messages with a value over a certain number (max messages per channel)

### requests:
```
userID: string
groupID: number
```
userID is a user's username
groupID is a groups id

### Database Link Layout:
<img width="1067" height="842" alt="database_layout" src="https://github.com/user-attachments/assets/b12637ff-36c0-4585-b3a2-16025d11c8ee" />


## Routing
All routing goes through Server.js, but is split between two sub routes ```/account/???``` and ```/group/???```

### /account/??? routes
```/login```
Used to sign in user

Parameters:
  username: string
  password: string

Return:
  {
    username: string,
    email: string,
    roles: [],
    groups: []
  }

```/create```
Used to create new user

Parameters:
  username: string,
  email: string,
  password: string

Return:
  {valid: boolean, mess: string}

```/retrieve```
Used to get information on single user

Parameters:
  username: string

Return:
  {
    username: string,
    email: string,
    roles: [],
    groups: []
  }

```/leaveGroup```
Deletes user group link from userGroup table

Parameters:
  username: string,
  groupID: number

Return:
  {valid: boolean, mess: string}

```/allOfGroup```
Returns all users of a group

Parameters:
  username: string,
  groupID: number

Return:
  Array of users
  
```/retrieveAll```
Returns all users

Parameters:
  username: string,
  groupID: number

Return:
  Array of users

```/setRoles```
Sets users rolls

Parameters:
  username: string,
  roles: []

Return:
  {valid: boolean, mess: string}

```/delete```
Deletes user from user table, clears all documents that reference them from database

Parameters:
  username: string,

Return:
  {valid: boolean, mess: string}

```/joinGroup```
Creates new user group link in userGroups table of mongodb

Parameters:
  username: string,
  groupID: number

Return:
  {valid: boolean, mess: string}

```/updatepfp```
Updates users profile image in mongodb

Parameters:
  username: string,
  image: number

Return:
  {valid: boolean, mess: string}

### /group/??? routes
```/create```
Creates new group

Parameters:
  name: string,
  user: string


```/retrieveAll```
Returns all groups

Parameters:
  username: string

Return:
  Array of groups

```/retreieve```
Retrieves single group

Parameters:
  username: string,
  groupID: number

Return:
  Group object

```/requestAccess```
Creates new document in requests table, using username and groupID

Parameters:
  username: string,
  groupID: number

Return:
  {valid:boolean, mess:string}


```/getRequests```
Get all join requests for group

Parameters:
  groupID: number

Return:
  Array of strings

  
```/createChannel```
Creates new document in channel for new channel

Parameters:
  groupID: number,
  channelName: string

Return:
  {valid:boolean, mess:string}
  
```/getChannel```
Retrieves channel information, messages, and user information for the messages

Parameters:
  channelID: string

Return:
  {
    name: string,
    messages: [
      {
        username: string,
        pfpImage: string,
        message: string,
        image: string
      }
    ]
  }
  
```/deleteChannel```
Deletes channel channels table

Parameters:
  groupID: number,
  channelName: string

Return:
  {valid:boolean, mess:string}
  
```/deleteGroup```
Deletes group, all channels for the group, and all messages for groups channels

Parameters:
  groupID: number

Return:
  {valid:boolean, mess:string}

```/addMessage```
Creates document in messages table, increases order of channel messages by 1, deletes all messages with an order above a set amount (max messages per channel)

Parameters:
  channelID: string,
  userID: string,
  message: string,
  image: string

Return:
  {valid:boolean, mess:string}
  

### Sockets
```roomJoin```
Socket message with 'roomJoin' as topic is sent once upon clicking channel, adds user to desired room using channel _id as room name. Emits '{username} has joined the chat' as 'Server' to room.

Parameters:
  room: string
  user: string

Emit:
  {user:{username:"Server"}, message:`${user.username} has joined the chat`}

```sendMessage```
Main socket function, used to emit user message to all users in given room. Recieves channel _id, user info, message, and image from user's client. Uses _id to determine room to emit message to. 

Parameters:
  room: string
  user: object
  message: string
  image: string

Emit:
  {user, message, image}

```roomLeave```
Socket message with 'roomLeave' as topic is sent once upon leaving channel, removes user from given room using channel _id as room name. Emits '{username} has left the chat' as 'Server' to room.

Parameters:
  room: string
  user: string

Emit:
  {user:{username:"Server"}, message:`${user.username} has left the chat`}
  

## File Layout
```
/
├─ server/
|  ├─ server.js  #Entry point to server, utilises subroutes for all logic
|  ├─ routes/
|  | ├─ account.js  #Handles all routes related to accounts
|  | ├─ group.js  #Handles all routes related to groups
|  |
|  ├─ data/
|    ├─ group.js  #Handles logic for saving to temporary group json
|    ├─ group.json  #Temporary file storage for groups
|    ├─ user.js  #Handles logic for saving to temporary user json
|    ├─ user.json  #Temporary file storage for users
|
├─ src/
   ├─ app/
   |  ├─ app.routes.ts
   |  ├─ app.html
   |  ├─ login/  #Login Page
   |  ├─ main-screen/  #Main Page - utilises subrouting for main content
   |  ├─ components/
   |     ├─ channel-modal/  #Modal - form for creating channels
   |     ├─ create-group/  #Subpage of main page - form for creating groups
   |     ├─ create-user/  #Subpage of main page - form for creating users
   |     ├─ group-browser/  #Subpage of main page - displays list of groups
   |     ├─ group-screen/  #Subpage of main page - handles inside of groups, selectable channels, etc
   |     ├─ user-manager/  #Subpage of main page or group screen - allows for accepting requests, kicking and deleting users
   |
   ├─ assets/ #Stores local assets
   ├─ guards/
   |  ├─ signed-in-guard.ts #Guard for when user is signed in
   |  ├─ signed-out-guard.ts  #Guard for when user is signed out
   |
   ├─ services/
      ├─ account-service.ts #Handles communicating to account.js in Server
      ├─ group-service.ts #Handles communicating to group.js in Server
```
