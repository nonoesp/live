import * as React from 'react'
import { Picture } from './components/picture'
import { app, useAppState } from 'state'
import { useKeyboardShortcuts } from 'hooks'
import { useHotkeys } from 'react-hotkeys-hook'

function App(): JSX.Element {

    useKeyboardShortcuts()

    useHotkeys(`command+shift+b`, () => {
        setText(`This is Nono Martínez Alonso! 👨🏻‍🎨`)
    })

    const { appState } = useAppState()

    const { setText } = app

    const buttonStyle = {
        display: "inline-block",
        cursor: "pointer",
        userSelect: "none" as UserSelect,
    }

    return (
        <div>
            <div className="wrapper">
            <h1>Hello, React! 🚀</h1>
                <p>{appState.text}</p>
                <div>
                    {app.canUndo && (
                    <div
                        style={buttonStyle}
                        onClick={() => app.undo()}
                    >
                    ← Undo
                    </div>
                    )}
                    &nbsp;&nbsp;
                    {app.canRedo && (
                    <div
                        style={buttonStyle}
                        onClick={() => app.redo()}
                    >
                        Redo →
                    </div>
                    )}                    

                </div>
                <br />
                <Picture
                    title={`Zoom H6 🎤`}
                    image={`https://nono.imgix.net/img/u/sketch-210508-panaderos-zoom-recorder-h6.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                    onClick={() => setText(`Zoom H6 🎤`)}
                />
                <Picture
                    title={`Sony a6500 📷`}
                    image={`https://nono.imgix.net/img/u/sketch-210923-sony-alpha-6500-evil-mirrorless-camera-tripod-video-8-usb-cable.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                    onClick={() => setText(`Sony a6500 📷`)}
                />
                <Picture
                    title={`Out of Context 🗿`}
                    image={`https://nono.imgix.net/img/u/sketch-190419_london-british-museum-hoa-hokakanaia.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                    onClick={() => setText(`Out of Context 🗿`)}
                />
                <Picture
                    title={`Erythrina Caffra 🌳`}
                    image={`https://nono.imgix.net/img/u/sketch-190531_malaga-enrique-garcia-herrera-tree-erythrina-caffra.jpg?ar=16%3A9&fit=clamp&h=1600&ixlib=php-3.3.1&w=800&pad=1900`}
                    onClick={() => setText(`Erythrina Caffra 🌳`)}
                />
            </div>
        </div>
    )
}

export default App;