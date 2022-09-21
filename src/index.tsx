/************************************************
 * React Diffuse
 * @description Global state management solution
 * @copyright 2022 RAPMINTS, LLC. All rights reserved.
 * @author Kyle Watkins, Paul Scala
 * @example https://codesandbox.io/s/wispy-leaf-iyp9k6
 ************************************************/
import React, { useMemo } from 'react'
import createContext from './createContext'
import { useReducer } from './useReducer'
import useFuseSelector, { useContextSelector } from './useContextSelector'
import SetupDiffuse from 'SetupDiffuse'

// Create diffuse context
const DiffuseContext = createContext()

/**
 * Diffuse ContextSelector
 * @param {function} selector Select from context
 */
function useFuse(fuse) {
    return useFuseSelector(DiffuseContext, fuse)
}

/**
 * Use dispatch hook
 * @param {string} reducerName Name of reducer to get dispatch for. Defaults to null, if null use generic dispatcher
 * @returns {function} Dispatch function
 */
function useDispatch(reducerName = null) {
    if (reducerName === null) {
        return useContextSelector(DiffuseContext, (context) => context.dispatch)
    }
    return useContextSelector(DiffuseContext, (context) => context.dispatch)(reducerName)
}

/**
 * Use actions hook
 * @param {string} reducerName Name of reducer to get actions for. Defaults to null, if null willl return empty actions list
 * @returns {object} List of actions to be ran as functions 
 */
function useActions(reducerName = null) {
    if (reducerName === null) {
        console.warn("Reducer name is null please specify a name")
        return {}
    } 

    const dispatch = useContextSelector(DiffuseContext, (context) => context.dispatch)(reducerName)

    if (dispatch === undefined) {
        console.warn(`Reducer of the name ${reducerName} does not exist`)
        return {}
    }
    
    const actionsDict = [...SetupDiffuse.globalStateMachine.actions[reducerName], ...SetupDiffuse.globalStateMachine.asyncActions[reducerName]]

    const actions  = {}

    actionsDict.map(actionName => {
        actions[actionName] = (payload) => {
            dispatch({type: actionName, payload})
        }
    })

    return actions
}

/**
 * Connects Child to a specified fuse
 * @param {string} fuseName Fuse to reference
 * @param {Component} Child Component to reference
 * @returns Wired component
 */
