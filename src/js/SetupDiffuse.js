/**
 * Diffuse setup class
 */
class setupDiffuseClass {
    constructor() {
        this.globalStateMachine = {
            initialState: {},
            reducer: {},
            asyncReducer: {},
            actions: {},
            asyncActions: {},
            middleware: {}
        }
    }

    /**
     * Create global state
     * @param {object[]} reducers Initialized reducers 
     * @returns Store
     */
    createGlobalState(reducers) {
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

        const globalStateMachine = {
            initialState: initialState,
            reducer: reducer,
            asyncReducer: asyncReducer,
            middleware: middleware,
            actions: actions,
            asyncActions: asyncActions
        }

        this.globalStateMachine = globalStateMachine

        return globalStateMachine
    }
}

// Setup singleton class
export default new setupDiffuseClass()