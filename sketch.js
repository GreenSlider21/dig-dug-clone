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
    if (this.x >= 0 && this.x < COLS - 1 && this.y >= 0 && this.y < ROWS - 1 && 
    (grid[this.y][this.x] === DIGABLE || grid[this.y+1][this.x] === DIGABLE || grid[this.y][this.x+1] === DIGABLE || grid[this.y+1][this.x+1] === DIGABLE)) {
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
    else if (this.x >= 0 && this.x < COLS - 1 && this.y >= 0 && this.y < ROWS - 1 && 
      grid[this.y][this.x] === EMPTY || grid[this.y+1][this.x] === EMPTY || grid[this.y][this.x+1] === EMPTY || grid[this.y+1][this.x+1] === EMPTY) {
      // faster tunnel delay
      if (millis() - walkTime > WALKDELAY) {
        walkTime = millis();
        this.move();
      }
    }
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = "orange";
    this.speed = 1;
    this.delay = 250;
    this.enemyTime = 0;
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  move() {
    if (millis() - this.enemyTime > this.delay) {
      this.enemyTime = millis();
      let choice = random(100);
      if (choice < 25) {
        // up
        if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === EMPTY || grid[this.y+1][this.x] === EMPTY || grid[this.y][this.x+1] === EMPTY || grid[this.y+1][this.x+1] === EMPTY) {
          this.y -= this.speed;
        }
      }
      else if (choice < 50) {
        // down
        if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === EMPTY || grid[this.y+1][this.x] === EMPTY || grid[this.y][this.x+1] === EMPTY || grid[this.y+1][this.x+1] === EMPTY) {
          this.y += this.speed;
        }
      }
      else if (choice < 75) {
        // left
        if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === EMPTY || grid[this.y+1][this.x] === EMPTY || grid[this.y][this.x+1] === EMPTY || grid[this.y+1][this.x+1] === EMPTY) {
          this.x -= this.speed;
        }
      }
      else {
        // right
        if (this.x >= 1 && this.x < COLS - 2 && this.y >= 1 && this.y < ROWS - 2 && grid[this.y][this.x] === EMPTY || grid[this.y+1][this.x] === EMPTY || grid[this.y][this.x+1] === EMPTY || grid[this.y+1][this.x+1] === EMPTY) {
          this.x += this.speed;
        }
      }
    }
  }
}

function preload() {
  level = loadJSON("level.json");
}

let taizo;
let theEnemies = [];
let xSpawns = [2, 21];
let ySpawns = [9, 6];

function setup() {
  createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
  taizo = new Character(12, 16);
  grid = level;
}

function draw() {
  background(220);
  displayGrid();

  // player
  taizo.attck();
  taizo.playerMove();
  taizo.display();

  // enemy
  for (let myEnemy of theEnemies) {
    myEnemy.move();
    myEnemy.display();
  }
}

function mousePressed() {
  spawnEnemy(xSpawns[1], ySpawns[1]);
}

function spawnEnemy(x, y) {
  let someEnemy = new Enemy(x, y);
  theEnemies.push(someEnemy);
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
    }
  }
}
