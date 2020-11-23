import {squareColour} from 'https://unpkg.com/@trichoplax/polipod_colours_js@0.0.0/index.js'
import {squareAngle} from 'https://unpkg.com/@trichoplax/polipod_angles_js@0.0.0/index.js'

let red = 0
let green = 0
let blue = 0
let angle = 0

const renderLoop = () => {
    if (changeColourActive) {
        [red, green, blue] = squareColour([red, green, blue])
    }

    if (changeAngleActive) {
        angle = squareAngle(angle)
    }

    context.fillStyle = `rgb(${red}, ${green}, ${blue})`
    context.fillRect(angle + 10, 10, 50, 50)

    window.requestAnimationFrame(renderLoop)
}
