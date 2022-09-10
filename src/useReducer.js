import React, { useCallback, useRef, useState } from 'react'

function useForceUpdate() {
    const [force, forceUpdate] = useState(null)
    force
    return forceUpdate
}

export function useReducer({reducer = null, asyncReducer = {}, initialState = {}, middleware = {}, actions = [], asyncActions = []}) {
    if (reducer === null) {
        console.warn('No reducer, use Reducer returned no state or dispatch')
        return []
    }

    const forceUpdate = useForceUpdate()
    const state = useRef(initialState)
    const getState = useCallback(() => {
        return state
    }, [state])

    const onLoading = (reducerName) => () => {
        return setValue(reducerName)({ type: 'LOADING' })
    }

    const onSuccess = (reducerName) => (payload) => {
        return setValue(reducerName)({ type: 'SUCCESS', payload })
    }

    const onFail = (reducerName) => (payload) => {
        return setValue(reducerName)({ type: 'FAIL', payload })
    }

    const onProgress = (reducerName) => (payload) => {
        return setValue(reducerName)({ type: 'PROGRESS', payload })
        // forceUpdate({ ...state.current, [reducerName]: nextState })
    }

    const setValue = useCallback(
        (reducerName) => async (action) => {
            let noAction = false

            // Initialize next state
            let nextState = state.current[reducerName]
            let newAction = action
            
            // If store is not defined in action set it
            if (newAction.store === undefined) {
                newAction.store = nextState
            }

            // Run before ware
            if (middleware?.[reducerName]?.beforeWare !== undefined && middleware[reducerName].beforeWare.length !== 0) {
                middleware?.[reducerName].beforeWare.forEach((beforeWare) => {
                    beforeWare(newAction)
                })
            }

            // If action is a regular function
            if (actions[reducerName].includes(action.type)) {
                nextState = reducer[reducerName](state.current[reducerName], action)
                newAction.store = nextState
            } 
            // If action is asyncronous
            else if (asyncActions[reducerName].includes(action.type)) {
                nextState = await asyncReducer[reducerName](newAction, onSuccess(reducerName), onFail(reducerName), onProgress(reducerName), onLoading(reducerName))
                newAction.store = nextState
            } 
            // If action doesn't exist
            else {
                noAction = true
                logger.warn('No state change, no update')
            }

            if (middleware?.[reducerName]?.afterWare !== undefined && middleware[reducerName].afterWare.length !== 0) {
                middleware?.[reducerName].afterWare.forEach((afterWare) => {
                    afterWare(newAction)
                })
            }

            state.current[reducerName] = nextState

            // Trigger only if an action was performed
            if (noAction === false) {
                forceUpdate({ ...state.current, [reducerName]: nextState })
            }

            return nextState
        },
        [getState]
    )

    return [state.current, setValue]
}
