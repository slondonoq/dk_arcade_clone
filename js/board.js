/**
 * Load the board elements
 */
preloadBoard = () => {
    numbers_white = []
    numbers_blue = []
    numbers_cyan = []

    for (let i = 0; i < 10; i++) {
        numbers_white.push(loadImage(`./assets/misc/number_white_${i}.png`))
        numbers_blue.push(loadImage(`./assets/misc/number_blue_${i}.png`))
        numbers_cyan.push(loadImage(`./assets/misc/number_cyan_${i}.png`))
    }
    icon_life = loadImage('./assets/misc/icon_life.png')
}
class Score {
    constructor() {
    }

    update() {
        const scoreDigits = this.getDigitsArray(score, 6)
        push()
        for (let i = 0; i < 6; i++) {
            image(
                numbers_white[scoreDigits[i]],
                map_data.SCORE_POSITION.x * SCALE_FACTOR + 8 * i * SCALE_FACTOR,
                map_data.SCORE_POSITION.y * SCALE_FACTOR,
                8 * SCALE_FACTOR,
                8 * SCALE_FACTOR
            )
        }
        pop()
    }

    /**
     * Get the digits of a number in an array
     * @param number
     * @param arrayLength
     * @returns {number[]}
     */
    getDigitsArray(number, arrayLength = 0) {
        const result = Array.from(number.toString(), (digit => parseInt(digit)))

        //fill missing places to the left with zeroes
        if (arrayLength - result.length > 0) {
            return Array(arrayLength - result.length).fill(0).concat(result)
        }

        return result
    }

}

/**
 * Draw the lives on the board
 */
class Lives {
    constructor() {
    }

    update() {
        push()
        for (let i = 0; i < 6; i++) {
            if (lives > i) {
                image(
                    lives > i ? icon_life : black_square,
                    map_data.LIVES_POSITION.x * SCALE_FACTOR + 8 * i * SCALE_FACTOR,
                    map_data.LIVES_POSITION.y * SCALE_FACTOR,
                    8 * SCALE_FACTOR,
                    8 * SCALE_FACTOR
                )
            } else {
                fill(0)
                rect(
                    map_data.LIVES_POSITION.x * SCALE_FACTOR + 8 * i * SCALE_FACTOR,
                    map_data.LIVES_POSITION.y * SCALE_FACTOR,
                    8 * SCALE_FACTOR,
                    8 * SCALE_FACTOR
                )
            }
        }
        pop()
    }
}

