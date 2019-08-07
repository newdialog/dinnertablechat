import React, { useState, useEffect, useRef } from 'react';

export const useFocus = (ref:any = null, defaultState = true, onChange:any = null) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const onFocus = () => {
        setState(true);
        if(onChange) onChange(true);
    }
    const onBlur = () => {
        setState(false);
        if(onChange) onChange(false);
    }
    const target = ref ? ref!.current : window;

    target.addEventListener('focus', onFocus);
    target.addEventListener('blur', onBlur);

    return () => {
        target.removeEventListener('focus', onFocus);
        target.removeEventListener('blur', onBlur);
    };
  }, []);

  return state;
};
