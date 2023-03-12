declare const _default: StateMachine;
export default _default;
export type StoreNameType = string;
/**
 * @typedef {string} StoreNameType
 */
export function mergeSelectors(selector: any, currentState: any): {
    stateSelections?: any[] | undefined;
    value: any;
};
declare class StateMachine {
    state: {};
    actions: {};
    middleWare: {};
    listener: {};
    initialState: {};
    store: {};
    storeDict: any[];
    selectors: {};
    selections: {};
    history: {};
    props: {};
    /**
     * @name TEST#store
     * @type {Object<string, function>}
     */
    /**
     * @template {import('./types.t').ActionsType} ActionT
     * @template {import('./types.t').SelectorsType} SelectorsT
     * @template {import('./types.t').InitialStateType} InitialStateT
     * Creates reducer
     * @param {object} reducerProps Reducer properties
     * @param {InitialStateT} reducerProps.initialState Reducer initial state
     * @param {ActionT} reducerProps.actions Reducer actions
     * @param {object=} reducerProps.middleWare Reducer middleWare
     * @param {SelectorsT=} reducerProps.selectors Reducer selectors
     * @param {object=} reducerProps.options
     */
    createReducer: <ActionT extends import("./types.t").ActionsType, SelectorsT extends import("./types.t").SelectorsType, InitialStateT extends import("./types.t").InitialStateType>({ initialState, actions, selectors, middleWare, options }: {
        initialState: InitialStateT;
        actions: ActionT;
        middleWare?: object | undefined;
        selectors?: SelectorsT | undefined;
        options?: object | undefined;
    }) => {
        /**
         * Store name
         * @param {StoreNameType} storeName Store name
         * @param {object|null} props Store props
         * @returns
         */
        createStore: (storeName: StoreNameType, props?: object | null) => import("./types.t").FuseBoxType<ActionT, SelectorsT, InitialStateT>;
    };
    useSelectionHook: (store: any, selector: any) => any;
    addFuseListener(storeName: any, func: any): void;
    removeFuseListener(storeName: any, func: any): void;
    dispatchReducerListeners(storeName: any, result: any, dontSaveToHistory?: boolean): void;
    getCurrentState(storeName: any): any;
    getAction(storeName: any, actionName: any): any;
    getFromMiddleWare(storeName: any): Promise<(middleWare: any, { type, payload }: {
        type?: string | undefined;
        payload?: null | undefined;
    }) => () => any>;
    runAction(storeName: any, action: any, payload: any): Promise<any>;
    dispatch: (storeName: any) => ({ type, payload }: {
        type?: string | undefined;
        payload?: null | undefined;
    }) => Promise<any>;
}
//# sourceMappingURL=StateMachine.d.ts.map