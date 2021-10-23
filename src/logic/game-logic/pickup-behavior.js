/**
 * @typedef {import('../../components/pickups').PickupApi} PickupApi
 * @typedef {import('../../utils/level-loader/types').MapCoords} MapCoords
 * @typedef {import('../../utils/level-loader/types').Direction} Direction
 * @typedef {import('../../utils/level-loader/types').MapUtilFuncs} MapUtilFuncs
 * @typedef {import('./game-state').PickupState} PickupState
 */

import GameState from './game-state';

export default class PickupBehaviors {
  #behaviors;

  /**
   * @param {GameState} gs
   */
  constructor(gs) {
    this.#behaviors = gs.state.pickups.map(s => new PickupBehavior(s));
  }

  /**
   * @param {number} index
   */
  get = index => {
    return this.#behaviors[index];
  };
}

export class PickupBehavior {
  #state;

  /**
   * @param {PickupState} state
   */
  constructor(state) {
    this.#state = state;
  }

  /**
   * @param {PickupApi} view
   * @returns {() => void} Returns an unregister function.
   */
  register = view => {
    const {
      position: { x, z },
    } = this.#state;
    this.#state.view = view;
    this.#state.view.setMapPos(x, z);

    return () => {
      this.#state.view = null;
    };
  };

  disable = () => {
    this.#state.view.setVisibility(false);
    this.#state.enabled = false;
  };
}
