import { useContext, useEffect, useRef, useState } from "react";

export default function useContextSelector(context, selector) {
  const { value, registerListener } = useContext(context);
  const selectorRef = useRef(selector);
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  );

  useEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    const updateValueIfNeeded = (newValue) => {
      const newSelectedValue = selectorRef.current(newValue);
      setSelectedValue(() => newSelectedValue);
    };

    const unregisterListener = registerListener(updateValueIfNeeded);

    return unregisterListener;
  }, [registerListener, value]);

  return selectedValue;
}
