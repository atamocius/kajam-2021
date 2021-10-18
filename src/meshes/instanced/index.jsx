/**
 * @typedef {import('../types').InstanceApi} InstanceApi
 */

import React, { createContext, useRef } from 'react';

import enemyRenders from './enemies';

/**
 * @typedef {Object} CountConfig
 * @property {EnemiesCountConfig} enemies
 */

/**
 * @typedef {Object} EnemiesCountConfig
 * @property {number} sampleEnemy2
 * @property {number} testRobot
 */

/********************************/

/**
 * @typedef {Object} Counts
 * @property {EnemyCounts} enemies
 */

/**
 * @typedef {Object} EnemyCounts
 * @property {number} sampleEnemy2
 * @property {number} testRobot
 */

/********************************/

/**
 * @typedef {Object} Refs
 * @property {EnemyRefs} enemies
 */

/**
 * @typedef {Object} EnemyRefs
 * @property {React.MutableRefObject<InstanceApi>} sampleEnemy2
 * @property {React.MutableRefObject<InstanceApi>} testRobot
 */

/** @type {React.Context<Refs>} */
export const InstancedModelsContext = createContext();

/**
 * @param {{config: CountConfig, children: React.ReactChildren}} param0
 */
export default function InstancedModelsProvider({ config, children }) {
  const { refs, renders } = useRefs(config);

  return (
    <>
      {renders}
      <InstancedModelsContext.Provider value={refs}>
        {children}
      </InstancedModelsContext.Provider>
    </>
  );
}

/**
 * @param {CountConfig} config
 * @returns {{ refs: Refs, renders: JSX.Element[] }}
 */
function useRefs(config) {
  const counts = calcCounts(config);

  const refs = {
    enemies: {},
  };

  const renders = [];

  Object.entries(counts.enemies).forEach(c => {
    const [key, count] = c;
    const ref = useRef();
    refs.enemies[key] = ref;
    const EnemyInstances = enemyRenders[key];
    renders.push(
      <EnemyInstances key={`enemies_${key}`} ref={ref} count={count} />
    );
  });

  return {
    refs,
    renders,
  };
}

/**
 * @param {CountConfig} config
 * @returns {Counts}
 */
function calcCounts(config) {
  const {
    enemies: {
      sampleEnemy2 = 0,
      // testRobot = 0
    },
  } = config;

  return {
    enemies: {
      sampleEnemy2,
      // testRobot,
    },
  };
}
