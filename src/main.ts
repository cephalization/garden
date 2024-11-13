import "./style.css";
import { setupCanvas } from "./canvas.ts";
import { run } from "./garden.ts";
import { Cube } from "./entity.ts";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}

const canvasSetup = setupCanvas(canvas);

run({
  entities: [
    new Cube({ velocityX: 1.99, velocityY: 1.99, color: "green" }),
    new Cube({
      x: canvasSetup.bounds.width - 10,
      y: canvasSetup.bounds.height - 10,
      velocityX: -1.99,
      velocityY: -1.99,
    }),
    new Cube({
      x: canvasSetup.bounds.width / 2,
      y: canvasSetup.bounds.height / 2,
      velocityX: 0.99,
      velocityY: 0.99,
    }),
    new Cube({
      x: canvasSetup.bounds.width / 2,
      y: canvasSetup.bounds.height - 10,
      velocityX: 0.99,
      velocityY: 0.99,
    }),
    new Cube({
      x: canvasSetup.bounds.width - 10,
      y: canvasSetup.bounds.height / 2,
      velocityX: -0.99,
      velocityY: -0.99,
    }),
  ],
  canvasSetup,
});
