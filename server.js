const e = require('express');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let arr = [];
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the username and socket ID associated with each socket
  let username;
  const socketId = socket.id;

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    // Broadcast the message to all connected clients along with the sender's username and socket ID
    
    io.emit('chat message', msg, username, socketId);

  });

  // Listen for typing events
  socket.on('typing', (isTyping) => {
    // Broadcast typing events to all connected clients along with the sender's username and socket ID
    io.emit('typing', isTyping, username, socketId);
  });

  // Listen for a username event when a user joins
  socket.on('username', (user) => {
    username = user;
  });

  // Listen for disconnection
  socket.on('disconnect', () => {
    console.log(`${username} with ID ${socketId} disconnected`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


