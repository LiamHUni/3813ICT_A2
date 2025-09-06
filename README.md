# s5333819 - 3813ICTA1

## Use of git repo
During the development of this project, git and GitHub were used to create backups after every new function was added to ensure a stable version was available. Branching was used when working with new installs which could affect the overall project, such as with the modals being added. Both the frontend (angular application) and backend (node server) were stored under the same directory, so only one git repo was required for the entire project.

## Data Structure
The two main data structures were users and groups, all required information was stored in these two. The storage of these arrays were done via seperate JavaScript files in the server, and saved to JSON files as a temporary storage solution. The layout of these data structures are shown below:

### Users:
```
username: string,
email: string,
password: string,
roles: string[],
groups: [
  {
    name: string,
    id: number,
    admin: boolean
  }
]
```

### Groups:
```
name: string,
id: number,
channels: string[],
joinRequests: string[]
```

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
Removes group from users group array

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
  
```/retrieveALl```
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
Deletes user from user array

Parameters:
  username: string,

Return:
  {valid: boolean, mess: string}

```/joinGroup```
Adds group to users group array

Parameters:
  username: string,
  groupID: number

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
Adds user to joinRequest in group object

Parameters:
  username: string,
  groupID: number

Return:
  {valid:boolean, mess:string}


```/getRequests```
Get all join requests from group

Parameters:
  groupID: number

Return:
  Array of strings

  
```/createChannel```
Add channel to group

Parameters:
  groupID: number,
  channelName: string

Return:
  {valid:boolean, mess:string}
  
```/deleteChannel```
Deletes channel from group

Parameters:
  groupID: number,
  channelName: string

Return:
  {valid:boolean, mess:string}
  
```/deleteGroup```
Deletes group

Parameters:
  groupID: number,

Return:
  {valid:boolean, mess:string}

  


### /group/??? routes

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
