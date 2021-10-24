/**
 * @typedef {import('./index').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
 * @param {number} duration
 */
export default function createRotateRightAnim(transform, onUpdate, duration) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    rotY: [
      { value: 0, duration: 0 },
      {
        value: -Math.PI * 0.5,
        duration,
        easing: 'easeInOutSine',
      },
    ],
  });
}
