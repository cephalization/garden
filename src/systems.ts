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
  }
  init(): void {
    if (window) {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.held.add(e.key);
      });
      window.addEventListener("keyup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.held.delete(e.key);
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
        // pull out watched keys
        const keys = Object.fromEntries(this.held.entries());
        // pull out relevant components
        const eVelocity = entity.getComponent<Velocity>("velocity")!;
        const eController = entity.getComponent<Controller>("controller")!;
        // apply velocities
        if (
          this.keymap.up.some((key) => keys[key] !== undefined) &&
          eController.directions.up
        ) {
          eVelocity.y -= eController.directions.up.v;
        }
        if (
          this.keymap.down.some((key) => keys[key] !== undefined) &&
          eController.directions.down
        ) {
          eVelocity.y += eController.directions.down.v;
        }
        if (
          this.keymap.left.some((key) => keys[key] !== undefined) &&
          eController.directions.left
        ) {
          eVelocity.x -= eController.directions.left.v;
        }
        if (
          this.keymap.right.some((key) => keys[key] !== undefined) &&
          eController.directions.right
        ) {
          eVelocity.x += eController.directions.right.v;
        }
      }
    });
  }
  keymap;
  held: Set<string> = new Set();
}
