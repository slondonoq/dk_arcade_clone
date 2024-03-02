let SCALE_FACTOR = 1
let score = 0
let lives = 6
let pressedKeys = {};
let listBarrels = [];
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

    map = loadImage('./assets/maps/map_25m.png')
    map_data = loadJSON('./assets/maps/map_25m_data.json')

    princess = loadAnimation('assets/animations/princess_1.png', 'assets/animations/princess_2.png');
    princess.frameDelay = 15;
    princess.scale = SCALE_FACTOR * 2.5;
    donkey = loadAnimation('assets/animations/donkey_1.png', 5);
    donkey.frameDelay = 20;
    donkey.scale = SCALE_FACTOR * 2.8;

    barrelAni = loadAnimation('assets/animations/rolling_1.png', 'assets/animations/rolling_2.png', 'assets/animations/rolling_3.png', 'assets/animations/rolling_4.png');
    barrelAni.scale = SCALE_FACTOR*2.8;
}

function setup() {

    SCALE_FACTOR = parseInt((window.innerHeight - 20) / map_data.MAP_DIMENSIONS.height)

    player = new Player(map_data.PLAYER_INITIAL_POSITION.x * SCALE_FACTOR,
            map_data.PLAYER_INITIAL_POSITION.y * SCALE_FACTOR,
            SCALE_FACTOR);
    platforms = new Platforms(map_data, SCALE_FACTOR).sprites;
    scoreBoard = new Score();
    livesBoard = new Lives();


    setUpBarrelsStock();
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


    help = createSprite(360, 115);
    help.scale = SCALE_FACTOR;
    help.addImage('assets/misc/help.png');
    help.immovable = true;
    help.collider = 'none';

}

function draw() {

    player.update();
    scoreBoard.update();
    livesBoard.update();

    background(map);
    animation(princess, map_data.PRINCESS_INITIAL_POSITION.x, map_data.PRINCESS_INITIAL_POSITION.y);
    animation(donkey, map_data.DONKEY_INITIAL_POSITION.x, map_data.DONKEY_INITIAL_POSITION.y);

    for (let i = listBarrels.length - 1; i >= 0; i--) {
        listBarrels[i].update();
    }
}




