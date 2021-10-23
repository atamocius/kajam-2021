import anime from 'animejs';

/**
 * @typedef {Object} PickupAnimationTransform
 * @property {number} rotY
 */

/**
 * @param {PlayerAnimationTransform} transform
 * @param {(transform: PickupAnimationTransform) => void} onUpdate
 */
export function createAnim(transform, onUpdate) {
  return anime({
    update: () => onUpdate(transform),
    autoplay: true,
    loop: true,
    targets: transform,

    rotY: [
      { value: 0, duration: 0 },
      {
        value: Math.PI,
        duration: 5000,
        easing: 'linear',
      },
    ],
  });
}
