export function startAudioStream(next) {
    navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            const audioContext = new AudioContext()
            const analyser = audioContext.createAnalyser()
            const microphone = audioContext.createMediaStreamSource(stream)
            const processor = audioContext.createScriptProcessor(2048, 1, 1)

            processor.clipping = false
            processor.lastClip = 0
            processor.volume = 0
            processor.clipLevel = 0.98
            processor.averaging = 0.95
            processor.clipLag = 500

            analyser.smoothingTimeConstant = 0.05
            analyser.fftSize = 1024

            microphone.connect(analyser)
            analyser.connect(processor)
            processor.connect(audioContext.destination)
            onAudioChange(analyser, processor, next)
        })
        .catch(function(err) {
            console.log('The following gUM error occured: ' + err)
        })
}

function onAudioChange(analyser, processor, next) {
    let prevEnergy = 0
    let prevTime = Date.now()

    processor.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        const length = array.length
        const values = array.reduce((a, b) => a + b)
        const energy = values / length
        if (
            Math.abs(prevEnergy - energy) > 10 &&
            energy > 10 &&
            Date.now() - prevTime > 400
        ) {
            prevTime = Date.now()
            prevEnergy = 0.85 * energy
            next()
        }
    }
}
