const fs = require('fs/promises');

class Group {
    constructor(name, id, channels=[]){
        this.name = name;
        this.id = id;
        this.channels = channels;
    }
}

const groups  = require('./group.json');

async function updateGroupJSON(data=groups, filename='data/group.json'){
    try{
        //Stringifies user array
        const jsonStr = JSON.stringify(data, null, 2);
        //Waits for group file to be updated
        await fs.writeFile(filename, jsonStr);
        console.log('Groups updated');
    }catch(err){
        console.error('Group file failed:',err);
    }
}

module.exports = {
    Group,
    groups,
    updateGroupJSON
};