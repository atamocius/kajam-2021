import classes from './index.module.css';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import { useRouter } from '../../utils/router';
import { routes as r } from '..';
import { useKeyDownNoRepeat } from '../../utils/keyboard';

import Shutter from '../../components/shutter';
import Gizmo from '../../components/gizmo';

import Level0 from '../../data/level0';

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

      // WASD
      case 'KeyW':
        ev.preventDefault();
        console.log('Forward');
        break;

      case 'KeyS':
        ev.preventDefault();
        console.log('Backward');
        break;

      case 'KeyA':
        ev.preventDefault();
        console.log('Strafe Left');
        break;

      case 'KeyD':
        ev.preventDefault();
        console.log('Strafe Right');
        break;

      // Turn
      case 'KeyQ':
        ev.preventDefault();
        console.log('Turn Left');
        break;

      case 'KeyE':
        ev.preventDefault();
        console.log('Turn Right');
        break;

      // Reload
      case 'KeyR':
        ev.preventDefault();
        console.log('Reload');
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
          camera={{ position: [0, 2, 2], fov: 50 }}
        >
          <Suspense fallback={null}>
            <Level0 />
          </Suspense>

          <Gizmo />
        </Canvas>
      </div>
      <Shutter open={shutterOpen} onClosed={handleShutterClosed} />
    </>
  );
}
