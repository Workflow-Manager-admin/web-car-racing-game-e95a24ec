export const KEYS = {
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  SPACE: ' ',
  ENTER: 'Enter'
};

export const checkCollision = (rect1, rect2) => {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
};

export const generateObstacle = (canvasWidth) => {
  const width = 60;
  const height = 80;
  return {
    x: Math.random() * (canvasWidth - width),
    y: -height,
    width,
    height,
    speed: 3 + Math.random() * 2
  };
};
