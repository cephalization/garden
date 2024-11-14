import { CanvasSetup } from "./canvas";
import { Entity } from "./entity";
import { System } from "./systems";

export type State = {
  time: number;
  deltaTime: number;
};

export class World {
  private entities: Entity[] = [];
  private systems: System[] = [];
  private nextEntityId = 0;

  addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  createEntity(): Entity {
    const entity = new Entity(this.nextEntityId++);
    this.addEntity(entity);
    return entity;
  }

  update(state: State, canvasSetup: CanvasSetup): void {
    this.systems.forEach((system) => {
      system.update({ entities: this.entities, state, canvasSetup });
    });
  }
}

export function run(config: { world: World; canvasSetup: CanvasSetup }) {
  const { world, canvasSetup } = config;
  const state: State = {
    time: 0,
    deltaTime: 0,
  };

  const update = () => {
    canvasSetup.update();
    const lastTime = state.time;
    state.time = Date.now();
    state.deltaTime = state.time - lastTime;

    world.update(state, canvasSetup);

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}
