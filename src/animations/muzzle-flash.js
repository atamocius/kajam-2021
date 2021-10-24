/**
 * @typedef {import('./types').LightAnimationProperties} LightAnimationProperties
 */

import anime from 'animejs';

/**
 * @param {LightAnimationProperties} properties
 * @param {(properties: LightAnimationProperties) => void} onUpdate
 * @param {number} flashDuration
 * @param {number} fadeDuration
 * @param {number} maxIntensity
 */
export default function createMuzzleFlashAnim(
  properties,
  onUpdate,
  flashDuration,
  fadeDuration,
  maxIntensity
) {
  return anime({
    update: () => onUpdate(properties),
    autoplay: false,
    targets: properties,

    intensity: [
      { value: 0, duration: 0 },
      {
        value: maxIntensity,
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
