import React, { Component, useMemo } from 'react'
import StateMachine from './StateMachine'
import { Types } from './types.t'

/**
 * Get reducer actions
 * @deprecated (Will be removed on version 3) Use [StoreName].actions
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
 * Get dispatch function for store
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Function}
 */
function useDispatch(fuseBox) {
    return StateMachine.store[fuseBox.name].dispatch
}

/**
 * Get fuse
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof I, any>}
 */
function useFuse(fuseBox) {
    return fuseBox.useState()
}

/**
 * Get fusebox selectors
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof S, any>}
 */
function useSelectors(fuseBox) {
    return StateMachine.store[fuseBox.name].getSelectors()
}

/**
 * Get fuse selection
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors()
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @param {S} selector
 * @returns {Record<keyof S, any>}
 */
function useFuseSelection(fuseBox, selector) {
    return StateMachine.useSelectionHook(fuseBox, selector)
}

/**
 * Connect wire
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @param {React.Component} Child
 * @returns {React.FunctionComponent}
 */
const connectWire = (fuseBox, Child) => (props) => {
    // Get from fuse
    const context = fuseBox.useState()

    // Get dispatch for fuse
    const dispatch = useDispatch(fuseBox)

    const actions = fuseBox.actions

    // Get fuse
    const fuse = {
        [fuseBox.name]: {
            store: context,
            dispatch: dispatch,
            actions: actions
        }
    }

    // Set up memoization
    // @ts-ignore
    return useMemo(() => <Child {...fuse} {...props} />, [props, context])
}

/**
 * Wire class components to fusebox
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>[]} fuseBoxes
 * @returns {(Child: React.Component) => React.FunctionComponent|React.Component}
 */
const wire = (fuseBoxes = []) => (Child) => {
    // Set child
    let newChild = Child

    // Connect all wires to fuses by name
    fuseBoxes.forEach((fuseBox) => {
        // @ts-ignore
        newChild = connectWire(fuseBox, newChild)
    })

    return newChild
}

const createReducer = StateMachine.createReducer

export { wire, useFuse, useActions, useDispatch, useFuseSelection, useSelectors, createReducer }
