// DIG DUG Clone
// Liam Prange
// April - Ongoing
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// constants
const EMPTY = 0;
const DIGABLE = 1;
const PLAYER = 9;
const POOKA = 8;
const FYGAR = 7;
const ROCK = 2;
const CELL_SIZE = 20;
const ROWS = 32;
const COLS = 28;

// varriables
let grid;
let level;

// classes
class Character {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.colour = "blue";
    this.speed = 1;
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1, CELL_SIZE);
    square(this.x * CELL_SIZE + 1, this.y * CELL_SIZE + 1, CELL_SIZE);
  }

  move() {
    if (keyIsDown(87) === true) {
      // move up
      this.y -= this.speed;
    }
    if (keyIsDown(83) === true) {
      // move down
      this.y += this.speed;
    }
    if (keyIsDown(65) === true) {
      // move left
      this.x -= this.speed;
    }
    if (keyIsDown(68) === true) {
      // move right
      this.x += this.speed;
    }
  }
}

function preload() {
  level = loadJSON("level.json");
}

let taizo;

function setup() {
  createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
  taizo = new Character(1, 1);
  grid = level;
}

function draw() {
  background(220);
  displayGrid();

  taizo.move();

  taizo.display();
}

function displayGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === EMPTY) {
        fill("white");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === DIGABLE) {
        fill("black");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === PLAYER) {
        fill("blue");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE, y * CELL_SIZE + 1, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE);
      }
      else if (grid[y][x] === POOKA) {
        fill("orange");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE, y * CELL_SIZE + 1, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE);
      }
      else if (grid[y][x] === FYGAR) {
        fill("green");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE, y * CELL_SIZE + 1, CELL_SIZE);
        square(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE);
      }
    }
  }
}
