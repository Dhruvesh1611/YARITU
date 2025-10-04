const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Debug route
app.get('/debug', (req, res) => {
    res.send('Server is running correctly. If you see this message, the server is operational.');
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Game state
const games = {};

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Create a new game
    socket.on('createGame', (data) => {
        const gameCode = generateGameCode();
        const playerId = socket.id;
        
        // Create new game
        games[gameCode] = {
            id: gameCode,
            host: playerId,
            players: {
                [playerId]: {
                    id: playerId,
                    name: data.playerName,
                    x: 0,
                    y: 0,
                    isIt: false,
                    score: 0
                }
            },
            active: false
        };
        
        // Join the game's socket room
        socket.join(gameCode);
        
        // Send game info back to creator
        socket.emit('gameCreated', {
            gameCode,
            playerId,
            players: games[gameCode].players
        });
        
        console.log(`Game created: ${gameCode} by ${data.playerName}`);
    });
    
    // Join an existing game
    socket.on('joinGame', (data) => {
        const gameCode = data.gameCode;
        const playerId = socket.id;
        
        // Check if game exists
        if (!games[gameCode]) {
            socket.emit('gameError', { message: 'Game not found. Check the code and try again.' });
            return;
        }
        
        // Check if game is already active
        if (games[gameCode].active) {
            socket.emit('gameError', { message: 'Cannot join. Game already in progress.' });
            return;
        }
        
        // Add player to game
        games[gameCode].players[playerId] = {
            id: playerId,
            name: data.playerName,
            x: 0,
            y: 0,
            isIt: false,
            score: 0
        };
        
        // Join the game's socket room
        socket.join(gameCode);
        
        // Send game info back to player
        socket.emit('gameJoined', {
            gameCode,
            playerId,
            players: games[gameCode].players
        });
        
        // Notify others that a player joined
        socket.to(gameCode).emit('playerJoined', {
            players: games[gameCode].players
        });
        
        console.log(`Player ${data.playerName} joined game: ${gameCode}`);
    });
    
    // Start the game
    socket.on('startGame', (data) => {
        const gameCode = data.gameCode;
        
        // Check if game exists
        if (!games[gameCode]) {
            socket.emit('gameError', { message: 'Game not found.' });
            return;
        }
        
        // Check if player is the host
        if (games[gameCode].host !== socket.id) {
            socket.emit('gameError', { message: 'Only the host can start the game.' });
            return;
        }
        
        // Mark game as active
        games[gameCode].active = true;
        
        // Randomly select a player to be "it"
        const playerIds = Object.keys(games[gameCode].players);
        const randomIndex = Math.floor(Math.random() * playerIds.length);
        const initialTaggerId = playerIds[randomIndex];
        
        games[gameCode].players[initialTaggerId].isIt = true;
        
        // Notify all players that game has started
        io.to(gameCode).emit('gameStarted');
        
        // Notify all players about initial tagger
        io.to(gameCode).emit('tagUpdate', {
            taggerId: initialTaggerId,
            taggedId: null,
            newTaggerId: initialTaggerId
        });
        
        console.log(`Game started: ${gameCode}`);
        
        // Start the game loop
        startGameLoop(gameCode);
    });
    
    // Player updates their position
    socket.on('playerUpdate', (data) => {
        const gameCode = data.gameCode;
        const playerId = socket.id;
        
        // Check if game exists and is active
        if (!games[gameCode] || !games[gameCode].active) {
            return;
        }
        
        // Update player position
        if (games[gameCode].players[playerId]) {
            games[gameCode].players[playerId].x = data.player.x;
            games[gameCode].players[playerId].y = data.player.y;
            games[gameCode].players[playerId].keys = data.player.keys;
        }
    });
    
    // Player tags another player
    socket.on('tagPlayer', (data) => {
        const gameCode = data.gameCode;
        const taggerId = data.taggerId;
        const taggedId = data.taggedId;
        
        // Check if game exists and is active
        if (!games[gameCode] || !games[gameCode].active) {
            return;
        }
        
        // Check if tagger is indeed "it"
        if (!games[gameCode].players[taggerId].isIt) {
            return;
        }
        
        // Update who is "it"
        games[gameCode].players[taggerId].isIt = false;
        games[gameCode].players[taggedId].isIt = true;
        
        // Update scores
        games[gameCode].players[taggerId].score++;
        games[gameCode].players[taggedId].score--;
        
        // Notify all players about the tag
        io.to(gameCode).emit('tagUpdate', {
            taggerId,
            taggedId,
            newTaggerId: taggedId
        });
        
        console.log(`Player ${taggerId} tagged player ${taggedId} in game: ${gameCode}`);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        const playerId = socket.id;
        console.log('Client disconnected:', playerId);
        
        // Find games where this player is a member
        Object.keys(games).forEach(gameCode => {
            if (games[gameCode].players[playerId]) {
                // Remove player from game
                delete games[gameCode].players[playerId];
                
                // Notify other players
                socket.to(gameCode).emit('playerLeft', { playerId });
                
                // If host left, assign a new host or clean up the game
                if (games[gameCode].host === playerId) {
                    const remainingPlayers = Object.keys(games[gameCode].players);
                    
                    if (remainingPlayers.length > 0) {
                        // Assign a new host
                        games[gameCode].host = remainingPlayers[0];
                    } else {
                        // No players left, remove the game
                        delete games[gameCode];
                    }
                }
                
                // If the player who was "it" left, assign a new player to be "it"
                if (games[gameCode] && games[gameCode].active) {
                    const remainingPlayers = Object.keys(games[gameCode].players);
                    
                    if (remainingPlayers.length > 0) {
                        let someoneIsIt = false;
                        
                        // Check if someone is already "it"
                        Object.values(games[gameCode].players).forEach(player => {
                            if (player.isIt) {
                                someoneIsIt = true;
                            }
                        });
                        
                        if (!someoneIsIt) {
                            // Assign a random player to be "it"
                            const randomIndex = Math.floor(Math.random() * remainingPlayers.length);
                            const newTaggerId = remainingPlayers[randomIndex];
                            
                            games[gameCode].players[newTaggerId].isIt = true;
                            
                            // Notify all players about the new tagger
                            io.to(gameCode).emit('tagUpdate', {
                                taggerId: null,
                                taggedId: null,
                                newTaggerId
                            });
                        }
                    }
                }
            }
        });
    });
});

// Start game loop for a specific game
function startGameLoop(gameCode) {
    // Send game state to all players every 100ms
    const intervalId = setInterval(() => {
        // Check if game still exists
        if (!games[gameCode]) {
            clearInterval(intervalId);
            return;
        }
        
        // Send game state to all players
        io.to(gameCode).emit('gameState', {
            players: games[gameCode].players
        });
    }, 100);
}

// Generate a random 6-character game code
function generateGameCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    if (games[result]) {
        return generateGameCode(); // Try again
    }
    
    return result;
}

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Debug endpoint available at http://localhost:${PORT}/debug`);
    console.log(`Main application available at http://localhost:${PORT}`);
}); 