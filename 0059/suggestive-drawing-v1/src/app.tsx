import * as React from 'react'
import { SVGEditor } from './components/svg-editor'
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
            <h1>Suggestive Drawing · Live 59 🚀</h1>
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
            </div>
            <SVGEditor/>
        </div>
    )
}

export default App;