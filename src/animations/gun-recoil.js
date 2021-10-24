/**
 * @typedef {import('./types').AnimationTransform} AnimationTransform
 */

import anime from 'animejs';

/**
 * @param {AnimationTransform} transform
 * @param {(transform: AnimationTransform) => void} onUpdate
 * @param {number} recoilDuration
 * @param {number} resetDuration
 * @param {number} maxAngle
 */
export default function createGunRecoilAnim(
  transform,
  onUpdate,
  recoilDuration,
  resetDuration,
  maxAngle
) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: false,
    targets: transform,

    rotX: [
      { value: 0, duration: 0 },
      {
        value: maxAngle,
        duration: recoilDuration,
        easing: 'easeInOutSine',
      },
      {
        value: 0,
        duration: resetDuration,
        easing: 'easeInOutSine',
      },
    ],
  });
}
