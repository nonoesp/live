import * as React from 'react'
import type { State } from 'types'
import { StateManager } from 'rko'
import type { StateSelector } from 'zustand'

export const initialState: State = {
    appState: {
        text: `We're coding live. 🙃`
    }
}

export const context = React.createContext<AppState>({} as AppState)

export class AppState extends StateManager<State> {

    setText = (text: string) => {

        const { state } = this;

        return this.setState({
            before: {
                appState: {
                    text: state.appState.text
                }
            },
            after: {
                appState: {
                    text
                }
            }
        })

    }

}

export const app = new AppState(initialState, "text-app", 1)

export function useAppState(): State
export function useAppState<K>(selector: StateSelector<State, K>): K
export function useAppState<K>(selector?: StateSelector<State, K>) {
    if (selector) {
        return app.useStore(selector)
    }
    return app.useStore()
}