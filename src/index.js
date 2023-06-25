import React, { Component, Suspense, useMemo } from 'react'
import StateMachine from './StateMachine'
// @ts-ignore
import { Types } from './types.t'

/**
 * Get reducer actions
 * @deprecated (Will be removed on version 3) Use [StoreName].actions
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof A, import('./types.t').ActionType>}
 */
function useActions(fuseBox) {
    return fuseBox.actions
}

/**
 * Get dispatch function for store
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Function}
 */
function useDispatch(fuseBox) {
    // @ts-ignore
    return StateMachine.store[fuseBox.name].dispatch
}

/**
 * Get fuse
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof I, any>}
 */
function useFuse(fuseBox) {
    return fuseBox.useState()
}

/**
 * Get fusebox selectors
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof S, any>}
 */
function useSelectors(fuseBox) {
    // @ts-ignore
    return StateMachine.store[fuseBox.name].getSelectors()
}

/**
 * Get fuse selection
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @param {S} selector
 * @returns {Record<keyof S, any>}
 */
function useFuseSelection(fuseBox, selector) {
    return StateMachine.useSelectionHook(fuseBox, selector)
}

/**
 * Connect wire
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @param {React.Component} Child
 * @returns {React.FunctionComponent<Record<N, import('./types.t').FuseBoxType<N,A,S,I>&any>>}
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
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>[]} fuseBoxes
 * @returns {(Child: React.Component) => React.FunctionComponent<Record<N, import('./types.t').FuseBoxType<N,A,S,I>&any>>|React.Component<Record<N, import('./types.t').FuseBoxType<N,A,S,I>&any>>}
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

/**
 * @class DiffuseBoundary
 * @description Handle async suspension and errors from fetchState functions
 * @extends {React.Component<import('./types.t').ErrorBoundaryPropsType>}
 */
class DiffuseBoundary extends React.Component {
    // @ts-ignore
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }
  
    // @ts-ignore
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error};
    }
  
    // @ts-ignore
    componentDidCatch(error, errorInfo) {
        // If error is not from diffuse throw error up
        if (error?.currentState?.diffuse?.error === undefined) {
            throw error
        }
        // If is a diffuse error
        else {
            if (this.props.onCatchError !== undefined) {
                // @ts-ignore
                this.props.onCatchError(error, errorInfo)
            }
        }
    }

    /**
     * 
     * @param {object} props
     * @param {any} props.error 
     * @returns 
     */
    ErrorFallbackWrapper = ({error}) => {
        if (error.store === undefined) {
            throw error
        }

        const fuse = error?.store()
        if (fuse.diffuse.error === false) {
            this.setState({hasError: false, error: undefined});
        }

        return (
            // @ts-ignore
            <this.props.ErrorFallbackComponent state={error?.currentState} />
        )
    }
  
    render() {
        if (this.state.hasError && this.state.error) {
            return (
                // @ts-ignore
                <this.ErrorFallbackWrapper error={this.state.error} />
            )
        }
  
        return (
            <Suspense fallback={this.props.SuspenseFallback}> 
                {this.props.children};
            </Suspense> 
        )
    }
}

const createReducer = StateMachine.createReducer

export { wire, useFuse, useActions, useDispatch, useFuseSelection, useSelectors, createReducer, DiffuseBoundary }