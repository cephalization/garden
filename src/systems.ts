import { CanvasSetup } from "./canvas";
import { Entity } from "./entity";
import {
  Position,
  Velocity,
  Renderable,
  Movement,
  Controller,
} from "./components";
import { State } from "./garden";

export interface SystemUpdateConfig {
  entities: Entity[];
  state: State;
  canvasSetup: CanvasSetup;
}

export interface System {
  init?: () => void;
  update(config: SystemUpdateConfig): void;
  cleanup?: () => void;
}

export class MovementSystem implements System {
  update({ entities, canvasSetup }: SystemUpdateConfig): void {
    entities.forEach((entity) => {
      if (
        entity.hasComponent("position") &&
        entity.hasComponent("velocity") &&
        entity.hasComponent("movement")
      ) {
        const position = entity.getComponent<Position>("position")!;
        const velocity = entity.getComponent<Velocity>("velocity")!;
        // TODO: Support multiple component fetch
        // We'd like to be able to stack components of the same general type
        // We should probably add a "subType" field as well so systems can select
        // A general type or a more specific type
        // OR we just support multiple behaviors on the same movement component...
        // that might be easiest for now
        const movement = entity.getComponent<Movement>("movement")!;

        movement.behavior.update(position, velocity, canvasSetup.bounds);
      }
    });
  }
}

// TODO: This only renders cubes
// Implement a system similar to the movement behavior system for rendering entities
export class RenderSystem implements System {
  update({ entities, canvasSetup }: SystemUpdateConfig): void {
    const { ctx } = canvasSetup;

    entities.forEach((entity) => {
      if (
        entity.hasComponent("position") &&
        entity.hasComponent("renderable")
      ) {
        const position = entity.getComponent<Position>("position")!;
        const renderable = entity.getComponent<Renderable>("renderable")!;

        ctx.fillStyle = renderable.color;
        ctx.fillRect(position.x, position.y, renderable.size, renderable.size);
      }
    });
  }
}

export type KeyMeta = {
  key: string;
  held: boolean;
  pressed: boolean;
  released: boolean;
};

export class KeyboardControllerSystem implements System {
  static DEFAULT_KEYMAP = {
    up: ["ArrowUp", "w"],
    down: ["ArrowDown", "s"],
    left: ["ArrowLeft", "a"],
    right: ["ArrowRight", "d"],
  };
  constructor({
    keymap = KeyboardControllerSystem.DEFAULT_KEYMAP,
  }: {
    keymap?: { up: string[]; down: string[]; left: string[]; right: string[] };
  } = {}) {
    this.keymap = keymap;
    this.held = new Map<string, KeyMeta>();
    Object.values(this.keymap).forEach((keys) => {
      keys.forEach((key) => {
        this.held.set(key, {
          key,
          held: false,
          pressed: false,
          released: false,
        });
      });
    });
  }
  init(): void {
    if (window) {
      window.addEventListener("keydown", (e) => {
        const oldMeta = this.held.get(e.key);
        this.held.set(e.key, {
          key: e.key,
          held: true,
          pressed: !oldMeta?.held,
          released: false,
        });
      });
      window.addEventListener("keyup", (e) => {
        this.held.set(e.key, {
          key: e.key,
          held: false,
          pressed: false,
          released: true,
        });
      });
    }
  }
  update(config: SystemUpdateConfig): void {
    const { entities } = config;

    entities.forEach((entity) => {
      if (
        entity.hasComponent("velocity") &&
        entity.hasComponent("controller")
      ) {
        // pull out relevant components
        const eVelocity = entity.getComponent<Velocity>("velocity")!;
        const eController = entity.getComponent<Controller>("controller")!;
        // apply hold velocities
        if (
          this.keymap.up.some((key) => this.held.get(key)?.held) &&
          eController.modifiers.hold?.up
        ) {
          eVelocity.y -= eController.modifiers.hold?.up.v;
        }
        if (
          this.keymap.down.some((key) => this.held.get(key)?.held) &&
          eController.modifiers.hold?.down
        ) {
          eVelocity.y += eController.modifiers.hold?.down.v;
        }
        if (
          this.keymap.left.some((key) => this.held.get(key)?.held) &&
          eController.modifiers.hold?.left
        ) {
          eVelocity.x -= eController.modifiers.hold?.left.v;
        }
        if (
          this.keymap.right.some((key) => this.held.get(key)?.held) &&
          eController.modifiers.hold?.right
        ) {
          eVelocity.x += eController.modifiers.hold?.right.v;
        }
        // apply press velocities
        if (
          this.keymap.up.some((key) => this.held.get(key)?.pressed) &&
          eController.modifiers.press?.up
        ) {
          eVelocity.y -= eController.modifiers.press?.up.v;
        }
        if (
          this.keymap.down.some((key) => this.held.get(key)?.pressed) &&
          eController.modifiers.press?.down
        ) {
          eVelocity.y += eController.modifiers.press?.down.v;
        }
        if (
          this.keymap.left.some((key) => this.held.get(key)?.pressed) &&
          eController.modifiers.press?.left
        ) {
          eVelocity.x -= eController.modifiers.press?.left.v;
        }
        if (
          this.keymap.right.some((key) => this.held.get(key)?.pressed) &&
          eController.modifiers.press?.right
        ) {
          eVelocity.x += eController.modifiers.press?.right.v;
        }
        // apply release velocities
        if (
          this.keymap.up.some((key) => this.held.get(key)?.released) &&
          eController.modifiers.release?.up
        ) {
          eVelocity.y -= eController.modifiers.release?.up.v;
        }
        if (
          this.keymap.down.some((key) => this.held.get(key)?.released) &&
          eController.modifiers.release?.down
        ) {
          eVelocity.y += eController.modifiers.release?.down.v;
        }
        if (
          this.keymap.left.some((key) => this.held.get(key)?.released) &&
          eController.modifiers.release?.left
        ) {
          eVelocity.x += eController.modifiers.release?.left.v;
        }
        if (
          this.keymap.right.some((key) => this.held.get(key)?.released) &&
          eController.modifiers.release?.right
        ) {
          eVelocity.x += eController.modifiers.release?.right.v;
        }
      }
    });
  }
  cleanup() {
    // reset pressed and released flags
    this.held.forEach((meta) => {
      meta.pressed = false;
      meta.released = false;
    });
  }
  keymap;
  held;
}
