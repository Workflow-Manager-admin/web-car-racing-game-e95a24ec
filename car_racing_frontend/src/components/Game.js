import React, { useEffect, useRef, useState } from 'react';
import { SOUNDS } from '../assets/sounds/racing-sounds';
import { KEYS, checkCollision, generateObstacle } from '../utils/gameUtils';
import '../styles/Game.css';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CAR_WIDTH = 50;
const CAR_HEIGHT = 80;

const Game = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  
  const gameStateRef = useRef({
    car: {
      x: CANVAS_WIDTH / 2 - CAR_WIDTH / 2,
      y: CANVAS_HEIGHT - CAR_HEIGHT - 20,
      width: CAR_WIDTH,
      height: CAR_HEIGHT,
      speed: 5
    },
    obstacles: [],
    keys: {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false
    },
    animationFrameId: null
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastObstacleTime = 0;

    const handleKeyDown = (e) => {
      if (gameStateRef.current.keys.hasOwnProperty(e.key)) {
        gameStateRef.current.keys[e.key] = true;
      }
      if (e.key === KEYS.SPACE) {
        togglePause();
      }
    };

    const handleKeyUp = (e) => {
      if (gameStateRef.current.keys.hasOwnProperty(e.key)) {
        gameStateRef.current.keys[e.key] = false;
      }
    };

    const drawCar = () => {
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(
        gameStateRef.current.car.x,
        gameStateRef.current.car.y,
        gameStateRef.current.car.width,
        gameStateRef.current.car.height
      );
    };

    const drawObstacles = () => {
      ctx.fillStyle = '#1E90FF';
      gameStateRef.current.obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
    };

    const updateGame = (timestamp) => {
      if (!isStarted || isPaused || gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update car position
      if (gameStateRef.current.keys[KEYS.LEFT]) {
        gameStateRef.current.car.x = Math.max(
          0,
          gameStateRef.current.car.x - gameStateRef.current.car.speed
        );
      }
      if (gameStateRef.current.keys[KEYS.RIGHT]) {
        gameStateRef.current.car.x = Math.min(
          canvas.width - gameStateRef.current.car.width,
          gameStateRef.current.car.x + gameStateRef.current.car.speed
        );
      }

      // Generate new obstacles
      if (timestamp - lastObstacleTime > 2000) {
        gameStateRef.current.obstacles.push(generateObstacle(CANVAS_WIDTH));
        lastObstacleTime = timestamp;
      }

      // Update obstacles
      gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter(obstacle => {
        obstacle.y += obstacle.speed;
        
        // Check collision
        if (checkCollision(gameStateRef.current.car, obstacle)) {
          SOUNDS.crash.play();
          setGameOver(true);
          return false;
        }

        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
          setScore(prev => prev + 10);
          SOUNDS.score.play();
          return false;
        }

        return true;
      });

      drawCar();
      drawObstacles();

      gameStateRef.current.animationFrameId = requestAnimationFrame(updateGame);
    };

    const startGame = () => {
      setIsStarted(true);
      setGameOver(false);
      setScore(0);
      gameStateRef.current.obstacles = [];
      SOUNDS.engine.play();
      gameStateRef.current.animationFrameId = requestAnimationFrame(updateGame);
    };

    const togglePause = () => {
      setIsPaused(!isPaused);
      if (!isPaused) {
        SOUNDS.engine.pause();
      } else {
        SOUNDS.engine.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameStateRef.current.animationFrameId);
      SOUNDS.engine.stop();
    };
  }, [isStarted, isPaused, gameOver]);

  const handleStartClick = () => {
    if (!isStarted || gameOver) {
      setIsStarted(true);
      setGameOver(false);
      setScore(0);
      gameStateRef.current.obstacles = [];
      SOUNDS.engine.play();
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score-board">Score: {score}</div>
        <button className="control-btn" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />

      {(gameOver || !isStarted) && (
        <div className="game-over">
          <h2>{gameOver ? 'Game Over!' : 'Car Racing Game'}</h2>
          <p>Score: {score}</p>
          <button className="control-btn" onClick={handleStartClick}>
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      )}

      <div className="instructions">
        <p>Use arrow keys to control the car</p>
        <p>Space to pause/resume</p>
      </div>
    </div>
  );
};

export default Game;
