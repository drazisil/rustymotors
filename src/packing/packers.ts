export function unpackShort(endianness: "LE" | "BE", data: Buffer) {
    if (endianness === "LE") {
      return data.readUInt16LE();
    }
    return data.readUInt16BE();
  }
  
  export function unpackByte(endianness: "LE" | "BE", data: Buffer) {
    if (endianness === "LE") {
      return data.readUInt8();
    }
    return data.readUInt8();
  }
  
  export function unpackLong(endianness: "LE" | "BE", data: Buffer) {
    if (endianness === "LE") {
      return data.readUInt32LE();
    }
    return data.readUInt32BE();
  }
  
  export function unpackBlob(endianness: "LE" | "BE", data: Buffer, length?: number) {
    if (length) {
      return data.subarray(0, length);
    }
    return data;
  }
  
  export function unpackFloat(endianness: "LE" | "BE", data: Buffer) {
    if (endianness === "LE") {
      return data.readFloatLE();
    }
    return data.readFloatBE();
  }
  
  function unpackBool(endianness: "LE" | "BE", data: Buffer) {
    return data.readUInt8() === 1;
  }
  
  export function unpackLengthShort(endianness: "LE" | "BE", data: Buffer) {
    if (endianness === "LE") {
      return data.readUInt16LE();
    }
    return data.readUInt16BE();
  }
  
  export function unpackStringVar(
    endianness: "LE" | "BE",
    data: Buffer,
    length?: number
  ) {
    if (length) {
      return data.subarray(0, length);
    }
    throw new Error("Length must be provided for variable length string");
  }
  
  export function unpackStringFixed(
    endianness: "LE" | "BE",
    data: Buffer,
    length?: number
  ) {
    if (length) {
      return data.subarray(0, length);
    }
    throw new Error("Length must be provided for fixed length string");
  }
  
  export function packShort(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(2);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt16LE(data);
    } else {
      buffer.writeUInt16BE(data);
    }
    return buffer;
  }
  
  export function packByte(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(1);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt8(data);
    } else {
      buffer.writeUInt8(data);
    }
    return buffer;
  }
  
  export function packLong(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(4);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt32LE(data);
    } else {
      buffer.writeUInt32BE(data);
    }
    return buffer;
  }
  
  export function packBlob(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(4);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt32LE(data);
    } else {
      buffer.writeUInt32BE(data);
    }
    return buffer;
  }
  
  export   function packFloat(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(4);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeFloatLE(data);
    } else {
      buffer.writeFloatBE(data);
    }
    return buffer;
  }
  
  export function packBool(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(1);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt8(data);
    } else {
      buffer.writeUInt8(data);
    }
    return buffer;
  }
  
  export function packLengthShort(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(2);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt16LE(data);
    } else {
      buffer.writeUInt16BE(data);
    }
    return buffer;
  }
  
  export function packStringVar(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(2);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt16LE(data);
    } else {
      buffer.writeUInt16BE(data);
    }
    return buffer;
  }
  
  export function packStringFixed(
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) {
    const buffer = Buffer.alloc(2);
    if (typeof data !== "number") {
      throw new Error("Data must be a number");
    }
    if (endianness === "LE") {
      buffer.writeUInt16LE(data);
    } else {
      buffer.writeUInt16BE(data);
    }
    return buffer;
  }