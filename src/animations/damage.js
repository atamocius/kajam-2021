/**
 * @typedef {import('./types').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
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
