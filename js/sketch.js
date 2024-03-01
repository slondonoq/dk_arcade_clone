let SCALE_FACTOR = 1
let score = 0
let lives = 6
let pressedKeys = {};

function keyPressed() {
  pressedKeys[key] = true;
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
}

function setup() {

    SCALE_FACTOR = parseInt((window.innerHeight - 20) / map_data.MAP_DIMENSIONS.height)

    player = setUpMario();
    barrels = setUpBarrels();
    platforms = setUpPlatforms();

    createCanvas(
        map_data.MAP_DIMENSIONS.width * SCALE_FACTOR,
        map_data.MAP_DIMENSIONS.height * SCALE_FACTOR
    )
    //World related
    world.gravity.y = 10;
    noFill()
    border = new Sprite(
        map_data.MAP_DIMENSIONS.width * SCALE_FACTOR / 2,
        map_data.MAP_DIMENSIONS.height * SCALE_FACTOR / 2,
        map_data.MAP_DIMENSIONS.width * SCALE_FACTOR + 2,
        map_data.MAP_DIMENSIONS.height * SCALE_FACTOR + 2,
        's'
    );
    border.shape = 'chain';

    noStroke()

    help = createSprite(360, 115);
    help.scale = SCALE_FACTOR;
    help.addImage('assets/misc/help.png');
    help.immovable = true;
    help.collider = 'none';

}

function draw() {
    updateMario(player);
    updateBoard();

    if (lives === 0) {
        marioSprite.changeAni('death')
    }
    background(map);
    animation(princess, map_data.PRINCESS_INITIAL_POSITION.x, map_data.PRINCESS_INITIAL_POSITION.y);
    animation(donkey, map_data.DONKEY_INITIAL_POSITION.x, map_data.DONKEY_INITIAL_POSITION.y);
}


