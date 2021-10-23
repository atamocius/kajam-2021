/**
 * @typedef {import('./index').EnemyAnimationTransform} EnemyAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {EnemyAnimationTransform} transform
 * @param {(transform: EnemyAnimationTransform) => void} onUpdate
 * @param {number} duration
 * @param {number} distance
 */
export default function createAttackSouthAnim(
  transform,
  onUpdate,
  duration,
  distance
) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [{ value: 0, duration: 0 }],
    z: [
      { value: 0, duration: 0 },
      {
        value: distance,
        duration,
        easing: 'easeInSine',
      },
      {
        value: 0,
        duration,
        easing: 'easeOutSine',
      },
    ],
  });
}