const connectWire = (fuseName, Child) => (props) => {
    // Get from fuse
    const context = useFuse(fuseName) 
    
    // Get dispatch for fuse
    const dispatch = useDispatch(fuseName)

    const actions = useActions(fuseName)

    // Get fuse
    const fuse = {
        [fuseName]: {
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
const wire = ({ fuseName = [], Child }) => {
    // Set child
    let newChild = Child
    
    // Connect all wires to fuses by name
    fuseName.forEach((name)=> {
        newChild = connectWire(name, newChild)
    })

    return newChild
}

/**
 * Creates a reducer
 * @param {object} props Reducer props
 * @param {object} props.initialState Initial reducer state
 * @param {array} props.actions Key value pair of functions
 */
const createReducer = ({ initialState = {}, actions = [], middleware = { beforeWare: [], afterWare: [] }, asyncActions = null }) => {
    // Reducer
    const reducer = {
        // Initial state dictionary
        initialState: {
            diffuse: {
                loading: false,
                error: false
            },
            ...initialState
        },

        // Actions dictionary
        actionsDict: {
            INITIALIZE_STORE: (state, payload = {}) => {
                return {
                    diffuse: {
                        loading: false,
                        error: false
                    },
                    ...initialState,
                    ...payload
                }
            },
            LOADING: (state) => {
                return {
                    diffuse: {
                        loading: true,
                        error: false
                    }
                }
            },
            SUCCESS: (state, payload) => {
                return {
                    diffuse: {
                        loading: false,
                        error: false
                    },
                    ...payload
                }
            },
            PROGRESS: (state, payload) => {
                return {
                    ...payload
                }
            },
            FAIL: (state, payload) => {
                return {
                    diffuse: {
                        loading: false,
                        error: true
                    },
                    ...payload
                }
            }
        },

        // Async actions dictionary
        asyncActionsDict: {},

        // Middleware
        middleware: middleware,

        // Initialized reducer function
        initialize: (name) => ({
            name: name,
            initialState: { ...reducer.initialState },
            middleware: middleware,
            reducer: reducer.reducer,
            asyncReducer: reducer.asyncReducer,
            actions: reducer.actionsDict,
            asyncActions: reducer.asyncActionsDict
        }),

        /**
         * Performs action on state
         * @param {object} state Current state
         * @param {object} action Action type and payload to perform on state
         * @returns New state
         */
        reducer: (state, action) => {
            // If action exist in dictionary run the action and return the value
            if (action.type in reducer.actionsDict) {
                const res = reducer.actionsDict[action.type](state, action.payload)
                return {
                    ...state,
                    ...res
                }
            }
        },

        /**
         * Performs async action on state
         * @param {object} action Action type and payload to perform on state
         * @param {function} onSuccess On success of running async action
         * @param {function} onFail On fail of running async action
         * @param {function} onProgress In progress of running async action
         * @param {function} onLoading Start loading async action
         * @returns New state based on async action
         */
        asyncReducer: async (action, onSuccess, onFail, onProgress, onLoading) => {
            onLoading()
            return {
                ...(await reducer.asyncActionsDict[action.type](
                    {
                        state: action.store,
                        payload: action.payload
                    },
                    onSuccess,
                    onFail,
                    onProgress
                )),
                type: action.type
            }
        },

        /**
         * Add action to reducer
         * @param {string} actionName Action name
         * @param {function} action Action to perform on reducer
         */
        addAction: (actionName, action) => {
            // Add regular action
            if (action.type === 'action') {
                reducer.actionsDict[actionName] = action.job
            }
            // Add async action
            else if (action.type === 'async') {
                reducer.asyncActionsDict[actionName] = action.job
            }
        },

        /**
         * Remove action from reducer
         * @param {string} actionName Action name to remove from reducer
         */
        removeAction: (actionName) => {
            // Remove action by name
            if (actionName in reducer.actionsDict) {
                delete reducer.actionsDict[actionName]
            }
        },

        /**
         * Get actions from reducer
         * @returns Array of actions
         */
        getActions: () => {
            // Init actions array
            const actions = []

            // For each action push to array
            for (const key in reducer.actionsDict) {
                actions.push(reducer.actionsDict[key])
            }

            // return actions
            return actions
        }
    }

    // Add actions to dictionary
    for (const key in actions) {
        reducer.addAction(key, actions[key])
    }

    return reducer
}

/**
 * Create global state from reducers
 * @param {object[]} reducers Initialized reducers 
 * @returns Store
 */
const createGlobalState = (reducers) => {
    return SetupDiffuse.createGlobalState(reducers)
}

/**
 * Diffuse Provider
 * @param {object} properties Properties for Diffusion
 * @param {object[]} properties.reducers Array of initialized reducers
 * @param {Component} properties.children Main App
 */
const Diffuse = ({ reducers, children }) => {
    // Get globalStateMachine from singleton class
    let globalStateMachine = SetupDiffuse.globalStateMachine

    // If reducers not undefined
    if (reducers !== undefined) {
        // Create store if reducers are passed through props
        globalStateMachine = createGlobalState(reducers)
    }

    if (Object.keys(globalStateMachine).length === 0) {
        console.warn('No reducers specified')
    }
    
    // Use reducer
    const value = useReducer(globalStateMachine)
    // Return diffusion provider
    return <DiffuseContext.Provider value={value}>{children}</DiffuseContext.Provider>
}

export { wire, createReducer, createGlobalState, useFuse, useDispatch, useActions}

export default Diffuse
