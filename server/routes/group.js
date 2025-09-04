/*
*
*   /group/??? routes
*
*/

const express = require('express');
const router = express.Router();

//Allows use of group info in data folder
const {Group, groups, updateGroupJSON} = require('../data/group.js');

const {users, updateUserJSON} = require('../data/user.js');

router.post('/create', (req, res)=>{
    const {name, user} = req.body;

    const nameMatch = groups.find(g => g.name === name);

    //Returns error messages if name is already used
    if(nameMatch){
        console.log("Group name already used");
        res.json({valid: false, mess:"Group name already used"})
    // Creates new group, returns valid
    }else{
        let newGroup = new Group(name, id = nextID(groups));
        groups.push(newGroup);
        console.log(newGroup);
        res.json({valid: true, mess:"Group successfully created"});
        //Adds newly made group to user who made it's group list
        addGroupToUser(newGroup, user)
        //Updates the group json file
        updateGroupJSON();
    }
});

//Finds next available (highest) id
function nextID(list){
    if(list.length === 0) return 1;

    const highestID = Math.max(...list.map(item=> item.id));
    return highestID + 1;
}

//Adds group to users group list
function addGroupToUser(group, username){
    console.log("ID:"+username);
    let user = users.find(u=> u.username === username);
    console.log(user);
    user.groups.push({name:group.name, id:group.id, admin:true});
    updateUserJSON();
}



router.post('/retrieve', (req, res)=>{
    const {groupID} = req.body;

    const group = groups.find(g => g.id === groupID);
    res.json(group);
});




module.exports = router;