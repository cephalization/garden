import "./style.css";
import { setupCanvas } from "./canvas";
import { World, run } from "./garden";
import {
  KeyboardControllerSystem,
  MovementSystem,
  RenderSystem,
} from "./systems";
import {
  Position,
  Velocity,
  Renderable,
  Movement,
  Controller,
} from "./components";
import {
  BounceBehavior,
  CircularBehavior,
  GravityBehavior,
  SineBehavior,
} from "./behaviors";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}

const canvasSetup = setupCanvas(canvas);
const world = new World();

// Add systems
world.addSystem(new KeyboardControllerSystem());
world.addSystem(new MovementSystem());
world.addSystem(new RenderSystem());

// Create entities
// Bouncing cube
const bouncingCube = world.createEntity();
bouncingCube.addComponent(new Position({ x: 0, y: 0 }));
bouncingCube.addComponent(new Velocity({ x: 2, y: 2 }));
bouncingCube.addComponent(new Renderable({ color: "green", size: 10 }));
bouncingCube.addComponent(new Movement({ behavior: new BounceBehavior() }));

// Circular motion cube
const circularCube = world.createEntity();
circularCube.addComponent(
  new Position({
    x: canvasSetup.bounds.width / 2,
    y: canvasSetup.bounds.height / 2,
  }),
);
circularCube.addComponent(new Velocity({ x: 0, y: 0 }));
circularCube.addComponent(new Renderable({ color: "blue", size: 10 }));
circularCube.addComponent(
  new Movement({
    behavior: new CircularBehavior(
      canvasSetup.bounds.width / 2,
      canvasSetup.bounds.height / 2,
      100,
    ),
  }),
);

// Sine wave cube
const sineCube = world.createEntity();
sineCube.addComponent(new Position({ x: 0, y: canvasSetup.bounds.height / 2 }));
sineCube.addComponent(new Velocity({ x: 2, y: 0 }));
sineCube.addComponent(new Renderable({ color: "purple", size: 10 }));
sineCube.addComponent(
  new Movement({
    behavior: new SineBehavior(canvasSetup.bounds.height / 2),
  }),
);

// Falling cube with gravity
const gravityCube = world.createEntity();
gravityCube.addComponent(new Position({ x: 100, y: 0 }));
gravityCube.addComponent(new Velocity({ x: 2, y: 0 }));
gravityCube.addComponent(new Renderable({ color: "orange", size: 10 }));
gravityCube.addComponent(new Movement({ behavior: new GravityBehavior() }));

// User controllable cube with bounce
const playerCube = world.createEntity();
playerCube.addComponent(
  new Position({ x: 100, y: canvasSetup.bounds.height - 80 }),
);
playerCube.addComponent(new Velocity({ x: 0, y: 0 }));
playerCube.addComponent(new Renderable({ color: "pink", size: 10 }));
playerCube.addComponent(
  new Controller({
    directions: {
      right: { v: 0.3 },
      left: { v: 0.3 },
      up: { v: 0.3 },
      down: { v: 0.3 },
    },
  }),
);
playerCube.addComponent(
  new Movement({ behavior: new GravityBehavior(0.5, 0.1) }),
);
playerCube.addComponent(
  new Movement({ behavior: new BounceBehavior({ decay: 2 }) }),
);

// User controllable cube with gravity
const playerCube2 = world.createEntity();
playerCube2.addComponent(
  new Position({ x: 400, y: canvasSetup.bounds.height - 80 }),
);
playerCube2.addComponent(new Velocity({ x: 0, y: 0 }));
playerCube2.addComponent(new Renderable({ color: "yellow", size: 10 }));
playerCube2.addComponent(
  new Controller({
    directions: {
      right: { v: 0.3 },
      left: { v: 0.3 },
      up: { v: 0.6 },
      down: { v: 0.3 },
    },
  }),
);
playerCube2.addComponent(
  new Movement({ behavior: new GravityBehavior(0.5, 0.1) }),
);

run({ world, canvasSetup });
