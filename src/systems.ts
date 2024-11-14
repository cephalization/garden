import { CanvasSetup } from "./canvas";
import { Entity } from "./entity";
import { Position, Velocity, Renderable, Movement } from "./components";
import { State } from "./garden";

export interface SystemUpdateConfig {
  entities: Entity[];
  state: State;
  canvasSetup: CanvasSetup;
}

export interface System {
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
