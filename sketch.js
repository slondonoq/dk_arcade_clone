const BASE_MAP_DIMENSIONS = {
  height: 256,
  width: 224
}
const BASE_SPRITE_WIDTH = 16 
const BASE_STARTING_HEIGHT = 16
const BASE_STEP_DISTANCE = 1
const BASE_SCORE_POSITION = {x: 88, y: 8}
const BASE_LIVES_POSITION = {x: 8, y: 24}
const SCALE_FACTOR = parseInt((window.innerHeight-20)/BASE_MAP_DIMENSIONS.height)
// const SCALE_FACTOR = 1

const MAP_DIMENSIONS = {
  height: BASE_MAP_DIMENSIONS.height * SCALE_FACTOR,
  width: BASE_MAP_DIMENSIONS.width * SCALE_FACTOR
}

const PLAYER_INITIAL_POSITION = {
  x: parseInt(BASE_SPRITE_WIDTH*SCALE_FACTOR/2),
  y: MAP_DIMENSIONS.height-(BASE_STARTING_HEIGHT*SCALE_FACTOR)
}
console.log(SCALE_FACTOR)

let score = 0
let lives = 6

function preload() {
  numbers_white = []
  numbers_blue = []
  numbers_cyan = []

  for (let i=0; i<10; i++) {
    numbers_white.push(loadImage(`./assets/misc/number_white_${i}.png`))
    numbers_blue.push(loadImage(`./assets/misc/number_blue_${i}.png`))
    numbers_cyan.push(loadImage(`./assets/misc/number_cyan_${i}.png`))
  }

  animation_walk = loadAnimation(
    './assets/animations/player_walk_1.png',
    './assets/animations/player_walk_2.png',
    './assets/animations/player_walk_3.png'
  )
  // imgWalk = loadImage("data/walking1.png");
  icon_life = loadImage('./assets/misc/icon_life.png')
  map = loadImage('./assets/maps/map_25m.png')
}

function setup() {
  createCanvas(MAP_DIMENSIONS.width, MAP_DIMENSIONS.height)

  player = createSprite(PLAYER_INITIAL_POSITION.x, PLAYER_INITIAL_POSITION.y)
  player.scale = SCALE_FACTOR
  player.debug = false
  player.addAnimation('walker', animation_walk)
  player.animation.stop()
  // player.addImage(imgWalk)
  player.mirrorX(-1)
  console.log(player)
}

function draw() {

  if(keyIsDown(LEFT_ARROW)) {
    player.position.x -= player.position.x > PLAYER_INITIAL_POSITION.x
      ? BASE_STEP_DISTANCE*SCALE_FACTOR
      : 0
    player.animation.play()
  }
  else if(keyIsDown(RIGHT_ARROW)) {
    player.position.x += player.position.x < MAP_DIMENSIONS.width-PLAYER_INITIAL_POSITION.x
      ? BASE_STEP_DISTANCE*SCALE_FACTOR
      : 0
    player.animation.play()
  }
  else if (keyCode === UP_ARROW) {
    score++
  }
  else {
    player.animation.stop()
    player.animation.rewind()
  }
  background(map)
  drawSprites()
  drawScore()
  drawLives()
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.mirrorX(1)
  }
  else if (keyCode === RIGHT_ARROW) {
    player.mirrorX(-1)
  }
  else if (keyCode === DOWN_ARROW) {
    lives--
  }
  
}

function drawScore() {
  const scoreDigits = getDigitsArray(score, 6)
  push()
  for (let i = 0; i<6; i++) {
    image(
      numbers_white[scoreDigits[i]],
      BASE_SCORE_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
      BASE_SCORE_POSITION.y*SCALE_FACTOR,
      8*SCALE_FACTOR,
      8*SCALE_FACTOR
    )
  }
  pop()
}

function drawLives() {
  push()
  for (let i = 0; i<6; i++) {
    if (lives > i) {
      image(
        lives > i ? icon_life : black_square,
        BASE_LIVES_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
        BASE_LIVES_POSITION.y*SCALE_FACTOR,
        8*SCALE_FACTOR,
        8*SCALE_FACTOR
      )
    }
    else {
      fill(0)
      rect(
        BASE_LIVES_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
        BASE_LIVES_POSITION.y*SCALE_FACTOR,
        8*SCALE_FACTOR,
        8*SCALE_FACTOR
      )
    }
  }
  pop()
}

function getDigitsArray(number, arrayLength=0) {
  const result = Array.from(number.toString(), (digit => parseInt(digit)))
  
  //fill missing places to the left with zeroes
  if (arrayLength-result.length>0) {
    return Array(arrayLength-result.length).fill(0).concat(result)
  }

  return result
}