declare const _default: StateMachine;
export default _default;
export type StoreNameType = string;
/**
 * @typedef {string} StoreNameType
 */
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
     * @template {import('./types.t').MiddleWareType<keyof ActionT>} MiddleWareT
     * Creates reducer
     * @param {object} reducerProps Reducer properties
     * @param {InitialStateT} reducerProps.initialState Reducer initial state
     * @param {ActionT} reducerProps.actions Reducer actions
     * @param {MiddleWareT=} reducerProps.middleWare Reducer middleWare
     * @param {SelectorsT=} reducerProps.selectors Reducer selectors
     */
    createReducer: <ActionT extends import("./types.t").ActionsType, SelectorsT extends import("./types.t").SelectorsType, InitialStateT extends import("./types.t").InitialStateType, MiddleWareT extends import("./types.t").MiddleWareType<keyof ActionT>>({ initialState, actions, selectors, middleWare }: {
        initialState: InitialStateT;
        actions: ActionT;
        middleWare?: MiddleWareT | undefined;
        selectors?: SelectorsT | undefined;
    }) => {
        /**
         * @template {import('./types.t').FuseBoxNameType} NameT
         * Store name
         * @param {NameT} storeName Store name
         * @param {object|null} props Store props
         * @returns
         */
        createStore: <NameT extends string>(storeName: NameT, props?: object | null) => import("./types.t").FuseBoxType<NameT, ActionT, SelectorsT, InitialStateT>;
    };
    mergeSelectors(selector: any, currentState: any): {
        stateSelections?: any[] | undefined;
        value: any;
    };
    useSelectionHook: (store: any, selector: any) => any;
    addFuseListener(storeName: any, func: any): void;
    removeFuseListener(storeName: any, func: any): void;
    dispatchReducerListeners(storeName: any, result: any, dontSaveToHistory?: boolean): void;
    getCurrentState(storeName: any): any;
    getAction(storeName: any, actionName: any): any;
    getFromMiddleWare(storeName: any): (middleWare: any, { type, payload }: {
        type?: string | undefined;
        payload?: null | undefined;
    }) => any;
    runAction(storeName: any, action: any, payload: any, callback?: () => undefined): Promise<any>;
    dispatch: (storeName: any) => ({ type, payload, callback }: {
        type?: string | undefined;
        payload?: null | undefined;
        callback: any;
    }) => Promise<any>;
}
//# sourceMappingURL=StateMachine.d.ts.map