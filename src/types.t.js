

/**
 * @typedef {object} ActionPropsType Diffuse action props
 * @property {StateType} state
 * @property {object} payload
 * @property {object} props
 */

/**
 * Initial actions type
 * @typedef {(actionProps: ActionPropsType, actions: Record<'LOADING'|'FAIL'|'SUCCESS'|'PROGRESS'|'MESSAGE_RECIEVED'|'CONNECT'|'DISCONNECT'|'CONNECT_ERROR'|'EMIT', ActionType> & Record<keyof ActionsType, ActionType>) => object|Promise<ActionPropsType>} InitialActionType
 */

/**
 * @typedef {object} DiffuseStateProps Diffuse reducer state
 * @property {boolean} loading Diffuse loading flag
 * @property {boolean} error Diffuse error flag
 * @property {string} connectionStatus
 */

/**
 * @typedef {Object.<string, any> & {diffuse: DiffuseStateProps}} StateType Diffuse state
 */

/**
 * @typedef {{diffuse: DiffuseStateProps}} DiffuseStateType Diffuse state
 */

/**
 * Reducer Actions Type
 * @typedef {Record<string, InitialActionType>} ActionsType
 */

/**
 * Reducer Selector Type
 * @typedef {Record<string, Array<(state:any) =>any>>} SelectorsType
 */

/**
 * Initial State Type
 * @typedef {Record<string | "diffuse", any>} InitialStateType
 */

/**
 * Fuse box action type
 * @typedef {(payload?: object) => void} ActionType Action
 * @param {object} payload payload
 * @returns {void}
 */

/**
 * Fuse box action type
 * @typedef {object} FuseStateType Action
 */

/**
 * Fuse box selector type
 * @typedef {function(any):any[]} SelectorType Action
 */

/**
 * @typedef {() => any} useSelectionsType
 */

/**
 * @template {ActionsType} ActionT
 * @template {SelectorsType} SelectorT
 * @template {InitialStateType} StateT
 * @typedef {Object} FuseBoxType
 * @property {string} name Fuse box name
 * @property {Function} useActions
 * @property {Record<keyof ActionT, ActionType>} actions
 * @property {function():StateT&DiffuseStateType} useState
 * @property {Record<keyof SelectorT, useSelectionsType>} selectors
 */

export const Types = {}