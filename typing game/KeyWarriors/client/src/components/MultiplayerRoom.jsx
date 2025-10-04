import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Replace with your server URL if deployed

const MultiplayerRoom = ({ roomId }) => {
  const [socket, setSocket] = useState(null);
  const [opponents, setOpponents] = useState({}); // track opponents' progress

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
      newSocket.emit('joinRoom', roomId);
    });

    newSocket.on('userJoined', (userId) => {
      console.log('User joined:', userId);
    });

    newSocket.on('opponentProgress', ({ socketId, progress }) => {
      setOpponents((prev) => ({ ...prev, [socketId]: progress }));
    });

    return () => newSocket.disconnect();
  }, [roomId]);

  // You can send your typing progress to server like this:
  // socket.emit('typingProgress', { roomId, progress: 50 });

  return (
    <div>
      <h2>Room: {roomId}</h2>
      <h3>Your socket ID: {socket?.id}</h3>
      <div>
        <h4>Opponents Progress:</h4>
        {Object.entries(opponents).map(([id, progress]) => (
          <div key={id}>
            {id}: {progress}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiplayerRoom;
