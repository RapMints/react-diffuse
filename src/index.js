/************************************************
 * React Diffuse
 * @description Global state management solution
 * @copyright 2022 RAPMINTS, LLC. All rights reserved.
 * @author Kyle Watkins, Paul Scala
 * @example https://codesandbox.io/s/wispy-leaf-iyp9k6
 ************************************************/
import React, { useContext, useMemo } from 'react'
import createContext from './createContext'
import { useReducerEnhanced } from './useReducer'
import useContextSelector from './useContextSelector'

// Create diffuse context
const DiffuseContext = createContext()

/**
 * Diffuse ContextSelector
 * @param {function} selector Select from context
 */
function useFuse(selector) {
    return useContextSelector(DiffuseContext, (context) => selector(context.value))
}

function useDispatch(reducerName = null) {
    if (reducerName === null) {
        return useContextSelector(DiffuseContext, (context) => context.setValue)
    }
    return useContextSelector(DiffuseContext, (context) => context.setValue)(reducerName)
}

/**
 * Wires component to a specified fuse
 * @param {object} properties
 * @param {string} properties.fuseName Fuse to reference
 * @param {Component} properties.component Component to reference
 * @returns Wired component
 */
const wire =
    ({ fuseName = [], Child }) =>
    (props) => {
        // Use diffusion context
        const context = useFuse((store) => store)
        const dispatch = useDispatch()
        const fuses = {}
        const memoConstraint = []

        for (let i = 0; i < fuseName.length; i++) {
            fuses[fuseName[i]] = {
                store: context[fuseName[i]],
                dispatch: dispatch(fuseName[i])
            }
            memoConstraint.push(context[fuseName[i]])
        }

        // Set up memoization
        return useMemo(() => <Child {...fuses} {...props} />, [props, ...memoConstraint])
    }

/**
 * Reduce
 * @param {object} reducer Reducer
 * @param {object} initialState Initial state
 * @param {object} actions Actions
 */
const Reduce = ({ reducer, initialState, middleware, asyncReducer = null, actions, asyncActions }) => {
    // Create initial dispatch
    const [state, dispatch] = React.useReducer((state, action) => action.store, initialState)

    // Create enhanced dispatch
    const enhancedDispatch = (newAction) => {
        const res = reducer(newAction.store, newAction)
        if (newAction.store !== res) {
            newAction.store = res
        }

        dispatch(newAction)
        return res
    }

    // Create enhanced async dispatch
    const enhancedAsyncDispatch = async (newAction) => {
        return (await asyncReducer(newAction, onSuccess, onFail, onProgress, onLoading)).store
    }

    // Initialize Default Loading Function
    const onLoading = () => {
        return dispatchWithMiddleWare({ type: 'LOADING' })
    }

    // Initialize Default Success Function
    const onSuccess = (payload) => {
        return dispatchWithMiddleWare({ type: 'SUCCESS', payload })
    }

    // Initialize Default Fail Function
    const onFail = (payload) => {
        return dispatchWithMiddleWare({ type: 'FAIL', payload })
    }

    // Initialize Default Progress functions
    const onProgress = (payload) => {
        return dispatchWithMiddleWare({ type: 'PROGRESS', payload })
    }

    // Dispatch with middleware
    const dispatchWithMiddleWare = async (action) => {
        // Set new action from action passed through dispatch
        let newAction = action

        // If store is not defined in action set it
        if (newAction.store === undefined) {
            newAction.store = state
        }

        // If before ware is available run it
        if (middleware && middleware.beforeWare) {
            middleware.beforeWare.forEach((beforeWare) => {
                beforeWare(newAction)
            })
        }

        // Async actions are available and the current action is async
        if (asyncReducer !== null && Object.keys(asyncActions).includes(newAction.type)) {
            // Get new store from dispatch
            const newStore = await enhancedAsyncDispatch(newAction)

            // Set new action with new store
            newAction = { ...newAction, store: { ...newStore } }
        } else {
            // Get new store from dispatch
            const newStore = { ...enhancedDispatch(newAction) }

            // Set new action with new store
            newAction = { ...newAction, store: { ...newStore } }
        }

        // If afterWare is available run it
        if (middleware && middleware.afterWare) {
            middleware.afterWare.forEach((afterWare) => {
                afterWare(newAction)
            })
        }

        // Return new action
        return newAction
    }

    let actionsDispatch = () => {
        let actionKeys = Object.keys(actions)
        let asyncActionKeys = Object.keys(asyncActions)
        let actionDispatch = {}
        actionKeys.map((a) => {
            actionDispatch[a] = (payload) => dispatchWithMiddleWare({ type: a, payload: payload })
        })

        asyncActionKeys.map((a) => {
            actionDispatch[a] = (payload) => dispatchWithMiddleWare({ type: a, payload: payload })
        })

        return actionDispatch
    }
    // Return state as store and dispatch as dispatch middleware
    const value = {
        /**
         * Current state of reducer
         * @type object
         */
        store: state,
        /**
         * @deprecated Use actions instead
         */
        dispatch: dispatchWithMiddleWare,
        /**
         * Dispatch actions for reducer
         * @type object
         */
        actions: actionsDispatch()
    }

    return value
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

class setupDiffuseClass {
    constructor() {
        this.store = {}
    }

    CombineReducers(reducers) {
        const initialState = {}
        const reducer = {}
        const asyncReducer = {}
        const middleware = {}
        const actions = {}
        const asyncActions = {}
        reducers.map((singleReducer) => {
            initialState[singleReducer.name] = singleReducer.initialState
            reducer[singleReducer.name] = singleReducer.reducer
            asyncReducer[singleReducer.name] = singleReducer.asyncReducer
            middleware[singleReducer.name] = singleReducer.middleware
            actions[singleReducer.name] = Object.keys(singleReducer.actions)
            asyncActions[singleReducer.name] = Object.keys(singleReducer.asyncActions)
        })

        const store = {
            initialState: initialState,
            reducer: reducer,
            asyncReducer: asyncReducer,
            middleware: middleware,
            actions: actions,
            asyncActions: asyncActions
        }

        this.store = store

        return store
    }
}

const SetupDiffuse = new setupDiffuseClass()

/**
 * Diffuse Provider
 * @param {object} properties Properties for Diffusion
 * @param {Component} properties.children Main App
 */
const Diffuse = ({ reducers, children }) => {
  let store = SetupDiffuse.store

  if (reducers !== undefined) {
      store = SetupDiffuse.CombineReducers(reducers)
  }
  const { initialState, reducer, asyncReducer, middleware, actions, asyncActions } = store
  const [value, setValue] = useReducerEnhanced(reducer, initialState, asyncReducer, middleware, actions, asyncActions)

  // Return diffusion provider
  return <DiffuseContext.Provider value={{ value, setValue }}>{children}</DiffuseContext.Provider>
}

export { wire, createReducer, useFuse, useDispatch, SetupDiffuse }

export default Diffuse
