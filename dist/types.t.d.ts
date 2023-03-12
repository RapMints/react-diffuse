/**
 * @typedef {object} ActionPropsType Diffuse action props
 * @property {StateType} state Current fuse state
 * @property {object} payload Action payload
 * @property {object} props Fuse box props
 * @property {(err?: any) => void} callback Callback function to run
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
 * Fuse box name type
 * @typedef {string} FuseBoxNameType
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
 * @typedef {(payload?: object, callback?: (err?: any) => void) => void} ActionType Action
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
 * @template {FuseBoxNameType} NameT
 * @template {ActionsType} ActionT
 * @template {SelectorsType} SelectorT
 * @template {InitialStateType} StateT
 * @typedef {Object} FuseBoxType
 * @property {NameT} name Fuse box name
 * @property {Record<keyof ActionT, ActionType>} actions Fuse box actions
 * @property {function():StateT&DiffuseStateType} useState Use fuse box state hook
 * @property {Record<keyof SelectorT, useSelectionsType>} selectors Fuse box selectors
 */
export const Types: {};
/**
 * Diffuse action props
 */
export type ActionPropsType = {
    /**
     * Current fuse state
     */
    state: StateType;
    /**
     * Action payload
     */
    payload: object;
    /**
     * Fuse box props
     */
    props: object;
    /**
     * Callback function to run
     */
    callback: (err?: any) => void;
};
/**
 * Initial actions type
 */
export type InitialActionType = (actionProps: ActionPropsType, actions: Record<'LOADING' | 'FAIL' | 'SUCCESS' | 'PROGRESS' | 'MESSAGE_RECIEVED' | 'CONNECT' | 'DISCONNECT' | 'CONNECT_ERROR' | 'EMIT', ActionType> & Record<keyof ActionsType, ActionType>) => object | Promise<ActionPropsType>;
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
 * Fuse box name type
 */
export type FuseBoxNameType = string;
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
export type ActionType = (payload?: object, callback?: ((err?: any) => void) | undefined) => void;
/**
 * Action
 */
export type FuseStateType = object;
/**
 * Action
 */
export type SelectorType = (arg0: any) => any[];
export type useSelectionsType = () => any;
export type FuseBoxType<NameT extends string, ActionT extends ActionsType, SelectorT extends SelectorsType, StateT extends InitialStateType> = {
    /**
     * Fuse box name
     */
    name: NameT;
    /**
     * Fuse box actions
     */
    actions: Record<keyof ActionT, ActionType>;
    /**
     * Use fuse box state hook
     */
    useState: () => StateT & DiffuseStateType;
    /**
     * Fuse box selectors
     */
    selectors: Record<keyof SelectorT, useSelectionsType>;
};
//# sourceMappingURL=types.t.d.ts.map