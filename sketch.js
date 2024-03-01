const BASE_SPRITE_WIDTH = 16
const BASE_SPRITE_HEIGHT = 15
const BASE_STARTING_HEIGHT = 16
const BASE_STEP_DISTANCE = 1
let SCALE_FACTOR = 1

let score = 0
let lives = 6
let listBarrels = [];
let barrel;
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

  animation_jump = loadAni('assets/animations/player_jump_1.png', 'assets/animations/player_jump_2.png' )
  animation_jump.frameDelay = 20;
  animation_walk = loadAni('./assets/animations/player_walk_1.png', 3)
  animation_death = loadAni('./assets/animations/player_death_1.png', 2)
  animation_death.frameDelay = 40;
  animation_stand = loadAni('./assets/animations/player_walk_1.png')

  icon_life = loadImage('./assets/misc/icon_life.png')
  map = loadImage('./assets/maps/map_25m.png')
  map_data = loadJSON('./assets/maps/map_25m_data.json')

  princess = loadAnimation('assets/animations/princess_1.png', 'assets/animations/princess_2.png');
  princess.frameDelay = 15;
  princess.scale = SCALE_FACTOR *2.5;
  donkey = loadAnimation ('assets/animations/donkey_1.png',5);
  donkey.frameDelay = 20;
  donkey.scale = SCALE_FACTOR*2.8;

  barrelAni = loadAnimation('assets/animations/rolling_1.png', 'assets/animations/rolling_2.png', 'assets/animations/rolling_3.png', 'assets/animations/rolling_4.png');
  
  barrelAni.scale = SCALE_FACTOR*2.8; 
  
}

function setup() {
  SCALE_FACTOR = parseInt((window.innerHeight-20)/map_data.MAP_DIMENSIONS.height);

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
  player.addAni('death', animation_death)
  player.addAni('walker', animation_walk)
  player.addAni('jumping', animation_jump)
  player.addAni('stand', animation_stand)
  player.mirror.x = true
  console.log(player)

  help = createSprite(360, 115);
  help.scale = SCALE_FACTOR;
  help.addImage('assets/misc/help.png');
  help.immovable = true;
  help.collider = 'none';
  
  barrels = new Sprite();
  barrels.img = 'assets/misc/barrels.png';
  barrels.scale = SCALE_FACTOR;
  barrels.position.x = map_data.BARRELS_POSITION.x;
  barrels.position.y = map_data.BARRELS_POSITION.y;
  barrels.collider = 'none';

  createBarrel();
  //barrel = new Barrel(2);
}
function draw() {
  //console.log(platforms);
  //checkPlayerOnGround();
  
  if(keyIsDown(LEFT_ARROW)) {
    player.position.x -= checkOutOfBounds('left')
      ? 0
      : BASE_STEP_DISTANCE*SCALE_FACTOR

    player.changeAni('walker')
    player.mirror.x = false;
    player.vel.x = -1;
  }
  else if(keyIsDown(RIGHT_ARROW)) {

    player.position.x += checkOutOfBounds('right')
      ? 0
      : BASE_STEP_DISTANCE*SCALE_FACTOR
    player.changeAni('walker')
    player.mirror.x = true;
    player.vel.x = 1;
  }
  else if (keyIsDown(32)) {

    /* if(checkPlayerOnGround()){
      player.velocity.y = -5;
    } */
    player.changeAni('jumping')
    player.velocity.y = -4;
  }
  else {
    //play(0) used to rewind animation
    player.changeAni('stand')
    //player.ani.play(0)
    player.ani.stop()
  }

  if(lives===0){
    player.changeAni('death')
    
  }
  background(map);
  drawScore();
  drawLives();
  animation(princess, map_data.PRINCESS_INITIAL_POSITION.x, map_data.PRINCESS_INITIAL_POSITION.y);
  animation(donkey, map_data.DONKEY_INITIAL_POSITION.x, map_data.DONKEY_INITIAL_POSITION.y);
 
  for (let i = listBarrels.length - 1; i >= 0; i--) {
    listBarrels[i].update();
  }

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
function checkPlayerOnGround() {
  for (let i = 0; i < platforms.length; i++) {

      if (player.collide(platforms[i])) {
        console.log(true);
          return true;
      }
  }
  console.log(false);
  return false;
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


class Barrel {
  constructor(speed) {
    this.sprite = new createSprite(100,230,30,30);
    
    this.sprite.diameter = 30;
    this.sprite.animation = barrelAni;
    this.sprite.animation.frameDelay = 20-speed;
    this.sprite.vel.x = 3;
    this.sprite.rotationLock=false;
    this.sprite.debug = true;
    
  }
  checkOutOfBoundsBarrel() {
    
    if( this.sprite.position.x > (map_data.MAP_DIMENSIONS.width*SCALE_FACTOR -this.sprite.diameter/2) || this.sprite.position.x < this.sprite.diameter/2){
      if(this.sprite.position.y > (map_data.MAP_DIMENSIONS.height*SCALE_FACTOR -this.sprite.diameter*2)){
        this.sprite.remove();
      }
      else{
        this.sprite.vel.x *= -1;
        this.sprite.animation.reverse();
      }
      
    }
  }
  update() {
    
    this.checkOutOfBoundsBarrel()
  }
}

function createBarrel() {

  listBarrels.push(new Barrel(2));
}