// المتغيرات الأخرى
let score = 0;
let combo = 1;
let lives = 4;
let level = 1;
let wave = 1;
let gameSpeed = 1.5;
let gameRunning = true;
let invulnerable = false;

// قائمة الرسائل العشوائية
const crashMessages = ["يحيوان", "اععععع😭", "🙄", "هزعلك", "متكلمنيش"];
const collectMessages = [
  "بحبك اووووى",
  "عسولييييييييييي",
  "روحيييييييي",
  "حبيبي انت",
  "🙈",
  "شطورييييييييييييي",
];

// متغير اللاعب
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 25,
  color: "#00d4ff",
  dy: 0,
  dx: 0,
  gravity: 0.5,
  jumpForce: -15, // قفز أسرع
  speed: 3,
  maxSpeed: 8,
};

// عناصر الواجهة
const scoreElement = document.getElementById("scoreValue");
const comboElement = document.getElementById("comboValue");
const waveElement = document.getElementById("waveValue");
const levelElement = document.getElementById("levelValue");
const healthBarElement = document.getElementById("healthBar");
const gameOverElement = document.getElementById("gameOver");
const finalScoreElement = document.getElementById("finalScore");
const finalLevelElement = document.getElementById("finalLevel");
const finalWaveElement = document.getElementById("finalWave");
const randomMessageElement = document.getElementById("randomMessage");
const comboDisplayElement = document.getElementById("comboDisplay");

// دوال الرسم
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
}

function drawObstacles() {
  obstacles.forEach((o) => {
    ctx.fillStyle = o.color || "#ff4757";
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
}

function drawCollectibles() {
  collectibles.forEach((c) => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
  });
}

// تحديث اللاعب
function updateBall() {
  ball.dy += ball.gravity;
  ball.y += ball.dy;
  ball.x += ball.dx;

  if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.dy = 0;
  }
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy = 0;
  }
  if (ball.x - ball.radius < 0) {
    ball.x = ball.radius;
    ball.dx = 0;
  }
  if (ball.x + ball.radius > canvas.width) {
    ball.x = canvas.width - ball.radius;
    ball.dx = 0;
  }
}

// تحديث العقبات
function updateObstacles() {
  obstacles = obstacles.filter((o) => {
    o.x -= gameSpeed;
    return o.x + o.width > -100;
  });
}

// تحديث الجواهر
function updateCollectibles() {
  collectibles = collectibles.filter((c) => {
    c.x -= gameSpeed;
    return c.x + c.size / 2 > -100;
  });
}

// التحقق من التصادم
function checkCollisions() {
  // العقبات
  obstacles = obstacles.filter((o) => {
    const hit =
      ball.x + ball.radius > o.x &&
      ball.x - ball.radius < o.x + o.width &&
      ball.y + ball.radius > o.y &&
      ball.y - ball.radius < o.y + o.height;

    if (hit && !invulnerable) {
      lives--;
      combo = 1;
      comboElement.textContent = "×" + combo;

      // رسالة عند الاصطدام
      const randomMsg =
        crashMessages[Math.floor(Math.random() * crashMessages.length)];
      showRandomMessage(randomMsg);

      if (lives <= 0) endGame();
      else {
        invulnerable = true;
        setTimeout(() => (invulnerable = false), 1500);
      }
      return false;
    }
    return true;
  });

  // الجواهر
  collectibles = collectibles.filter((c) => {
    const dx = c.x - ball.x;
    const dy = c.y - ball.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball.radius + c.size / 2) {
      score += c.value;
      scoreElement.textContent = score;
      combo++;
      comboElement.textContent = "×" + combo;
      showComboEffect(combo);

      // رسالة عند جمع النجمة
      const randomMsg =
        collectMessages[Math.floor(Math.random() * collectMessages.length)];
      showRandomMessage(randomMsg);

      return false;
    }
    return true;
  });
}

// رسائل عشوائية
function showRandomMessage(message) {
  randomMessageElement.textContent = message;
  randomMessageElement.style.opacity = 1;
  setTimeout(() => {
    randomMessageElement.style.opacity = 0;
  }, 2000);
}

// تأثير الكومبو
function showComboEffect(value) {
  comboDisplayElement.textContent = `×${value}`;
  comboDisplayElement.style.opacity = 1;
  comboDisplayElement.style.transform = "scale(1)";
  setTimeout(() => {
    comboDisplayElement.style.opacity = 0;
    comboDisplayElement.style.transform = "scale(0.5)";
  }, 800);
}

// تهيئة البداية
function initializeGame() {
  obstacles.length = 0;
  collectibles.length = 0;

  const spacing = 400;

  for (let i = 0; i < 5; i++) {
    const x = canvas.width + i * spacing + Math.random() * 100;

    createObstacle(x);
    createCollectible(x + 100);
  }

  // عقبة قريبة للمستخدم
  createObstacle(canvas.width / 2 + 150);
  createCollectible(canvas.width / 2 + 250);

  showRandomMessage("ابدأ بالقفز.. استمتع!");
}
initializeGame();

function spawnNewElements() {
  const lastObstacle = obstacles[obstacles.length - 1];
  const lastCollectible = collectibles[collectibles.length - 1];

  const x = (lastObstacle?.x || canvas.width) + 400 + Math.random() * 100;

  if (!lastObstacle || x > lastObstacle.x) {
    createObstacle(x);
  }

  if (!lastCollectible || x > lastCollectible.x + 100) {
    createCollectible(x + 100);
  }
}

// حلقات الرسم
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBall();
  updateObstacles();
  updateCollectibles();
  checkCollisions();

  // إنشاء عناصر جديدة إذا انتهت القائمة
  if (obstacles.length < 3 || collectibles.length < 3) {
    spawnNewElements();
  }

  drawBall();
  drawObstacles();
  drawCollectibles();

  requestAnimationFrame(animate);
}
animate();
