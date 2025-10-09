module.exports = {
    connect: function(io, PORT){
        io.on('connection', (socket) => {
            console.log(`User connection on port ${PORT}:${socket.id}`);

            // Called once when joining channel, sends message to all users in channel stating user has joined
            socket.on('roomJoin', ({room, user})=>{
                socket.join(room);
                io.to(room).emit('message', {user:{username:"Server"}, message:`${user.username} has joined the chat`});
            });

            // Recieves user message, with room, user, message, and image data to emit to all users in channel room
            socket.on('sendMessage', ({room, user, message, image}) => {
                io.to(room).emit('message', {user, message, image});
            });

            // Custom disconnect function, allows for leaving message to be sent
            socket.on('roomLeave', ({room, user})=>{
                // Loops through and leaves all rooms client is part of, ensures user isn't accidently left in old room
                for(const room of socket.rooms){
                    if(room != socket.id){
                        socket.leave(room);
                    }
                }
                // Sends leave message to previous room
                io.to(room).emit('message', {user:{username:"Server"}, message:`${user.username} has left the chat`});
            });
        })
    }
}