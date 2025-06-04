// === تعريف canvas ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// إعدادات اللعبة
canvas.width = window.innerWidth > 1000 ? 1000 : window.innerWidth - 40;
canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight - 40;