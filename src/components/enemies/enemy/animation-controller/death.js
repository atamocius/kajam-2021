/**
 * @typedef {import('./index').EnemyAnimationTransform} EnemyAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {EnemyAnimationTransform} transform
 * @param {(transform: EnemyAnimationTransform) => void} onUpdate
 */
export default function createDeathAnim(transform, onUpdate) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    scaleY: [
      { value: 1, duration: 0 },
      {
        value: 0.1,
        duration: 1500,
        easing: 'easeOutCubic',
      },
    ],
    y: [
      { value: 0, duration: 0 },
      {
        value: -0.5,
        delay: 800,
        duration: 1000,
        easing: 'easeInCubic',
      },
    ],
  });
}
