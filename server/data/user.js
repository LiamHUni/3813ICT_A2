class User {
    constructor(username, email, password, id, roles, groups){
        this.username = username;
        this.email = email;
        this.password = password;
        this.id = id;
        this.roles = roles;
        this.groups = groups;
    }
}

const users = [
    new User("super", "super@test.com", "123", 0, ["user", "superAdmin"], []),
];

module.exports = {
    User,
    users
};