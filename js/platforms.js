/**
 * Set up the platforms for the game (static sprites)
 */
class Platforms  {

    constructor(map_data) {
       this.sprites = new Group();

        map_data.PLATFORMS.forEach(platform => {
            let newPLatform= new this.sprites.Sprite(
                platform.x * SCALE_FACTOR,
                platform.y * SCALE_FACTOR,
                platform.width * SCALE_FACTOR,
                platform.height * SCALE_FACTOR,
                'static'
            )
            // newPLatform.visible = false
            newPLatform.debug = true

        })
    }

}
