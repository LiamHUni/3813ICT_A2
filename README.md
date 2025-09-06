# 3813ICTA1

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```
## Routing
All routing goes through Server.js, but is split between two sub routes ```/account/???``` and ```/group/???```
<pre>
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
</pre>




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
