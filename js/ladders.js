/**
 * Set up the ladders for the game (static sprites)
 */
class Ladders  {

    constructor(map_data) {
       this.sprites = new Group();

        map_data.LADDERS.forEach(ladder => {
            let newLadder= new this.sprites.Sprite(
                ladder.x * SCALE_FACTOR,
                ladder.y * SCALE_FACTOR,
                ladder.width * SCALE_FACTOR,
                ladder.height * SCALE_FACTOR,
                'static'
            )
            // newLadder.visible = false
            newLadder.debug = true
        })
    }

}
