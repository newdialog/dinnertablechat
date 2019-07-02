import Lottie from '@jadbox/lottie-react-web';
import { Waypoint } from 'react-waypoint';
import React, { useEffect, useMemo, useRef, useState } from 'react';
// import useVisibility from 'react-use-visibility';
import useIsInViewport from 'use-is-in-viewport';

interface Props {
  options: any;
  speed?: number;
}
export default function WaypointLottie(props: Props) {
  // console.log('props', props);
  const ref = useRef<Lottie>();
  const [state, setState] = useState<any>({});

  const id = props.options.path;

  // const isVisible = useVisibility(pRef.current, {partial: true});
  const [isInViewport, childRef] = useIsInViewport({threshold: 1})
  // console.log('isVisible', isVisible, props.options.path)

  useEffect( () => {
    if(isInViewport && !state.seen) setState(p => ({ ...p, play: true, seen: true }));
    else if(!isInViewport && state.seen) setState(p => ({ ...p, play: false  }));

    if(!ref.current) return;
    if(isInViewport) {
      ref.current.play();
    } else {
      ref.current.stop();
      // console.log('stopping', id);
    }
  }, [isInViewport, ref]);
  // isPaused={!state.play}
  /* useEffect( () => {
    // hack to help improve pagespeed
    setTimeout(()=> {
      // console.log('aaa', props.options.path);
      setState(p => ({ ...p, startDelay: true}));
    }, 60);
  }, []) */

    // return React.useMemo( () => {
    // console.log('rr', props.options.path);
  
    /*
    const _handleWaypointEnter = () => {
      // console.log('start');
      setState(p => ({ ...p, play: true, seen: true }));
      if (!ref.current) return;
      ref.current.play();
    };
  
    const _handleWaypointLeave = () => {
      // console.log('end');
      setState(p => ({ ...p, play: false }));
      if (!ref.current) return;
      ref.current.stop();
    };
    */

    return (
      <div ref={childRef}>
        { (state.seen) ? (<Lottie
        isPaused={!state.play}
        options={props.options}
        speed={props.speed}
        ref={ref}
        isClickToPauseDisabled={true}
      />) : <div style={{width:400, height:300}}/>
      }</div>
  )

//}, [state, props.options, ref]);
}

/*
  <Waypoint
  topOffset="-10%"
  bottomOffset="0"
  onEnter={useMemo(() => cullingHandlers(diningRef, false, 1.6), [
    diningRef
  ])}
  onLeave={useMemo(() => cullingHandlers(diningRef, true), [
    diningRef
  ])}
  >
*/