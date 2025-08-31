const express = require('express');
const app = express();
const http = require('http').Server(app);

const {users} = require('./data/user.js');

const accountRoutes = require('./routes/account.js');

const cors = require('cors');
app.use(cors());

app.use(express.json());

//Allows use of /acconut/??? route
app.use('/account', accountRoutes);

let server = http.listen(3000, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host, port);
});