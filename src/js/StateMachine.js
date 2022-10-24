const useDiffuseAsync = true

class StateMachine {
    constructor() {
        this.state = {}
        this.actions = {}
        this.middleWare = {}
        this.listener = {}
        this.initialState = {}
        this.store = {}
        this.storeDict = []
        this.selectors = {}
        this.history = []
    }

    createReducer = ({ initialState = {}, actions = {}, selectors = {}, middleWare = {} }) => {
        const that = this
        return {
            createStore: (storeName) => {
                const initState = {
                    ...(useDiffuseAsync === true && {diffuse: {
                        loading: false,
                        error: false
                    },}),
                    ...initialState
                }

                // Set store initial state
                that.initialState[storeName] = {
                    ...initState
                }

                // Initialize store
                that.state[storeName] = {
                    ...initState
                }

                that.actions[storeName] = {}

                // Set store actions
                let newActions = {
                    ...(useDiffuseAsync === true && {INITIALIZE_STORE: (state, payload = {}) => {
                        return {
                            diffuse: {
                                loading: false,
                                error: false
                            },
                            ...initialState,
                            ...payload
                        }
                    },
                    LOADING: ({state}) => {
                        return {
                            diffuse: {
                                loading: true,
                                error: false
                            }
                        }
                    },
                    SUCCESS: ({state, payload}) => {
                        return {
                            diffuse: {
                                loading: false,
                                error: false
                            },
                            ...payload
                        }
                    },
                    PROGRESS: ({state, payload}) => {
                        return {
                            ...payload
                        }
                    },
                    FAIL: ({state, payload}) => {
                        return {
                            diffuse: {
                                loading: false,
                                error: true
                            },
                            ...payload
                        }
                    },}),
                    ...actions
                }

                that.history[storeName] = {
                    undo: [],
                    redo: []
                }

                // Add store to dictionary
                that.storeDict[storeName] = true

                // Create listener for store
                that.listener[storeName] = []

                // Add middleware for store
                that.middleWare[storeName] = {
                    beforeWare: [],
                    afterWare: []
                }

                // Create store object
                const store = {
                    name: storeName,
                    getHistory: () => {
                        return that.history[storeName]
                    },
                    getState: () => {
                        return that.state?.[storeName]
                    },
                    getInitialState: () => {
                        return that.initialState?.[storeName]
                    },
                    dispatch: ({ type, payload } = {}) => {
                        if (that.actions[storeName][type] === undefined) {
                            console.warn("Action doesn't exist.")
                            return
                        }

                        that.dispatch(storeName)({
                            type: type,
                            payload: payload ?? undefined
                        })
                    },
                    getAction: (actionName) => {
                        return (payload) => store.dispatch({ type: actionName, payload })
                    },
                    getActions: () => {
                        return Object.keys(that.actions?.[storeName]).reduce((prev, actionName) => {
                            prev[actionName] = store.getAction(actionName)
                            return prev
                        }, {})
                    },
                    addAction: (actionName, action) => {
                        that.actions[storeName][actionName] = {function: action}
                    },
                    removeAction: (actionName) => {
                        delete this?.actions?.[storeName][actionName]
                    },
                    addMiddleWare: ({afterWare = null, beforeWare = null} = {}) => {
                        if (afterWare !== null) {
                            that.middleWare?.[storeName].afterWare.push(afterWare)
                        }
                        else if (beforeWare !== null) {
                            that.middleWare?.[storeName].beforeWare.push(beforeWare)
                        }
                    },
                    getSelector: (selectorName) => {
                        return that.selectors[storeName][selectorName]
                    },
                    createSelector: function createSelector(selectorName, ...args) {
                        let lastSelector = args.pop()
                        if (args.length === 0) {
                            that.selectors[storeName][selectorName] = lastSelector
                        } else {
                            that.selectors[storeName][selectorName] = (state) => {
                                const stateSelections = args.map((arg) => {
                                    return arg(state)
                                })

                                return lastSelector(...stateSelections)
                            }
                        }
                    },
                    getMiddleWare: () => {
                        return that.middleWare[storeName]
                    },
                    undo: () => {
                        const history = store.getHistory()

                        if (history.undo.length > 0) {
                            let lastState = history.undo.pop()
                            let currentState = store.getState()
                            history.redo.push(currentState)
                            that.dispatchReducerListeners(storeName, lastState, true)
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
                            that.dispatchReducerListeners(storeName, nextState, true)
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
                if (middleWare?.beforeWare) {
                    for (const index in middleWare.beforeWare) {
                        store.addMiddleWare({beforeWare: middleWare.beforeWare[index]})
                    }
                }

                // Add afterware
                if (middleWare?.afterWare) {
                    for (const index in middleWare.afterWare) {
                        store.addMiddleWare({afterWare: middleWare.afterWare[index]})
                    }
                }

                // Add selectors
                for (const selectorName in selectors) {
                    store.createSelector(selectorName, ...selectors[selectorName])
                }

                // Add store object to stores
                that.store[storeName] = store

                return {
                    name: storeName
                }
            }
        }
    }

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

    getCurrentState(storeName) {
        return this.state[storeName]
    }

    getAction(storeName, actionName) {
        return this.actions?.[storeName]?.[actionName] ?? null
    }

    async getFromMiddleWare(storeName) {
        return (middleWare, { type = '', payload = null }) => {
            let middleWareSelection = middleWare(storeName)
            let executeMiddleWare = middleWareSelection(this.getCurrentState(storeName))
            let isAsync = executeMiddleWare.constructor.name === 'AsyncFunction'

            if (isAsync === true) {
                return async () => await executeMiddleWare({ type, payload })
            } else {
                return () => executeMiddleWare({ type, payload })
            }
        }
    }

    async runAction(storeName, action, payload) {
        // Initialize results
        let result
        let store = this.store[storeName]
        let actions = store.getActions()

        // If action is a function
        if (action instanceof Function) {
            // Get result of action
            result = action({
                state: this.getCurrentState(storeName),
                payload: payload
            }, actions)

            if (isPromise(result)) {
                result = await result
            }
        }

        return result
    }

    async runAsyncAction(storeName, action, payload) {
        // Initialize results
        let result
        let store = this.store[storeName]
        let actions = store.getActions()
        // If action is a function
        if (action instanceof Function) {
            // Await result of action
            result = await action(
                {
                    state: this.getCurrentState(storeName),
                    payload: payload
                },
                actions
            )
        }

        return result
    }

    dispatch = (storeName) => async ({ type = '', payload = null }) => {
            let action = (this.getAction(storeName, type)).function

            if (action === null) {
                console.error('Action or reducer doesnt exist')
                return
            }

            // Get middleWare
            const beforeWare = this.middleWare?.[storeName]?.beforeWare ?? []
            const afterWare = this.middleWare?.[storeName]?.afterWare ?? []
            const runMiddleWare = await this.getFromMiddleWare(storeName)

            // Dispatch before ware
            if (beforeWare.length !== 0) {
                for (let i = 0; i < beforeWare.length; i++) {
                    const middleWareIsAsync = isAsync(beforeWare[i])
                    let result
                    const executeMiddleWare = runMiddleWare(beforeWare[i], {
                        type,
                        payload
                    })

                    if (middleWareIsAsync) {
                        result = await executeMiddleWare()
                    } else {
                        result = executeMiddleWare()
                    }

                    this.dispatchReducerListeners(storeName, result)
                }
            }

            // Dispatch action
            let result = await this.runAction(storeName, action, payload)
            this.dispatchReducerListeners(storeName, result)

            // Dispatch after ware
            if (afterWare.length !== 0) {
                for (let i = 0; i < afterWare.length; i++) {
                    const middleWareIsAsync = isAsync(afterWare[i])
                    let result
                    const executeMiddleWare = runMiddleWare(afterWare[i], {
                        type,
                        payload
                    })

                    if (middleWareIsAsync) {
                        result = await executeMiddleWare()
                    } else {
                        result = executeMiddleWare()
                    }

                    this.dispatchReducerListeners(storeName, result)
                }
            }

            return this.state[storeName]
        }
}

function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
  
    return false;
}

function isAsyncAction(func, actions) {
    try {
        return func.constructor.name === 'AsyncFunction' || isPromise(func({}, actions))
    }
    catch(e) {
        return false
    }
}

function isAsync(func) {
    try {
        return func.constructor.name === 'AsyncFunction' || isPromise(func({}, {}))
    }
    catch(e) {
        return false
    }
}
export default new StateMachine()
