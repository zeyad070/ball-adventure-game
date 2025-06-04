let obstacles = [];
let collectibles = [];

function createObstacle(x, type = "spike") {
  const obstacle = {
    x: x,
    y: canvas.height - 25, // تتماشى مع الارتفاع الجديد للعقبة
    width: 30,
    height: 25, // تم تقليل الارتفاع
    color: "#ff4757",
  };
  obstacles.push(obstacle);
}

function createCollectible(x, type = "star") {
  const collectible = {
    x: x,
    y: Math.random() * (canvas.height - 200) + 150, // تم رفع القيمة من 100 إلى 150
    size: 25,
    color: "#ffd700",
    value: 10,
  };
  collectibles.push(collectible);
}

// === نهاية اللعبة ===
function endGame() {
  gameRunning = false;
  gameOverElement.style.display = "block";
  finalScoreElement.textContent = `نقاطك النهائية: ${score}`;
  finalLevelElement.textContent = `وصلت للمستوى: ${level}`;
  finalWaveElement.textContent = `آخر موجة: ${wave}`;
}

// === إعادة اللعبة ===
function resetGame() {
  score = 0;
  combo = 1;
  lives = 4;
  level = 1;
  wave = 1;
  gameSpeed = 1.5;
  gameRunning = true;
  invulnerable = false;

  scoreElement.textContent = score;
  comboElement.textContent = "×" + combo;
  healthBarElement.innerHTML = '<div class="heart">♥</div>'.repeat(lives);

  gameOverElement.style.display = "none";

  initializeGame();
}

// === التحكم عبر لوحة المفاتيح ===
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      ball.dx = -ball.speed;
      break;
    case "ArrowRight":
      ball.dx = ball.speed;
      break;
    case "ArrowUp":
    case " ":
      if (ball.y + ball.radius >= canvas.height) {
        ball.dy = ball.jumpForce;
      }
      break;
  }
});

// === التحكم عبر اللمس ===
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  if (Math.abs(dy) > Math.abs(dx)) {
    if (dy < -50 && ball.y + ball.radius >= canvas.height) {
      ball.dy = ball.jumpForce;
    }
  } else {
    if (dx > 50) {
      ball.dx = ball.speed;
    } else if (dx < -50) {
      ball.dx = -ball.speed;
    }
  }
});
