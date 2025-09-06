/*
*
*   /account/??? routes
*
*/

const express = require('express');
const router = express.Router();

//Allows use of user info in data folder
const {User, users, updateUserJSON} = require('../data/user.js');

const{groups, updateGroupJSON} = require('../data/group.js');

router.post('/login', (req, res) =>{
    const {username, password} = req.body;

    //Finds any user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    //If a user is found
    if(user){
        //Checks if user is super admin, if so, gives all groups as their group list
        if(user.roles.includes("superAdmin")){
            let allGroups = [];
            //Loops through all groups, gets their name and id
            for(const g of groups){
                allGroups.push({name:g.name, id:g.id, admin:true});
            }
            //Sets user group to be all groups
            user.groups = allGroups;
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

    // updateUserJSON();
});

router.post('/create', (req, res)=>{
    const {username, email, password} = req.body;

    const usernameMatch = users.find(u => u.username === username);
    const emailMatch = users.find(u => u.email === email);

    //Returns error messages if username and email are already used 
    if(usernameMatch && emailMatch){
        console.log("Username and Email already used");
        res.json({valid: false, mess:"Username and Email already used"})

    //Returns error if username is already used
    }else if(usernameMatch && !emailMatch){
        console.log("Username used");
        res.json({valid: false, mess:"Username must be unique"})

    //Returns error if email is already used
    }else if(!usernameMatch && emailMatch){
        console.log("Email used");
        res.json({valid: false, mess:"Email already used"})

    // Creates new user, returns valid
    }else{
        let newUser = new User(username, email, password);
        users.push(newUser);
        console.log(newUser);
        res.json({valid: true, mess:"User successfully created"})
        updateUserJSON();
    }
});

router.post('/retrieve', (req, res)=>{
    const {username} = req.body;

    const user = users.find(u => u.username === username);

    if(user.roles.includes("superAdmin")){
        let allGroups = [];
        //Loops through all groups, gets their name and id
        for(const g of groups){
            allGroups.push({name:g.name, id:g.id, admin:true});
        }
        //Sets user group to be all groups
        user.groups = allGroups;
    }


    //Seperates password and rest of user info
    const {password, ...userInfo} = user;
    //Adds valid attribute to info
    userInfo.valid = true;
    res.json(userInfo);
});

router.post('/leaveGroup', (req, res)=>{
    const {username, groupID} = req.body;
    // console.log(username, groupID);

    // const userLeft  = user.groups.filter(group=>group.id !== groupID);
    // const userLeft  = {...user, groups:user.groups.filter(group=>group.id !== groupID)};
    // console.log(userLeft);


    const user = users.find(u => u.username === username);

    let index = user.groups.indexOf(user.groups.find(g=>g.id === groupID));
    if(index !== -1){
        user.groups.splice(index,1);
    }
    updateUserJSON();

    res.json({valid:true, mess:""});
});



router.post('/allOfGroup', (req, res)=>{
    const {username, groupID} = req.body;

    const usersOfGroup = users
    .filter(u=>u.username !== username)
    .filter(u=>u.groups.some(g=>g.id === groupID))
    .map(u=>({username: u.username, roles:u.roles}));
    // console.log(usersOfGroup);


    res.json(usersOfGroup);
});

router.post('/retrieveAll', (req, res)=>{
    const {username} = req.body;

    //Gets username and roles of all users, skipping current user
    const userCopy = users.map(u=>({username: u.username, roles:u.roles})).filter(u=>u.username !== username);

    res.json(userCopy);
});

router.post('/setRoles', (req, res)=>{
    const {username, roles} = req.body;

    //Find user

    //Set user.roles = roles

    //updateUserJSON();
});

router.post('/delete', (req, res)=>{
    const {username} = req.body;

    //Find user
    let user = users.find(u => u.username === username);
    //Get user index in users group
    let index = users.indexOf(user);
    //Remove from users group
    if(index !== -1){
        users.splice(index,1);
    }
    //Update user JSON file
    updateUserJSON();

    //Remove their join requests from any group
    groups.forEach(g => {
        let groupIndex = g.joinRequests.indexOf(username);
        if(groupIndex !== -1){
            g.joinRequests.splice(groupIndex,1);
            console.log("removed from:"+g.name);
        }
    });
    console.log(groups);
    updateGroupJSON();

    res.json({valid:true, mess:""});

});

router.post('/joinGroup', (req, res)=>{
    const {username, groupID, allow} = req.body;

    //Removes user from group join requests array
    let group = groups.find(g => g.id === groupID);
    let index = group.joinRequests.indexOf(username);
    // console.log(index);
    if(index !== -1){
        group.joinRequests.splice(index,1);
    }
    // console.log(groups);
    updateGroupJSON();

    //Add group to user group array
    if(allow){
        const user = users.find(u=>u.username === username);
        user.groups.push({name:group.name, id: groupID, admin:false});
    }
    updateUserJSON();

    res.json({valid:true, mess:""});
});



module.exports = router;