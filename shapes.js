class Shape {
  constructor() {
    this.space = [[]];
    this.x = 0;
    this.y = 0;
    this.isLanded = false;
  }
  randomlyRotate(max) {
    const rand = Math.floor(Math.random() * (max - 0));
    for (let i = 0; i < rand; i++) {
      this.rotate();
    }
  }
  showBlockAtCenter() {
    // this method is called to help the block appear at the center of the space
    const calculatedX = Number(
      (space[0].length / 2 - this.space[0].length / 2).toFixed()
    );
    this.x = calculatedX;
  }
  rotate() {
    // switch the size of rows and columns
    const oldRowCount = this.space.length;
    const oldColCount = this.space[0].length;
    const newRowCount = oldColCount;
    const newColCount = oldRowCount;

    // check if the new size of block is crossing the bottom boundary
    if (
      newRowCount + this.y > space.length ||
      newColCount + this.x > space[0].length
    )
      return;

    // generate an empty matrix
    let tempSpace = Array.from({ length: newRowCount }, () =>
      Array(newColCount).fill(0)
    );

    // set the empty matrix to the rotated version of the old matrix
    for (let i = 0; i < tempSpace.length; i++) {
      for (let j = 0; j < tempSpace[i].length; j++) {
        tempSpace[newRowCount - i - 1][j] = this.space[j][i];
      }
    }

    // check if the tempSpace is intersecting with any other blocks
    let agree = true;
    for (let i = 0; i < tempSpace.length; i++) {
      for (let j = 0; j < tempSpace[i].length; j++) {
        if (!tempSpace[i][j]) continue;

        // know if the block square is intersecting
        if (space[this.y + i][this.x + j]) {
          agree = false;
        }
      }
    }

    // update the matrix
    if (agree) this.space = tempSpace;
  }
  render() {
    for (let i = 0; i < this.space.length; i++) {
      for (let j = 0; j < this.space[i].length; j++) {
        if (!this.space[i][j]) continue;

        const y = (this.y + i) * blockSize;
        const x = (this.x + j) * blockSize;
        drawBlock(x, y);
      }
    }
  }
  land() {
    for (let i = 0; i < this.space.length; i++) {
      for (let j = 0; j < this.space[i].length; j++) {
        if (!this.space[i][j]) continue;
        space[this.y + i][this.x + j] = 1;
      }
    }
    this.isLanded = true;
  }
  moveDown() {
    if (this.y + this.space.length >= space.length) {
      this.land();
      return;
    }

    let letGo = true;

    for (let i = 0; i < this.space.length; i++) {
      for (let j = 0; j < this.space[i].length; j++) {
        // if this square is not filled then move to the next square
        if (!this.space[i][j]) continue;

        // square under this
        const x = this.x + j;
        const y = this.y + i;

        if (space[y + 1][x]) {
          letGo = false;
          this.land();
          break;
        }
      }
    }
    if (letGo) this.y = this.y + 1;
  }
  moveRight() {
    if (this.x + this.space[0].length >= space[0].length) return;

    let letGo = true;

    for (let i = 0; i < this.space.length; i++) {
      for (let j = 0; j < this.space[i].length; j++) {
        // if this square is not filled then move to the next square
        if (!this.space[i][j]) continue;

        // square under this
        const x = this.x + j;
        const y = this.y + i;

        if (space[y][x + 1]) {
          letGo = false;
          break;
        }
      }
    }
    if (letGo) this.x++;
  }
  moveLeft() {
    if (this.x <= 0) return;

    let letGo = true;

    for (let i = 0; i < this.space.length; i++) {
      for (let j = 0; j < this.space[i].length; j++) {
        // if this square is not filled then move to the next square
        if (!this.space[i][j]) continue;

        // square under this
        const x = this.x + j;
        const y = this.y + i;

        if (space[y][x - 1]) {
          letGo = false;
          break;
        }
      }
    }
    if (letGo) this.x--;
  }
}

class Tblock extends Shape {
  constructor() {
    super();
    this.space = [
      [0, 1, 0],
      [1, 1, 1],
    ];
    this.showBlockAtCenter();
    this.randomlyRotate(3);
  }
}

class SquareBlock extends Shape {
  constructor() {
    super();
    this.space = [
      [1, 1],
      [1, 1],
    ];
    this.showBlockAtCenter();
    // you don't need to randomly rotate this
  }
}
class Lblock extends Shape {
  constructor() {
    super();
    this.space = [
      [1, 0],
      [1, 0],
      [1, 1],
    ];
    this.showBlockAtCenter();
    this.randomlyRotate(3);
  }
}
class Jblock extends Shape {
  constructor() {
    super();
    this.space = [
      [0, 1],
      [0, 1],
      [1, 1],
    ];
    this.showBlockAtCenter();
    this.randomlyRotate(3);
  }
}

class Sblock extends Shape {
  constructor() {
    super();
    this.space = [
      [0, 1, 1],
      [1, 1, 0],
    ];
    this.showBlockAtCenter();
    this.randomlyRotate(1);
  }
}

class Zblock extends Shape {
  constructor() {
    super();
    this.space = [
      [1, 1, 0],
      [0, 1, 1],
    ];
    this.showBlockAtCenter();
    this.randomlyRotate(1);
  }
}

class Iblock extends Shape {
  constructor() {
    super();
    this.space = [[1], [1], [1], [1]];
    this.showBlockAtCenter();
    this.randomlyRotate(1);
  }
}
