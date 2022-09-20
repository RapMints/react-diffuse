import React, {
  createContext as createContextOriginal,
  useEffect,
  useRef
} from 'react'

export const ORIGINAL_PROVIDER = Symbol()

export interface Value {
  value: Object
  registerListener: Function
  listeners: Set<Listener>
}

export interface Listener {
  fuse: string
  shouldUpdate: Function
}

export interface Context<Value> {
  Provider: React.ComponentType<{ value: Value; children: React.ReactNode }>;
  displayName?: string;
}

function createProvider(ProviderOriginal) {
  return ({ value, children }) => {
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
        if (listener !== undefined && listener.fuse === value?.reducerUpdated) {
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

export default function createContext(defaultValue) {
  const context = createContextOriginal({
    value: {
      current: defaultValue
    },
    register: () => {
      return () => {}
    }
  })

  delete (context as any).Consumer;

  (context as any).Provider = createProvider(context.Provider);

  return context
}
