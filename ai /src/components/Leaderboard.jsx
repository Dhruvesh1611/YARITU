import { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';

export default function Leaderboard({ currentScore, gameOver, playerName }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState(playerName || '');

  // Load leaderboard from localStorage on component mount
  useEffect(() => {
    const storedLeaderboard = localStorage.getItem('snakeGameLeaderboard');
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  // Show form when game is over and score is worthy of leaderboard
  useEffect(() => {
    if (gameOver && currentScore > 0) {
      // Check if score is high enough for leaderboard
      if (leaderboard.length < 5 || currentScore > leaderboard[leaderboard.length - 1]?.score) {
        setShowForm(true);
      }
    }
  }, [gameOver, currentScore, leaderboard]);

  const saveScore = () => {
    if (!name.trim()) return;
    
    const newScore = { name: name.trim(), score: currentScore, date: new Date().toLocaleDateString() };
    const newLeaderboard = [...leaderboard, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep only top 5 scores
    
    setLeaderboard(newLeaderboard);
    localStorage.setItem('snakeGameLeaderboard', JSON.stringify(newLeaderboard));
    setShowForm(false);
  };

  return (
    <div className={styles.leaderboardContainer}>
      <h2>Leaderboard</h2>
      
      {showForm && (
        <div className={styles.scoreForm}>
          <p>Congratulations! Your score: {currentScore}</p>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={15}
            />
            <button onClick={saveScore}>Save</button>
          </div>
        </div>
      )}
      
      <div className={styles.scoresList}>
        {leaderboard.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className={entry.score === currentScore && gameOver ? styles.currentScore : ''}>
                  <td>{index + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.score}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noScores}>No scores yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}