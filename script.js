document.addEventListener('DOMContentLoaded', () => {
  const staticPatrick = document.getElementById('staticPatrick');
  const dancingPatrick = document.getElementById('dancingPatrick');
  const timerDisplay = document.getElementById('timer');
  const audio = document.getElementById('backgroundMusic');

  let seconds = 0;
  let timerInterval = null;

  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `Time Danced: ${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  function startTimer() {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
      }, 1000);
    }
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Function to handle space key press
  function handleKeyDown(event) {
    if (event.code === 'Space') {
      staticPatrick.style.display = 'none';
      dancingPatrick.style.display = 'block';
      startTimer();
      
      // Play audio if it's paused
      if (audio.paused) {
        audio.play();
      }
    }
  }

  // Function to handle space key release
  function handleKeyUp(event) {
    if (event.code === 'Space') {
      staticPatrick.style.display = 'block';
      dancingPatrick.style.display = 'none';
      stopTimer();
      audio.pause();
    }
  }

  // Add event listeners for keydown and keyup
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Prevent space bar from scrolling the page
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  });

  // Initialize timer display
  updateTimerDisplay();
});