import React from 'react'
import { startAudioStream } from './assets/js/audio.js'
import { getRandomColor } from './assets/js/helpers.js'
import './App.css'

const App = () => {
    const [color, setColor] = React.useState('#fff')

    React.useEffect(() => {
        startAudioStream(() => setColor(getRandomColor()))
    }, [])

    return (
        <div
            className="App"
            style={{ height: '100vh', width: '100vw', backgroundColor: color }}
        />
    )
}

export default App
