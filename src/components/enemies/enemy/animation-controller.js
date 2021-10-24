/**
 * @typedef {import('../../../animations/types').AnimationTransform} AnimationTransform
 * @typedef {import('@react-three/fiber').GroupProps} GroupProps
 * @typedef {import('../../../utils/level-loader/types').Direction} Direction
 * @typedef {import('./').EnemyApi} EnemyApi
 */

import { Mutex } from 'async-mutex';

import { mapXToPosX, mapZToPosZ, directionAngle } from '../../../levels/common';
import { Direction } from '../../../utils/level-loader/common';

import createMoveNorthAnim from '../../../animations/move-north';
import createMoveSouthAnim from '../../../animations/move-south';
import createMoveWestAnim from '../../../animations/move-west';
import createMoveEastAnim from '../../../animations/move-east';
import createRotateLeftAnim from '../../../animations/rotate-left';
import createRotateRightAnim from '../../../animations/rotate-right';

import createAttackNorthAnim from '../../../animations/attack-north';
import createAttackSouthAnim from '../../../animations/attack-south';
import createAttackWestAnim from '../../../animations/attack-west';
import createAttackEastAnim from '../../../animations/attack-east';

const MOVE_DURATION = 300;
const TURN_DURATION = 300;

const ATTACK_DURATION = 200;
const ATTACK_DISTANCE = 0.5;

export default class AnimationController {
  #mutex;

  #ref;

  #transform;
  #x;
  #z;
  #look;
  #rotY;

  #moveNorthAnim;
  #moveSouthAnim;
  #moveWestAnim;
  #moveEastAnim;

  #moveForwardAnimLookup;
  #moveBackwardAnimLookup;
  #strafeLeftAnimLookup;
  #strafeRightAnimLookup;

  #rotateLeftAnim;
  #rotateRightAnim;

  #attackNorthAnim;
  #attackSouthAnim;
  #attackWestAnim;
  #attackEastAnim;

  #attackAnimLookup;

  /**
   * @param {React.MutableRefObject<GroupProps>} ref
   */
  constructor(ref) {
    this.#mutex = new Mutex();

    this.#ref = ref;

    /** @type {AnimationTransform} */
    this.#transform = {
      x: 0,
      y: 0,
      z: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scaleX: 0,
      scaleY: 0,
      scaleZ: 0,
    };

    this.#x = 0;
    this.#z = 0;
    this.#look = '';

    this.#buildMoveAnims();
    this.#buildRotateAnims();
    this.#buildAttackAnims();

    this.#moveForwardAnimLookup = {
      [Direction.north]: this.#moveNorthAnim,
      [Direction.south]: this.#moveSouthAnim,
      [Direction.west]: this.#moveWestAnim,
      [Direction.east]: this.#moveEastAnim,
    };
    this.#moveBackwardAnimLookup = {
      [Direction.north]: this.#moveSouthAnim,
      [Direction.south]: this.#moveNorthAnim,
      [Direction.west]: this.#moveEastAnim,
      [Direction.east]: this.#moveWestAnim,
    };
    this.#strafeLeftAnimLookup = {
      [Direction.north]: this.#moveWestAnim,
      [Direction.south]: this.#moveEastAnim,
      [Direction.west]: this.#moveSouthAnim,
      [Direction.east]: this.#moveNorthAnim,
    };
    this.#strafeRightAnimLookup = {
      [Direction.north]: this.#moveEastAnim,
      [Direction.south]: this.#moveWestAnim,
      [Direction.west]: this.#moveNorthAnim,
      [Direction.east]: this.#moveSouthAnim,
    };

    this.#attackAnimLookup = {
      [Direction.north]: this.#attackNorthAnim,
      [Direction.south]: this.#attackSouthAnim,
      [Direction.west]: this.#attackWestAnim,
      [Direction.east]: this.#attackEastAnim,
    };
  }

  /**
   * @param {number} x
   * @param {number} z
   * @param {Direction} look
   */
  reset(x, z, look) {
    this.#x = mapXToPosX(x);
    this.#z = mapZToPosZ(z);
    this.#look = look;
    this.#rotY = directionAngle[look];

    this.#transform.x = 0;
    this.#transform.y = 0;
    this.#transform.z = 0;
    this.#transform.rotY = 0;
    this.#transform.scaleY = 1;

    this.#update(this.#transform);
  }

  async moveForward() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#moveForwardAnimLookup[this.#look];
      a.play();
      await a.finished;
    });
  }

  async moveBackward() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#moveBackwardAnimLookup[this.#look];
      a.play();
      await a.finished;
    });
  }

  async strafeLeft() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#strafeLeftAnimLookup[this.#look];
      a.play();
      await a.finished;
    });
  }

  async strafeRight() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#strafeRightAnimLookup[this.#look];
      a.play();
      await a.finished;
    });
  }

  async rotateLeft() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#rotateLeftAnim;
      a.play();
      await a.finished;
    });
  }

  async rotateRight() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#rotateRightAnim;
      a.play();
      await a.finished;
    });
  }

  async attack() {
    await this.#mutex.runExclusive(async () => {
      const a = this.#attackAnimLookup[this.#look];
      a.play();
      await a.finished;
    });
  }

  /**
   * @param {AnimationTransform} transform
   */
  #update = transform => {
    if (!this.#ref.current) {
      return;
    }

    const t = transform;

    this.#ref.current.position.set(this.#x + t.x, t.y, this.#z + t.z);
    this.#ref.current.rotation.set(0, this.#rotY + t.rotY, 0);
    this.#ref.current.scale.set(1, t.scaleY, 1);
  };

  #buildMoveAnims() {
    this.#moveNorthAnim = createMoveNorthAnim(
      this.#transform,
      this.#update,
      MOVE_DURATION
    );
    this.#moveSouthAnim = createMoveSouthAnim(
      this.#transform,
      this.#update,
      MOVE_DURATION
    );
    this.#moveWestAnim = createMoveWestAnim(
      this.#transform,
      this.#update,
      MOVE_DURATION
    );
    this.#moveEastAnim = createMoveEastAnim(
      this.#transform,
      this.#update,
      MOVE_DURATION
    );
  }

  #buildRotateAnims() {
    this.#rotateLeftAnim = createRotateLeftAnim(
      this.#transform,
      this.#update,
      TURN_DURATION
    );
    this.#rotateRightAnim = createRotateRightAnim(
      this.#transform,
      this.#update,
      TURN_DURATION
    );
  }

  #buildAttackAnims() {
    this.#attackNorthAnim = createAttackNorthAnim(
      this.#transform,
      this.#update,
      ATTACK_DURATION,
      ATTACK_DISTANCE
    );
    this.#attackSouthAnim = createAttackSouthAnim(
      this.#transform,
      this.#update,
      ATTACK_DURATION,
      ATTACK_DISTANCE
    );
    this.#attackWestAnim = createAttackWestAnim(
      this.#transform,
      this.#update,
      ATTACK_DURATION,
      ATTACK_DISTANCE
    );
    this.#attackEastAnim = createAttackEastAnim(
      this.#transform,
      this.#update,
      ATTACK_DURATION,
      ATTACK_DISTANCE
    );
  }
}
