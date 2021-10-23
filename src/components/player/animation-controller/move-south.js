/**
 * @typedef {import('./index').PlayerAnimationTransform} PlayerAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {PlayerAnimationTransform} transform
 * @param {(transform: PlayerAnimationTransform) => void} onUpdate
 * @param {number} duration
 */
export default function createMoveSouthAnim(transform, onUpdate, duration) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [{ value: 0, duration: 0 }],
    z: [
      { value: 0, duration: 0 },
      {
        value: 1,
        duration,
        easing: 'easeInOutSine',
      },
    ],
  });
}
