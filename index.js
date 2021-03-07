const canvas = document.getElementById('polipod_canvas')
canvas.width = 1000
canvas.height = 1000
const context = canvas.getContext('2d')
const twoPi = 2 * Math.PI

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

const changeLocationCheckbox = document.getElementById('change_location')
let changeLocationActive = changeLocationCheckbox.checked
changeLocationCheckbox.addEventListener('change', () => {
    changeLocationActive = changeLocationCheckbox.checked
})

const drawCircle = (x, y, radius, colour) => {
    const [red, green, blue] = colour
    context.fillStyle = `rgb(${red}, ${green}, ${blue})`
    context.beginPath()
    context.arc(x, y, radius, 0, twoPi)
    context.fill()
}

const segmentColours = (segments, colourPhase, colourFrequency, fearLevel) => {
    return segments.map(segment => [
        Math.floor((Math.sin(segment * colourFrequency - colourPhase) + 1) * 128)
        , Math.floor((Math.sin((segment + 1) * colourFrequency - colourPhase) + 1) * 64 + 32)
        , Math.floor((Math.sin((segment + 0) * colourFrequency - colourPhase) + 1) * 128)
    ])
}

const segmentAngles = (segments, anglePhase, angleAmplitude, angleFrequency) => {
    return segments.map(segment => Math.sin(segment * angleFrequency - anglePhase) * angleAmplitude)
}

const numberOfCreatures = 12
const numberOfArms = 7
const numberOfSegments = 70
const maxSpeedChange = 0.3
const maxArmAmplitude = 0.2
const minArmAmplitude = 0.01
const maxArmFrequency = 0.1
const minArmFrequency = 0.01
const baseRadius = 3

const segments = (new Array(numberOfSegments)).fill().map((_, index) => index)

const creatures = (new Array(numberOfCreatures)).fill().map(creature => ({
    arms: (new Array(numberOfArms)).fill().map((_, index) => ({
        angle: twoPi * index / numberOfArms
        , phase: Math.random() * twoPi
        , amplitude: Math.random() * (maxArmAmplitude - minArmAmplitude) + minArmAmplitude
        , frequency: Math.random() * (maxArmFrequency - minArmFrequency) + minArmFrequency
        , angles: segments.map(segment => 0)
    }))
    , location: {
        x: Math.random() * canvas.width
        , y: Math.random() * canvas.height
        , xDrift: 0
        , yDrift: 0
    }
    , colours: segments.map(segment => [128, 128, 128])
    , colourPhase: Math.random() * twoPi
    , colourFrequency: 0.3
    , fearLevel: 0
    , fearTarget: 0
}))

export const renderLoop = () => {
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (const creature of creatures) {
        if (changeColourActive) {
            creature.colourPhase -= 0.5
            if (creature.colourPhase < twoPi) {
                creature.colourPhase += twoPi
            }
            creature.colours = segmentColours(segments, creature.colourPhase, creature.colourFrequency, creature.fearLevel)
        }

        if (changeLocationActive) {
            const direction = Math.random() * twoPi
            const magnitude = Math.random() * maxSpeedChange
            creature.location.xDrift += Math.cos(direction) * magnitude
            creature.location.yDrift += Math.sin(direction) * magnitude

            creature.location.xDrift *= 0.99
            creature.location.yDrift *= 0.99
            creature.location.x += creature.location.xDrift
            creature.location.y += creature.location.yDrift
            if (creature.location.x < 0) {
                creature.location.xDrift += 0.1
            }

            if (creature.location.x > canvas.width) {
                creature.location.xDrift -= 0.1
            }

            if (creature.location.y < 0) {
                creature.location.yDrift += 0.1
            }

            if (creature.location.y > canvas.height) {
                creature.location.yDrift -= 0.1
            }
        }

        for (const arm of creature.arms) {
            let angle = arm.angle

            if (changeAngleActive) {
                arm.phase += 0.04 + Math.random() * 0.01
                if (arm.phase > twoPi) {
                    arm.phase -= twoPi
                }

                arm.amplitude += (Math.random() - 0.5) * 0.001
                if (arm.amplitude > maxArmAmplitude) {
                    arm.amplitude -= 0.001
                }
                if (arm.amplitude < minArmAmplitude) {
                    arm.amplitude += 0.001
                }

                arm.frequency += (Math.random() - 0.5) * 0.001
                if (arm.frequency > maxArmFrequency) {
                    arm.frequency -= 0.001
                }
                if (arm.frequency < minArmFrequency) {
                    arm.frequency += 0.001
                }

                arm.angles = segmentAngles(segments, arm.phase, arm.amplitude, arm.frequency)
            }
            let x = creature.location.x
            let y = creature.location.y
            let radius = baseRadius
            for (const segment of segments) {
                const colour = creature.colours[segment]
                angle += arm.angles[segment]
                radius *= 0.98
                x += Math.cos(angle) * radius
                y += Math.sin(angle) * radius
                drawCircle(x, y, radius, colour)
            }
        }
    }

    window.requestAnimationFrame(renderLoop)
}
