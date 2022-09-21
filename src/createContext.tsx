import React, {
  createContext as createContextOriginal,
  useEffect,
  useRef
} from 'react'

export const ORIGINAL_PROVIDER = Symbol()

const CONTEXT_VALUE = Symbol();

export interface Value {
  value: GlobalStateContext
  registerListener: Function
  listeners: Set<Listener>
}

export interface GlobalStateContext {
  state?: Object
  dispatch?: Function
  reducerUpdated?: string | undefined
}

export interface Listener {
  fuse: string
  shouldUpdate: Function
}

export interface Context<Value> {
  Provider: React.ComponentType<{ value: Value; children: React.ReactNode }>;
  displayName?: string;
}

export interface ProviderProps {
  value: GlobalStateContext
  children: React.ReactNode
}

export type Version = number;

type ContextValue<Value> = {
    /* "v"alue     */ value: React.MutableRefObject<Value>;
    /* "l"isteners */ listener?: Set<Listener>;
    /* register    */ register: () => () => void
}

function createProvider<Value>(ProviderOriginal) {
  return ({ value, children }: { value: GlobalStateContext; children: React.ReactNode }) => {
    const valueRef = useRef(value)
    const listenersRef = useRef(new Set())
    const contextValue = useRef({
      value: valueRef,
      registerListener: (listener: Listener) => {
        listenersRef.current.add(listener)
        return () => listenersRef.current.delete(listener)
      },
      listeners: new Set()
    })
  
    useEffect(() => {
      valueRef.current = value
      listenersRef.current.forEach((listener: Listener) => {
        // Update listener where fuse name matches the reducer update
        if (listener !== undefined && listener.fuse === value.reducerUpdated) {
          listener.shouldUpdate(value)
        }
      })
    }, [value])

    return (
      <ProviderOriginal value={contextValue.current}>
        {children}
      </ProviderOriginal>
    )
  }
}

export default function createContext<Value>(defaultValue?: Value) {
  const context = createContextOriginal<ContextValue<Value|undefined>>({
    value: {
      current: defaultValue
    },
    register: () => () => {}
  })

  delete (context as any).Consumer;

  (context as unknown as Context<Value>).Provider = createProvider(context.Provider);

  return context as unknown as Context<Value>
}
