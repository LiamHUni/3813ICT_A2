const fs = require('fs/promises');

class User {
    constructor(username, email, password, roles, groups){
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.groups = groups;
    }
}

//Loads all user info at upon server starting
const users  = require('./user.json');


//Used to update user json file for temporary data storage
async function updateUserJSON(data=users, filename='data/user.json'){
    try{
        //Stringifies user array
        const jsonStr = JSON.stringify(data, null, 2);
        //Waits for user filet o be updated
        await fs.writeFile(filename, jsonStr);
        console.log('Users updated');
    }catch(err){
        console.error('User file failed:',err);
    }
}

module.exports = {
    User,
    users,
    updateUserJSON
};