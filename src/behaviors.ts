import { Position, Velocity } from "./components";
import { CanvasSetup } from "./canvas";

export interface MovementBehavior {
  type: string;
  update(
    position: Position,
    velocity: Velocity,
    bounds: CanvasSetup["bounds"],
  ): void;
}

/**
 * @deprecated Replace with mass/size component value
 */
const TEMP_BODY_SIZE = 10;

export class BounceBehavior implements MovementBehavior {
  type = "bounce";

  constructor({ decay = 0 }: { decay?: number } = {}) {
    this.decay = decay;
  }

  update(
    position: Position,
    velocity: Velocity,
    bounds: CanvasSetup["bounds"],
  ) {
    position.x += velocity.x;
    position.y += velocity.y;

    if (position.x + TEMP_BODY_SIZE > bounds.width || position.x < 0) {
      if (position.x > bounds.width) {
        position.x = bounds.width - TEMP_BODY_SIZE;
      }
      if (position.x < 0) {
        position.x = 0;
      }
      if (velocity.x < 0) {
        velocity.x = Math.max(-velocity.x - this.decay, 0);
      } else {
        velocity.x = Math.min(-velocity.x + this.decay, 0);
      }
    }
    if (position.y + TEMP_BODY_SIZE > bounds.height || position.y < 0) {
      if (position.y > bounds.height) {
        position.y = bounds.height;
      }
      if (position.y < 0) {
        position.y = 0;
      }

      if (velocity.y < 0) {
        velocity.y = Math.max(-velocity.y - this.decay, 0);
      } else {
        velocity.y = Math.min(-velocity.y + this.decay, 0);
      }
    }
  }

  decay;
}

export class CircularBehavior implements MovementBehavior {
  type = "circular";
  private center: { x: number; y: number };
  private radius: number;
  private angle: number;
  private speed: number;

  constructor(centerX: number, centerY: number, radius: number, speed = 0.02) {
    this.center = { x: centerX, y: centerY };
    this.radius = radius;
    this.angle = 0;
    this.speed = speed;
  }

  update(position: Position, velocity: Velocity) {
    this.angle += this.speed;
    position.x = this.center.x + Math.cos(this.angle) * this.radius;
    position.y = this.center.y + Math.sin(this.angle) * this.radius;

    // Update velocity for any components that might need it
    velocity.x = -Math.sin(this.angle) * this.speed * this.radius;
    velocity.y = Math.cos(this.angle) * this.speed * this.radius;
  }
}

export class SineBehavior implements MovementBehavior {
  type = "sine";
  private startY: number;
  private amplitude: number;
  private frequency: number;
  private time: number = 0;

  constructor(
    startY: number,
    amplitude: number = 100,
    frequency: number = 0.005,
  ) {
    this.startY = startY;
    this.amplitude = amplitude;
    this.frequency = frequency;
  }

  update(position: Position, velocity: Velocity) {
    this.time += 1;
    position.x += velocity.x;
    position.y =
      this.startY + Math.sin(this.time * this.frequency) * this.amplitude;

    // Wrap around screen
    if (position.x < -TEMP_BODY_SIZE)
      position.x = window.innerWidth + TEMP_BODY_SIZE;
    if (position.x > window.innerWidth + TEMP_BODY_SIZE)
      position.x = -TEMP_BODY_SIZE;
  }
}

export class GravityBehavior implements MovementBehavior {
  type = "gravity";
  private gravity: number;
  private bounce: number;

  constructor(gravity: number = 0.5, bounce: number = 0.7) {
    this.gravity = gravity;
    this.bounce = bounce;
  }

  update(
    position: Position,
    velocity: Velocity,
    bounds: CanvasSetup["bounds"],
  ) {
    velocity.y += this.gravity;
    position.x += velocity.x;
    position.y += velocity.y;

    // Ground collision
    if (position.y + TEMP_BODY_SIZE > bounds.height) {
      position.y = bounds.height - TEMP_BODY_SIZE;
      velocity.y = -velocity.y * this.bounce;
    }

    // Wall collision
    if (position.x + TEMP_BODY_SIZE > bounds.width || position.x < 0) {
      velocity.x = -velocity.x * this.bounce;
    }
  }
}
