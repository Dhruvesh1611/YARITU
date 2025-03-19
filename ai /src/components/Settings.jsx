import { useState } from 'react';
import styles from './Settings.module.css';

export default function Settings({ onSettingsChange, isVisible, onClose }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [playerName, setPlayerName] = useState(localStorage.getItem('playerName') || '');
  
  const difficultySettings = {
    easy: { speed: 150, scoreMultiplier: 1 },
    medium: { speed: 100, scoreMultiplier: 1.5 },
    hard: { speed: 70, scoreMultiplier: 2 }
  };
  
  const handleSave = () => {
    // Save player name to localStorage
    localStorage.setItem('playerName', playerName);
    
    // Apply settings
    onSettingsChange({
      ...difficultySettings[difficulty],
      playerName
    });
    
    onClose();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsModal}>
        <h2>Game Settings</h2>
        
        <div className={styles.settingGroup}>
          <label>Your Name:</label>
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            maxLength={15}
          />
        </div>
        
        <div className={styles.settingGroup}>
          <label>Difficulty:</label>
          <div className={styles.difficultyOptions}>
            <button 
              className={`${styles.difficultyBtn} ${difficulty === 'easy' ? styles.active : ''}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button 
              className={`${styles.difficultyBtn} ${difficulty === 'medium' ? styles.active : ''}`}
              onClick={() => setDifficulty('medium')}
            >
              Medium
            </button>
            <button 
              className={`${styles.difficultyBtn} ${difficulty === 'hard' ? styles.active : ''}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>
        
        <div className={styles.difficultyDescription}>
          {difficulty === 'easy' && (
            <p>Slower snake speed, perfect for beginners.</p>
          )}
          {difficulty === 'medium' && (
            <p>Balanced speed with moderate challenge.</p>
          )}
          {difficulty === 'hard' && (
            <p>Fast-paced gameplay for experienced players!</p>
          )}
        </div>
        
        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}