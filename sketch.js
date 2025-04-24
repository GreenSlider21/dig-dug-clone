// DIG DUG Clone
// Liam Prange
// April - Ongoing
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// constants
const EMPTY = 0;
const DIGABLE = 1;
const ROCK = 2;
const PUMP = 3;
const FYGAR = 7;
const POOKA = 8;
const PLAYER = 9;
const CELL_SIZE = 20;
const ROWS = 32;
const COLS = 28;
const WALKDELAY = 200;
const DIGDELAY = 400;

// varriables
let grid;
let level;
let walkTime = 0;
let digTime = 0;

// classes
class Character {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.colour = "blue";
    this.speed = 1;
    this.pumpColour = "purple";
    this.attcking = false;
    this.facingDirection = "right";
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }
  
  move() {
    console.log(this.x, this.y, this.facingDirection);
    // alows the player to move the four cardinal directions, but disallows diagnal movment
    if (this.attcking === false){
      if (keyIsDown(87) === true) {
        // move up
        this.facingDirection = "up";
        this.y -= this.speed;
      }
      else if (keyIsDown(83) === true) {
        // move down
        this.facingDirection = "down";
        this.y += this.speed;
      }
      else if (keyIsDown(65) === true) {
        // move left
        this.facingDirection = "left";
        this.x -= this.speed;
      }
      else if (keyIsDown(68) === true) {
        // move right
        this.facingDirection = "right";
        this.x += this.speed;
      }
    }
  }

  attck() {
    if (keyIsDown(32) === true) {
      this.attcking = true;
      fill(this.pumpColour);
      if (this.facingDirection === "up"){
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 2 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 3 * CELL_SIZE, CELL_SIZE);
      }
      else if (this.facingDirection === "down"){
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 2 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 3 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 4 * CELL_SIZE, CELL_SIZE);
      }
      else if (this.facingDirection === "left"){
        square(this.x * CELL_SIZE - 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE - 2 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE - 3 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
      }
      else if (this.facingDirection === "right"){
        square(this.x * CELL_SIZE + 2 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE + 3 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE + 4 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
      }
    }
    else {
      this.attcking = false;
    }
  }

  playerMove() {
   // movement that is specifically triggered and slower by digging new tunnels
   if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && 
    (grid[this.y][this.x] === DIGABLE || grid[this.y+1][this.x] === DIGABLE ||grid[this.y][this.x+1] === DIGABLE ||grid[this.y+1][this.x+1] === DIGABLE)) {
      // slower digging delay
      if (millis() - digTime > DIGDELAY) {
        digTime = millis();
        // deletes old tiles to make tunnels
        grid[this.y][this.x] = EMPTY;
        grid[this.y+1][this.x] = EMPTY;
        grid[this.y][this.x+1] = EMPTY;
        grid[this.y+1][this.x+1] = EMPTY;
        
        this.move();
      }
    }
    
    // movement that is specifically triggered by walking in tunnels
    else if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === EMPTY || 
      this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === PLAYER) {
        // faster tunnel delay
        if (millis() - walkTime > WALKDELAY) {
          walkTime = millis();
          this.move();
        }
      }
  }
}

class Enemy {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.speed = 1;
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      // up
      this.y -= this.speed;
    }
    else if (choice < 50) {
      // down
      this.y += this.speed;
    }
    else if (choice < 75) {
      // left
      this.x -= this.speed;
    }
    else {
      // right
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
  taizo = new Character(12, 16);
  grid = level;
}

function draw() {
  background(220);
  displayGrid();

  taizo.attck();
  taizo.playerMove();
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
      else if (grid[y][x] === PUMP) {
        fill("purple");
        square(x * CELL_SIZE + 2, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE + 3, y * CELL_SIZE, CELL_SIZE);
        square(x * CELL_SIZE + 4, y * CELL_SIZE, CELL_SIZE);
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
