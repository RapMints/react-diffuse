/**
 * Wire class components to fusebox
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>[]} fuseBoxes
 * @returns {(Child: React.Component) => React.FunctionComponent<Record<N, import('./types.t').FuseBoxType<N,A,S,I>&any>>|React.Component<Record<N, import('./types.t').FuseBoxType<N,A,S,I>&any>>}
 */
export function wire<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBoxes?: import("./types.t").FuseBoxType<N, A, S, I>[]): (Child: React.Component) => React.FunctionComponent<Record<N, any>> | React.Component<Record<N, any>, any, any>;
/**
 * Get fuse
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof I, any>}
 */
export function useFuse<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<N, A, S, I>): Record<keyof I, any>;
/**
 * Get reducer actions
 * @deprecated (Will be removed on version 3) Use [StoreName].actions
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof A, import('./types.t').ActionType>}
 */
export function useActions<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<N, A, S, I>): Record<keyof A, import("./types.t").ActionType>;
/**
 * Get dispatch function for store
 * @deprecated (Will be removed on version 3) Use [StoreName].useState()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Function}
 */
export function useDispatch<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<N, A, S, I>): Function;
/**
 * Get fuse selection
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors()
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @param {S} selector
 * @returns {Record<keyof S, any>}
 */
export function useFuseSelection<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<N, A, S, I>, selector: S): Record<keyof S, any>;
/**
 * Get fusebox selectors
 * @deprecated (Will be removed on version 3) Use [StoreName].selectors
 * @template {import('./types.t').FuseBoxNameType} N
 * @template {import('./types.t').ActionsType} A
 * @template {import('./types.t').SelectorsType} S
 * @template {import('./types.t').InitialStateType} I
 * @param {import('./types.t').FuseBoxType<N,A,S,I>} fuseBox
 * @returns {Record<keyof S, any>}
 */
export function useSelectors<N extends string, A extends import("./types.t").ActionsType, S extends import("./types.t").SelectorsType, I extends import("./types.t").InitialStateType>(fuseBox: import("./types.t").FuseBoxType<N, A, S, I>): Record<keyof S, any>;
export const createReducer: <ActionT extends import("./types.t").ActionsType, SelectorsT extends import("./types.t").SelectorsType, InitialStateT extends import("./types.t").InitialStateType, MiddleWareT extends import("./types.t").MiddleWareType<string>, P>({ initialState, actions, selectors, middleWare }: {
    initialState: InitialStateT;
    actions: ActionT;
    middleWare?: MiddleWareT | undefined;
    selectors?: SelectorsT | undefined;
}) => {
    createStore: undefined;
    createFuseBox: <NameT extends string>(fuseBoxName: NameT, props?: object | null | undefined) => import("./types.t").FuseBoxType<NameT, ActionT, SelectorsT, InitialStateT>;
};
import React from "react";
import { Component } from "react";
//# sourceMappingURL=index.d.ts.map