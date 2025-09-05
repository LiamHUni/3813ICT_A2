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


//Sends all groups for group browser page
router.post('/retrieveAll', (req, res)=>{
    const {username} = req.body;

    //Find all groups user is part of


    /*
    * Loop through all groups
    * Check if they're part of the group already
    * Check if they've requested access
    * Check if they're banned
    * Get only group name, id, and status
    * Status = notJoined, joined, requested, banned
    * [{name, id, status}, ]
    */
});


//Sends all information about group
router.post('/retrieve', (req, res)=>{
    const {id} = req.body;

    const group = groups.find(g => g.id === id);
    res.json(group);
});

router.post('/requestAccess', (req, res)=>{
    const {username, groupID} = req.body;

    //Find group

    //Add user to request array

    //updateGroupJSON();
});

//Adds new channel to group
router.post('/createChannel', (req, res)=>{
    const {groupID, channelName} = req.body;

    const group = groups.find(g => g.id === groupID);
    group.channels.push(channelName);
    updateGroupJSON();

    res.json({valid:true, mess:""});
});

//Delete channel from group
router.post('/deleteChannel', (req, res)=>{
    const {groupID, channelName} = req.body;

    let group = groups.find(g => g.id === groupID);
    let index = group.channels.indexOf(channelName);
    if(index !== -1){
        group.channels.splice(index,1);
    }
    updateGroupJSON();

    res.json({valid:true, mess:""});
});

//Delete group
router.post('/deleteGroup', (req, res)=>{
    const {groupID} = req.body;

    //Remove the group from all users group lists


    // updateUserJSON();


    //Remove group from group array

    // updateGroupJSON();

    res.json({valid:true, mess:""});
});




module.exports = router;