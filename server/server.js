const express = require('express');
const app = express();
const http = require('http').Server(app);

const accountRoutes = require('./routes/account.js');
const groupRoutes = require('./routes/group.js');

const cors = require('cors');
app.use(cors());

app.use(express.json());

//Allows use of /account/??? route
app.use('/account', accountRoutes);

//Allows use of /group/??? route
app.use('/group', groupRoutes);

let server = http.listen(3000, function() {
    let host = server.address().address;
    let port = server.address().port;
    console.log(host, port);
});