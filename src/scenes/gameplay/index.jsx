import classes from './index.module.css';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import { useRouter } from '../../utils/router';
import { routes as r } from '..';
import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Shutter from '../../components/shutter';
import Gizmo from '../../components/gizmo';

import Level0 from '../../levels/level0';

// TODO: Pass the level as a prop
export default function Gameplay() {
  const [shutterOpen, setShutterOpen] = useState(true);
  const { changeRoute } = useRouter();

  const exitToMenu = () => {
    setShutterOpen(false);
  };

  const handleShutterClosed = () => {
    changeRoute(r.main);
  };

  /**
   * @param {KeyboardEvent} ev
   */
  const handleKeyDown = async ev => {
    switch (ev.code) {
      case 'Escape':
        ev.preventDefault();
        exitToMenu();
        break;

      case 'F1':
        ev.preventDefault();
        console.log('Help');
        break;

      default:
        break;
    }
  };

  useKeyDownNoRepeat(handleKeyDown);

  return (
    <>
      <div className={classes.base}>
        <Canvas
          shadows
          gl={{ alpha: false }}
          // camera={{ position: [0, 2, 2], fov: 50 }}
        >
          <Suspense fallback={null}>
            <Level0 />
          </Suspense>

          {/* <Gizmo /> */}
        </Canvas>
      </div>
      <Shutter open={shutterOpen} onClosed={handleShutterClosed} />
    </>
  );
}
