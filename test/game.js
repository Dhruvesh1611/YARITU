// Game variables
let socket;
let canvas;
let ctx;
let gameActive = false;
let playerId;
let players = {};
let gameCode = '';
let isHost = false;

// Game constants
const PLAYER_SPEED = 5;
const PLAYER_SIZE = 30;
const COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];

// Helper function for error display
function showError(message) {
    console.error('Error:', message);
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert('Error: ' + message);
    }
}

// DOM Elements
const joinContainer = document.getElementById('joinContainer');
const lobbyContainer = document.getElementById('lobbyContainer');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');
const playersList = document.getElementById('playersList');
const startGameBtn = document.getElementById('startGameBtn');
const createGameBtn = document.getElementById('createGameBtn');
const joinGameBtn = document.getElementById('joinGameBtn');
const gameCodeInput = document.getElementById('gameCode');
const playerNameInput = document.getElementById('playerName');
const gameStats = document.getElementById('gameStats');

// Initialize the game
function init() {
    try {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            showError('Cannot find canvas element');
            return;
        }
        
        ctx = canvas.getContext('2d');
        
        // Event listeners
        if (createGameBtn) createGameBtn.addEventListener('click', createGame);
        if (joinGameBtn) joinGameBtn.addEventListener('click', toggleJoinGameInput);
        if (gameCodeInput) gameCodeInput.addEventListener('keypress', handleGameCodeInput);
        if (startGameBtn) startGameBtn.addEventListener('click', startGame);
        
        // Keyboard controls
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // Connect to server
        connectToServer();
    } catch (error) {
        showError('Initialization error: ' + error.message);
    }
}

// Connect to Socket.io server
function connectToServer() {
    try {
        console.log('Attempting to connect to Socket.IO server...');
        
        // Check if Socket.IO is loaded
        if (typeof io === 'undefined') {
            showError('Socket.IO is not loaded. Check if the server is running and serving the Socket.IO client correctly.');
            return;
        }
        
        socket = io({
            reconnectionAttempts: 5,
            timeout: 10000
        });
        
        // Socket connection events
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });
        
        socket.on('connect_error', (error) => {
            showError('Connection error: ' + error.message);
        });
        
        socket.on('connect_timeout', () => {
            showError('Connection timeout. The server might be down or unreachable.');
        });
        
        socket.on('reconnect_failed', () => {
            showError('Failed to reconnect to the server after multiple attempts.');
        });
        
        // Socket event handlers
        socket.on('gameCreated', handleGameCreated);
        socket.on('gameJoined', handleGameJoined);
        socket.on('playerJoined', handlePlayerJoined);
        socket.on('gameStarted', handleGameStarted);
        socket.on('gameState', handleGameState);
        socket.on('gameError', handleGameError);
        socket.on('playerLeft', handlePlayerLeft);
        socket.on('tagUpdate', handleTagUpdate);
    } catch (error) {
        showError('Socket connection error: ' + error.message);
    }
}

// Create a new game
function createGame() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    isHost = true;
    socket.emit('createGame', { playerName });
}

// Toggle join game input
function toggleJoinGameInput() {
    gameCodeInput.classList.toggle('hidden');
    if (!gameCodeInput.classList.contains('hidden')) {
        gameCodeInput.focus();
    }
}

// Handle game code input
function handleGameCodeInput(e) {
    if (e.key === 'Enter') {
        joinGame();
    }
}

// Join an existing game
function joinGame() {
    const playerName = playerNameInput.value.trim();
    const code = gameCodeInput.value.trim();
    
    if (!playerName) {
        alert('Please enter your name');
        return;
    }
    
    if (!code) {
        alert('Please enter a game code');
        return;
    }
    
    socket.emit('joinGame', { playerName, gameCode: code });
}

// Handle game created event
function handleGameCreated(data) {
    gameCode = data.gameCode;
    playerId = data.playerId;
    players = data.players;
    
    // Show lobby
    joinContainer.style.display = 'none';
    lobbyContainer.style.display = 'flex';
    gameCodeDisplay.textContent = gameCode;
    
    // Only host can start the game
    startGameBtn.style.display = isHost ? 'block' : 'none';
    
    updatePlayersList();
}

// Handle game joined event
function handleGameJoined(data) {
    gameCode = data.gameCode;
    playerId = data.playerId;
    players = data.players;
    
    // Show lobby
    joinContainer.style.display = 'none';
    lobbyContainer.style.display = 'flex';
    gameCodeDisplay.textContent = gameCode;
    
    // Only host can start the game
    startGameBtn.style.display = 'none';
    
    updatePlayersList();
}

// Handle player joined event
function handlePlayerJoined(data) {
    players = data.players;
    updatePlayersList();
}

