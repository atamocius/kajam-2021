/**
 * @typedef {import('../../../animations/types').AnimationTransform} AnimationTransform
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../../utils/level-loader/types').Direction} Direction
 * @typedef {import('./').EnemyApi} EnemyApi
 */

import { Direction } from '../../../utils/level-loader/common';

import createDamageAnim from '../../../animations/damage';
import createDeathAnim from '../../../animations/death';

export default class LocalAnimationController {
  #ref;

  #transform;

  #damageAnim;
  #deathAnim;

  /**
   * @param {React.MutableRefObject<GroupProps>} ref
   */
  constructor(ref) {
    this.#ref = ref;

    /** @type {AnimationTransform} */
    this.#transform = {
      x: 0,
      y: 0,
      z: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
    };

    this.#buildDamageAndDeathAnims();
  }

  reset() {
    this.#transform.x = 0;
    this.#transform.y = 0;
    this.#transform.z = 0;
    this.#transform.rotX = 0;
    this.#transform.rotY = 0;
    this.#transform.rotZ = 0;
    this.#transform.scaleX = 1;
    this.#transform.scaleY = 1;
    this.#transform.scaleZ = 1;

    this.#update(this.#transform);
  }

  async damage() {
    const a = this.#damageAnim;
    a.play();
    await a.finished;
  }

  async death() {
    const a = this.#deathAnim;
    a.play();
    await a.finished;
  }

  /**
   * @param {AnimationTransform} transform
   */
  #update = transform => {
    if (!this.#ref.current) {
      return;
    }

    const t = transform;

    this.#ref.current.position.set(t.x, t.y, t.z);
    this.#ref.current.rotation.set(t.rotX, t.rotY, t.rotZ);
    this.#ref.current.scale.set(t.scaleX, t.scaleY, t.scaleZ);
  };

  #buildDamageAndDeathAnims() {
    this.#damageAnim = createDamageAnim(this.#transform, this.#update);
    this.#deathAnim = createDeathAnim(this.#transform, this.#update);
  }
}
