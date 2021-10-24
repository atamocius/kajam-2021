/**
 * @typedef {import('./index').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
 * @param {number} duration
 * @param {number} distance
 */
export default function createAttackEastAnim(
  transform,
  onUpdate,
  duration,
  distance
) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    x: [
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
    z: [{ value: 0, duration: 0 }],
  });
}
