import classes from './index.module.css';

import React from 'react';

export default function UIButton({
  children,
  x = 0,
  y = 0,
  width = 300,
  height = 100,
  fontSize = 48,
  onClick,
}) {
  const baseStyle = {
    transform: `translate(${x * 100}%, ${y * 100}%)`,
  };

  const btnStyle = {
    transform: `translate(
      calc(-${width}px * 0.5),
      calc(-${height}px * 0.5)
    )`,
    width,
    height,
  };

  return (
    <g className={classes.base} style={baseStyle} onClick={onClick}>
      <rect className={classes.button} style={btnStyle} rx={10} ry={10} />
      <text
        className={classes.text}
        dominantBaseline='central'
        textAnchor='middle'
        fontSize={fontSize}
      >
        {children}
      </text>
    </g>
  );
}
