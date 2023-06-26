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
export const createReducer: <ActionT extends import("./types.t").ActionsType, SelectorsT extends import("./types.t").SelectorsType, InitialStateT extends import("./types.t").InitialStateType, MiddleWareT extends import("./types.t").MiddleWareType<keyof ActionT>>({ initialState, actions, selectors, middleWare }: {
    initialState: InitialStateT;
    actions: ActionT;
    middleWare?: MiddleWareT | undefined;
    selectors?: SelectorsT | undefined;
}) => {
    createStore: undefined;
    createFuseBox: <NameT extends string>(fuseBoxName: NameT, props?: object | null | undefined) => import("./types.t").FuseBoxType<NameT, ActionT, SelectorsT, InitialStateT>;
};
/**
 * @class DiffuseBoundary
 * @description Handle async suspension and errors from fetchState functions
 * @extends {React.Component<import('./types.t').ErrorBoundaryPropsType>}
 */
export class DiffuseBoundary extends React.Component<import("./types.t").ErrorBoundaryPropsType, any, any> {
    static getDerivedStateFromError(error: any): {
        hasError: boolean;
        error: any;
    };
    constructor(props: any);
    state: {
        hasError: boolean;
        error: undefined;
    };
    errorCondition: (error: any) => any;
    componentDidCatch(error: any, errorInfo: any): void;
    /**
     *
     * @param {object} props
     * @param {any} props.error
     * @returns
     */
    ErrorFallbackWrapper: ({ error }: {
        error: any;
    }) => JSX.Element;
    render(): JSX.Element;
}
import React from "react";
import { Component } from "react";
//# sourceMappingURL=index.d.ts.map