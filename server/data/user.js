class User {
    constructor(username, email, password, roles, groups){
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.groups = groups;
    }
}

const users = [
    new User("super", "super@test.com", "123", ["user", "groupAdmin", "superAdmin"], []),
];

module.exports = {
    User,
    users
};