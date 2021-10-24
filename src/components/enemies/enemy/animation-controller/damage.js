/**
 * @typedef {import('./index').EnemyAnimationTransform} EnemyAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {EnemyAnimationTransform} transform
 * @param {(transform: EnemyAnimationTransform) => void} onUpdate
 */
export default function createDamageAnim(transform, onUpdate) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [
      { value: 0, duration: 0 },
      {
        value: -0.05,
        duration: 20,
        easing: 'easeInOutSine',
      },
      {
        value: 0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: -0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: 0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: 0,
        duration: 40,
        easing: 'easeInOutSine',
      },
    ],
    z: [
      { value: 0, duration: 0 },
      {
        value: -0.05,
        duration: 20,
        easing: 'easeInOutSine',
      },
      {
        value: 0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: -0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: 0.05,
        duration: 40,
        easing: 'easeInOutSine',
      },
      {
        value: 0,
        duration: 40,
        easing: 'easeInOutSine',
      },
    ],
  });
}
