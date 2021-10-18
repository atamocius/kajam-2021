import classes from './index.module.css';

import React from 'react';

export default function UILabel({ children, x = 0, y = 0, fontSize = 48 }) {
  const baseStyle = {
    transform: `translate(${x * 100}%, ${y * 100}%)`,
  };

  return (
    <text
      className={classes.base}
      style={baseStyle}
      dominantBaseline='central'
      textAnchor='middle'
      fontSize={fontSize}
    >
      {children}
    </text>
  );
}
