import { useHotkeys } from 'react-hotkeys-hook'
import { app } from 'state'

export function useKeyboardShortcuts() {

    // Undo
    useHotkeys(`command+z,ctrl+z`, () => {
        app.undo()
    })
    
    // Redo
    useHotkeys(`command+shift+z,ctrl+shift+z`, () => {
        app.redo()
    })

    useHotkeys(`command+shift+v`, () => {
        alert(`This really works! 🥳`)
    })

}