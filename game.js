let score = 0;
let health = 100;
let isGameOver = false;

const pikmin = document.getElementById('pikmin');
const scoreValue = document.getElementById('score-value');
const healthFill = document.getElementById('health-fill');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const hitSound = document.getElementById('hit-sound');

function updateScore(points) {
  score += points;
  scoreValue.textContent = score;
}

function updateHealth(damage) {
  health = Math.max(0, health - damage);
  healthFill.style.width = `${health}%`;
  
  if (health <= 0 && !isGameOver) {
    endGame();
  }
}

function endGame() {
  isGameOver = true;
  finalScoreElement.textContent = score;
  gameOverScreen.classList.remove('hidden');
  pikmin.style.pointerEvents = 'none';
}

function resetGame() {
  score = 0;
  health = 100;
  isGameOver = false;
  scoreValue.textContent = '0';
  healthFill.style.width = '100%';
  gameOverScreen.classList.add('hidden');
  pikmin.style.pointerEvents = 'auto';
  movePikmin();
}

function hitPikmin() {
  if (isGameOver) return;
  
  hitSound.currentTime = 0;
  hitSound.play();
  
  pikmin.classList.remove('idle');
  pikmin.classList.add('hit');
  
  updateScore(10);
  updateHealth(5);
  
  setTimeout(() => {
    pikmin.classList.remove('hit');
    pikmin.classList.add('idle');
  }, 200);
  
  movePikmin();
}

function movePikmin() {
  const container = document.querySelector('.game-container');
  const maxX = container.clientWidth - pikmin.clientWidth;
  const maxY = container.clientHeight - pikmin.clientHeight;
  
  const newX = Math.random() * maxX;
  const newY = Math.random() * maxY;
  
  pikmin.style.left = `${newX}px`;
  pikmin.style.top = `${newY}px`;
}

pikmin.addEventListener('click', hitPikmin);
movePikmin();