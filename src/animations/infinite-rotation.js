/**
 * @typedef {import('./types').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
 * @param {number} duration
 */
export default function createInfiniteRotationAnim(
  transform,
  onUpdate,
  duration
) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: true,
    loop: true,
    targets: transform,

    rotY: [
      { value: 0, duration: 0 },
      {
        value: Math.PI * 2,
        duration,
        easing: 'linear',
      },
    ],
  });
}
