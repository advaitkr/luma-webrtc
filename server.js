require("dotenv").config()
const express = require('express');
const app = express()
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');
const io = require('socket.io')(server)
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{
    debug:true
})
app.set('view engine','ejs');
app.use(express.static('public'))
app.use('/peerjs',peerServer)

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/meeting',(req,res)=>{

    res.send(`${process.env.SERVER_URL}/${uuidv4()}`)
})

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})


io.on('connection',socket=>{
    socket.on('join-room',(roomId,userId)=>{
        console.log(roomId)
         socket.join(roomId)
         //socket.to(roomId).emit('user-connected')
         socket.broadcast.to(roomId).emit('user-connected',userId);
         socket.on('message',message=>{
            console.log(message,"hey")
            io.to(roomId).emit('createMessage',message)
         })
    })
})

server.listen(process.env.PORT || 3030,()=>{
    console.log("running on 3030")
})