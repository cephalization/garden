import { MovementBehavior } from "./behaviors";

export abstract class Component {
  abstract type: string;
}

export class Position extends Component {
  type = "position" as const;
  constructor(params: { x: number; y: number }) {
    super();
    this.x = params.x;
    this.y = params.y;
  }
  x: number;
  y: number;
}

export class Velocity extends Component {
  type = "velocity" as const;
  constructor(params: { x: number; y: number }) {
    super();
    this.x = params.x;
    this.y = params.y;
  }
  x: number;
  y: number;
}

// TODO distinguish this from mass / bounds
// Update movement behaviors to require position, velocity, bounds, mass, etc
export class Renderable extends Component {
  type = "renderable" as const;
  constructor(params: { color: string; size: number }) {
    super();
    this.color = params.color;
    this.size = params.size;
  }
  color: string;
  size: number;
}

export class Age extends Component {
  type = "age" as const;
  constructor(params: { age: number; realAge: number }) {
    super();
    this.age = params.age;
    this.realAge = params.realAge;
  }
  age: number;
  realAge: number;
}

export class Movement extends Component {
  type = "movement" as const;
  constructor(params: { behavior: MovementBehavior }) {
    super();
    this.behavior = params.behavior;
  }
  behavior: MovementBehavior;
}

export class Controller extends Component {
  type = "controller" as const;
  constructor(params: {
    directions: Partial<
      Record<"up" | "down" | "left" | "right", { v: number }>
    >;
  }) {
    super();
    this.directions = params.directions;
  }

  directions;
}
