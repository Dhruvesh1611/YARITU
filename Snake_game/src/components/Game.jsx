import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Game.module.css';
import Confetti from './Confetti';
import Settings from './Settings';


const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = {
  x: Math.floor(Math.random() * TILE_COUNT),
  y: Math.floor(Math.random() * TILE_COUNT),
};

// Power-up types
const POWER_UP_TYPES = {
  SPEED: 'speed',
  SLOW: 'slow',
  DOUBLE_POINTS: 'doublePoints',
  IMMUNITY: 'immunity'
};

// Power-up appearance chance (percentage)
const POWER_UP_CHANCE = 15;

export default function Game() {
  const [snake, setSnake] = useState(() => {
    const savedSnake = localStorage.getItem('snakeGameState');
    return savedSnake ? JSON.parse(savedSnake).snake : INITIAL_SNAKE;
  });
  const [food, setFood] = useState(() => {
    const savedFood = localStorage.getItem('snakeGameState');
    return savedFood ? JSON.parse(savedFood).food : INITIAL_FOOD;
  });
  const [direction, setDirection] = useState(() => {
    const savedDirection = localStorage.getItem('snakeGameState');
    return savedDirection ? JSON.parse(savedDirection).direction : { dx: 1, dy: 0 };
  });
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('snakeGameState');
    return savedScore ? JSON.parse(savedScore).score : 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('playerName') || '';
  });
  const [nameSubmitted, setNameSubmitted] = useState(() => {
    const savedState = localStorage.getItem('snakeGameState');
    return savedState ? JSON.parse(savedState).nameSubmitted : false;
  });
  const [nameError, setNameError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const canvasRef = useRef(null);
  
  // Auto-save timer reference
  const autoSaveTimerRef = useRef(null);
  // Auto-save indicator state
  const [showAutoSave, setShowAutoSave] = useState(false);
  // Auto-save interval (in milliseconds)
  const AUTO_SAVE_INTERVAL = 10000; // 10 seconds
  
  // Default game settings
  const [gameSettings, setGameSettings] = useState({
    speed: 100,
    scoreMultiplier: 1.5,
    playerName: localStorage.getItem('playerName') || '',
    snakeColor: localStorage.getItem('snakeColor') || '#2ecc71'
  });
  
  // Power-up state
  const [powerUp, setPowerUp] = useState(null);
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [powerUpTimeLeft, setPowerUpTimeLeft] = useState(0);

  // Prevent scrolling with arrow keys during gameplay
  useEffect(() => {
    const preventScroll = (e) => {
      if ([37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', preventScroll);
    
    return () => {
      window.removeEventListener('keydown', preventScroll);
    };
  }, []);

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
    };
  }, []);
  
  // Generate a power-up with random position and type
  const generatePowerUp = useCallback(() => {
    // Random chance to generate a power-up
    if (Math.random() * 100 > POWER_UP_CHANCE) return null;
    
    // Select random power-up type
    const types = Object.values(POWER_UP_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    
    return {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
      type
    };
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection({ dx: 1, dy: 0 });
    setScore(0);
    setGameOver(false);
    setPowerUp(null);
    setActivePowerUp(null);
    setPowerUpTimeLeft(0);
    // Keep the player name but reset the game
    
    // Clear saved game state when resetting
    localStorage.removeItem('snakeGameState');
  }, [generateFood]);

  const checkCollision = useCallback((head) => {
    if (
      head.x < 0 ||
      head.x >= TILE_COUNT ||
      head.y < 0 ||
      head.y >= TILE_COUNT
    ) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const head = {
      x: snake[0].x + direction.dx,
      y: snake[0].y + direction.dy,
    };

    // Check collision unless immunity power-up is active
    if (checkCollision(head) && activePowerUp !== POWER_UP_TYPES.IMMUNITY) {
      setGameOver(true);
      setShowConfetti(true);
      return;
    }

    const newSnake = [head, ...snake];

    // Check if snake ate the food
    if (head.x === food.x && head.y === food.y) {
      // Calculate score based on difficulty multiplier
      const points = 10 * gameSettings.scoreMultiplier;
      // Double points if power-up is active
      const finalPoints = activePowerUp === POWER_UP_TYPES.DOUBLE_POINTS ? points * 2 : points;
      
      setScore((prev) => prev + finalPoints);
      setFood(generateFood());
      
      // Chance to spawn a power-up when eating food
      if (!powerUp) {
        setPowerUp(generatePowerUp());
      }
    } else {
      newSnake.pop();
    }
    
    // Check if snake ate a power-up
    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
      activatePowerUp(powerUp.type);
      setPowerUp(null);
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, checkCollision, generateFood, powerUp, activePowerUp, gameSettings.scoreMultiplier, generatePowerUp]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      const { keyCode } = event;
      const { dx, dy } = direction;

      switch (keyCode) {
        case 37: // Left
          if (dx !== 1) setDirection({ dx: -1, dy: 0 });
          break;
        case 38: // Up
          if (dy !== 1) setDirection({ dx: 0, dy: -1 });
          break;
        case 39: // Right
          if (dx !== -1) setDirection({ dx: 1, dy: 0 });
          break;
        case 40: // Down
          if (dy !== -1) setDirection({ dx: 0, dy: 1 });
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  // Activate power-up effect
  const activatePowerUp = useCallback((type) => {
    setActivePowerUp(type);
    setPowerUpTimeLeft(5); // 5 seconds duration
  }, []);
  
  // Handle power-up timer
  useEffect(() => {
    if (!activePowerUp || powerUpTimeLeft <= 0) return;
    
    const powerUpTimer = setInterval(() => {
      setPowerUpTimeLeft(prev => {
        if (prev <= 1) {
          setActivePowerUp(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(powerUpTimer);
  }, [activePowerUp, powerUpTimeLeft]);
  
  // Save game state to localStorage
  const saveGameState = useCallback(() => {
    if (gameOver || !nameSubmitted) return;
    
    const gameState = {
      snake,
      food,
      direction,
      score,
      nameSubmitted,
      powerUp,
      activePowerUp,
      powerUpTimeLeft
    };
    
    localStorage.setItem('snakeGameState', JSON.stringify(gameState));
    localStorage.setItem('playerName', playerName);
    
    // Show auto-save indicator
    setShowAutoSave(true);
    
    // Hide auto-save indicator after 1 second
    setTimeout(() => {
      setShowAutoSave(false);
    }, 1000);
  }, [snake, food, direction, score, nameSubmitted, powerUp, activePowerUp, powerUpTimeLeft, gameOver, playerName]);
  
  // Setup auto-save timer
  useEffect(() => {
    if (gameOver || !nameSubmitted) {
      // Clear auto-save timer if game is over or name not submitted
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      return;
    }
    
    // Start auto-save timer
    autoSaveTimerRef.current = setInterval(saveGameState, AUTO_SAVE_INTERVAL);
    
    // Clean up timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [gameOver, nameSubmitted, saveGameState]);
  
  // Calculate game speed based on active power-ups and score
  const calculateGameSpeed = useCallback(() => {
    let speed = gameSettings.speed;
    
    // Increase speed based on score (every 50 points)
    const speedIncrease = Math.floor(score / 50) * 5;
    speed = Math.max(30, speed - speedIncrease); // Cap minimum speed at 30ms
    
    if (activePowerUp === POWER_UP_TYPES.SPEED) {
      speed = speed * 0.6; // 40% faster
    } else if (activePowerUp === POWER_UP_TYPES.SLOW) {
      speed = speed * 1.5; // 50% slower
    }
    
    return speed;
  }, [activePowerUp]);
  
  useEffect(() => {
    // Only start the game loop if the player has submitted their name
    if (!gameOver && nameSubmitted) {
      const gameLoop = setInterval(moveSnake, calculateGameSpeed());
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, calculateGameSpeed, gameOver, nameSubmitted]);

  // Draw game elements on canvas
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake with custom color
    snake.forEach((segment) => {
      ctx.fillStyle = gameSettings.snakeColor;
      ctx.shadowColor = gameSettings.snakeColor;
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
        5
      );
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;

    // Draw food with glowing effect
    const foodGradient = ctx.createRadialGradient(
      (food.x * GRID_SIZE) + (GRID_SIZE/2),
      (food.y * GRID_SIZE) + (GRID_SIZE/2),
      2,
      (food.x * GRID_SIZE) + (GRID_SIZE/2),
      (food.y * GRID_SIZE) + (GRID_SIZE/2),
      GRID_SIZE/2
    );
    foodGradient.addColorStop(0, '#ff5555');
    foodGradient.addColorStop(0.7, '#ff0000');
    foodGradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
    
    ctx.fillStyle = foodGradient;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    
    ctx.beginPath();
    ctx.arc(
      (food.x * GRID_SIZE) + (GRID_SIZE/2),
      (food.y * GRID_SIZE) + (GRID_SIZE/2),
      GRID_SIZE/2 - 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw power-up if exists
    if (powerUp) {
      let powerUpColor;
      switch(powerUp.type) {
        case POWER_UP_TYPES.SPEED:
          powerUpColor = '#3498db'; // Blue
          break;
        case POWER_UP_TYPES.SLOW:
          powerUpColor = '#9b59b6'; // Purple
          break;
        case POWER_UP_TYPES.DOUBLE_POINTS:
          powerUpColor = '#f1c40f'; // Yellow
          break;
        case POWER_UP_TYPES.IMMUNITY:
          powerUpColor = '#e74c3c'; // Red
          break;
        default:
          powerUpColor = '#2ecc71'; // Green
      }
      
      const powerUpGradient = ctx.createRadialGradient(
        (powerUp.x * GRID_SIZE) + (GRID_SIZE/2),
        (powerUp.y * GRID_SIZE) + (GRID_SIZE/2),
        2,
        (powerUp.x * GRID_SIZE) + (GRID_SIZE/2),
        (powerUp.y * GRID_SIZE) + (GRID_SIZE/2),
        GRID_SIZE/2
      );
      powerUpGradient.addColorStop(0, powerUpColor);
      powerUpGradient.addColorStop(0.6, powerUpColor);
      powerUpGradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
      
      ctx.fillStyle = powerUpGradient;
      ctx.shadowColor = powerUpColor;
      ctx.shadowBlur = 20;
      
      ctx.beginPath();
      ctx.arc(
        (powerUp.x * GRID_SIZE) + (GRID_SIZE/2),
        (powerUp.y * GRID_SIZE) + (GRID_SIZE/2),
        GRID_SIZE/2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  }, [snake, food, powerUp]);

  // Update canvas when game state changes
  useEffect(() => {
    drawGame();
  }, [snake, food, powerUp, drawGame]);
  
  // Save game state when component unmounts
  useEffect(() => {
    return () => {
      // Only save if the game is active
      if (!gameOver && nameSubmitted) {
        const gameState = {
          snake,
          food,
          direction,
          score,
          nameSubmitted,
          powerUp,
          activePowerUp,
          powerUpTimeLeft
        };
        
        localStorage.setItem('snakeGameState', JSON.stringify(gameState));
        localStorage.setItem('playerName', playerName);
      }
    };
  }, [snake, food, direction, score, nameSubmitted, powerUp, activePowerUp, powerUpTimeLeft, gameOver, playerName]);

  // Handle touch events for mobile controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      e.preventDefault();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      if (!touchStartX || !touchStartY) return;
      
      e.preventDefault();
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;
      
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      // Determine swipe direction based on which axis had the larger movement
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          // Swipe right
          if (direction.dx !== -1) setDirection({ dx: 1, dy: 0 });
        } else {
          // Swipe left
          if (direction.dx !== 1) setDirection({ dx: -1, dy: 0 });
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          // Swipe down
          if (direction.dy !== -1) setDirection({ dx: 0, dy: 1 });
        } else {
          // Swipe up
          if (direction.dy !== 1) setDirection({ dx: 0, dy: -1 });
        }
      }
      
      // Reset touch start coordinates after processing the swipe
      touchStartX = touchEndX;
      touchStartY = touchEndY;
    };
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [direction, canvasRef]);
  
  // Add touch control buttons for mobile users
  const renderTouchControls = () => {
    return (
      <div className={styles.touchControls}>
        <button 
          className={styles.touchBtn} 
          onClick={() => direction.dx !== 1 && setDirection({ dx: -1, dy: 0 })}
          aria-label="Move Left"
        >
          ←
        </button>
        <button 
          className={styles.touchBtn} 
          onClick={() => direction.dy !== 1 && setDirection({ dx: 0, dy: -1 })}
          aria-label="Move Up"
        >
          ↑
        </button>
        <button 
          className={styles.touchBtn} 
          onClick={() => direction.dy !== -1 && setDirection({ dx: 0, dy: 1 })}
          aria-label="Move Down"
        >
          ↓
        </button>
        <button 
          className={styles.touchBtn} 
          onClick={() => direction.dx !== -1 && setDirection({ dx: 1, dy: 0 })}
          aria-label="Move Right"
        >
          →
        </button>
      </div>
    );
  };
  
  // Handle name submission
  const handleNameSubmit = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setNameError('Please enter your name to start the game');
      return;
    }
    
    setNameError('');
    setNameSubmitted(true);
  };
  
  // Render name input form
  const renderNameForm = () => {
    return (
      <div className={styles.nameFormContainer}>
        <h2>Enter Your Name</h2>
        <form className={styles.nameForm} onSubmit={handleNameSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={15}
            />
            <button type="submit">Start Game</button>
          </div>
          {nameError && <p className={styles.errorMessage}>{nameError}</p>}
        </form>
      </div>
    );
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameControls}>
        <button className={styles.settingsBtn} onClick={() => setShowSettings(true)}>
          Settings
        </button>
      </div>
      <Settings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={setGameSettings}
      />
      {showConfetti && <Confetti show={showConfetti} duration={5000} />}
      <h1>Snake Game</h1>
      
      {!nameSubmitted ? (
        // Show name input form if name hasn't been submitted
        renderNameForm()
      ) : (
        // Show game content if name has been submitted
        <>
          <div className={styles.score}>Score: {score}</div>
          
          {showAutoSave && (
            <div className={styles.autoSaveIndicator}>
              Auto-saving...
            </div>
          )}
          
          {activePowerUp && (
            <div className={`${styles.powerUpIndicator} ${styles[activePowerUp]}`}>
              {activePowerUp === POWER_UP_TYPES.SPEED && 'Speed Boost!'}
              {activePowerUp === POWER_UP_TYPES.SLOW && 'Slow Motion!'}
              {activePowerUp === POWER_UP_TYPES.DOUBLE_POINTS && 'Double Points!'}
              {activePowerUp === POWER_UP_TYPES.IMMUNITY && 'Immunity!'}
              <span className={styles.powerUpTimer}>{powerUpTimeLeft}s</span>
            </div>
          )}
          
          {/* Add touch controls for mobile devices */}
          {renderTouchControls()}
          
          <canvas
            id="gameCanvas"
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            ref={canvasRef}
          />
          {gameOver && (
            <div className={styles.gameOver}>
              <h2>Game Over!</h2>
              <p>Final Score: {score}</p>

              <button onClick={resetGame}>Play Again</button>
            </div>
          )}
          

        </>
      )}
    </div>
  );
}