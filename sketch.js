const BASE_SPRITE_WIDTH = 16
const BASE_SPRITE_HEIGHT = 15
const BASE_STARTING_HEIGHT = 16
const BASE_STEP_DISTANCE = 1
let SCALE_FACTOR = 1

let score = 0
let lives = 6

class SpriteObj {
  constructor(width, height) {
    this.width = width
    this.height = height
  }
}

function preload() {
  numbers_white = []
  numbers_blue = []
  numbers_cyan = []

  for (let i=0; i<10; i++) {
    numbers_white.push(loadImage(`./assets/misc/number_white_${i}.png`))
    numbers_blue.push(loadImage(`./assets/misc/number_blue_${i}.png`))
    numbers_cyan.push(loadImage(`./assets/misc/number_cyan_${i}.png`))
  }

  animation_walk = loadAni('./assets/animations/player_walk_1.png', 3)

  icon_life = loadImage('./assets/misc/icon_life.png')
  map = loadImage('./assets/maps/map_25m.png')
  map_data = loadJSON('./assets/maps/map_25m_data.json')
}

function setup() {
  SCALE_FACTOR = parseInt((window.innerHeight-20)/map_data.MAP_DIMENSIONS.height)

  createCanvas(
    map_data.MAP_DIMENSIONS.width*SCALE_FACTOR,
    map_data.MAP_DIMENSIONS.height*SCALE_FACTOR
  )

  //World related
  world.gravity.y = 10;
  noFill()
  border = new Sprite(
    map_data.MAP_DIMENSIONS.width*SCALE_FACTOR/2,
    map_data.MAP_DIMENSIONS.height*SCALE_FACTOR/2,
    map_data.MAP_DIMENSIONS.width*SCALE_FACTOR + 2,
    map_data.MAP_DIMENSIONS.height*SCALE_FACTOR + 2,
    's'
  );
  border.shape = 'chain';

  platforms = new Group()

  map_data.PLATFORMS.forEach(platform => {
    noStroke()
    let newPLatform = new platforms.Sprite(
      platform.x*SCALE_FACTOR,
      platform.y*SCALE_FACTOR,
      platform.width*SCALE_FACTOR,
      platform.height*SCALE_FACTOR,
      'static'
    )
    // newPLatform.visible = false
    newPLatform.debug = true
  })

  noStroke()
  player = createSprite(
    map_data.PLAYER_INITIAL_POSITION.x*SCALE_FACTOR,
    map_data.PLAYER_INITIAL_POSITION.y*SCALE_FACTOR
  )
  player.scale = SCALE_FACTOR
  player.height = BASE_SPRITE_HEIGHT*SCALE_FACTOR
  player.width = BASE_SPRITE_WIDTH*SCALE_FACTOR
  player.debug = true
  player.rotationLock = true
  player.addAni('walker', animation_walk)
  player.mirror.x = true
  console.log(player)
}

function draw() {

  if(keyIsDown(LEFT_ARROW)) {
    player.position.x -= checkOutOfBounds('left')
      ? 0
      : BASE_STEP_DISTANCE*SCALE_FACTOR

    player.ani.play()
  }
  else if(keyIsDown(RIGHT_ARROW)) {
    player.position.x += checkOutOfBounds('right')
      ? 0
      : BASE_STEP_DISTANCE*SCALE_FACTOR
    player.ani.play()
  }
  else if (keyIsDown(UP_ARROW)) {
    score++
  }
  else {
    //play(0) used to rewind animation
    player.ani.play(0)
    player.ani.stop()
  }
  background(map)
  drawScore()
  drawLives()
}

function keyPressed() {
  console.log(player)
  if (keyCode === LEFT_ARROW && !player.ani.playing) {
    player.mirror.x = false
  }
  else if (keyCode === RIGHT_ARROW && !player.ani.playing) {
    player.mirror.x = true
  }
  else if (keyCode === DOWN_ARROW) {
    lives--
  }
  
}

function checkOutOfBounds(side) {
  switch(side) {
    case 'left':
      return player.position.x <= parseInt(BASE_SPRITE_WIDTH*SCALE_FACTOR/2)
    case 'right':
      return player.position.x > map_data.MAP_DIMENSIONS.width*SCALE_FACTOR-parseInt(BASE_SPRITE_WIDTH*SCALE_FACTOR/2)
  }
}

function drawScore() {
  const scoreDigits = getDigitsArray(score, 6)
  push()
  for (let i = 0; i<6; i++) {
    image(
      numbers_white[scoreDigits[i]],
      map_data.SCORE_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
      map_data.SCORE_POSITION.y*SCALE_FACTOR,
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
        map_data.LIVES_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
        map_data.LIVES_POSITION.y*SCALE_FACTOR,
        8*SCALE_FACTOR,
        8*SCALE_FACTOR
      )
    }
    else {
      fill(0)
      rect(
        map_data.LIVES_POSITION.x*SCALE_FACTOR+8*i*SCALE_FACTOR,
        map_data.LIVES_POSITION.y*SCALE_FACTOR,
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