// Update players list in lobby
function updatePlayersList() {
    playersList.innerHTML = '';
    
    Object.values(players).forEach((player, index) => {
        const playerItem = document.createElement('div');
        playerItem.textContent = `${player.name} ${player.id === playerId ? '(You)' : ''}`;
        playerItem.style.color = COLORS[index % COLORS.length];
        playersList.appendChild(playerItem);
    });
}

// Start the game
function startGame() {
    if (isHost) {
        socket.emit('startGame', { gameCode });
    }
}

// Handle game started event
function handleGameStarted() {
    gameActive = true;
    lobbyContainer.style.display = 'none';
    gameStats.style.display = 'block';
    
    // Initialize game state
    Object.values(players).forEach((player, index) => {
        player.x = Math.random() * (canvas.width - PLAYER_SIZE);
        player.y = Math.random() * (canvas.height - PLAYER_SIZE);
        player.color = COLORS[index % COLORS.length];
        player.isIt = index === 0; // First player is "it"
        player.score = 0;
        player.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
    });
    
    // Start game loop
    gameLoop();
}

// Game loop
function gameLoop() {
    if (!gameActive) return;
    
    updateGame();
    drawGame();
    
    // Send player position to server
    socket.emit('playerUpdate', {
        gameCode,
        player: {
            id: playerId,
            x: players[playerId].x,
            y: players[playerId].y,
            keys: players[playerId].keys
        }
    });
    
    requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame() {
    const player = players[playerId];
    
    // Move player based on key presses
    if (player.keys.left) player.x -= PLAYER_SPEED;
    if (player.keys.right) player.x += PLAYER_SPEED;
    if (player.keys.up) player.y -= PLAYER_SPEED;
    if (player.keys.down) player.y += PLAYER_SPEED;
    
    // Keep player within bounds
    player.x = Math.max(0, Math.min(canvas.width - PLAYER_SIZE, player.x));
    player.y = Math.max(0, Math.min(canvas.height - PLAYER_SIZE, player.y));
    
    // Check for tag (if this player is "it")
    if (player.isIt) {
        Object.values(players).forEach(otherPlayer => {
            if (otherPlayer.id !== playerId && checkCollision(player, otherPlayer)) {
                // Tag another player
                socket.emit('tagPlayer', {
                    gameCode,
                    taggerId: playerId,
                    taggedId: otherPlayer.id
                });
            }
        });
    }
}

// Check collision between two players
function checkCollision(player1, player2) {
    return (
        player1.x < player2.x + PLAYER_SIZE &&
        player1.x + PLAYER_SIZE > player2.x &&
        player1.y < player2.y + PLAYER_SIZE &&
        player1.y + PLAYER_SIZE > player2.y
    );
}

// Draw game
function drawGame() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all players
    Object.values(players).forEach(player => {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
        
        // Draw "IT" indicator
        if (player.isIt) {
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('IT', player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2 + 4);
        }
        
        // Draw player name
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(player.name, player.x + PLAYER_SIZE / 2, player.y - 5);
    });
}

// Handle key down
function handleKeyDown(e) {
    if (!gameActive || !players[playerId]) return;
    
    const player = players[playerId];
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
            player.keys.left = true;
            break;
        case 'ArrowRight':
        case 'd':
            player.keys.right = true;
            break;
        case 'ArrowUp':
        case 'w':
            player.keys.up = true;
            break;
        case 'ArrowDown':
        case 's':
            player.keys.down = true;
            break;
    }
}

// Handle key up
function handleKeyUp(e) {
    if (!gameActive || !players[playerId]) return;
    
    const player = players[playerId];
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'a':
            player.keys.left = false;
            break;
        case 'ArrowRight':
        case 'd':
            player.keys.right = false;
            break;
        case 'ArrowUp':
        case 'w':
            player.keys.up = false;
            break;
        case 'ArrowDown':
        case 's':
            player.keys.down = false;
            break;
    }
}

// Handle game state update from server
function handleGameState(data) {
    // Update other players (not this player)
    Object.values(data.players).forEach(serverPlayer => {
        if (serverPlayer.id !== playerId && players[serverPlayer.id]) {
            players[serverPlayer.id].x = serverPlayer.x;
            players[serverPlayer.id].y = serverPlayer.y;
        }
    });
}

// Handle tag update
function handleTagUpdate(data) {
    Object.values(players).forEach(player => {
        player.isIt = player.id === data.newTaggerId;
        if (player.id === data.taggedId) {
            player.score--;
        } else if (player.id === data.taggerId) {
            player.score++;
        }
    });
    
    // Update score display
    updateScoreDisplay();
}

// Update score display
function updateScoreDisplay() {
    const player = players[playerId];
    gameStats.textContent = `Score: ${player.score} | ${player.isIt ? 'You are IT!' : ''}`;
}

// Handle player left
function handlePlayerLeft(data) {
    delete players[data.playerId];
    updatePlayersList();
}

// Handle game errors
function handleGameError(data) {
    alert(data.message);
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 