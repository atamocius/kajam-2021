/**
 * @typedef {import('./types').MaterialAnimationProperties} MaterialAnimationProperties
 */

import anime from 'animejs';

/**
 * @param {MaterialAnimationProperties} properties
 * @param {(properties: MaterialAnimationProperties) => void} onUpdate
 * @param {number} flashDuration
 * @param {number} fadeDuration
 * @param {number} maxOpacity
 */
export default function createDamageFlashAnim(
  properties,
  onUpdate,
  flashDuration,
  fadeDuration,
  maxOpacity
) {
  return anime({
    update: () => onUpdate(properties),
    autoplay: false,
    targets: properties,

    opacity: [
      { value: 0, duration: 0 },
      {
        value: maxOpacity,
        duration: flashDuration,
        easing: 'linear',
      },
      {
        value: 0,
        duration: fadeDuration,
        easing: 'linear',
      },
    ],
  });
}
