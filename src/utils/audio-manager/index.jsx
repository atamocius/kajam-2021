import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { Audio, AudioLoader, AudioListener, PositionalAudio } from 'three';
import { useLoader } from '@react-three/fiber';

export const SfxIndex = {
  accessDenied: 0,
  accessGranted: 1,
  ammoPickup: 2,
  gunEmpty: 3,
  gunShot: 4,
  healthPickup: 5,
  keycardPickup: 6,
  playerDamaged: 7,
  playerDeath: 8,
  playerFootsteps: 9,
};

export const PositionalSfxIndex = {
  enemyAttack: 0,
  enemyDamaged: 1,
  enemyDeath: 2,
  enemyFootsteps: 3,
};

export const BgmIndex = {
  drone: 0,
  level1Bgm: 1,
  level2Bgm: 2,
  level3Bgm: 3,
  menuBgm: 4,
};

const sfx = [
  '/audio/sfx/access-denied.mp3',
  '/audio/sfx/access-granted.mp3',
  '/audio/sfx/ammo-pickup.mp3',
  '/audio/sfx/gun-empty.mp3',
  '/audio/sfx/gun-shot.mp3',
  '/audio/sfx/health-pickup.mp3',
  '/audio/sfx/keycard-pickup.mp3',
  '/audio/sfx/player-damaged.mp3',
  '/audio/sfx/player-death.mp3',
  '/audio/sfx/player-footsteps.mp3',
];

const positionalSfx = [
  '/audio/sfx/enemy-attack.mp3',
  '/audio/sfx/enemy-damaged.mp3',
  '/audio/sfx/enemy-death.mp3',
  '/audio/sfx/enemy-footsteps.mp3',
];

const bgm = [
  '/audio/bgm/drone.mp3',
  '/audio/bgm/level-1-bgm.mp3',
  '/audio/bgm/level-2-bgm.mp3',
  '/audio/bgm/level-3-bgm.mp3',
  '/audio/bgm/menu-bgm.mp3',
];

/**
 * @typedef {Object} AudioManagerApi
 * @property {AudioListener} listener
 * @property {(index: number) => void} playSfx
 * @property {(index: number) => void} stopSfx
 * @property {(index: number) => void} playBgm
 * @property {(index: number) => void} stopBgm
 * @property {(index: number) => PositionalAudio} createPositionalAudio
 */

/** @type {React.Context<AudioManagerApi>} */
const AudioManagerContext = createContext();

/**
 * @param {{ sfxSettings: Object.<number, (audio: Audio) => void>, bgmSettings: Object.<number, (audio: Audio) => void> }} param0
 */
export function AudioManagerProvider({ sfxSettings, bgmSettings, children }) {
  const sfxBuffers = useLoader(AudioLoader, sfx);
  const positionalSfxBuffers = useLoader(AudioLoader, positionalSfx);
  const bgmBuffers = useLoader(AudioLoader, bgm);

  const listener = useMemo(() => new AudioListener(), []);

  const sfxAudios = useMemo(
    () =>
      sfxBuffers.map((b, i) => {
        const a = new Audio(listener).setBuffer(b).setVolume(2);
        if (sfxSettings) {
          const s = sfxSettings[i];
          if (s) {
            s(a);
          }
        }
        return a;
      }),
    []
  );
  const bgmAudios = useMemo(
    () =>
      bgmBuffers.map((b, i) => {
        const a = new Audio(listener).setBuffer(b).setVolume(0.4).setLoop(true);
        if (bgmSettings) {
          const s = bgmSettings[i];
          if (s) {
            s(a);
          }
        }
        return a;
      }),
    []
  );

  /** @type {PositionalAudio[]} */
  const positionalSfxAudios = [];

  const resume = () => {
    sfxAudios.forEach(a => {
      if (a.context.state === 'suspended') {
        a.context.resume();
      }
    });
    bgmAudios.forEach(a => {
      if (a.context.state === 'suspended') {
        a.context.resume();
      }
    });
    positionalSfxAudios.forEach(a => {
      if (a.context.state === 'suspended') {
        a.context.resume();
      }
    });
  };

  useEffect(() => {
    const handler = () => {
      resume();
    };

    document.addEventListener('keydown', handler, false);
    return () => document.removeEventListener('keydown', handler, false);
  }, []);

  const api = {
    listener,

    playSfx: index => {
      const a = sfxAudios[index];
      a.isPlaying = false;
      a.play();
    },

    stopSfx: index => {
      sfxAudios[index].stop();
    },

    playBgm: index => {
      bgmAudios[index].play();
    },

    stopBgm: index => {
      bgmAudios[index].stop();
    },

    createPositionalAudio: index => {
      const b = positionalSfxBuffers[index];
      const a = new PositionalAudio(listener)
        .setBuffer(b)
        .setVolume(2)
        .setRefDistance(2);
      positionalSfxAudios.push(a);
      return a;
    },
  };

  return (
    <AudioManagerContext.Provider value={api}>
      {children}
    </AudioManagerContext.Provider>
  );
}

export function useAudioManager() {
  const ctx = useContext(AudioManagerContext);

  if (ctx === undefined) {
    throw new Error(
      'useAudioManager must be used within a AudioManagerProvider'
    );
  }

  return ctx;
}

export default class AudioManager {
  constructor() {}
}
