let secretNumber;
let attemptsLeft;
let difficulty = "";

const bgMusic = document.getElementById('bgMusic');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const loseSound = document.getElementById('loseSound');
const heartsContainer = document.getElementById('heartsContainer');
const musicButton = document.getElementById('musicButton');

function updateHearts(count) {
  const currentHearts = heartsContainer.querySelectorAll('.heart');
  const currentCount = currentHearts.length;

  if (count < currentCount) {
    for (let i = currentCount - 1; i >= count; i--) {
      const heart = currentHearts[i];
      heart.classList.add('fade-out');
      setTimeout(() => heart.remove(), 300);
    }
  } else {
    for (let i = currentCount; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = '❤️';
      heartsContainer.appendChild(heart);
    }
  }
}

function setDifficulty(level) {
  difficulty = level;
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = level === 'easy' ? 10 : 5;
  document.getElementById('attempts').textContent = `Attempts: ${attemptsLeft}`;
  document.getElementById('feedback').textContent = "Game started! Make a guess.";
  updateHearts(attemptsLeft);
  bgMusic.volume = 0.3;
  bgMusic.play();
  musicButton.textContent = '🎵 Music On';
}

function submitGuess() {
  if (!difficulty) {
    alert("Choose a difficulty first!");
    return;
  }

  const guess = Number(document.getElementById('guessInput').value);
  const feedback = document.getElementById('feedback');

  if (!guess || guess < 1 || guess > 100) {
    feedback.textContent = "Enter a number between 1 and 100.";
    return;
  }

  attemptsLeft--;
  document.getElementById('attempts').textContent = `Attempts: ${attemptsLeft}`;
  updateHearts(attemptsLeft);

  feedback.style.opacity = '0';
  setTimeout(() => {
    if (guess === secretNumber) {
      correctSound.play();
      feedback.textContent = `🎉 Correct! The number was ${secretNumber}.`;
    } else if (attemptsLeft === 0) {
      loseSound.play();
      feedback.textContent = `💀 Game over! The number was ${secretNumber}.`;
    } else if (guess > secretNumber) {
      wrongSound.play();
      feedback.textContent = "Too high! Try again.";
    } else {
      wrongSound.play();
      feedback.textContent = "Too low! Try again.";
    }
    feedback.style.opacity = '1';
  }, 200);
}

function restartGame() {
  difficulty = "";
  attemptsLeft = 0;
  document.getElementById('attempts').textContent = "Attempts: -";
  document.getElementById('feedback').textContent = "Game reset. Choose difficulty to start!";
  document.getElementById('guessInput').value = "";
  heartsContainer.innerHTML = '';
  bgMusic.pause();
  bgMusic.currentTime = 0;
  musicButton.textContent = '🎵 Music On';
}

function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play();
    musicButton.textContent = '🎵 Music On';
  } else {
    bgMusic.pause();
    musicButton.textContent = '🔇 Music Off';
  }
}
