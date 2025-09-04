/*
*
*   /group/??? routes
*
*/

const express = require('express');
const router = express.Router();

//Allows use of group info in data folder
const {Group, groups, updateGroupJSON} = require('../data/group.js');

router.post('/create', (req, res)=>{
    const {name} = req.body;

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
        res.json({valid: true, mess:"Group successfully created"})
        updateGroupJSON();
    }
});

function nextID(list){
    if(list.length === 0) return 1;

    const highestID = Math.max(...list.map(item=> item.id));
    return highestID + 1;
}


module.exports = router;