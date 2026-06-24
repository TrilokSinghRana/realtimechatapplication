// const http=require('http')
// const express=require('express')

// const cors=require('cors')
// const socketIO=require('socket.io')

// const app=express()
// const port= 4500 || process.env.PORT;


// const users=[{}];

// app.use(cors())
// app.get('/',(req,res)=>{
//   res.send('hell its working')
// })
// const server=http.createServer(app)
// const io = socketIO(server)

// io.on("connection",(socket)=>{
//   console.log("New connection")
  
//   socket.on('joined',({user})=>{
//      users[socket.id]=user;
//      console.log(`${user} has joined`);
//      socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has Joined`});
//      socket.emit('welcome',{user:"Admin",message:`welcome to the chat `})
//   })

//   socket.on("message",({message,id})=>{
//     io.emit('sendmessage',{user:users[id],message,id})
//   })
//     socket.on('disconnect',()=>{
//       socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`});
//       console.log('user left')
//     })
// })

// server.listen(port,()=>{
//   console.log(`server is working on http://localhost:${port}`);
// })


const http = require("http");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 4500;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, it's working");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log(`New Connection: ${socket.id}`);

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;

    console.log(`${user} joined the chat`);

    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${user}`,
    });

    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${user} has joined`,
    });
  });

  socket.on("message", ({ message }) => {
    io.emit("sendMessage", {
      user: users[socket.id],
      message,
    });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      console.log(`${users[socket.id]} left the chat`);

      socket.broadcast.emit("leave", {
        user: "Admin",
        message: `${users[socket.id]} has left`,
      });

      delete users[socket.id];
    }
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});