/**
 * Set up the barrels stock in the game
 * @returns {*}
 */
setUpBarrelsStock = () => {

  const BASE_BARRELS_WIDTH = 20
  const BASE_BARRELS_HEIGHT = 32

  barrelsSprite = new Sprite();
  barrelsSprite.img = 'assets/misc/barrels.png';
  barrelsSprite.scale = SCALE_FACTOR;
  barrelsSprite.h = BASE_BARRELS_HEIGHT*SCALE_FACTOR;
  barrelsSprite.w = BASE_BARRELS_WIDTH*SCALE_FACTOR;
  barrelsSprite.position.x = map_data.BARRELS_POSITION.x*SCALE_FACTOR;
  barrelsSprite.position.y = map_data.BARRELS_POSITION.y*SCALE_FACTOR;
  barrelsSprite.collider = 'static'
}

class Barrel {
  constructor(group) {
    this.sprite = new group.Sprite();
    this.sprite.x = map_data.BARREL_ROLL_START_POSITION.x*SCALE_FACTOR
    this.sprite.y = map_data.BARREL_ROLL_START_POSITION.y*SCALE_FACTOR
    this.sprite.scale = SCALE_FACTOR
    this.sprite.h = 10*SCALE_FACTOR
    this.sprite.w = 12*SCALE_FACTOR
    this.sprite.diameter = 12*SCALE_FACTOR;
    this.sprite.animation = barrelAni;
    this.sprite.animation.frameDelay = 20-2;
    this.sprite.vel.x = 3;
    this.sprite.rotationLock=false;
    this.sprite.debug = true;
    //TODO: check this
    this.sprite.animation.stop()

  }
  checkOutOfBoundsBarrel() {

    if(this.sprite.collides(border)){
      if(this.sprite.position.y > (map_data.MAP_DIMENSIONS.height*SCALE_FACTOR -this.sprite.diameter*2)){
        this.sprite.remove();
      }
      else{
        this.sprite.vel.x *= -1;
        // this.sprite.animation.reverse();
      }

    }
  }
  update() {

    this.checkOutOfBoundsBarrel()
  }
}

function createBarrel() {
  //* Left line below commented just in case the new barrel
  //* group gives problems in the future
  // listBarrels.push(new Barrel(2));
  new Barrel(listBarrels);
}