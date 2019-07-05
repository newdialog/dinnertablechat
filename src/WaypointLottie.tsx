import Lottie from '@jadbox/lottie-react-web';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import useIsInViewport from 'use-is-in-viewport';
import LazyLoadComp from 'react-lazy-load-component'

interface Props {
  options: any;
  speed?: number;
  threshold?: number;
}
export default function WaypointLottie(props: Props) {
  // console.log('props', props);
  const ref = useRef<Lottie>();
  // const [state, setState] = useState<any>({});

  const id = props.options.path;

  // const isVisible = useVisibility(pRef.current, {partial: true});
  // const [isInViewport, childRef] = useIsInViewport({threshold: 1})
  // console.log('isVisible', isVisible, props.options.path)

  const onVisibleChange = (visible:boolean) => {
    // console.log('onVisibleChange', visible);
    // if(visible && !state.seen) setState(p => ({ ...p, play: true, seen: true }));
    // else if(!visible && state.seen) setState(p => ({ ...p, seen: true  }));

    if(!ref.current) return;
    if(visible) {
      ref.current.play();
    } else {
      ref.current.stop();
      // console.log('stopping', id);
    }
    // isPaused={!state.play}
    // setState(p => ({ ...p, seen: visible }));
  }

    return (
      <LazyLoadComp onVisibleChange={onVisibleChange} threshold={props.threshold || 0.1}>
        <Lottie
          options={props.options}
          speed={props.speed}
          ref={ref}
          isClickToPauseDisabled={true}
        />
      }</LazyLoadComp>
  )

}
