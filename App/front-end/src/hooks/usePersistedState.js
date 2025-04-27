import { useState } from "react";

export default function usePersistedState(key, initialState) {
  const [state, setState] = useState(() => {
    const persistedData = localStorage.getItem(key);

    if (!persistedData) {
      return typeof initialState === 'function' ? initialState() : initialState;
    }

    return JSON.parse(persistedData);
  });

  const updateState = (value) => {
    const newState = typeof value === 'function' ? value(state) : value;

    if (newState == null || newState == undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(newState));
    }

    setState(newState);
  };

  return [state, updateState];
}
