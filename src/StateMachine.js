import React, { useLayoutEffect, useState } from 'react'
// @ts-ignore
import { Types } from './types.t'

/**
 * @typedef {string} StoreNameType
 */

class StateMachine {
    constructor() {
        this.state = {}
        this.actions = {}
        this.middleWare = {}
        this.listener = {}
        this.initialState = {}
        this.store = {}
        // @ts-ignore
        this.storeDict = []
        this.selectors = {}
        this.selections = {}
        this.history = {}
        this.props = {}
    }

    /**
     * @name TEST#store
     * @type {Object<string, function>}
     */

    /**
     * @template {import('./types.t').ActionsType} ActionT
     * @template {import('./types.t').SelectorsType} SelectorsT
     * @template {import('./types.t').InitialStateType} InitialStateT
     * @template {import('./types.t').MiddleWareType<keyof ActionT>} MiddleWareT
     * Creates reducer
     * @param {object} reducerProps Reducer properties
     * @param {InitialStateT} reducerProps.initialState Reducer initial state
     * @param {ActionT} reducerProps.actions Reducer actions
     * @param {MiddleWareT=} reducerProps.middleWare Reducer middleWare
     * @param {SelectorsT=} reducerProps.selectors Reducer selectors
     */
    createReducer = ({ initialState, actions, selectors, middleWare}) => {
        const that = this

        const defaultOptions = {
            useDiffuseAsync: true,
            useDiffuseInitializeState: true,
            useDiffuseWebsocket: true,
            plugins: []
        }

        const config = {
            ...defaultOptions,
        }

        /**
        * @template {import('./types.t').FuseBoxNameType} NameT
        * Create fuse box (Formally named createStore)
        * @param {NameT} fuseBoxName Fuse box name
        * @param {object|null} props Fuse box props 
        */
        const create = (fuseBoxName, props = null) => {
            const diffuseState = {
                diffuse: {
                    ...(config.useDiffuseAsync === true && {
                        loading: false,
                        error: false
                    }),
                    ...(config.useDiffuseWebsocket === true && {
                        connectionStatus: 'DISCONNECTED'
                    })
                }
            }

            const initState = {
                ...(Object.keys(diffuseState.diffuse).length !== 0 && {...diffuseState}),
                ...initialState
            }

            // Set store initial state
            // @ts-ignore
            that.initialState[fuseBoxName] = {
                ...initState
            }

            // Initialize store
            // @ts-ignore
            that.state[fuseBoxName] = {
                ...initState
            }

            // @ts-ignore
            that.selectors[fuseBoxName] = {}
            // @ts-ignore
            that.selections[fuseBoxName] = {}
            // @ts-ignore
            that.actions[fuseBoxName] = {}

            // @ts-ignore
            that.props[fuseBoxName] = props

            // Set store actions
            /**
                * @type {import('./types.t').ActionsType}
                */
            let newActions = {
                ...(config.useDiffuseInitializeState === true && {INITIALIZE_STATE: ({state, payload = {}}) => {
                    return {
                        ...initState,
                        ...payload
                    }
                }}),
                ...(config.useDiffuseAsync === true && {
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */  
                    LOADING: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                loading: true,
                                error: false
                            },
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    SUCCESS: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                loading: false,
                                error: false
                            },
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    PROGRESS: ({state, payload}) => {
                        return {
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    FAIL: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                loading: false,
                                error: true
                            },
                            ...payload
                        }
                    },
                }),
                ...(config.useDiffuseWebsocket === true && {
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    MESSAGE_RECIEVED: ({state, payload}) => {
                        return {
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    EMIT: ({state, payload}) => {
                        return {
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    CONNECT: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                connectionStatus: 'CONNECTED'
                            },
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    DISCONNECT: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                connectionStatus: 'DISCONNECTED'
                            },
                            ...payload
                        }
                    },
                    /**
                        * 
                        * @param {import('./types.t').ActionPropsType} params
                        * @returns {object}
                        */ 
                    CONNECT_ERROR: ({state, payload}) => {
                        return {
                            diffuse: {
                                ...state.diffuse,
                                connectionStatus: 'FAILED'
                            },
                            ...payload
                        }
                    }
                }),
                ...actions
            }

            // @ts-ignore
            that.history[fuseBoxName] = {
                undo: [],
                redo: []
            }

            // Add store to dictionary
            // @ts-ignore
            that.storeDict[fuseBoxName] = true

            // Create listener for store
            // @ts-ignore
            that.listener[fuseBoxName] = []

            // Add middleware for store
            // @ts-ignore
            that.middleWare[fuseBoxName] = {
                beforeWare: [],
                afterWare: []
            }
            
            // Create store object
            const store = {
                name: fuseBoxName,
                getHistory: () => {
                    // @ts-ignore
                    return that.history[fuseBoxName]
                },
                /**
                    * Get state from state machine
                    * @returns {import('./types.t').FuseStateType}
                    */
                getState: () => {
                    // @ts-ignore
                    return that.state?.[fuseBoxName]
                },
                /**
                    * 
                    * @returns {import('./types.t').FuseStateType}
                    */
                getInitialState: () => {
                    // @ts-ignore
                    return that.initialState?.[fuseBoxName]
                },
                // @ts-ignore
                dispatch: ({ type, payload, callback } = {}) => {
                    // @ts-ignore
                    if (that.actions[fuseBoxName][type] === undefined) {
                        console.warn("Action doesn't exist.")
                        return
                    }

                    that.dispatch(fuseBoxName)({
                        type: type,
                        payload: payload ?? undefined,
                        callback: callback
                    })
                },
                /**
                    * Get a fuse action
                    * @param {keyof ActionT} actionName
                    * @returns {import('./types.t').ActionType} 
                    */
                getAction: (actionName) => {
                    /**
                        * @type {import('./types.t').ActionType}
                        * @param {object|undefined} payload Payload
                        */
                    let action = (payload, callback) => store.dispatch({ type: actionName, payload, callback })
                    return action
                },
                /**
                    * Get all fuse actions
                    * @returns {Record<keyof ActionT, import('./types.t').ActionType>}
                    */
                getActions: () => {
                    /**
                        * @type {Record<keyof ActionT, import('./types.t').ActionType>}
                        */
                    // @ts-ignore
                    let actions = {}
                        
                    /**
                        * @param {Record<keyof ActionT, import('./types.t').ActionType>} prev
                        * @param {keyof ActionT} actionName
                        */
                    let reduceFunction = (prev, actionName) => {
                        /**
                            * @type {Record<keyof ActionT, import('./types.t').ActionType>}
                            *
                            */
                        prev[actionName] = store.getAction(actionName)
                        return prev
                    }
                    
                    /**
                        * @type {Record<keyof ActionT, import('./types.t').ActionType>}
                        */
                    // @ts-ignore
                    actions = Object.keys(that.actions?.[fuseBoxName]).reduce(reduceFunction, actions)

                    return actions
                },
                // @ts-ignore
                addAction: (actionName, action) => {
                    // @ts-ignore
                    that.actions[fuseBoxName][actionName] = {function: action}
                },
                // @ts-ignore
                removeAction: (actionName) => {
                    // @ts-ignore
                    delete that?.actions?.[fuseBoxName][actionName]
                },
                addMiddleWare: ({afterWare = null, beforeWare = null} = {}) => {
                    if (afterWare !== null) {
                        // @ts-ignore
                        that.middleWare?.[fuseBoxName].afterWare.push(afterWare)
                    }
                    else if (beforeWare !== null) {
                        // @ts-ignore
                        that.middleWare?.[fuseBoxName].beforeWare.push(beforeWare)
                    }
                },
                /**
                    * Get selector function
                    * @param {keyof SelectorsT} selectorName 
                    * @returns {Function[]}
                    */
                getSelector: (selectorName) => {
                    // @ts-ignore
                    return that.selectors[fuseBoxName][selectorName]
                },
                /**
                    * Get selector function
                    * @param {keyof SelectorsT} selectorName 
                    * @returns {Function[]}
                    */
                getSelection: (selectorName) => {
                    // @ts-ignore
                    return that.selections[fuseBoxName][selectorName]
                },
                /**
                    * Get selector function 
                    * @returns {Record<keyof SelectorsT, import('./types.t').useSelectionsType>}
                    */
                getSelections: () => {
                    // @ts-ignore
                    return that.selections[fuseBoxName]
                },
                /**
                    * Get selector function
                    * @returns {Record<keyof SelectorsT, import('./types.t').useSelectionsType>}
                    */
                getSelectors: () => {
                    // @ts-ignore
                    return that.selectors[fuseBoxName]
                },
                // @ts-ignore
                createSelector: function createSelector(selectorName, ...args) {
                    // @ts-ignore
                    that.selectors[fuseBoxName][selectorName] = args
                    // @ts-ignore
                    that.selections[fuseBoxName][selectorName] = () => that.useSelectionHook(store, args)
                },
                getMiddleWare: () => {
                    // @ts-ignore
                    return that.middleWare[fuseBoxName]
                },
                undo: () => {
                    const history = store.getHistory()

                    if (history.undo.length > 0) {
                        let lastState = history.undo.pop()
                        let currentState = store.getState()
                        history.redo.push(currentState)
                        that.dispatchReducerListeners(fuseBoxName, lastState, true)
                    } else {
                        console.log('Nothing to undo')
                    }
                },
                redo: () => {
                    const history = store.getHistory()

                    if (history.redo.length > 0) {
                        let nextState = history.redo.pop()
                        let currentState = store.getState()
                        history.undo.push(currentState)
                        that.dispatchReducerListeners(fuseBoxName, nextState, true)
                    } else {
                        console.log('Nothing to redo')
                    }
                }
            }

            // Add actions
            for (const actionName in newActions) {
                store.addAction(actionName, newActions[actionName])
            }

            // Add before ware 
            //@ts-ignore
            if (middleWare?.beforeWare) {
                // @ts-ignore
                for (const index in middleWare.beforeWare) {
                    // @ts-ignore
                    store.addMiddleWare({beforeWare: middleWare.beforeWare[index]})
                }
            }

            // Add afterware
            // @ts-ignore
            if (middleWare?.afterWare) {
                // @ts-ignore
                for (const index in middleWare.afterWare) {
                    // @ts-ignore
                    store.addMiddleWare({afterWare: middleWare.afterWare[index]})
                }
            }

            // Add selectors
            for (const selectorName in selectors) {
                store.createSelector(selectorName, ...selectors[selectorName])
            }

            // Add store object to stores
            // @ts-ignore
            that.store[fuseBoxName] = store
            
            /**
                * @type {import('./types.t').FuseBoxType<NameT, ActionT, SelectorsT, InitialStateT>}
                */
            let fuseBox = {
                name: fuseBoxName,
                actions: store.getActions(),
                useState: () => {
                    const [fuse, setFuse] = useState(store.getState())
                
                    useLayoutEffect(() => {
                        /**
                            * 
                            * @param {object} newStore 
                            */
                        const handleReducerChange = (newStore) => {
                            setFuse(newStore)
                        }
                
                        this.addFuseListener(store.name, handleReducerChange)
                
                        return () => {
                            this.removeFuseListener(store.name, handleReducerChange)
                        }
                    }, [])
                    
                    /**
                        * @type {InitialStateT & import('./types.t').DiffuseStateType}
                        */
                    // @ts-ignore
                    const state = fuse
                    return state
                },
                selectors: store.getSelections(),
            }
            
            return fuseBox
        }
        
        const reducer = {
            createFuseBox: create,
            /**
             * @deprecated Use createFuseBox
             */
            createStore: create
        }

        return reducer
    }

    // @ts-ignore
    mergeSelectors(selector, currentState) {
        let stateSelections, value
        
        if (selector.length === 0) {
            throw 'DiffuseError: No selectors specified'
        }
    
        if (selector.length === 1) {
            value = selector[0](currentState)
        }
        else {
            const selectors = [...selector]
            let lastSelector = selectors.pop()
            
            stateSelections = selectors.map((arg) => {
                return arg(currentState)
            })
    
            value = lastSelector
        }
    
        return {
            value,
            ...(stateSelections && {stateSelections: stateSelections})
        }
    }

    // @ts-ignore
    useSelectionHook = (store,selector) => {
        let selection = this.mergeSelectors(selector, store.getState())
        const [fuseSelection, setFuseSelection] = useState(selection)
    
        useLayoutEffect(() => {
            // @ts-ignore
            const handleReducerChange = (newStore) => {
                const newFuseSelection = this.mergeSelectors(selector, newStore)
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
    
            this.addFuseListener(store.name, handleReducerChange)
    
            return () => {
                this.removeFuseListener(store.name, handleReducerChange)
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
    addFuseListener(storeName, func) {
        // If storeName exist in dictionary
        if (this.storeDict[storeName]) {
            // If listeners for storeName were not yet defined
            if (this.listener[storeName] === undefined) {
                // Define listeners for storeName
                this.listener[storeName] = []
            }

            // Push function to listener
            this.listener[storeName].push(func)
        } else {
            console.warn("Reducer doesn't exist")
        }
    }

    // @ts-ignore
    removeFuseListener(storeName, func) {
        // If storeName exist in dictionary
        if (this.storeDict.includes(storeName)) {
            // Get listeners for reducer
            const reducerListener = this.listener?.[storeName]

            // If reducer listener is not undefined
            if (reducerListener !== undefined) {
                // Get index of function to remove from reducer listener
                const indexToRemove = reducerListener.indexOf(func)

                // Remove listening function from reducer listener
                this.listener[storeName].splice(indexToRemove, indexToRemove + 1)
            } else {
                // Reducer does not exist
                console.warn("Reducer doesn't exist")
            }
        } else {
            // Reducer does not exist
            console.warn("Reducer doesn't exist")
        }
    }

    // @ts-ignore
    dispatchReducerListeners(storeName, result, dontSaveToHistory = false) {
        // If there is a result to push
        if (result !== undefined) {
            if (dontSaveToHistory === false) {
                if (this.history[storeName].redo.length !== 0) {
                    this.history[storeName].redo = []
                }
            }
            const undoCount = this.history[storeName]?.undo.length
            const currentState = this.getCurrentState(storeName)
            if (dontSaveToHistory === false) {
                if ((undoCount !== 0 && this.history[storeName]?.undo[undoCount - 1] !== currentState) || undoCount === 0) {
                    this.history[storeName].undo.push(this.getCurrentState(storeName))
                }
            }

            // Set State
            this.state[storeName] = {
                ...this.getCurrentState(storeName),
                ...result
            }

            // If storeName exist in listeners
            if (this.listener[storeName] !== undefined) {
                // For each function listening
                for (let i = 0; i < this.listener[storeName].length; i++) {
                    // Dispatch listening functions
                    this.listener[storeName][i](this.state[storeName])
                }
            }
        }
    }

    // @ts-ignore
    getCurrentState(storeName) {
        return this.state[storeName]
    }

    // @ts-ignore
    getAction(storeName, actionName) {
        return this.actions?.[storeName]?.[actionName] ?? null
    }

    // @ts-ignore
    getFromMiddleWare(storeName) {
        // @ts-ignore
        return (middleWare, { type = '', payload = null }) => {
            let result = middleWare(storeName, this.getCurrentState(storeName), {type, payload})

            return result
        }
    }

    // @ts-ignore
    async runAction(storeName, action, payload, callback = () => (undefined)) {
        // Initialize results
        let result
        
        // Create stores object
        const stores = Object.keys(this.store).reduce((previous, current) => {
            previous[this.store[current].name] = {
                state: this.store[current].getState(),
                actions: this.store[current].getActions()
            }

            return previous
        }, {})

        // Get store
        const store = stores[storeName]
        
        // Get store actions
        const actions = store.actions

        // If action is a function
        if (action instanceof Function) {
            // Get result of action
            result = action({
                state: this.getCurrentState(storeName),
                payload: payload,
                callback: callback,
                ...(this.props[storeName] !== null && {props: this.props[storeName]})
            }, actions, stores)

            // If is async
            if (isPromise(result)) {
                result = await result
            }
        }

        return result
    }

    // @ts-ignore
    dispatch = (storeName) => async ({ type = '', payload = null, callback }) => {
            let action = (this.getAction(storeName, type)).function

            if (action === null) {
                console.error('Action or reducer doesnt exist')
                return
            }

            // Get middleWare
            const beforeWare = this.middleWare?.[storeName]?.beforeWare ?? []
            const afterWare = this.middleWare?.[storeName]?.afterWare ?? []
            let runMiddleWare = this.getFromMiddleWare(storeName)
            
            if (isPromise(runMiddleWare)) {
                // @ts-ignore
                runMiddleWare = await runMiddleWare
            }

            // Dispatch before ware
            if (beforeWare.length !== 0) {
                for (let i = 0; i < beforeWare.length; i++) {
                    const middleWareIsAsync = isAsync(beforeWare[i])
                    let result
                    // @ts-ignore
                    let executeMiddleWare = runMiddleWare(beforeWare[i], {
                        type,
                        payload
                    })

                    // @ts-ignore
                    result = executeMiddleWare()

                    if (isPromise(result) === true) {
                        result = await result
                    }

                    this.dispatchReducerListeners(storeName, result)
                }
            }

            // Dispatch action
            let result = await this.runAction(storeName, action, payload, callback)
            this.dispatchReducerListeners(storeName, result)

            // Dispatch after ware
            if (afterWare.length !== 0) {
                for (let i = 0; i < afterWare.length; i++) {
                    let result
                    // @ts-ignore
                    let executeMiddleWare = runMiddleWare(afterWare[i], {
                        type,
                        payload
                    })

                    // @ts-ignore
                    result = executeMiddleWare()

                    if (isPromise(result) === true) {
                        result = await result
                    }

                    this.dispatchReducerListeners(storeName, result)
                }
            }

            return this.state[storeName]
        }
}

// @ts-ignore
function isPromise(p) {
    // @ts-ignore
    if (Boolean(p && typeof p.then === 'function')) {
      return true;
    }
  
    return false;
}

// @ts-ignore
function isAsync(func) {
    try {
        return func.constructor.name === 'AsyncFunction' || isPromise(func({}, {}))
    }
    catch(e) {
        return false
    }
}

export default new StateMachine()
