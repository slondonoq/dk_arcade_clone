/**
 * Set up the barrels in the game
 * @returns {*}
 */
setUpBarrels = () => {
    barrelsSprite = new Sprite();
    barrelsSprite.img = 'assets/misc/barrels.png';
    barrelsSprite.scale = SCALE_FACTOR;
    barrelsSprite.position.x = map_data.BARRELS_POSITION.x;
    barrelsSprite.position.y = map_data.BARRELS_POSITION.y;
    barrelsSprite.collider = 'none';
    return barrelsSprite;
}