export function wire(stores?: any[]): (Child: any) => any;
/**
 * Get fuse
 * @deprecated Use store.useState()
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof I, any>}
 */
export function useFuse<A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<A, S, I>): Record<keyof I, any>;
/**
 * Get reducer actions
 * @deprecated Use fuseBox.actions
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<A,S,I>} fuseBox
 * @returns {Record<keyof A, import('./types.t').ActionType>}
 */
export function useActions<A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<A, S, I>): Record<keyof A, import("./types.t").ActionType>;
/**
 *
 * @param {object} store
 * @param {string} store.name 'Store name'
 * @returns
 */
export function useDispatch(store: {
    name: string;
}): any;
export function useFuseSelection(store: any, selector: any): any;
export function useSelectors(store: any): any;
export const createReducer: <ActionT extends import("./types.t").ActionsType, SelectorsT extends import("./types.t").SelectorsType, InitialStateT extends import("./types.t").InitialStateType>({ initialState, actions, selectors, middleWare, options }: {
    initialState: InitialStateT;
    actions: ActionT;
    middleWare?: object | undefined;
    selectors?: SelectorsT | undefined;
    options?: object | undefined;
}) => {
    createStore: (storeName: string, props?: object | null) => import("./types.t").FuseBoxType<ActionT, SelectorsT, InitialStateT>;
};
//# sourceMappingURL=index.d.ts.map