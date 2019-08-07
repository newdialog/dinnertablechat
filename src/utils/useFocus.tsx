import React, { useState, useEffect, useRef } from 'react';

export const useFocus = (ref:any = null, defaultState = true) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    const onFocus = () => setState(true);
    const onBlur = () => setState(false);
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
