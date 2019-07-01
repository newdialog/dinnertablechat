import Lottie from '@jadbox/lottie-react-web';
import { Waypoint } from 'react-waypoint';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  options: any;
  speed?: number;
}
export default function WaypointLottie(props: Props) {
  // console.log('props', props);
  const ref = useRef<Lottie>();
  const [state, setState] = useState<any>({});

    // return React.useMemo( () => {
    // console.log('rr', props.options.path);
  
    const _handleWaypointEnter = () => {
      console.log('start');
      setState(p => ({ ...p, play: true, seen: true }));
      if (!ref.current) return;
      ref.current.play();
    };
  
    const _handleWaypointLeave = () => {
      console.log('end');
      setState(p => ({ ...p, play: false }));
      if (!ref.current) return;
      ref.current.stop();
    };

    return (
    <Waypoint
      topOffset="-20%"
      onEnter={_handleWaypointEnter}
      onLeave={_handleWaypointLeave}>
      <div>
        {state.seen ? (<Lottie
        isPaused={!state.play}
        options={props.options}
        speed={props.speed}
        ref={ref}
        isClickToPauseDisabled={true}
      />) : <div style={{width:400, height:300}}/>
      }</div></Waypoint>
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