/**
 * Diffuse ContextSelector
 * @param selector - Select from context
 */
declare function useFuse(selector: (...params: any[]) => any): void;

/**
 * Use dispatch hook
 * @param reducerName - Name of reducer to get dispatch for. Defaults to null, if null use generic dispatcher
 * @returns Dispatch function
 */
declare function useDispatch(reducerName: string): (...params: any[]) => any;

/**
 * Use actions hook
 * @param reducerName - Name of reducer to get actions for. Defaults to null, if null willl return empty actions list
 * @returns List of actions to be ran as functions
 */
declare function useActions(reducerName: string): any;

/**
 * Connects Child to a specified fuse
 * @param fuseName - Fuse to reference
 * @param Child - React.Component to reference
 * @returns Wired component
 */
declare function connectWire(fuseName: string, Child: React.Component): any;

/**
 * Wires component to a specified fuses
 * @param properties.fuseName - Fuse to reference
 * @param properties.component - React.Component to reference
 * @returns Wired component
 */
declare function wire(properties: {
    fuseName: string;
    component: React.Component;
}): any;

/**
 * Creates a reducer
 * @param props - Reducer props
 * @param props.initialState - Initial reducer state
 * @param props.actions - Key value pair of functions
 */
declare function createReducer(props: {
    initialState: any;
    actions: any[];
}): void;

/**
 * Create global state from reducers
 * @param reducers - Initialized reducers
 * @returns Store
 */
declare function createGlobalState(reducers: object[]): any;

/**
 * Diffuse Provider
 * @param properties - Properties for Diffusion
 * @param properties.reducers - Array of initialized reducers
 * @param properties.children - Main App
 */
declare function Diffuse(properties: {
    reducers: object[];
    children: React.Component;
}): void;

/**
 * Diffuse setup class
 */
declare class setupDiffuseClass {
    /**
     * Create global state
     * @param reducers - Initialized reducers
     * @returns Store
     */
    createGlobalState(reducers: object[]): any;
}

