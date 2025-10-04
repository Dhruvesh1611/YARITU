import React, { useEffect, useState } from 'react';
import './SoloGame.css';

const sampleText = "Typing games are fun and improve your skills.";

function SoloGame({ difficulty, onExit }) {
  const [userInput, setUserInput] = useState('');
  const [botProgress, setBotProgress] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const botSpeed = {
    easy: 500,
    medium: 250,
    hard: 100
  }[difficulty];

  useEffect(() => {
    if (botProgress >= sampleText.length || userInput.length >= sampleText.length) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(() => {
      setBotProgress((prev) => prev + 1);
    }, botSpeed);

    return () => clearInterval(interval);
  }, [botProgress, userInput, botSpeed]);

  const handleChange = (e) => {
    if (!gameOver) setUserInput(e.target.value);
  };

  const getWinner = () => {
    if (userInput.length >= sampleText.length && botProgress >= sampleText.length) {
      return 'Draw!';
    } else if (userInput.length >= sampleText.length) {
      return '🎉 You Win!';
    } else if (botProgress >= sampleText.length) {
      return '🤖 Bot Wins!';
    }
    return '';
  };

  return (
    <div className="solo-game">
      <h2>🧠 Solo Mode - {difficulty.toUpperCase()}</h2>
      <p className="text">{sampleText}</p>

      <textarea
        rows="3"
        value={userInput}
        onChange={handleChange}
        placeholder="Start typing here..."
        disabled={gameOver}
      />

      <div className="progress">
        <p>🤖 Bot Progress: {botProgress}/{sampleText.length}</p>
        <p>🧑 You: {userInput.length}/{sampleText.length}</p>
      </div>

      {gameOver && <h3>{getWinner()}</h3>}
      <button onClick={onExit}>🔙 Back</button>
    </div>
  );
}

export default SoloGame;
