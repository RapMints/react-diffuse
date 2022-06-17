/************************************************
 * React Diffuse
 * @description Global state management solution
 * @copyright 2022 RAPMINTS, LLC. All rights reserved.
 * @author Kyle Watkins, Paul Scala
 * @example https://codesandbox.io/s/wispy-leaf-iyp9k6
 ************************************************/
import React, { useContext, useMemo } from 'react'

// Create diffuse context
const DiffuseContext = React.createContext()

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
    const context = useContext(DiffuseContext)
    const fuses = {}
    const memoConstraint = []
    for (let i = 0; i < fuseName.length; i++) {
      fuses[fuseName[i]] = context[fuseName[i]]
      memoConstraint.push(context[fuseName[i]].store)
    }

    // Set up memoization
    return useMemo(
      () => <Child {...fuses} {...props} />,
      [props, ...memoConstraint]
    )
  }

/**
 * Reduce
 * @param {object} reducer Reducer
 * @param {object} initialState Initial state
 * @param {object} actions Actions
 */
const Reduce = ({
  reducer,
  initialState,
  middleware,
  asyncReducer = null,
  actions,
  asyncActions
}) => {
  // Create initial dispatch
  const [state, dispatch] = React.useReducer(
    (state, action) => action.store,
    initialState
  )

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
    return (
      await asyncReducer(newAction, onSuccess, onFail, onProgress, onLoading)
    ).store
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
    if (
      asyncReducer !== null &&
      Object.keys(asyncActions).includes(newAction.type)
    ) {
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

  // Return state as store and dispatch as dispatch middleware
  const value = {
    store: state,
    dispatch: dispatchWithMiddleWare
  }

  return value
}

/**
 *
 * @param {object[]} values
 */
const MergeReducers = (globalState = []) => {
  // Reduce each state into reducers
  const reducers = globalState.map((state) => {
    return {
      [state.name]: () =>{
        const reducer = Reduce({
          reducer: state.reducer,
          initialState: state.initialState,
          middleware: state.middleware,
          asyncReducer: state.asyncReducer,
          actions: state.actions,
          asyncActions: state.asyncActions
        })
        return reducer
      }
    }
  })

  // Initialize merged reducers
  const mergedReducers = []

  // Merge reducers into an array
  reducers.map((r) => {
    Object.keys(r).map((key) => {
      mergedReducers.push(r[key])
    })
  })

  return reducers
}

/**
 * Creates a reducer
 * @param {object} initialState Initial reducer state
 * @param {object} actions Key value pair of functions
 */
const createReducer = ({
  initialState = {},
  actions = [],
  middleware = { beforeWare: [], afterWare: [] },
  asyncActions = null
}) => {
  // Reducer
  const reducer = {
    initialState: {
      diffuse: {
        loading: false,
        error: false
      },
      ...initialState
    },
    actionsDict: {
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
    asyncActionsDict: {},
    middleware: middleware,
    // Initialized reducer function
    initialize: (name) => ({
      name: name,
      initialState: { ...reducer.initialState },
      reducer: reducer.reducer,
      middleware: middleware,
      asyncReducer: reducer.asyncReducer,
      actions: reducer.actionsDict,
      asyncActions: reducer.asyncActionsDict
    }),
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
    asyncReducer: async (action, onSuccess, onFail, onProgress, onLoading) => {
      onLoading()
      return {
        ...(await reducer.asyncActionsDict[action.type](
          action.store,
          onSuccess,
          onFail,
          onProgress
        )),
        type: action.type
      }
    },
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
    removeAction: (actionName) => {
      // Remove action by name
      if (actionName in reducer.actionsDict) {
        delete reducer.actionsDict[actionName]
      }
    },
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
 * Diffuse Provider
 * @param {object} properties Properties for Diffusion
 * @param {Component} properties.children Main App
 */
const Diffuse = ({ reducers, children }) => {
  // Merge reducers from global state
  const mergedReducers = MergeReducers(reducers)

  // Init Fuse
  const values = {}

  

  // Initialize fuses
  for (let i = 0; i < mergedReducers.length; i++) {
    let keys = Object.keys(mergedReducers[i])[0]
    values[keys] = mergedReducers[i][keys]()
  }

  // Return diffusion provider
  return (
    <DiffuseContext.Provider value={values}>{children}</DiffuseContext.Provider>
  )
}

export { wire, createReducer }

export default Diffuse
