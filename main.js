const scoreHolder = document.getElementById("score");
const timeHolder = document.getElementById("time");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const secondaryCanvas = document.getElementById("secondaryCanvas");
const secCtx = secondaryCanvas.getContext("2d");
const startButton = document.getElementById("startButton");
const buttons = document.querySelectorAll(".button");
const menuBackground = document.getElementById("menuBackground");

const blockSize = 25;
const horizontalBlocks = 20;
const verticalBlocks = 30;
canvas.width = horizontalBlocks * blockSize;
canvas.height = verticalBlocks * blockSize;
secondaryCanvas.width = blockSize * 6;
secondaryCanvas.height = blockSize * 6;
const safeAreaInBlocks = 6;
const boundaryYPosition = safeAreaInBlocks * blockSize;
let timer = { min: 0, sec: 0 };

let score = 0;
let blockColor = "white";
let mainInterval = null;
let timeInterval = null;

// add sound effect to all buttons
buttons.forEach((btn) => {
  btn.addEventListener("mouseover", () => {
    const clickSound = new Audio("assets/clickSound.mp3");
    clickSound.play();
  });
  btn.addEventListener("click", () => {
    const clickSound = new Audio("assets/openSound.mp3");
    clickSound.play();
  });
});

// prepare space
let space = Array.from({ length: verticalBlocks }, () =>
  Array.from({ length: horizontalBlocks }, () => 0)
);

function drawBlock(x, y) {
  ctx.strokeStyle = "black";
  ctx.fillStyle = blockColor;

  ctx.fillRect(x, y, blockSize, blockSize);
  ctx.strokeRect(x, y, blockSize, blockSize);
}

function drawNextBlock(x, y) {
  secCtx.strokeStyle = "black";
  secCtx.fillStyle = "white";

  secCtx.fillRect(x, y, blockSize, blockSize);
  secCtx.strokeRect(x, y, blockSize, blockSize);
}

function renderSpace() {
  for (let i = 0; i < verticalBlocks; i++) {
    for (let j = 0; j < horizontalBlocks; j++) {
      if (space[i][j]) {
        // horizontal point = blockSize * blockIndex
        let x = j * blockSize;
        // horizontal point = blockSize * blockIndex
        let y = i * blockSize;

        drawBlock(x, y);
      }
    }
  }

  // draw boundary
  ctx.beginPath();
  ctx.moveTo(0, boundaryYPosition);
  ctx.lineTo(ctx.canvas.width, boundaryYPosition);
  ctx.strokeStyle = "white";
  ctx.stroke();
}
const blockTypes = [
  Tblock,
  SquareBlock,
  Lblock,
  Jblock,
  Sblock,
  Zblock,
  Iblock,
];

function generateNewBlock() {
  const randomNumber = Math.floor(Math.random() * blockTypes.length);
  return new blockTypes[randomNumber]();
}
let nextBlock = generateNewBlock();

function updateBlock() {
  currentBlock = nextBlock;
  nextBlock = generateNewBlock();
  nextBlock.rotate();
  nextBlock.rotate();

  // update small canvas
  secCtx.reset();
  for (let i = 0; i < nextBlock.space.length; i++) {
    for (let k = 0; k < nextBlock.space[i].length; k++) {
      if (nextBlock.space[i][k]) {
        // horizontal point = blockSize * blockIndex
        let x = (k + 1) * blockSize;
        // horizontal point = blockSize * blockIndex
        let y = (i + 1) * blockSize;

        drawNextBlock(x, y);
      }
    }
  }
}
updateBlock();

generateNewBlock();
function updateScore(amount = 10) {
  score += amount;
  scoreHolder.innerText = score;
}

function collapse() {
  let filledRows = [];
  for (let i = 0; i < space.length; i++) {
    let isFilled = true;
    for (let j = 0; j < space[i].length; j++) {
      if (!space[i][j]) {
        isFilled = false;
        break;
      }
    }
    if (isFilled) {
      const bricksBreakSound = new Audio("./assets/bricksBreak.mp3");
      bricksBreakSound.play();

      space[i] = space[i].map(() => 0);
      filledRows.push(i);

      updateScore(50);
    }
  }
  setTimeout(() => {
    filledRows.forEach((row) => {
      for (let i = row; i > 0; i--) {
        for (let j = 0; j < space[i].length; j++) {
          space[i][j] = space[i - 1][j];
        }
      }
    });
  }, 300);
}

function isBoundaryCrossed() {
  let crossed = false;
  for (let i = 0; i < space[0].length; i++) {
    if (space[safeAreaInBlocks - 1][i]) {
      crossed = true;
      break;
    }
  }
  if (crossed) {
    blockColor = "red";

    const failedSound = new Audio("./assets/failedSound.mp3");
    failedSound.play();

    clearInterval(mainInterval);
    clearInterval(timeInterval);
    menuBackground.style.display = "flex";
  }
}

function mainIntervalFunction() {
  if (currentBlock.isLanded) {
    const brickLandingSound = new Audio("./assets/bricksLand.mp3");
    brickLandingSound.play();
    // check if blocks have crossed the line
    isBoundaryCrossed();
    collapse();
    updateScore();
    updateBlock();
  }

  currentBlock.moveDown();
}
function timeIntervalFunction() {
  if (1 + timer.sec >= 60) {
    timer.sec = 0;
    timer.min++;
  } else timer.sec++;
  timeHolder.innerText = `${timer.min}:${timer.sec}`;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") currentBlock.moveDown();
  else if (e.key === "ArrowRight") currentBlock.moveRight();
  else if (e.key === "ArrowLeft") currentBlock.moveLeft();
  else if (e.key === "ArrowUp") currentBlock.rotate();
});

function paint() {
  ctx.reset();
  renderSpace();
  currentBlock.render();

  if (currentBlock.y + currentBlock.length === 13) return;

  requestAnimationFrame(paint);
}

paint();

startButton.addEventListener("click", () => {
  space = Array.from({ length: verticalBlocks }, () =>
    Array.from({ length: horizontalBlocks }, () => 0)
  );

  timer.sec = 0;
  timer.min = 0;
  score = 0;
  blockColor = "white";
  timeInterval = setInterval(timeIntervalFunction, 1000);
  mainInterval = setInterval(mainIntervalFunction, 150);
  menuBackground.style.display = "none";
});
