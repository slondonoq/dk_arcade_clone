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

class Player {
    /**
     * Set up the player (mario) sprite
     */
    constructor(x, y, scale) {
        this.lives = 3;
        this.sprite = new createSprite(x, y);
        // Initial dimensions of the player (mario)
        this.sprite.scale = scale
        this.sprite.height = BASE_SPRITE_HEIGHT * this.sprite.scale
        this.sprite.width = BASE_SPRITE_WIDTH * this.sprite.scale
        this.sprite.debug = true
        this.sprite.rotationLock = true

        // Adding all the animations to the player (mario)
        this.sprite.addAni('death', animation_death)
        this.sprite.addAni('walker', animation_walk)
        this.sprite.addAni('jumping', animation_jump)
        this.sprite.addAni('stand', animation_stand)
        this.sprite.mirror.x = true
        // Flags for movement mechanics
        this.isPlayerOnTheGround = true;
        this.isPlayerOnLadder = false;
    }

    loseLife() {
        this.lives -= 1
    }

    /**
     * Update the player's position and animations
     */
    update() {

        let mvmt = createVector(0, 0);

        this.isPlayerOnTheGround = this.sprite.colliding(platforms) > 1;

        // Move the player to the left
        if (pressedKeys['A']) {
            mvmt.x -= 1
            this.sprite.changeAni('walker')
            this.sprite.mirror.x = false;
            this.sprite.vel.x = -0.5;
        }
        // Move the player to the right
        if (pressedKeys['D']) {
            mvmt.x += 1
            this.sprite.changeAni('walker')
            this.sprite.mirror.x = true;
            this.sprite.vel.x = 0.5;
        }
        // TODO: add animation and check if preventing gravity is possible (stay hanged on ladder)
        // Move the player up a ladder
        if (pressedKeys['W'] && this.isPlayerOnLadder) {
            // Allow player to go through certain platforms
            this.sprite.overlaps(overlappable_platforms)
            mvmt.y -= 2
            this.sprite.velocity.y = -0.5;
        }
        // Move the player down a ladder
        else if (pressedKeys['S'] && this.isPlayerOnLadder) {
            // Allow player to go through certain platforms
            this.sprite.overlaps(overlappable_platforms)
            mvmt.y += 2
            this.sprite.velocity.y = -0.5;
        }
        // Remove ability to go through platforms if player is not on a ladder
        else if (!this.isPlayerOnLadder) this.sprite.collides(overlappable_platforms)
        // Player jumps
        if (pressedKeys[' '] && this.isPlayerOnTheGround) {
            this.sprite.changeAni('jumping');
            this.sprite.velocity.y = -4;
        }

        // If the player is not moving and is on the ground, change the animation to standing
        if (!this.isMoving() && this.isPlayerOnTheGround) {
            this.sprite.changeAni('stand')
        }

        // Prevent to make diagonal movements faster than horizontal ones
        mvmt.setMag(2.5);

        this.sprite.position.x += mvmt.x;
        this.sprite.position.y += mvmt.y;

        
        // Check if the player is out of bounds
        this.checkOutOfBounds();

        // Check if the player is dead
        if (this.lives < 1) {
            this.sprite.changeAni('death')
        }

    }

    /**
     * Prevent the player from grap the borders of the screen
     * @returns {Boolean}
     */
    checkOutOfBounds = () => {

        if (this.sprite.colliding(border) > 0) {
            console.log('colliding')

            if (this.sprite.mirror.x == true) {
                this.sprite.vel.x -= 0.5;
            } else {
                this.sprite.vel.x += 0.5;
            }

        }

    }

    checkDeath = () => {
        //TODO: properly detect collisions
        if (this.sprite.colliding(barrels) > 0) {
            this.loseLife()
        }
    }

    setPlayerOnLadder = (isOnLadder) => {
        this.isPlayerOnLadder = isOnLadder
    }

    /**
     * Check if the player is moving
     * @returns {boolean} is the player moving
     */
    isMoving = () => {
        return pressedKeys['A'] || pressedKeys['D'] || pressedKeys[' ']
    }
}

