/**
 * Set up the barrels stock in the game
 * @returns {*}
 */
setUpBarrelsStock = () => {
    barrelsSprite = new Sprite();
    barrelsSprite.img = 'assets/misc/barrels.png';
    barrelsSprite.scale = SCALE_FACTOR;
    barrelsSprite.position.x = map_data.BARRELS_POSITION.x;
    barrelsSprite.position.y = map_data.BARRELS_POSITION.y;
    barrelsSprite.collider = 'none';
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