const BASE_STEP_DISTANCE = 0.1
const BASE_SPRITE_WIDTH = 16
const BASE_SPRITE_HEIGHT = 15
const BASE_JUMP_FORCE = 2
/**
 * Load the animations for the player (mario)
 */
preloadMario = () => {
    animation_jump = loadAni('assets/animations/player_jump_1.png', 'assets/animations/player_jump_2.png')
    animation_jump.frameDelay = 20;
    animation_walk = loadAni('./assets/animations/player_walk_1.png', 3)
    animation_death = loadAni('./assets/animations/player_death_1.png', 2)
    animation_death.frameDelay = 40;
    animation_stand = loadAni('./assets/animations/player_walk_1.png')
}
/**
 * Set up the player (mario) sprite
 */
setUpMario = () => {
    // Initial position of the player (mario)
    marioSprite = createSprite(
        map_data.PLAYER_INITIAL_POSITION.x * SCALE_FACTOR ,
        map_data.PLAYER_INITIAL_POSITION.y * SCALE_FACTOR
    )
    // Initial dimensions of the player (mario)
    marioSprite.scale = 2.5
    marioSprite.height = BASE_SPRITE_HEIGHT * marioSprite.scale
    marioSprite.width = BASE_SPRITE_WIDTH * marioSprite.scale
    marioSprite.debug = true
    marioSprite.rotationLock = true

    // Adding all the animations to the player (mario)
    marioSprite.addAni('death', animation_death)
    marioSprite.addAni('walker', animation_walk)
    marioSprite.addAni('jumping', animation_jump)
    marioSprite.addAni('stand', animation_stand)
    marioSprite.mirror.x = true

    return marioSprite
}
/**
 * Update the player's position and animations
 * @param mario
 */
updateMario = (mario) => {
    let mvmt = createVector(0, 0);

    isPlayerOnTheGround = mario.colliding(platforms) > 10;

    if (pressedKeys['A']) {
        mvmt.x -= 1
        mario.changeAni('walker')
        mario.mirror.x = false;
        mario.vel.x = -0.5;
    }

    if (pressedKeys['D']) {
        mvmt.x += 1
        mario.changeAni('walker')
        mario.mirror.x = true;
        mario.vel.x = 0.5;
    }

    if (pressedKeys[' '] && isPlayerOnTheGround && !mario.collides(platforms)) {
        mario.changeAni('jumping');
        mario.velocity.y = -4;
    }

    if (!isMoving() && isPlayerOnTheGround){
        mario.changeAni('stand')

    }

    mvmt.setMag(2.5);

    mario.position.x += mvmt.x;
    mario.position.y += mvmt.y;
}

/**
 * Check if the player is out of bounds in the specified side
 * @param player Reference to the sprite of the player
 * @param {String} side Which side to check for
 * @returns {Boolean}
 */
checkOutOfBounds = (player, side) =>{
    switch (side) {
        case 'left':
            return player.position.x <= parseInt(BASE_SPRITE_WIDTH * SCALE_FACTOR / 2)
        case 'right':
            return player.position.x > map_data.MAP_DIMENSIONS.width * SCALE_FACTOR - parseInt(BASE_SPRITE_WIDTH * SCALE_FACTOR / 2)
    }
}

/**
 * Check if the player is moving
 * @returns {boolean} is the player moving
 */
isMoving = () => {
    return pressedKeys['A'] || pressedKeys['D'] || pressedKeys[' ']
}