# Multiplayer Tag Game

A simple multiplayer tag game that friends can easily play together. Players move around in a 2D space and try to avoid being "it". The player who is "it" must try to tag other players. When a tag occurs, the tagger earns a point, and the tagged player becomes "it" and loses a point.

## Features

- Create or join a game with a simple code
- Real-time multiplayer gameplay
- Lobby system for waiting for friends
- Score tracking
- Simple controls (WASD or arrow keys)

## How to Set Up

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open your browser and go to `http://localhost:3000`

If you want to play with friends over the internet, you'll need to deploy this to a hosting service or use a tool like ngrok to expose your local server.

## How to Play

### Creating a Game

1. Enter your name
2. Click "Create New Game"
3. Share the displayed game code with your friends
4. Wait for your friends to join
5. Click "Start Game" when everyone is ready

### Joining a Game

1. Enter your name
2. Click "Join Game"
3. Enter the game code provided by the game creator
4. Wait for the host to start the game

### Controls

- Move: WASD or Arrow Keys
- Objective: If you're "it", try to tag other players by touching them
- If you're not "it", avoid being tagged
- Scoring: +1 point for tagging someone, -1 point for being tagged

## Technologies Used

- Node.js
- Express
- Socket.IO
- HTML5 Canvas
- JavaScript

## License

MIT 