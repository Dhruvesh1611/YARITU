import React, { useState } from 'react';
import './App.css';
import SoloGame from './components/SoloGame';

function App() {
  const [mode, setMode] = useState(null);

  if (mode?.type === 'solo') {
    return <SoloGame difficulty={mode.level} onExit={() => setMode(null)} />;
  }

  return (
    <div className="app">
      <h1>🎮 KeyWarriors</h1>
      <div className="menu">
        <h2>Choose Game Mode</h2>

        <div className="mode">
          <h3>🧠 Solo Mode</h3>
          <button onClick={() => setMode({ type: 'solo', level: 'easy' })}>Easy</button>
          <button onClick={() => setMode({ type: 'solo', level: 'medium' })}>Medium</button>
          <button onClick={() => setMode({ type: 'solo', level: 'hard' })}>Hard</button>
        </div>

        <div className="mode">
          <h3>👥 Multiplayer Mode</h3>
          <button disabled>Coming Soon</button>
        </div>

        <div className="mode">
          <h3>👁️ Observer Mode</h3>
          <button disabled>Coming Soon</button>
        </div>
      </div>
    </div>
  );
}

export default App;
