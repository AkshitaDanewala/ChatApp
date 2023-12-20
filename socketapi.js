
const io = require( "socket.io" )();
const socketapi = {
    io: io
};


const Users = require("./model/usermodel")
// Add your socket.io logic here!
io.on( "connection",  async function( socket ) {
    console.log( "A user connected" );


    socket.on("sony", msg=>{
console.log(msg)
// io.emit("incomingMsg", msg)
socket.broadcast.emit("incomingMsg", msg)
    })


    socket.on("user", async(users)=>{

        try{
            const username = await Users.findOne({})
            io.emit("userName", username, users)
        }catch(err){
            console.err("username not found", err)
        }
    })
    
});




// end of socket.io logic

module.exports = socketapi;