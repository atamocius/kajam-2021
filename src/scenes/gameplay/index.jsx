import classes from './index.module.css';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import { useRouter } from '../../utils/router';
import { routes as r } from '..';
// import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Shutter from '../../components/shutter';

import Gizmo from '../../components/gizmo';

export default function Gameplay({ level, nextLevel }) {
  const [shutterOpen, setShutterOpen] = useState(true);
  const [targetRoute, setTargetRoute] = useState(nextLevel);
  const { changeRoute } = useRouter();

  // const exitToMenu = () => {
  //   setShutterOpen(false);
  // };

  const handleShutterClosed = () => {
    changeRoute(targetRoute);
  };

  const handleGameOver = () => {
    setTargetRoute(r.mainMenu);
    setShutterOpen(false);
  };
  const handleExitedLevel = () => {
    setTargetRoute(nextLevel);
    setShutterOpen(false);
  };

  // /**
  //  * @param {KeyboardEvent} ev
  //  */
  // const handleKeyDown = async ev => {
  //   switch (ev.code) {
  //     case 'Escape':
  //       ev.preventDefault();
  //       exitToMenu();
  //       break;

  //     case 'F1':
  //       ev.preventDefault();
  //       console.log('Help');
  //       break;

  //     default:
  //       break;
  //   }
  // };

  // useKeyDownNoRepeat(handleKeyDown);

  return (
    <>
      <div className={classes.base}>
        <Canvas shadows gl={{ alpha: false }}>
          <Suspense fallback={null}>
            {level(handleGameOver, handleExitedLevel)}
          </Suspense>
          <Gizmo />
        </Canvas>
      </div>
      <Shutter open={shutterOpen} onClosed={handleShutterClosed} />
    </>
  );
}
