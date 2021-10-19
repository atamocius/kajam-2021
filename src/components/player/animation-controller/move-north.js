/**
 * @typedef {import('./index').PlayerAnimationTransform} PlayerAnimationTransform
 */

import anime from 'animejs';

/**
 * @param {PlayerAnimationTransform} transform
 * @param {(transform: PlayerAnimationTransform) => void} onUpdate
 */
export default function createMoveNorthAnim(transform, onUpdate) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [{ value: 0, duration: 0 }],
    z: [
      { value: 0, duration: 0 },
      {
        value: -1,
        duration: 1000,
        easing: 'linear',
      },
    ],
  });
}
