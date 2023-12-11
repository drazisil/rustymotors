import { Container } from "./Container.js";

export abstract class ListEntry extends Container {
  // Public members
  constructor() {
    super(0, 0);
    this._size = 0;
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
  }

  get hasHeader(): boolean {
    return false;
  }

  abstract deserialize(data: ArrayBufferLike): void;

  abstract serialize(): ArrayBufferLike;
}
