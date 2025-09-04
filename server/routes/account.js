/*
*
*   /account/??? routes
*
*/

const express = require('express');
const router = express.Router();

//Allows use of user info in data folder
const {User, users, updateUserJSON} = require('../data/user.js');

const{groups} = require('../data/group.js');

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



module.exports = router;