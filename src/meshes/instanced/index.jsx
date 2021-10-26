/**
 * @typedef {import('../types').InstanceApi} InstanceApi
 */

import React, { createContext, useContext, useRef } from 'react';

import stagePropRenders from './stage-props';
import enemyRenders from './enemies';
import pickupRenders from './pickups';

/**
 * @typedef {Object} CountConfig
 * @property {StagePropsCountConfig} stageProps
 * @property {EnemiesCountConfig} enemies
 * @property {PickupsCountConfig} pickups
 */

/**
 * @typedef {Object} StagePropsCountConfig
 * @property {number} crates
 */

/**
 * @typedef {Object} EnemiesCountConfig
 * @property {number} bot
 * @property {number} alienBody
 * @property {number} alienLegs
 */

/**
 * @typedef {Object} PickupsCountConfig
 * @property {number} health
 * @property {number} ammo
 */

/********************************/

/**
 * @typedef {Object} Counts
 * @property {StagePropCounts} stageProps
 * @property {EnemyCounts} enemies
 * @property {PickupCounts} pickups
 */

/**
 * @typedef {Object} StagePropCounts
 * @property {number} crates
 */

/**
 * @typedef {Object} EnemyCounts
 * @property {number} bot
 * @property {number} alienBody
 * @property {number} alienLegs
 */

/**
 * @typedef {Object} PickupCounts
 * @property {number} health
 * @property {number} ammo
 */

/********************************/

/**
 * @typedef {Object} Refs
 * @property {StagePropRefs} stageProps
 * @property {EnemyRefs} enemies
 * @property {PickupRefs} pickups
 */

/**
 * @typedef {Object} StagePropRefs
 * @property {React.MutableRefObject<InstanceApi>} crates
 */

/**
 * @typedef {Object} EnemyRefs
 * @property {React.MutableRefObject<InstanceApi>} bot
 * @property {React.MutableRefObject<InstanceApi>} alienBody
 * @property {React.MutableRefObject<InstanceApi>} alienLegs
 */

/**
 * @typedef {Object} PickupRefs
 * @property {React.MutableRefObject<InstanceApi>} health
 * @property {React.MutableRefObject<InstanceApi>} ammo
 */

/** @type {React.Context<Refs>} */
const InstancedModelsContext = createContext();

/**
 * @param {{config: CountConfig, children: React.ReactChildren}} param0
 */
export function InstancedModelsProvider({ config, children }) {
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

export function useInstancedModels() {
  const ctx = useContext(InstancedModelsContext);

  if (ctx === undefined) {
    throw new Error(
      'useInstancedModels must be used within a InstancedModelsProvider'
    );
  }

  return ctx;
}

/**
 * @param {CountConfig} config
 * @returns {{ refs: Refs, renders: JSX.Element[] }}
 */
function useRefs(config) {
  const counts = calcCounts(config);

  const refs = {
    stageProps: {},
    enemies: {},
    pickups: {},
  };

  const renders = [];

  Object.entries(counts.stageProps).forEach(c => {
    const [key, count] = c;
    const ref = useRef();
    refs.stageProps[key] = ref;
    const StagePropInstances = stagePropRenders[key];
    renders.push(
      <StagePropInstances key={`stageProps_${key}`} ref={ref} count={count} />
    );
  });

  Object.entries(counts.enemies).forEach(c => {
    const [key, count] = c;
    const ref = useRef();
    refs.enemies[key] = ref;
    const EnemyInstances = enemyRenders[key];
    renders.push(
      <EnemyInstances key={`enemies_${key}`} ref={ref} count={count} />
    );
  });

  Object.entries(counts.pickups).forEach(c => {
    const [key, count] = c;
    const ref = useRef();
    refs.pickups[key] = ref;
    const PickupInstances = pickupRenders[key];
    renders.push(
      <PickupInstances key={`pickups_${key}`} ref={ref} count={count} />
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
    stageProps: { crates = 0 },
    enemies: { bot = 0, alienBody = 0, alienLegs = 0 },
    pickups: { health = 0, ammo = 0 },
  } = config;

  return {
    stageProps: {
      crates,
    },
    enemies: {
      bot,
      alienBody,
      alienLegs,
    },
    pickups: {
      health,
      ammo,
    },
  };
}
