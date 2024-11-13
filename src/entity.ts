import { CanvasSetup } from "./canvas";
import { State } from "./garden";

export type Entity = {
  update: (state: State, canvasSetup: CanvasSetup) => void;
};

export class Cube implements Entity {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  age: number;
  realAge: number;
  color: string;

  constructor({
    x = 0,
    y = 0,
    velocityX = 0,
    velocityY = 0,
    size = 10,
    age = 0,
    realAge = 0,
    color = "red",
  }: Partial<Cube> = {}) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.size = size;
    this.age = age;
    this.realAge = realAge;
    this.color = color;
  }
  update(state: State, canvasSetup: CanvasSetup) {
    const { ctx, bounds } = canvasSetup;
    this.age += 1;
    this.realAge += state.deltaTime;

    // bounce a cube around the screen
    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x + this.size > bounds.width) {
      this.velocityX = -this.velocityX;
    }
    if (this.y + this.size > bounds.height) {
      this.velocityY = -this.velocityY;
    }
    if (this.x < 0) {
      this.velocityX = -this.velocityX;
    }
    if (this.y <= 0) {
      this.velocityY = -this.velocityY;
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    // this.debug();
  }

  debug() {
    console.table({
      x: this.x,
      y: this.y,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
    });
  }
}
