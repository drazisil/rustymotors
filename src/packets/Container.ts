export abstract class Container {
  // Public members
  constructor(id = 0, version = 0) {
    this._id = id;
    this._version = version;
    this._size = 0;
    this._data = new ArrayBuffer(this._size);
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get size(): number {
    return this._size;
  }

  get hasHeader(): boolean {
    return this._header !== undefined;
  }

  // Protected members
  protected setHeader(): void {
    this._header = new ArrayBuffer(8);
    const view = new DataView(this._header);
    view.setInt16(0, this._id);
    view.setInt16(2, this._size);
    view.setInt16(4, this._version);
    view.setInt16(6, 0);
  }

  protected isHeaderValid(): boolean {
    if (this._header === undefined) {
      return false;
    }
    const view = new DataView(this._header);
    const id = view.getInt16(0);
    const size = view.getInt16(2);
    const version = view.getInt16(4);
    const reserved = view.getInt16(6);
    return (
      id === this._id &&
      size === this._size &&
      version === this._version &&
      reserved === 0
    );
  }

  protected _id: number;
  protected _version: number;
  protected _data: ArrayBufferLike;
  protected _size: number;
  protected _header: ArrayBufferLike | undefined;

  // Private members

  // Static members
  static isInt8(value: number) {
    if (value >= -128 && value <= 127) {
      return value;
    }
    throw new Error(`Value ${value} is not a valid Int8`);
  }

  static isInt16(value: number) {
    if (value >= -32768 && value <= 32767) {
      return value;
    }
    throw new Error(`Value ${value} is not a valid Int16`);
  }

  static isInt32(value: number) {
    if (value >= -2147483648 && value <= 2147483647) {
      return value;
    }
    throw new Error(`Value ${value} is not a valid Int32`);
  }

  static PackInt8(value: number): ArrayBufferLike {
    const buffer = new ArrayBuffer(1);
    const view = new DataView(buffer);
    view.setInt8(0, value);
    return buffer;
  }

  static PackInt16(value: number): ArrayBufferLike {
    const buffer = new ArrayBuffer(2);
    const view = new DataView(buffer);
    view.setInt16(0, value);
    return buffer;
  }

  static PackString(
    value: string,
    length: number = value.length,
    includeLength: "no" | "before" | "after" = "no"
  ): ArrayBufferLike {
    const prefixLength = includeLength === "before" ? 2 : 0;
    const suffixLength = includeLength === "after" ? 2 : 0;
    const buffer = new ArrayBuffer(prefixLength + length + suffixLength);
    const view = new DataView(buffer);
    if (includeLength === "before") {
      view.setInt16(0, length);
    }
    for (let i = 0; i < length; i++) {
      // The length may include padding, so we need to pad the string
      if (i >= value.length) {
        view.setUint8(prefixLength + i, 0);
        continue;
      }
      view.setUint8(prefixLength + i, value.charCodeAt(i));
    }
    if (includeLength === "after") {
      view.setInt16(prefixLength + length, length);
    }
    return buffer;
  }

  static PackBlob(
    value: Buffer,
    length: number = value.byteLength,
    includeLength: "no" | "before" | "after" = "no"
  ): ArrayBufferLike {
    const prefixLength = includeLength === "before" ? 2 : 0;
    const suffixLength = includeLength === "after" ? 2 : 0;
    const buffer = new ArrayBuffer(prefixLength + length + suffixLength);
    const view = new DataView(buffer);
    if (includeLength === "before") {
      view.setInt16(0, length);
    }
    for (let i = 0; i < length; i++) {
      // The length may include padding, so we need to pad the string
      if (i >= value.length) {
        view.setUint8(prefixLength + i, 0);
        continue;
      }
      view.setUint8(prefixLength + i, value[i]);
    }
    if (includeLength === "after") {
      view.setInt16(prefixLength + length, length);
    }
    return buffer;
  }
}
