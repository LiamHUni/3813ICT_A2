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

    //Find all groups id's user is part of
    const userGroups = users.find(u=>u.username === username)?.groups.map(g=>{return g.id});

    //Creates deep copy of groups list, ensures original list is not affected
    const groupCopy = groups.map(g=>({...g}));

    //Removing and adding required attributes
    groupCopy.forEach(g=>{
        //Remove channel attributes
        delete g.channels;

        //Determines users status to group
        //Status can be requested, joined, or none
        if(g.joinRequests.includes(username)){
            g.status = "Pending"
        }else if(userGroups.includes(g.id)){
            g.status = "Joined"
        }else {
            g.status = "none"
        }
        delete g.joinRequests;
    });

    res.json(groupCopy);
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
    const group = groups.find(g => g.id === groupID);
    group.joinRequests.push(username);
    updateGroupJSON();

    res.json({valid:true, mess:""});
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
    const user = users.map(u=>removeGroup(u, groupID));
    updateUserJSON();

    //Remove group from group array
    //Find group index in group array
    const index = groups.indexOf(groups.find(g=>g.id===groupID));
    //Remove if it exists
    if(index !== -1){
        groups.splice(index, 1);
    }
    updateGroupJSON();

    res.json({valid:true, mess:""});
});

function removeGroup(user, groupID){
    //Find the index of the group inside user group array
    const index = user.groups.indexOf(user.groups.find(g=>g.id===groupID));
    //Remove if it exists
    if(index !== -1){
        user.groups.splice(index, 1);
    }
    // console.log(user);
    return user;
}




module.exports = router;