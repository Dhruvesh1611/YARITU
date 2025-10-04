const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);

    // Inform others in the room
    socket.to(roomId).emit('userJoined', socket.id);
  });

  socket.on('typingProgress', ({ roomId, progress }) => {
    socket.to(roomId).emit('opponentProgress', { socketId: socket.id, progress });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
