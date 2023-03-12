import React, { useLayoutEffect, useMemo, useState } from 'react'
import StateMachine, { mergeSelectors } from './StateMachine'
import { Types } from './types.t'

/**
 * Get reducer actions
 * @deprecated Use fuseBox.actions
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof A, import('./types.t').ActionType>}
 */
function useActions(fuseBox) {
    return fuseBox.actions
}

/**
 * 
 * @param {object} store
 * @param {string} store.name 'Store name'
 * @returns 
 */
function useDispatch(store) {
    return StateMachine.store[store.name].dispatch
}

/**
 * Get fuse
 * @deprecated Use store.useState()
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof I, any>}
 */
function useFuse(fuseBox) {
    return fuseBox.useState()
}

// @ts-ignore
function useSelectors(store) {
    return StateMachine.store[store.name].getSelectors()
}

// @ts-ignore
function useFuseSelection(store, selector) {
    let selection = mergeSelectors(selector, StateMachine.store[store.name].getState())
    const [fuseSelection, setFuseSelection] = useState(selection)

    useLayoutEffect(() => {
        // @ts-ignore
        const handleReducerChange = (newStore) => {
            const newFuseSelection = mergeSelectors(selector, newStore)
            let shouldUpdate = false
            if (newFuseSelection.value instanceof Function) {
                // @ts-ignore
                for (let i = 0; i < newFuseSelection.stateSelections.length; i++) {
                    // @ts-ignore
                    if (newFuseSelection.stateSelections[i] !== fuseSelection.stateSelections[i]) {
                        shouldUpdate = true
                        break
                    }
                }
            }
            else if (newFuseSelection.value !== fuseSelection.value) {
                shouldUpdate = true      
            }  

            if (shouldUpdate) {
                setFuseSelection(newFuseSelection)
            }
        }

        StateMachine.addFuseListener(store.name, handleReducerChange)

        return () => {
            StateMachine.removeFuseListener(store.name, handleReducerChange)
        }
    }, [])

    if (fuseSelection.value instanceof Function) {
        // @ts-ignore
        return fuseSelection.value(...fuseSelection.stateSelections)
    }
    else {
        return fuseSelection.value
    }
}

// @ts-ignore
const connectWire = (store, Child) => (props) => {
    // Get from fuse
    const context = useFuse(store)

    // Get dispatch for fuse
    const dispatch = useDispatch(store)

    const actions = useActions(store)

    // Get fuse
    const fuse = {
        [store.name]: {
            store: context,
            dispatch: dispatch,
            actions: actions
        }
    }

    // Set up memoization
    // @ts-ignore
    return useMemo(() => <Child {...fuse} {...props} />, [props, context])
}

// @ts-ignore
const wire = (stores = []) => (Child) => {
    // Set child
    let newChild = Child

    // Connect all wires to fuses by name
    stores.forEach((store) => {
        newChild = connectWire(store, newChild)
    })

    return newChild
}

const createReducer = StateMachine.createReducer

export { wire, useFuse, useActions, useDispatch, useFuseSelection, useSelectors, createReducer }
