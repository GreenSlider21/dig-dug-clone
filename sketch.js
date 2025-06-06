// DIG DUG Clone
// Liam Prange
// April - Ongoing
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// constants
const EMPTY = 0;
const DIGABLE = 1;
const CELL_SIZE = 20;
const ROWS = 32;
const COLS = 28;
const WALKDELAY = 200;
const DIGDELAY = 350;
const MUSICDELAY = 181000;
const PUMPDELAY = 2000;

// varriables
let grid;
let layout;
let layoutClone;
let level = 0;
let prevoiusLevel = 0;
let walkTime = 0;
let digTime = 0;
let hurtTime = 0;
let playerHit = false;
let gameState = "play";
let musicState = "play";
let soundState = "done";
let music;
let musicTime = 0;
let gameEnd;
let win;
let die;
let pop;
let pump;
let pumpTime = 0;
let pumping;
let score = 0;
let highScore = 0;
let scoreLives = 1000;
let kills = 0;

// classes
// the player character class
class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.colour = "blue";
    this.speed = 1;
    this.pumpColour = "purple";
    this.attcking = false;
    this.facingDirection = "right";
    this.lives = 3;
    this.hurtDelay = 200;
    this.attackDelay = 200;
    this.attackTime = 0;
  }
  
  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  heal() {
    if (score >= scoreLives) {
      scoreLives += 1000;
      this.lives++;
    }
  }

  hurt() {
    if (playerHit === true) {
      if (millis() - hurtTime > this.hurtDelay) {
        hurtTime = millis();
        soundState = "die";
        this.lives -= 1;
        this.x = 12;
        this.y = 16;
        let enemiesClone = structuredClone(theEnemies);
        theEnemies.length = 0;
        for (let i = 0; i < enemiesClone.length; i++) {
          spawnEnemy(xSpawns[i], ySpawns[i]);
        }
        playerHit = false;
      }
    }
  }

  gameOver() {
    if (this.lives > 0) {
      gameState = "play";
    }
    else {
      gameState = "game over";
      musicState = "game over";
    }
  }
  
  move() {
    // console.log(this.x, this.y, this.facingDirection, this.attcking);
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
      if (grid[nextY][nextX] === DIGABLE || grid[nextY+1][nextX] === DIGABLE 
        || grid[nextY][nextX+1] === DIGABLE || grid[nextY+1][nextX+1] === DIGABLE) {
        // slower digging delay
        if (millis() - digTime > DIGDELAY - level * 10) {
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
      else if (grid[nextY][nextX] === EMPTY && grid[nextY+1][nextX] === EMPTY 
        && grid[nextY][nextX+1] === EMPTY && grid[nextY+1][nextX+1] === EMPTY) {
        // faster tunnel delay
        if (millis() - walkTime > WALKDELAY - level * 10) {
          walkTime = millis();
          this.x = nextX;
          this.y = nextY;
        }
      }
    }
  }
  
  attck() {
    if (millis() - this.attackTime > this.attackDelay) {
      this.attackTime = millis();
      if (keyIsDown(32) === true) {
        this.attcking = true;
        soundState = "pump";
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
}

// the enemy characters class
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.end = {playerX: this.x, playerY: this.y};
    this.colour = "orange";
    this.speed = 1;
    this.delay = 410 - level*10;
    this.enemyTime = 0;
    this.ghost;
    this.ghosting;
    this.playerDirection = "right";
    this.health = 3;
    this.hit = false;
    this.hurtDelay = 200;
    this.hurtTime = 0;
    this.healDelay = 400;
    this.healTime = 0;
    this.attack = true;
  }

  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  life() {
    if (this.health <= 0) {
      kills++;
      deadEnemies.splice(theEnemies.indexOf(this), 0, 0);
      theEnemies.splice(theEnemies.indexOf(this), 1);
      soundState = "pop";
      score += floor(random(100));
      if (score > highScore) {
        highScore = score;
        storeItem("highPoint", highScore);
      }
    }
  }

  attacking() {
    if (this.health < 3) {
      this.attack = false;
    }
    else {
      this.attack = true;
    }
  }

  hitDetection() {
    // Always update end with the current player position
    this.end.playerX = taizo.x;
    this.end.playerY = taizo.y;
    // console.log(this.health);

    // covers all the posibilities in minimal lines to see if the enemy touched the player
    if ((this.x === this.end.playerX && this.y === this.end.playerY ||
        this.x === this.end.playerX + 1 && this.y === this.end.playerY || 
        this.x === this.end.playerX + 1 && this.y === this.end.playerY + 1 ||
        this.x === this.end.playerX && this.y === this.end.playerY + 1 ||
    
        this.x + 1 === this.end.playerX && this.y === this.end.playerY ||
        this.x + 1 === this.end.playerX && this.y === this.end.playerY + 1 ||
    
        this.x === this.end.playerX && this.y + 1 === this.end.playerY ||
        this.x === this.end.playerX + 1 && this.y + 1 === this.end.playerY ||
    
        this.x + 1 === this.end.playerX && this.y + 1 === this.end.playerY) && this.attack === true) {
      // console.log("GUH!");
      playerHit = true;
    }

    // taking the player direction of attack
    if (keyIsDown(87)) {
      this.playerDirection = "up";
    }
    else if (keyIsDown(83)) {
      this.playerDirection = "down";
    }
    else if (keyIsDown(65)) {
      this.playerDirection = "left";
    }
    else if (keyIsDown(68)) {
      this.playerDirection = "right";
    }

    // detecing if the enemy is hit by the player attack
    if (millis() - this.hurtTime > this.hurtDelay) {
      this.hurtTime = millis();
      if (keyIsDown(32) === true) {
        if (this.playerDirection === "up" &&
          ((this.x === this.end.playerX || this.x + 1 === this.end.playerX) && 
          (this.y + 1 === this.end.playerY - 1 || this.y + 1 === this.end.playerY - 2 || this.y + 1 === this.end.playerY - 3))) {
          // console.log("Hit Up");
          this.health --;
          this.hit = true;
        }
        else if (this.playerDirection === "down" &&
          ((this.x === this.end.playerX || this.x + 1 === this.end.playerX) && 
          (this.y === this.end.playerY + 2 || this.y === this.end.playerY + 3 || this.y === this.end.playerY + 4))) {
          // console.log("Hit Down");
          this.health --;
          this.hit = true;   
        }
        else if (this.playerDirection === "left" &&
          ((this.y === this.end.playerY + 1 || this.y + 1 === this.end.playerY + 1) && 
          (this.x + 1 === this.end.playerX - 1 || this.x + 1 === this.end.playerX - 2 || this.x + 1 === this.end.playerX - 3))){
          // console.log("Hit Left");
          this.health --;
          this.hit = true;    
        }
        else if (this.playerDirection === "right" &&
          ((this.y === this.end.playerY + 1 || this.y + 1 === this.end.playerY + 1) && 
          (this.x === this.end.playerX + 2 || this.x === this.end.playerX + 3 || this.x === this.end.playerX + 4))){
          // console.log("Hit Right");
          this.health --;
          this.hit = true;  
        }
      }
      if (this.hit === true) {
        soundState = "pumping";
      }
      else {
        this.hit = false;
        if (this.health < 3 && millis() - this.healTime > this.healDelay) {
          this.healTime = millis();
          this.health ++;
        }
      }
    }
  }

  move() {
    if (this.hit === false && this.health === 3){
      if (millis() - this.enemyTime > this.delay) {
        this.enemyTime = millis();
  
        if (grid[this.y][this.x] !== EMPTY || grid[this.y + 1][this.x] !== EMPTY 
            || grid[this.y][this.x + 1] !== EMPTY || grid[this.y + 1][this.x + 1] !== EMPTY) {
          this.ghosting = true;
        }
  
        else {
          this.ghosting = false;
        }
  
        let gamble;
        
        if (this.ghosting === false){
          gamble = Math.floor(random(100));
        }
        
        if (gamble <= 10 || this.ghosting === true) {
          this.ghost = true;
        } 
        else {
          this.ghost = false;
        }
  
        //L* pathfinding 
        let directions = [];
        
        if (this.end.playerY < this.y) {
          // up
          directions.push({x: 0, y: -1});
        }
        if (this.end.playerY > this.y) {
          // down
          directions.push({x: 0, y: 1});
        }
        if (this.end.playerX < this.x) {
          // left
          directions.push({x: -1, y: 0});
        } 
        if (this.end.playerX > this.x) {
          // right
          directions.push({x: 1, y: 0});
        }
  
        for (let dir of directions) {
          let nextX = this.x + dir.x;
          let nextY = this.y + dir.y;
      
          // Keeps the enemies within bounds
          if (nextX < 0 || nextY < 0 || nextX + 1 >= COLS || nextY + 1 >= ROWS) {
            // do nothing if movement would go out of bounds
            return;
          }
      
          // Only move if all four grid spaces are empty
          if (this.ghost === false) {
            if (grid[nextY][nextX] === EMPTY && grid[nextY + 1][nextX] === EMPTY 
              && grid[nextY][nextX + 1] === EMPTY && grid[nextY + 1][nextX + 1] === EMPTY) {
              this.x = nextX;
              this.y = nextY;
            }
          }
          else {
            this.x = nextX;
            this.y = nextY;
          }
        }
      }
    }
  }
}

function preload() {
  // grid level layout
  layout = loadJSON("level.json");

  // music
  music = loadSound("play.m4a");
  gameEnd = loadSound("game over.mp3");
  win = loadSound("win.mp3");

  // sound effects
  die = loadSound("die.mp3");
  pop = loadSound("pop.mp3");
  pump = loadSound("pump.mp3");
  pumping = loadSound("pumping.mp3");
}

let taizo;
let theEnemies = [];
let deadEnemies = [1, 2, 3, 4];
let xSpawns = [2, 21, 7, 18];
let ySpawns = [9, 6, 22, 24];

function setup() {
  createCanvas(COLS * CELL_SIZE + 100, ROWS * CELL_SIZE + 50);

  if (getItem("highPoint")) {
    highScore = getItem("highPoint");
  }

  grid = layout;
  taizo = new Character(12, 16);
}

function draw() {
  // console.log(theEnemies);
  background(20);
  resetLevel();
  displayGrid();
  noStroke();
  needMoreEnemies();
  jukebox();
  displayScore();
  displayLives();
  displayKills();
  
  if (gameState === "play") {
    // player
    taizo.gameOver();
    taizo.attck();
    taizo.move();
    taizo.display();
    taizo.hurt();
    taizo.heal();

    // enemy
    for (let myEnemy of theEnemies) {
      myEnemy.hitDetection();
      // myEnemy.move();
      myEnemy.display();
      myEnemy.life();
      myEnemy.attacking();
    }
  }

  else {
    textSize(100);
    textAlign(CENTER);
    textFont("Impact");
    fill("white");
    text("Game Over", width/2 - 50, height/2);
  }
}

function jukebox() {
  // music
  if (musicState === "play") {
    music.setVolume(0.5);
    music.play();
    musicState = "done";
  }
  if (musicState === "game over") {
    music.stop();
    gameEnd.setVolume(0.5);
    gameEnd.play();
    musicState = "done";
  }
  if (musicState === "win") {
    win.setVolume(0.5);
    win.play();
    musicState = "done";
  }
  // reset main music
  if (millis() - musicTime > MUSICDELAY && gameState !== "game over") {
    musicTime = millis();
    musicState = "play";
  }

  // sound effects
  if (soundState === "die" && taizo.lives > 0) {
    die.setVolume(0.5);
    die.play();
    soundState = "done";
  }
  if (soundState === "pop") {
    pop.setVolume(0.5);
    pop.play();
    soundState = "done";
  }
  else if (soundState === "pumping") {
    if (millis() - pumpTime > PUMPDELAY) {
      pumpTime = millis();
      pumping.setVolume(0.5);
      pumping.play();
      soundState = "done";
    }
  }
  else if (soundState === "pump") {
    if (millis() - pumpTime > PUMPDELAY) {
      pumpTime = millis();
      pump.setVolume(0.5);
      pump.play();
      soundState = "done";
    }
  }
}

function enemySpawner() {
  for (let i = 0; i < 4; i++) {
    spawnEnemy(xSpawns[i], ySpawns[i]);
  }
}

function spawnEnemy(x, y) {
  let someEnemy = new Enemy(x, y, taizo.x, taizo.y);
  theEnemies.push(someEnemy);
}

function needMoreEnemies () {
  if (theEnemies.length < 4 && deadEnemies.length % 4 === 0) {
    enemySpawner();
    level ++;
    if (deadEnemies.length > 4){
      musicState = "win";
    }
  }
}

function resetLevel() {
  if (level > prevoiusLevel) {
    // grid = layoutClone;
    prevoiusLevel++;
    taizo.x = 12;
    taizo.y = 16;
  }
}

function displayGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === EMPTY) {
        fill("sienna");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === DIGABLE) {
        fill("black");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function displayScore() {
  textSize(30);
  textAlign(CENTER);
  textFont("Impact");
  fill("dodgerblue");
  text("SCORE", width-50, 30);
  text(score, width-50, 60);
  text("HIGH", width-50, 130);
  text("SCORE", width-50, 160); 
  text(highScore, width-50, 190);
}

function displayLives() {
  textSize(30);
  textAlign(CENTER);
  textFont("Impact");
  fill("dodgerblue");
  text("LIVES", 50, height-10);
  text(taizo.lives, 110, height-10);

  text("1UP IN", 230, height-10);
  text(scoreLives - score, 305, height-10);
  text("POINTS", 390, height-10);

  textSize(50);
  text(":", 90, height-9);
}

function displayKills() {
  textSize(30);
  textAlign(CENTER);
  textFont("Impact");
  fill("dodgerblue");
  text("KILLS", 500, height-10);
  text(kills, 560, height-10);

  textSize(50);
  text(":", 540, height-9);

  for (let i = 0; i < kills; i++) {
    fill("orange");
    square(width - CELL_SIZE, height - CELL_SIZE - i * CELL_SIZE, CELL_SIZE);
  }
}