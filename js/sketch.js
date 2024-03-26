let SCALE_FACTOR = 1
let score = 100
let lives = 3
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

    map = loadImage('../assets/maps/map_25m.png')
    map_data = loadJSON('../assets/maps/map_25m_data.json')
    console.log(map_data.PLAYER_INITIAL_POSITION);
    preloadMario();
    preloadBoard();


    princessAni = loadAnimation('../assets/animations/princess_1.png', 2);
    princessAni.frameDelay = 15;
    help = loadImage('../assets/misc/help.png');
    // help.frameDelay = 15;
    donkey_animation = loadAnimation('../assets/animations/donkey_1.png', 5);
    donkey_animation.frameDelay = 45;

    barrelAni = loadAnimation('../assets/animations/rolling_1.png', 4);
    gameOver = loadImage('../assets/misc/GameOver.png')
    win = loadImage('../assets/misc/win.png')
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
  
  console.log(map_data.PLAYER_INITIAL_POSITION
    );
  player = new Player(map_data.PLAYER_INITIAL_POSITION.x * SCALE_FACTOR,
          map_data.PLAYER_INITIAL_POSITION.y * SCALE_FACTOR,
          SCALE_FACTOR);

  princessAni.scale = SCALE_FACTOR; 

  platformGroup = new Platforms(map_data, SCALE_FACTOR);
  platforms = platformGroup.sprites;
  overlappable_platforms = platformGroup.overlappable;
  ladders = new Ladders(map_data, SCALE_FACTOR).sprites;
  scoreBoard = new Score();
  livesBoard = new Lives();
  listBarrels = new Group(); 
  listBarrels.life = 1070;   

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
  
  princess = new Sprite()
  princess.x = map_data.PRINCESS_INITIAL_POSITION.x*SCALE_FACTOR
  princess.y = map_data.PRINCESS_INITIAL_POSITION.y*SCALE_FACTOR
  princess.ani = princessAni
  princess.scale = SCALE_FACTOR
  princess.debug = true;
    
  setTimeout(() => {  
    setInterval(createBarrel, 5000);
  }
  , 1300); 
        
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
  listBarrels.update();
  
  
  //Of every 120 frames, paint the image 60 (half on-off)
  if(frameCount%120 < 60 && player.lives > 0 && !player.win){ 
    image(
      help,
      map_data.HELP_SCREAM_INITIAL_POSITION.x*SCALE_FACTOR,
      map_data.HELP_SCREAM_INITIAL_POSITION.y*SCALE_FACTOR,
      23*SCALE_FACTOR,
      8*SCALE_FACTOR
    )
  }
  if(player.lives <= 0){
    donkey.ani.pause();
    princess.ani.pause();   
    listBarrels.removeAll();                
    image(    
      gameOver,
      map_data.FINAL_BANNER.x*SCALE_FACTOR,
      map_data.FINAL_BANNER.y*SCALE_FACTOR,
      map_data.FINAL_BANNER.width*SCALE_FACTOR,
      map_data.FINAL_BANNER.height*SCALE_FACTOR, 
    )
  }
  if(player.win){
    donkey.ani.pause();
    princess.ani.pause();
    listBarrels.removeAll();                
    image(    
      win,
      map_data.FINAL_BANNER.x*SCALE_FACTOR,
      map_data.FINAL_BANNER.y*SCALE_FACTOR,
      map_data.FINAL_BANNER.width*SCALE_FACTOR,
      map_data.FINAL_BANNER.height*SCALE_FACTOR, 
    )
  }
}
