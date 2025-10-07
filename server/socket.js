module.exports = {
    connect: function(io, PORT){
        io.on('connection', (socket) => {
            console.log(`User connection on port ${PORT}:${socket.id}`);

            socket.on('roomJoin', ({room, user})=>{
                socket.join(room);
                io.to(room).emit('message', {user:{name:"Server"}, message:{message:`${user.username} has joined the chat`}});
            });

            socket.on('sendMessage', ({room, user, message}) => {
                io.to(room).emit('message', {user, message});
            });

            // Custom disconnect function, allows for leaving message to be sent
            socket.on('roomLeave', ({room, user})=>{
                io.to(room).emit('message', {user:{name:"Server"}, message:{message:`${user.username} has left the chat`}});
            });
        })
    }
}