// DIG DUG Clone
// Liam Prange
// April - June
//
// Extra for Experts:
// Got an actually working sound system that detect a multitude of diffent sounds and what to play when

// constants
const EMPTY = 0;
const DIGABLE = 1;
const CELL_SIZE = 20;
const ROWS = 32;
const COLS = 28;
const WALKDELAY = 150;
const DIGDELAY = 300;
const MUSICDELAY = 181000;
const PUMPDELAY = 2000;

// varriables
let grid;
let layout;
let level = 0;
let prevoiusLevel = 0;
let walkTime = 0;
let digTime = 0;
let hurtTime = 0;
let playerHit = false;
let gameState = "pause";
let musicState = "play";
let soundState = "done";
let music;
let musicTime = 0;
let gameEnd;
let win;
let die;
let pop;
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
  }
  
  // shows the player
  display() {
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  // ads an extra life if the player reaches 1000, 2000, 3000, ect. points
  heal() {
    if (score >= scoreLives) {
      scoreLives += 1000;
      this.lives++;
    }
  }

  // removes a life if the player is hit and resets their position and the enemies positions
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

  // triggers the game over state when the player has lost all their lives
  gameOver() {
    if (this.lives > 0) {
      gameState = "play";
    }
    else {
      gameState = "game over";
      musicState = "game over";
    }
  }
  
  // controls the players movement
  move() {
    let nextX = this.x;
    let nextY = this.y;
  
    if (this.attcking === false){
      // move up with w or up arrow
      if (keyIsDown(87) || keyIsDown(38)) {
        nextY -= this.speed;
        this.facingDirection = "up";
      }
      // move down with s or down arrow
      else if (keyIsDown(83) || keyIsDown(40)) {
        nextY += this.speed;
        this.facingDirection = "down";
      }
      // move left with a or left arrow
      else if (keyIsDown(65) || keyIsDown(37)) {
        nextX -= this.speed;
        this.facingDirection = "left";
      }
      // move right with d or right arrow
      else if (keyIsDown(68) || keyIsDown(39)) {
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
  
  // checks the direction the player last moved in and attacks in that direction
  attck() {
    if (keyIsDown(32) === true) {
      this.attcking = true;
      fill(this.pumpColour);
      // attack up
      if (this.facingDirection === "up"){
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 2 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE - 3 * CELL_SIZE, CELL_SIZE);
      }
      // attack down
      else if (this.facingDirection === "down"){
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 2 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 3 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE, this.y * CELL_SIZE + 4 * CELL_SIZE, CELL_SIZE);
      }
      // attack left
      else if (this.facingDirection === "left"){
        square(this.x * CELL_SIZE - 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE - 2 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
        square(this.x * CELL_SIZE - 3 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
      }
      // attack right
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
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.end = {playerX: this.x, playerY: this.y};
    this.colour = "orange";
    this.delay = 490 - level*70;
    this.enemyTime = 0;
    this.ghost;
    this.ghosting;
    this.health = 3;
    this.hit = false;
    this.hurtDelay = 600;
    this.hurtTime = 0;
    this.healDelay = 900;
    this.healTime = 0;
    this.attack = true;
  }

  // shows the enemies 
  display() {
    // change to green if not at full health otherwise stays orange
    if (this.health < 3) {
      this.colour = "green";
    }
    else {
      this.colour = "orange";
    }
    fill(this.colour);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
    square(this.x * CELL_SIZE + 1 * CELL_SIZE, this.y * CELL_SIZE + 1 * CELL_SIZE, CELL_SIZE);
  }

  // if they lose all their health splice them out of theEnemies array and add them to the deadEnemies array
  life() {
    if (this.health <= 0) {
      kills++;
      deadEnemies.splice(theEnemies.indexOf(this), 0, 0);
      theEnemies.splice(theEnemies.indexOf(this), 1);
      soundState = "pop";
      score += floor(random(50, 100));
      if (score > highScore) {
        highScore = score;
        storeItem("highPoint", highScore);
      }
    }
  }

  // stop them from damaging the player if they arn't at full health
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
      playerHit = true;
    }

    // detecing if the enemy is hit by the player attack
    if (millis() - this.hurtTime > this.hurtDelay) {
      this.hurtTime = millis();
      // detects if the enemy needs takes damage only if the players attack is touching the enemy
      if (keyIsDown(32) === true) {
        if (taizo.facingDirection === "up" &&
          ((this.x === this.end.playerX || this.x + 1 === this.end.playerX) && 
          (this.y + 1 === this.end.playerY - 1 || this.y + 1 === this.end.playerY - 2 || this.y + 1 === this.end.playerY - 3))) {
          this.health --;
          this.hit = true;
          soundState = "pumping";
          this.hit = false;
        }
        else if (taizo.facingDirection === "down" &&
          ((this.x === this.end.playerX || this.x + 1 === this.end.playerX) && 
          (this.y === this.end.playerY + 2 || this.y === this.end.playerY + 3 || this.y === this.end.playerY + 4))) {
          this.health --;
          this.hit = true;
          soundState = "pumping";
          this.hit = false;
        }
        else if (taizo.facingDirection === "left" &&
          ((this.y === this.end.playerY + 1 || this.y + 1 === this.end.playerY + 1) && 
          (this.x + 1 === this.end.playerX - 1 || this.x + 1 === this.end.playerX - 2 || this.x + 1 === this.end.playerX - 3))){
          this.health --;
          this.hit = true;
          soundState = "pumping";
          this.hit = false;
        }
        else if (taizo.facingDirection === "right" &&
          ((this.y === this.end.playerY + 1 || this.y + 1 === this.end.playerY + 1) && 
          (this.x === this.end.playerX + 2 || this.x === this.end.playerX + 3 || this.x === this.end.playerX + 4))){
          this.health --;
          this.hit = true;
          soundState = "pumping";
          this.hit = false;
        }
      }
      else {
        // heals the enemy health after a delay
        if (this.health < 3 && millis() - this.healTime > this.healDelay) {
          this.healTime = millis();
          this.health ++;
        }
      }
    }
  }

  // controls the enemy movement
  move() {
    // only move while at full health
    if (this.hit === false && this.health === 3){
      if (millis() - this.enemyTime > this.delay) {
        this.enemyTime = millis();
  
        // if still in a wall keep ghosting
        if (grid[this.y][this.x] !== EMPTY || grid[this.y + 1][this.x] !== EMPTY 
            || grid[this.y][this.x + 1] !== EMPTY || grid[this.y + 1][this.x + 1] !== EMPTY) {
          this.ghosting = true;
        }
  
        else {
          this.ghosting = false;
        }
        
        // on a five percent chance allow moving through walls
        let gamble;
        
        if (this.ghosting === false){
          gamble = Math.floor(random(100));
        }
        
        if (gamble <= 5 || this.ghosting === true) {
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
  background(20);
  resetLevel();
  displayGrid();
  noStroke();
  needMoreEnemies();
  jukebox();
  displayScore();
  displayLives();
  displayKills();
  displayControls();
  gameStateCheck();
}

// pressing p puases and resumes the game
function keyTyped() {
  if (gameState === "pause" && key === "p") {
    gameState = "play";
  }
  else if (gameState === "play" && key === "p") {
    gameState = "pause";
  }
}

// check if the game is paused, playing, or finished to allow or dissallow movement and trigger sounds and text
function gameStateCheck() {
  if (gameState === "pause") {
    textSize(50);
    textAlign(CENTER);
    textFont("Impact");
    fill("white");
    text("PRESS P TO START & PAUSE", width/2 - 50, height/2);
  }
  
  else if (gameState === "play") {
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
      myEnemy.move();
      myEnemy.display();
      myEnemy.life();
      myEnemy.attacking();
    }
  }

  else if (gameState === "game over") {
    textSize(100);
    textAlign(CENTER);
    textFont("Impact");
    fill("white");
    text("Game Over", width/2 - 50, height/2);
  }
}

// plays a song or sound if the condition is met
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
}

// creates four enemies
function enemySpawner() {
  for (let i = 0; i < 4; i++) {
    spawnEnemy(xSpawns[i], ySpawns[i]);
  }
}

// puts the enemies in theEnemies array so that they are in play
function spawnEnemy(x, y) {
  let someEnemy = new Enemy(x, y, taizo.x, taizo.y);
  theEnemies.push(someEnemy);
}

// checks if all the enemies are dead, if so calls new ones into play
function needMoreEnemies () {
  if (theEnemies.length < 4 && deadEnemies.length % 4 === 0) {
    enemySpawner();
    level ++;
    if (deadEnemies.length > 4){
      musicState = "win";
    }
  }
}

// resets player position if it's a new level
function resetLevel() {
  if (level > prevoiusLevel) {
    prevoiusLevel++;
    taizo.x = 12;
    taizo.y = 16;
  }
}

// displays the grid and sets each tile to empty or digable apropriatly based on the grid
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

// displays the player score and highscore with lables
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

// displays the players lives and how many points they need for an extra life
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

// displays how many kills the player has and shows all the dead enemies
function displayKills() {
  textSize(30);
  textAlign(CENTER);
  textFont("Impact");
  fill("dodgerblue");
  text("KILLS", 500, height-10);
  text(kills, 560, height-10);
  text("KILL", width-60, 560);
  text("OR BE", width-60, 590);
  text("KILLED", width-60, 620);

  textSize(50);
  text(":", 540, height-9);

  for (let i = 0; i < kills; i++) {
    fill("orange");
    square(width - CELL_SIZE, height - CELL_SIZE - i * CELL_SIZE, CELL_SIZE);
  }
}

// displays the goal and controls while making them white when pressed
function displayControls() {
  textSize(15);
  textAlign(CENTER);
  textFont("Impact");
  fill("dodgerblue");
  text("MOVEMENT", width-60, 260);
  text("ATTACK", width-60, 350);

  if (keyIsDown(87) || keyIsDown(38)) {
    fill("white");
  }
  else {
    fill("dodgerblue");
  }
  text("W", width-60, 290);

  if (keyIsDown(65) || keyIsDown(37)) {
    fill("white");
  }
  else {
    fill("dodgerblue");
  }
  text("A", width-80, 315);
  
  if (keyIsDown(83) || keyIsDown(40)) {
    fill("white");
  }
  else {
    fill("dodgerblue");
  }
  text("S", width-60, 315);

  if (keyIsDown(68) || keyIsDown(39)) {
    fill("white");
  }
  else {
    fill("dodgerblue");
  }
  text("D", width-40, 315);

  if (keyIsDown(32)) {
    fill("white");
  }
  else {
    fill("dodgerblue");
  }
  text("HOLD SPACE", width-60, 370);

  fill("blue");
  text("YOU", width-80, 450);
  square(width-90, 470, CELL_SIZE);

  fill("orange");
  text("THEM", width-40, 450);
  square(width-50, 470, CELL_SIZE);
}