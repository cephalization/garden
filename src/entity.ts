import { Component } from "./components";

export class Entity {
  private components: Map<string, Component> = new Map();
  public id: number;

  constructor(id: number) {
    this.id = id;
  }

  addComponent(component: Component): void {
    this.components.set(component.type, component);
  }

  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  hasComponent(type: string): boolean {
    return this.components.has(type);
  }

  removeComponent(type: string): void {
    this.components.delete(type);
  }
}
