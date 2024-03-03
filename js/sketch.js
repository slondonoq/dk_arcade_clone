let SCALE_FACTOR = 1
let score = 100
let lives = 6
let pressedKeys = {};
let listBarrels;
function keyPressed() {
  pressedKeys[key] = true;
  if(key === 'L') {
    player.loseLife();
  }
}
function keyReleased() {
  delete pressedKeys[key];
}
// This function is used to load an animation from a sequence of images
function preload() {

    preloadMario();
    preloadBoard();

    map = loadImage('../assets/maps/map_25m.png')
    map_data = loadJSON('../assets/maps/map_25m_data.json')

    princess = loadAnimation('../assets/animations/princess_1.png', 2);
    princess.frameDelay = 15;
    help = loadImage('../assets/misc/help.png');
    // help.frameDelay = 15;
    donkey_animation = loadAnimation('../assets/animations/donkey_1.png', 5);
    donkey_animation.frameDelay = 20;

    barrelAni = loadAnimation('../assets/animations/rolling_1.png', 4);
}

function setup() {

  /* Important! The scale factor calculated below is used to have a better
     proportion between canvas size and screen, preventing a really small
     playing space as the sprites are by default made for a canvas of size
     224x256. Thus, any map placing constants should be calculated by commenting
     the scale factor line and testing on the default size, then multiplying
     the amount calculated by the scale factor. An example of this can be seen
     on the player class builder.
  */

  // SCALE_FACTOR = parseInt((window.innerHeight - 20) / map_data.MAP_DIMENSIONS.height)

  player = new Player(map_data.PLAYER_INITIAL_POSITION.x * SCALE_FACTOR,
          map_data.PLAYER_INITIAL_POSITION.y * SCALE_FACTOR,
          SCALE_FACTOR);

  princess.scale = SCALE_FACTOR;

  platformGroup = new Platforms(map_data, SCALE_FACTOR);
  platforms = platformGroup.sprites;
  overlappable_platforms = platformGroup.overlappable;
  ladders = new Ladders(map_data, SCALE_FACTOR).sprites;
  scoreBoard = new Score();
  livesBoard = new Lives();
  listBarrels = new Group();

  // Setting overlapping callbacks
  player.sprite.overlaps(ladders, () => player.setPlayerOnLadder(true))
  player.sprite.overlapped(ladders, () => player.setPlayerOnLadder(false))

  //TODO: allow barrels to randomly go down ladders by adding function as param
  listBarrels.overlaps(ladders)

  setUpBarrelsStock();

  //Donkey related
  //TODO: move code
  donkey = new Sprite()
  donkey.x = map_data.DONKEY_INITIAL_POSITION.x*SCALE_FACTOR
  donkey.y = map_data.DONKEY_INITIAL_POSITION.y*SCALE_FACTOR
  donkey.ani = donkey_animation
  donkey.scale = SCALE_FACTOR
  //TODO: put these values into constants
  donkey.h = 32*SCALE_FACTOR
  donkey.w = 46*SCALE_FACTOR
  donkey.collider = 'static' 


  createBarrel();

  createCanvas(
      map_data.MAP_DIMENSIONS.width * SCALE_FACTOR,
      map_data.MAP_DIMENSIONS.height * SCALE_FACTOR
  )
  //World related
  world.gravity.y = 10;
  border = new Sprite(
      map_data.MAP_DIMENSIONS.width * SCALE_FACTOR / 2,
      map_data.MAP_DIMENSIONS.height * SCALE_FACTOR / 2,
      map_data.MAP_DIMENSIONS.width * SCALE_FACTOR + 2,
      map_data.MAP_DIMENSIONS.height * SCALE_FACTOR + 2,
      's'
  );
  border.shape = 'chain';
}

function draw() {
  // * Pay attention to the update order, as updates that
  // * are done before the background may be overwritten
  background(map);
  player.update();
  scoreBoard.update();
  livesBoard.update();

  animation(princess, map_data.PRINCESS_INITIAL_POSITION.x*SCALE_FACTOR, map_data.PRINCESS_INITIAL_POSITION.y*SCALE_FACTOR);
  //Of every 120 frames, paint the image 60 (half on-off)
  if(frameCount%120 < 60){ 
    image(
      help,
      map_data.HELP_SCREAM_INITIAL_POSITION.x*SCALE_FACTOR,
      map_data.HELP_SCREAM_INITIAL_POSITION.y*SCALE_FACTOR,
      23*SCALE_FACTOR,
      8*SCALE_FACTOR
    )
  }

  for (let i = listBarrels.length - 1; i >= 0; i--) {
    listBarrels[i].update();
  }
}
