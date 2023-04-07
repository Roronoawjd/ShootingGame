//캔버스 세팅
let canvas;
let ctx;
let enemy_speed = Math.random() + 0.1;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, playerImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false; //true이면 게임이 끝남, false이면 게임이 안끝남
//우주선 좌표
let score = 0;
// player 좌표
let playerX = canvas.width / 2 - 25;
let playerY = canvas.height - 50;

let bulletList = []; //총알들을 저장하는 리스트
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = playerX + 15;
    this.y = playerY;
    this.alive = true; //true면 살아있는 총알 false면 죽은 총알

    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 5;
  };
  this.checkBullet = function () {
    //총알 날라간놈 삭제
    for (let i = 0; i < bulletList.length; i++) {
      if (bulletList[i].y < -20) {
        bulletList.splice(i, 1);
      }
    }
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y + 50 &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 30
      ) {
        //  총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
        score++;
        this.alive = false; //죽은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}

let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.speed = Math.random() + 0.1;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 50);
    enemyList.push(this);
  };
  this.update = function () {
    if (score <= 50) {
      this.y += this.speed; // 적군의 속도 조절
    } else if (score <= 100) {
      this.y += this.speed + 0.5; // 적군의 속도 조절
    } else {
      this.y += this.speed + 5; // 적군의 속도 조절
    }

    if (this.y >= canvas.height - 50) {
      gameOver = true;
    }
  };
}

function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.jpeg";

  playerImage = new Image();
  playerImage.src = "images/player.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameOver.png";
}

let KeysDown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    KeysDown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete KeysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet(); // 총알 생성
    }
  });
}

function createBullet() {
  let b = new Bullet(); // 총알 하나 생성
  b.init();
}

function createEnemy() {
  let interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in KeysDown) {
    playerX += 3; // 우주선의 속도
  } //right
  if (37 in KeysDown) {
    playerX -= 3;
  } //left
  if (playerX <= -25) {
    playerX = -25;
  }
  if (playerX >= canvas.width - 25) {
    playerX = canvas.width - 25;
  }
  // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만 있게 하려면?

  // 총알의 y좌표 업데이트하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
    if (bulletList[i].alive == false) {
      bulletList.splice(i, 1);
    }
  }
  // 총알 캔버스 범위 밖 삭제
  for (let i = 0; i < bulletList.length; i++) {
    bulletList[i].checkBullet();
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImage, playerX, playerY, 50, 50);
  ctx.fillText(`score:${score}`, 20, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y, 20, 20);
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y, 50, 50);
  }
}

function main() {
  if (!gameOver) {
    update(); // 자표값 업데이트하고
    render(); // 그려주고
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 160, 380, 380);
  }
}
loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render 해준다

// 총알만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 --, 총알의 x값은? 스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알 배열에 저장을 한다.
// 4. 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 해준다.
