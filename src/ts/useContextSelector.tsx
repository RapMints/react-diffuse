import { useContext, useEffect, useRef, useState } from 'react'

export default function useFuseSelector(context, fuse): Object {
  const { value, registerListener} = useContext(context)
  const selector = (context) => context.state[fuse]
  // We use a state to store the selectedValue
  // It will re-render only if the value changes
  // As you may notice, I lazily initialize the value
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  )

  const selectorRef = useRef(selector)

  useEffect(() => {
    // Store the selector function at each render
    // Because maybe the function has changed
    selectorRef.current = selector
  })

  useEffect(() => {
    
    const updateValueIfNeeded = (newValue) => {
      // Calculate the new selectedValue
      const newSelectedValue = selectorRef.current(newValue)
      // Only update when selected values are not the same
      // React will only re-render if the reference has changed
      // Use the callback to be able to select callback too
      // Otherwise it will the selected callback
      if (selectedValue !== newSelectedValue) {
        setSelectedValue(() => newSelectedValue)
      }
    }

    const unregisterListener = registerListener({fuse: fuse, shouldUpdate:updateValueIfNeeded})

    return unregisterListener
  }, [registerListener, value, selectedValue])
  
  return selectedValue
}

export function useContextSelector(context, selector) {
  const { value, registerListener } = useContext(context)
  // We use a state to store the selectedValue
  // It will re-render only if the value changes
  // As you may notice, I lazily initialize the value
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  )
  const selectorRef = useRef(selector)

  useEffect(() => {
    // Store the selector function at each render
    // Because maybe the function has changed
    selectorRef.current = selector
  })

  useEffect(() => {
    const updateValueIfNeeded = (newValue) => {
      // Calculate the new selectedValue
      const newSelectedValue = selectorRef.current(newValue)
      // Only update when selected values are not the same
      // React will only re-render if the reference has changed
      // Use the callback to be able to select callback too
      // Otherwise it will the selected callback
      if (selectedValue !== newSelectedValue) {
        setSelectedValue(() => newSelectedValue)
      }
    }

    const unregisterListener = registerListener({shouldUpdate:updateValueIfNeeded})

    return unregisterListener
  }, [registerListener, value, selectedValue])

  return selectedValue
}