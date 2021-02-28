import {squareColour} from '@trichoplax/polipod_colours_js/index.js'
import {squareAngle} from '@trichoplax/polipod_angles_js/index.js'

const canvas = document.getElementById('polipod_canvas')
const context = canvas.getContext('2d')

const changeColourCheckbox = document.getElementById('change_colour')
let changeColourActive = changeColourCheckbox.checked
changeColourCheckbox.addEventListener('change', () => {
    changeColourActive = changeColourCheckbox.checked
})

const changeAngleCheckbox = document.getElementById('change_angle')
let changeAngleActive = changeAngleCheckbox.checked
changeAngleCheckbox.addEventListener('change', () => {
    changeAngleActive = changeAngleCheckbox.checked
})

let red = 0
let green = 0
let blue = 0
let angle = 0

export const renderLoop = () => {
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
