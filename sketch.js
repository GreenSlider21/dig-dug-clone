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
const CELL_SIZE = 10;
const ROWS = 64/2;
const COLS = 56/2;

// varriables
let grid;
let level;

// classes
class Player {
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}

function preload() {
  level = loadJSON("level.json");
}

function setup() {
  createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
  // grid = level;
  grid = generateRandomGrid(ROWS, COLS);
}

function draw() {
  background(220);
  displayGrid();
  // generateRandomGrid();
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

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);

  toggleCell(x,y);
  toggleCell(x+1,y);
  toggleCell(x,y+1);
  toggleCell(x+1,y+1);
}

function toggleCell(x, y) {
  // make sure cell your toggling is actually in the grid
  if (x >= 0 && x < COLS && y >= 0 && y < ROWS){
    if (grid[y][x] === EMPTY) {
      grid[y][x] = DIGABLE;
    }
    else if (grid[y][x] === DIGABLE) {
      grid[y][x] = EMPTY;
    }
  }
}

function generateRandomGrid(COLS, ROWS) {
  let newGrid = [];
  for (let y = 0; y < ROWS; y++) {
    newGrid.push([]);
    for (let x = 0; x < COLS; x++) {
      //toss a 0 or 1 in randomly
      if (random(100) < 50) {
        newGrid[y].push(EMPTY);
      }
      else {
        newGrid[y].push(DIGABLE);
      }
    }
  }
  return newGrid;
}