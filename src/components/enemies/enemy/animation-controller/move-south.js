/**
 * @typedef {import('./index').EnemyAnimationTransform} EnemyAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {EnemyAnimationTransform} transform
 * @param {(transform: EnemyAnimationTransform) => void} onUpdate
 */
export default function createMoveSouthAnim(transform, onUpdate) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [{ value: 0, duration: 0 }],
    z: [
      { value: 0, duration: 0 },
      {
        value: 1,
        duration: 300,
        easing: 'easeInOutSine',
      },
    ],
  });
}
