import classes from './index.module.css';

import React, { useState } from 'react';

import { useRouter } from '../../utils/router';
import { routes as r } from '..';
import Shutter from '../../components/shutter';
import UIButton from '../../components/ui-button';

export default function GameOver() {
  const [shutterOpen, setShutterOpen] = useState(true);
  const { changeRoute } = useRouter();

  const handleClick = () => {
    setShutterOpen(false);
  };

  const handleShutterClosed = () => {
    changeRoute(r.mainMenu);
  };

  return (
    <>
      <svg className={classes.base} viewBox='0 0 1920 1080'>
        <UIButton x={0.5} y={0.5} onClick={handleClick}>
          Back to Main Menu
        </UIButton>
      </svg>
      <Shutter open={shutterOpen} onClosed={handleShutterClosed} />
    </>
  );
}
