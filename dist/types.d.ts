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
 *
 * @typedef {Record<string, Function | InitialActionType>} ActionsType
 */
/**
 * @typedef {(payload?: object) => void} ActionType Action
 * @param {object} payload payload
 * @returns {void}
 */
/**
 * @template {ActionsType} T
 * @typedef {Object} FuseBoxType
 * @property {keyof T} name Fuse box name
 * @property {Function} useActions
 * @property {Record<keyof T, ActionType>} actions
 * @property {Function} useFuse
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
export type ActionsType = Record<string, Function | InitialActionType>;
/**
 * Action
 */
export type ActionType = (payload?: object) => void;
export type FuseBoxType<T extends ActionsType> = {
    /**
     * Fuse box name
     */
    name: keyof T;
    useActions: Function;
    actions: Record<keyof T, ActionType>;
    useFuse: Function;
};
//# sourceMappingURL=types.d.ts.map