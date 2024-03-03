/**
 * Set up the platforms for the game (static sprites)
 */
class Platforms  {

    constructor(map_data) {
       this.sprites = new Group();
       this.overlappable = new this.sprites.Group()

        map_data.PLATFORMS.forEach(platform => {
            let newPlatform;
            
            if (platform.y > 240) {
                newPlatform = new this.sprites.Sprite(
                    platform.x * SCALE_FACTOR,
                    platform.y * SCALE_FACTOR,
                    platform.width * SCALE_FACTOR,
                    platform.height * SCALE_FACTOR,
                    'static'
                )
            }
            else {
                newPlatform = new this.overlappable.Sprite(
                    platform.x * SCALE_FACTOR,
                    platform.y * SCALE_FACTOR,
                    platform.width * SCALE_FACTOR,
                    platform.height * SCALE_FACTOR,
                    'static'
                )
            }
            // newPLatform.visible = false
            newPlatform.debug = true

        })
    }

}
