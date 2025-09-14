const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Connect Mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/club', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('Mongo connected'))
  .catch(err=>console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));

// Basic health route
app.get('/', (req,res)=> res.send('Backend running'));

// HTTP + Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ["GET","POST"] }
});

// Simple signaling for WebRTC
io.on('connection', socket => {
  console.log('socket connected', socket.id);

  socket.on('join-room', ({roomId, userId})=>{
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('signal', ({toSocketId, data})=>{
    if(toSocketId) {
      io.to(toSocketId).emit('signal', { from: socket.id, data });
    } else {
      // broadcast to room (simple)
      const rooms = Array.from(socket.rooms).filter(r=>r!==socket.id);
      rooms.forEach(r => socket.to(r).emit('signal', { from: socket.id, data }));
    }
  });

  socket.on('disconnect', ()=> {
    console.log('socket disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
