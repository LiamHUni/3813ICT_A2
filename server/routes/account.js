/*
*
*   /account/??? routes
*
*/

const express = require('express');
const router = express.Router();

//Allows use of user info in data folder
const {users, updateUserJSON} = require('../data/user.js');

router.post('/login', (req, res) =>{
    const {username, password} = req.body;

    //Finds any user with matching username and password
    const user = users.find(u => u.username === username && u.password === password);

    //If a user is found
    if(user){
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



module.exports = router;