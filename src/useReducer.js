import React, { useCallback, useRef, useState } from 'react'
import logger from '../example/src/StateManagement/middlewares/logger'

function useForceUpdate() {
    const [force, forceUpdate] = useState(null)
    return forceUpdate
}

export default function useReducer(reducer, initState) {
    const forceUpdate = useForceUpdate()
    const state = useRef(initState)
    const getState = useCallback(() => {
        return state
    }, [state])

    const setValue = useCallback(
        (newValue) => {
            const nextState = reducer(state.current, newValue)

            state.current = nextState

            forceUpdate({ ...nextState })
            return nextState
        },
        [getState]
    )

    return [state.current, setValue]
}

/**
 * Merge old state with new state
 * @param {object} oldState Old state
 * @param {object} newState New state
 * @return Merged new state
 */
const merge = (oldState, newState) => {
    const reducerName = Object.keys(newState)[0]
    oldState[reducerName] = newState[reducerName]
    return oldState
}

export function useReducerEnhanced(reducer, initState, asyncReducer, middleware, actions, asyncActions) {
    const forceUpdate = useForceUpdate()
    const state = useRef(initState)
    const getState = useCallback(() => {
        return state
    }, [state])

    const setValue = useCallback(
        (reducerName) => async (action) => {
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
            } 
            // If action is asyncronous
            else if (asyncActions[reducerName].includes(action.type)) {
                nextState = await asyncReducer[reducerName](state.current[reducerName], action)
            } 
            // If action doesn't exist
            else {
                logger.warn('No state change, no update')
                return nextState
            }

            if (middleware?.[reducerName]?.afterWare !== undefined && middleware[reducerName].afterWare.length !== 0) {
                middleware?.[reducerName].afterWare.forEach((afterWare) => {
                    afterWare(newAction)
                })
            }

            state.current[reducerName] = nextState

            forceUpdate({ ...state.current, [reducerName]: nextState })
            
            return nextState
        },
        [getState]
    )

    return [state.current, setValue]
}
