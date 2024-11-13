import { CanvasSetup } from "./canvas";
import { Entity } from "./entity";

export type State = {
  time: number;
  deltaTime: number;
};

function createState(): State {
  return {
    time: 0,
    deltaTime: 0,
  };
}

export function run(config: { entities: Entity[]; canvasSetup: CanvasSetup }) {
  const { entities, canvasSetup } = config;
  const state = createState();

  const update = () => {
    canvasSetup.update();
    const lastTime = state.time;
    state.time = Date.now();
    state.deltaTime = state.time - lastTime;

    entities.forEach((entity) => {
      // save ctx.fillStyle
      const fillStyle = canvasSetup.ctx.fillStyle;
      entity.update(state, canvasSetup);
      // restore ctx.fillStyle
      canvasSetup.ctx.fillStyle = fillStyle;
    });

    requestAnimationFrame(update);
  };

  requestAnimationFrame(() => {
    update();
  });
}
