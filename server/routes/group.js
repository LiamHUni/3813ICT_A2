/*
*
*   /group/??? routes
*
*/

const express = require('express');
const router = express.Router();

/*
*   Mongodb setup/connection
*/
const {ObjectId} = require('mongodb');
const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

//Server functions
const { read, remove, add, update, removeMany } = require('../data/mongoFunctions.js');


const dbName = 'A2';
let collection;

async function connectMongo(base){
    await client.connect();
    // console.log('Connected');
    const db = client.db(dbName);
    collection = db.collection(base);
}

class Group {
    constructor(name, id){
        this.name = name;
        this.id = id;
    }
}

//Allows use of group info in data folder
const {groups, updateGroupJSON} = require('../data/group.js');

const {users, updateUserJSON} = require('../data/user.js');

router.post('/create', async(req, res)=>{
    const {name, user} = req.body;

    await connectMongo("groups");
    let groups = await read(collection, {});

    const nameMatch = groups.find(g => g.name === name);

    //Returns error messages if name is already used
    if(nameMatch){
        console.log("Group name already used");
        res.json({valid: false, mess:"Group name already used"})

    // Creates new group, returns valid
    }else{
        let newGroup = new Group(name, id = nextID(groups));
        await add(collection, newGroup);
        // console.log(newGroup);
        res.json({valid: true, mess:"Group successfully created"});

        //Adds newly made group to user who made it's group list
        await connectMongo("userGroup");
        await add(collection, {userID: user, groupID:newGroup.id});
    }

    client.close();
});

//Finds next available (highest) id
function nextID(list){
    if(list.length === 0) return 1;

    const highestID = Math.max(...list.map(item=> item.id));
    return highestID + 1;
}


//Sends all groups for group browser page
router.post('/retrieveAll', async(req, res)=>{
    const {username} = req.body;

    //Find all groups id's user is part of
    await connectMongo("userGroup");
    const userGroups = await read(collection, {userID: username});
    const userGroupID = userGroups.map(g => g.groupID);
    // console.log(userGroupID);

    //Retrieve all groups
    await connectMongo("groups");
    const groups = await read(collection, {});
    const groupID = groups.map(g=>g.id);
    
    await connectMongo("requests");
    const requests = await read(collection, {userID: username});
    const requestID = requests.map(r=>r.groupID);
    // console.log(requests);
    
    //Removing and adding required attributes
    groups.forEach(g=>{
        //Determines users status to group
        //Status can be requested, joined, or none
        if(requestID.includes(g.id)){
            g.status = "Pending"
        }else if(userGroupID.includes(g.id)){
            g.status = "Joined"
        }else {
            g.status = "none"
        }
        delete g.joinRequests;
    });

    res.json(groups);
    client.close();
});


//Sends all information about single group
router.post('/retrieve', async(req, res)=>{
    const {id} = req.body;

    await connectMongo("groups");
    const group = await read(collection, {id: id});

    await connectMongo("channels");
    const channels = await read(collection, {groupID: id});
    group[0].channels = channels;
    // console.log(group[0]);
    res.json(group[0]);
    // client.close();
});

router.post('/requestAccess', async(req, res)=>{
    const {username, groupID} = req.body;

    await connectMongo("requests");
    await add(collection, {userID: username, groupID});

    res.json({valid:true, mess:""});
    client.close();
});

router.post('/getRequests', async(req, res)=>{
    const {groupID} = req.body;

    // Gets requests for current group
    await connectMongo("requests");
    let requests = await read(collection, {groupID});
    requests = requests.map(r=>r.userID);

    // Get usernames for requests
    await connectMongo("users");
    let users = await read(collection, {username: {$in: requests}})
    users = users.map(u=>u.username);

    res.json(users);
    client.close();
});

//Adds new channel to group
router.post('/createChannel', async(req, res)=>{
    const {groupID, channelName} = req.body;

    await connectMongo("channels");
    await add(collection, {groupID, name:channelName});
    // console.log(channelName);

    client.close();
    res.json({valid:true, mess:""});
});

router.post('/getChannel', async(req, res)=>{
    const {channelID} = req.body;

    const chanID = new ObjectId(channelID)

    // Gets channel information
    await connectMongo("channels");
    const channel = await read(collection, {_id: chanID});

    // Get all messages from channel
    await connectMongo("messages");
    let messages = await read(collection, {_id: chanID});

    // Add user information per message
    await connectMongo("users");
    for(m of messages){
        const user = await read(collection, {username:m.userID});
        m.username = user.username;
        m.pfpImage = user.pfpImage;
    }

    channel[0].messages = messages;

    // console.log(channel[0]);

    // client.close();
    res.json(channel[0]);
});

//Delete channel from group
router.post('/deleteChannel', async(req, res)=>{
    const {groupID, channelName} = req.body;
    // console.log(channelName);
    await connectMongo("channels");
    await remove(collection, {_id: new ObjectId(channelName)});

    client.close();
    res.json({valid:true, mess:""});
});

//Delete group
router.post('/deleteGroup', async(req, res)=>{
    const {groupID} = req.body;

    // Delete user group relation
    await connectMongo("userGroup");
    await removeMany(collection, {groupID});

    // Get group channels
    await connectMongo("channels");
    let channels = await read(collection, {groupID});
    channels = channels.map(c => c._id);
    
    // Delete channels
    await removeMany(collection, {groupID});
    
    // Delete all messages from channels
    await connectMongo("messages");
    await removeMany(collection, {channelID: {$in: channels}});

    //Delete group
    await connectMongo("groups");
    await remove(collection, {id: groupID});

    client.close();
    res.json({valid:true, mess:""});
});

router.post('/addMessage', async(req, res)=>{
    const {channelID, userID, message} = req.body;

    const chanID = new ObjectId(channelID);
    await connectMongo("messages");
    await update(collection, {channelID}, {$inc:{order:1}});
    await add(collection, {channelID, userID, message});
    await removeMany(collection, {order:{$gt:10}}); // Increase value to allow more messages to be saved
    
    
    client.close();
});


module.exports = router;