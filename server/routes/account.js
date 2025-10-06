/*
*
*   /account/??? routes
*
*/

const express = require('express');
const router = express.Router();

/*
*   Mongodb setup/connection
*/
const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

//Server functions
const { read, remove, add, update, removeAll } = require('../data/mongoFunctions.js');


const dbName = 'A2';
let collection;

async function connectMongo(base){
    await client.connect();
    // console.log('Connected');
    const db = client.db(dbName);
    collection = db.collection(base);
}

//Allows use of user info in data folder
// const {users, updateUserJSON} = require('../data/user.js');

// const{groups, updateGroupJSON} = require('../data/group.js');

class User {
    constructor(username, email, password, roles=["user"]){
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}



router.post('/login', async(req, res) =>{
    const {username, password} = req.body;

    // Create query
    query = {username, password};
    // Connect to mongodb
    await connectMongo("users");
    // Retrieve data
    result = await read(collection, query);
    const user = result[0]

    //If a user is found
    if(user){
        //Checks if user is super admin, if so, gives all groups as their group list
        if(user.roles.includes("superAdmin")){
            let allGroups = [];

            await connectMongo("groups")
            const groups = await read(collection, {});

            //Loops through all groups, gets their name and id
            for(const g of groups){
                allGroups.push({name:g.name, id:g.id, admin:true});
            }
            //Sets user group to be all groups
            user.groups = allGroups;
        }else{
            await connectMongo("userGroup");
            const groupIDs = await read(collection, {userID: username});

            await connectMongo("groups");
            const groups = await read(collection, {id: { $in: groupIDs.map(groupID => groupID.groupID)}});
            console.log(groups);

            let userGroups =[]
            for(const g of groups){
                userGroups.push({name:g.name, id:g.id, admin:true});
            }
            //Sets user group to be all groups
            user.groups = userGroups;
        }


        //Seperates password and rest of user info
        const {password, ...userInfo} = user;
        //Adds valid attribute to info
        userInfo.valid = true;
        res.json(userInfo);
    }else{
        //Returns invalid
        res.json({valid: false});
    }

    client.close();
});

router.post('/create', async(req, res)=>{
    const {username, email, password} = req.body;

    await connectMongo("users")
    const usernameMatch = await read(collection, {username});
    const emailMatch = await read(collection, {email});


    //Returns error messages if username and email are already used 
    if(usernameMatch.length > 0 && emailMatch.length > 0){
        console.log("Username and Email already used");
        res.json({valid: false, mess:"Username and Email already used"})

    //Returns error if username is already used
    }else if(usernameMatch.length > 0 && emailMatch.length == 0){
        console.log("Username used");
        res.json({valid: false, mess:"Username must be unique"})

    //Returns error if email is already used
    }else if(usernameMatch.length == 0 && emailMatch.length > 0){
        console.log("Email used");
        res.json({valid: false, mess:"Email already used"})

    // Creates new user, returns valid
    }else{
        let newUser = new User(username, email, password);
        await add(collection, newUser)
        console.log(newUser);
        res.json({valid: true, mess:"User successfully created"})
    }

    client.close();
});

router.post('/retrieve', async(req, res)=>{
    const {username} = req.body;
    // Create query
    query = {username};
    // Connect to mongodb
    await connectMongo("users");
    // Retrieve data
    result = await read(collection, query);
    const user = result[0]

    //Checks if user is super admin, if so, gives all groups as their group list
    if(user.roles.includes("superAdmin")){
        
        await connectMongo("groups");
        const groups = await read(collection, {});
        client.close();
        
        let allGroups = [];
        //Loops through all groups, gets their name and id
        for(const g of groups){
            allGroups.push({name:g.name, id:g.id, admin:true});
        }
        //Sets user group to be all groups
        user.groups = allGroups;
    }else{
        await connectMongo("userGroup");
        const groupIDs = await read(collection, {userID: username});

        await connectMongo("groups");
        const groups = await read(collection, {id: { $in: groupIDs.map(groupID => groupID.groupID)}});

        let userGroups =[]
        for(const g of groups){
            userGroups.push({name:g.name, id:g.id, admin:true});
        }
        //Sets user group to be all groups
        user.groups = userGroups;
    }

        //Seperates password and rest of user info
    const {password, ...userInfo} = user;
    //Adds valid attribute to info
    userInfo.valid = true;
    res.json(userInfo);

    client.close();
});

router.post('/leaveGroup', async(req, res)=>{
    const {username, groupID} = req.body;
    query = {userID: username, groupID};

    await connectMongo("userGroup");
    await remove(collection, query);

    client.close();
    res.json({valid:true, mess:""});
});



router.post('/allOfGroup', async(req, res)=>{
    const {username, groupID} = req.body;

    // Create query
    query = {userID: {$ne : username}, groupID};

    // Get usernames from current group ID
    await connectMongo("userGroup");
    let userIDs = await read(collection, query);
    userIDs = userIDs.map(userID => userID.userID);
    
    // Get users from username
    await connectMongo("users")
    let groupUsers = await read(collection, {username: { $in: userIDs}})

    let usersOfGroup = groupUsers.filter(u=>({username: u.username, roles:u.roles}));

    client.close();
    res.json(usersOfGroup);
});

router.post('/retrieveAll', async(req, res)=>{
    const {username} = req.body;

    query = {username: {$ne : username}};

    await connectMongo("users");
    let users = await read(collection, query);

    //Gets username and roles of all users, skipping current user
    const userCopy = users.map(u=>({username: u.username, roles:u.roles}));

    client.close();
    res.json(userCopy);
});

router.post('/setRoles', (req, res)=>{
    const {username, roles} = req.body;

    //Find user

    //Set user.roles = roles

    //updateUserJSON();
});

router.post('/delete', async(req, res)=>{
    const {username} = req.body;

    // Delete user from users table
    await connectMongo("users");
    await remove(collection, {username});

    // Remove user from all groups
    // Remove all entires including username from user group linking table
    await connectMongo("userGroup");
    await removeAll(collection, {userID: username});

    client.close();
    res.json({valid:true, mess:""});
});

router.post('/joinGroup', async(req, res)=>{
    const {username, groupID, allow} = req.body;

    const query = {userID: username, groupID}

    // Remove request from requests table
    await connectMongo("requests");
    await remove(collection, query);

    //Add group to user group array
    if(allow){
        await connectMongo("userGroup");
        await add(collection, query);
    }

    client.close();
    res.json({valid:true, mess:""});
});



module.exports = router;