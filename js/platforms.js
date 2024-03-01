/**
 * Set up the platforms for the game (static sprites)
 */
setUpPlatforms = () => {
    platformsSprites = new Group();

    map_data.PLATFORMS.forEach(platform => {
        noStroke()
        let newPLatform = new platformsSprites.Sprite(
            platform.x * SCALE_FACTOR,
            platform.y * SCALE_FACTOR,
            platform.width * SCALE_FACTOR,
            platform.height * SCALE_FACTOR,
            'static'
        )
        // newPLatform.visible = false
        newPLatform.debug = true

    })

    return platformsSprites;
}