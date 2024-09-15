const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: canvas.width / 2,
  y: canvas.height - 60, // 사람 이미지 높이에 맞춰 위치 수정
  width: 50, // 이미지의 가로 크기
  height: 60, // 이미지의 세로 크기
  speed: 5, // 속도를 조금 줄였습니다
  dx: 0,
  dy: 0, // y 축 이동 추가
};

let obstacles = [];
let gameOver = false;
let startTime = Date.now(); // 게임 시작 시간을 저장

// 이미지 로드
const meteorImg = new Image();
meteorImg.src = 'meteor.png'; // 운석 이미지 파일 경로

const playerImg = new Image();
playerImg.src = 'player.png'; // 사람 이미지 파일 경로

// 지난 시간을 계산해 반환하는 함수
function getElapsedTime() {
  let currentTime = Date.now();
  let elapsedTime = (currentTime - startTime) / 1000; // 초 단위로 변환
  return elapsedTime.toFixed(2); // 소수점 2자리까지
}

// 플레이어 그리기
function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height); // 사람 이미지 그리기
}

function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // 화면 밖으로 나가지 않게 조정
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function createObstacle() {
  let size = Math.random() * 40 + 70; // 운석 크기 (최소 40, 최대 70)
  let x = Math.random() * (canvas.width - size); 
  let y = 0 - size;
  let speed = Math.random() * 3 + 2;
  
  obstacles.push({ x, y, size, speed });
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(meteorImg, obstacle.x, obstacle.y, obstacle.size, obstacle.size); // 운석 이미지 그리기
  });
}

function moveObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.y += obstacle.speed;
  });

  obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);
}

function detectCollision() {
  obstacles.forEach(obstacle => {
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const obstacleCenterX = obstacle.x + obstacle.size / 2;
    const obstacleCenterY = obstacle.y + obstacle.size / 2;

    const distanceX = playerCenterX - obstacleCenterX;
    const distanceY = playerCenterY - obstacleCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    const playerRadius = Math.min(player.width, player.height) / 2 * 0.8;
    const obstacleRadius = obstacle.size / 2 * 0.8;

    if (distance < playerRadius + obstacleRadius) {
      gameOver = true;
    }
  });
}

function drawElapsedTime() {
  ctx.font = "40px Arial";
  ctx.fillStyle = "black";
  let marginTop = 20;
  ctx.fillText(`생존시간: ${getElapsedTime()}s`, 10, 30 + marginTop); // 왼쪽 상단에 시간 표시
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clear();
  drawPlayer();
  drawObstacles();
  movePlayer();
  moveObstacles();
  detectCollision();
  drawElapsedTime(); // 경과 시간을 화면에 그리기

  if (!gameOver) {
    requestAnimationFrame(update);
  } else {
    alert(`Game Over!당신의 생존시간은 ${getElapsedTime()}초 입니다!!`);
    document.location.reload();
  }
}

function keyDown(e) {
  if (e.key === "ArrowRight" || e.key === "Right") {
    player.dx = player.speed;
  } else if (e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = -player.speed;
  } else if (e.key === "ArrowUp" || e.key === "Up") {
    player.dy = -player.speed;
  } else if (e.key === "ArrowDown" || e.key === "Down") {
    player.dy = player.speed;
  }
}

function keyUp(e) {
  if (e.key === "ArrowRight" || e.key === "Right" || e.key === "ArrowLeft" || e.key === "Left") {
    player.dx = 0;
  } else if (e.key === "ArrowUp" || e.key === "Up" || e.key === "ArrowDown" || e.key === "Down") {
    player.dy = 0;
  }
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// 장애물 생성 주기
setInterval(createObstacle, 150);

// 게임 시작
update();
