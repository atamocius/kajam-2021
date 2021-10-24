/**
 * @typedef {import('./index').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
 * @param {number} duration
 */
export default function createMoveNorthAnim(transform, onUpdate, duration) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [{ value: 0, duration: 0 }],
    z: [
      { value: 0, duration: 0 },
      {
        value: -1,
        duration,
        easing: 'easeInOutSine',
      },
    ],
  });
}
