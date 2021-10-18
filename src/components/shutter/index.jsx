import classes from './index.module.css';
import cn from 'classnames';

import React, { useEffect, useState } from 'react';
import { delay } from '../../utils/promise';

const FADE_DURATION_MS = 300;

export default function Shutter({
  open = false,
  onOpening,
  onOpened,
  onClosing,
  onClosed,
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    (async () => {
      if (open) {
        onOpening && onOpening();
        await delay(FADE_DURATION_MS);
        setShow(false);
        onOpened && onOpened();
        return;
      }

      setShow(true);
      onClosing && onClosing();
      await delay(FADE_DURATION_MS);
      onClosed && onClosed();
    })();
  }, [open]);

  const c = cn(classes.base, {
    [classes.open]: open,
    [classes.closed]: !open,
  });

  return show ? <div className={c} /> : null;
}
