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
// the player character class
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
    console.log(this.x, this.y, this.facingDirection, this.attcking);
    let nextX = this.x;
    let nextY = this.y;
  
    if (this.attcking === false){
      if (keyIsDown(87)) {
        nextY -= this.speed;
        this.facingDirection = "up";
      }
      else if (keyIsDown(83)) {
        nextY += this.speed;
        this.facingDirection = "down";
      }
      else if (keyIsDown(65)) {
        nextX -= this.speed;
        this.facingDirection = "left";
      }
      else if (keyIsDown(68)) {
        nextX += this.speed;
        this.facingDirection = "right";
      }
  
      // Keeps the player within bounds
      if (nextX < 0 || nextY < 0 || nextX + 1 >= COLS || nextY + 1 >= ROWS) {
        // do nothing if movement would go out of bounds
        return;
      }
    
      // movement that is specifically triggered and slower by digging new tunnels
      if (grid[nextY][nextX] === DIGABLE || grid[nextY+1][nextX] === DIGABLE || grid[nextY][nextX+1] === DIGABLE || grid[nextY+1][nextX+1] === DIGABLE) {
        // slower digging delay
        if (millis() - digTime > DIGDELAY) {
          digTime = millis();
          // deletes old tiles to make tunnels
          grid[nextY][nextX] = EMPTY;
          grid[nextY+1][nextX] = EMPTY;
          grid[nextY][nextX+1] = EMPTY;
          grid[nextY+1][nextX+1] = EMPTY;
          this.x = nextX;
          this.y = nextY;
        }
      }
      // movement that is specifically triggered by walking in tunnels
      else if (grid[nextY][nextX] === EMPTY && grid[nextY+1][nextX] === EMPTY && grid[nextY][nextX+1] === EMPTY && grid[nextY+1][nextX+1] === EMPTY) {
        // faster tunnel delay
        if (millis() - walkTime > WALKDELAY) {
          walkTime = millis();
          this.x = nextX;
          this.y = nextY;
        }
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
}

// the enemy characters class
class Enemy {
  constructor(x, y, playerX, playerY) {
    this.x = x;
    this.y = y;
    this.start = {enemyX: this.x, enemyY: this.y,};
    this.end = {playerX: this.x, playerY: this.y,};
    this.colour = "orange";
    this.speed = 1;
    this.delay = 250;
    this.enemyTime = 0;
    this.openSet = [];
    // openSet starts with beginning node only
    this.openSet.push(this.start);
    this.closedSet = [];
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  heuristic() {
    let d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
    return d;
  }

  removeFromArray() {
    for (let y = grid.length - 1; y >= 0; y--) {
      for (let x = grid.length - 1; x >= 0; x--) {
        if (grid[y][x] === remove) {
          grid.splice(grid[y][x], 1);
        }
      }
    }
  }

  move() {
  // Always update end with the current player position
    this.end.playerX = taizo.x;
    this.end.playerY = taizo.y;

    // console.log(this.openSet, this.end);
    
    if (millis() - this.enemyTime > this.delay) {
      this.enemyTime = millis();
  
      let choice = random(100);
      let nextX = this.x;
      let nextY = this.y;
      
      // temporary random direction picker
      // if (choice < 25) {
      //   // up
      //   nextY -= this.speed;
      // } 
      // else if (choice < 50) {
      //   // down
      //   nextY += this.speed;
      // } 
      // else if (choice < 75) {
      //   // left
      //   nextX -= this.speed;
      // } 
      // else {
      //   // right
      //   nextX += this.speed;
      // }
  
      // Keeps the enemies within bounds
      if (nextX < 0 || nextY < 0 || nextX + 1 >= COLS || nextY + 1 >= ROWS) {
        // do nothing if movement would go out of bounds
        return;
      }
  
      // Only move if all four grid spaces are empty
      if (grid[nextY][nextX] === EMPTY && grid[nextY + 1][nextX] === EMPTY && grid[nextY][nextX + 1] === EMPTY && grid[nextY + 1][nextX + 1] === EMPTY) {
        this.x = nextX;
        this.y = nextY;
        this.start.enemyX = nextX;
        this.start.enemyY = nextY;
      }
    }
  }
}

function preload() {
  level = loadJSON("levelempty.json");
}

let taizo;
let theEnemies = [];
let xSpawns = [2, 21, 7, 18];
let ySpawns = [9, 6, 22, 24];

function setup() {
  createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
  taizo = new Character(12, 16);
  grid = level;
}

function draw() {
  background(220);
  displayGrid();
  // noStroke();

  // player
  taizo.attck();
  taizo.move();
  taizo.display();

  // enemy
  for (let myEnemy of theEnemies) {
    myEnemy.move();
    myEnemy.display();
  }
}

function mousePressed() {
  for (let i = 0; i < 4; i++){
    spawnEnemy(xSpawns[i], ySpawns[i]);
  }
}

function spawnEnemy(x, y) {
  let someEnemy = new Enemy(x, y, taizo.x, taizo.y);
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
