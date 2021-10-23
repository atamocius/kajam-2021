/**
 * @typedef {import('./index').EnemyAnimationTransform} EnemyAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {EnemyAnimationTransform} transform
 * @param {(transform: EnemyAnimationTransform) => void} onUpdate
 * @param {number} duration
 */
export default function createMoveEastAnim(transform, onUpdate, duration) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [
      { value: 0, duration: 0 },
      {
        value: 1,
        duration,
        easing: 'easeInOutSine',
      },
    ],
    z: [{ value: 0, duration: 0 }],
  });
}
