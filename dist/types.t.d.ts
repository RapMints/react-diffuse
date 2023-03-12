/**
 * @typedef {object} ActionPropsType Diffuse action props
 * @property {StateType} state
 * @property {object} payload
 * @property {object} props
 */
/**
 * Initial actions type
 * @typedef {(actionProps: ActionPropsType) => object} InitialActionType
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
 * @property {keyof SelectorT} name Fuse box name
 * @property {Function} useActions
 * @property {Record<keyof ActionT, ActionType>} actions
 * @property {function():StateT&DiffuseStateType} useState
 * @property {Record<keyof SelectorT, useSelectionsType>} selectors
 */
export const Types: {};
/**
 * Diffuse action props
 */
export type ActionPropsType = {
    state: StateType;
    payload: object;
    props: object;
};
/**
 * Initial actions type
 */
export type InitialActionType = (actionProps: ActionPropsType) => object;
/**
 * Diffuse reducer state
 */
export type DiffuseStateProps = {
    /**
     * Diffuse loading flag
     */
    loading: boolean;
    /**
     * Diffuse error flag
     */
    error: boolean;
    connectionStatus: string;
};
/**
 * Diffuse state
 */
export type StateType = {
    [x: string]: any;
} & {
    diffuse: DiffuseStateProps;
};
/**
 * Diffuse state
 */
export type DiffuseStateType = {
    diffuse: DiffuseStateProps;
};
/**
 * Reducer Actions Type
 */
export type ActionsType = Record<string, InitialActionType>;
/**
 * Reducer Selector Type
 */
export type SelectorsType = {
    [x: string]: ((state: any) => any)[];
};
/**
 * Initial State Type
 */
export type InitialStateType = Record<string | "diffuse", any>;
/**
 * Action
 */
export type ActionType = (payload?: object) => void;
/**
 * Action
 */
export type FuseStateType = object;
/**
 * Action
 */
export type SelectorType = (arg0: any) => any[];
export type useSelectionsType = () => any;
export type FuseBoxType<ActionT extends ActionsType, SelectorT extends SelectorsType, StateT extends InitialStateType> = {
    /**
     * Fuse box name
     */
    name: keyof SelectorT;
    useActions: Function;
    actions: Record<keyof ActionT, ActionType>;
    useState: () => StateT & DiffuseStateType;
    selectors: Record<keyof SelectorT, useSelectionsType>;
};
//# sourceMappingURL=types.t.d.ts.map