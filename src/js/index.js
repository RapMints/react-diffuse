import React, { useLayoutEffect, useMemo, useState } from 'react'
import StateMachine from './StateMachine'

function useActions(store) {
    return StateMachine.store[store.name].getActions()
}

function useDispatch(store) {
    return StateMachine.store[store.name].dispatch
}

function useFuse(store) {
    const [fuse, setFuse] = useState(StateMachine.store[store.name].getState())

    useLayoutEffect(() => {
        const handleReducerChange = (newStore) => {
            setFuse(newStore)
        }

        StateMachine.addFuseListener(store.name, handleReducerChange)

        return () => {
            StateMachine.removeFuseListener(store.name, handleReducerChange)
        }
    }, [])

    return fuse
}

function useSelectors(store) {
    return StateMachine.store[store.name].getSelectors()
}

function useFuseSelector(store, selector) {
    const [fuseSelection, setFuseSelection] = useState(selector(StateMachine.store[store.name].getState()))

    useLayoutEffect(() => {
        const handleReducerChange = (newStore) => {
            const newFuseSelection = selector(newStore)

            if (fuseSelection !== newFuseSelection) {
                setFuseSelection(newFuseSelection)
            }
        }

        StateMachine.addFuseListener(store.name, handleReducerChange)

        return () => {
            StateMachine.removeFuseListener(store.name, handleReducerChange)
        }
    }, [])

    return fuseSelection
}

/**
 * Connects Child to a specified fuse
 * @param {string} fuseName Fuse to reference
 * @param {Component} Child Component to reference
 * @returns Wired component
 */
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
    return useMemo(() => <Child {...fuse} {...props} />, [props, context])
}

/**
 * Wires component to a specified fuses
 * @param {object} properties
 * @param {string} properties.fuseName Fuse to reference
 * @param {Component} properties.component Component to reference
 * @returns Wired component
 */
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

export { wire, useFuse, useActions, useDispatch, useFuseSelector, useSelectors, createReducer }
