/**
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 */

import React, { useRef, useEffect } from 'react';

import { useLevelData } from '../../utils/level-data-provider';
import registry from '../../models';
import { mapXToPosX, mapZToPosZ } from '../../levels/common';

import { useGameLogic } from '../../logic/game-logic';

export default function Pickups() {
  const {
    logic: {
      entities: { pickups },
    },
  } = useLevelData();

  return pickups.map((d, i) => {
    const { kind } = d;
    const Component = registry.pickups[kind];

    return (
      <Pickup key={i} index={i}>
        <Component position={[0, 0, 0]} />
      </Pickup>
    );
  });
}

function Pickup({ index, children }) {
  /**
   * @type {React.MutableRefObject<GroupProps>}
   */
  const ref = useRef();

  const { pickups } = useGameLogic();

  useEffect(() => {
    const api = makeApi(ref);
    return pickups.get(index).register(api);
  }, []);

  return <group ref={ref}>{children}</group>;
}

/**
 * @typedef {Object} PickupApi
 * @property {(x: number, z: number) => void} setMapPos
 * @property {(isVisible: boolean) => void} setVisibility
 */

/**
 * @param {React.MutableRefObject<GroupProps>} ref
 * @return {PickupApi}
 */
function makeApi(ref) {
  const setMapPos = (x, z) => {
    const px = mapXToPosX(x);
    const pz = mapZToPosZ(z);
    ref.current.position.set(px, 0, pz);
  };

  const setVisibility = isVisible => {
    if (isVisible) {
      ref.current.position.setY(0);
    } else {
      ref.current.position.setY(-100);
    }
  };

  return {
    setMapPos,
    setVisibility,
  };
}
