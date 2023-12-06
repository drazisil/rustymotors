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
  includeLength: boolean = true
) {

  if (length === undefined) {
    throw new Error("Length must be provided for blobs");
  }

  if (!(data instanceof Buffer)) {
    throw new Error("Data must be a buffer");
  }

  let offset = 0;

  if (includeLength === true) {
    length += 2;
    offset = 2;
  }

  const buffer = Buffer.alloc(length);

  if (endianness === "LE") {
    buffer.writeUInt16LE(length - 2);
  } else {
    buffer.writeUInt16BE(length - 2);
  }

  for (const byte of data) {
    if (offset >= length) {
      break;
    }
    buffer.writeUInt8(byte, offset);
    offset++;
  }

  return buffer;
}

export function packFloat(
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

/**
 * Packs a boolean into a 2 byte buffer
 */
export function packBool(
  endianness: "LE" | "BE",
  data: unknown,
  length?: number,
  includeLength?: boolean
) {
  const buffer = Buffer.alloc(2);
  if (typeof data !== "boolean") {
    throw new Error("Data must be a boolean");
  }
  if (endianness === "LE") {
    buffer.writeUInt8(data ? 1 : 0, 0);
  } else {
    buffer.writeUInt8(data ? 1 : 0, 1);
  }
  return buffer;
}

export function packLengthShort(
  endianness: "LE" | "BE",
  data: unknown,
  length?: number,
  includeLength: boolean = false
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
  includeLength: boolean = true
) {

  if (length === undefined) {
    throw new Error("Length must be provided for variable length strings");
  }

  // Verify that data is a string
  if (typeof data !== "string") {
    throw new Error("Data must be a string");
  }

  if (includeLength === false) {
    throw new Error("includeLength must be true for variable length strings");
  }

  const buffer = Buffer.alloc(length + 2);

  let offset = 0;

  if (endianness === "LE") {
    buffer.writeUInt16LE(length);
  } else {
    buffer.writeUInt16BE(length);
  }

  offset = 2;

  buffer.write(data.substring(0, length), offset);

  return buffer;
}

export function packStringFixed(
  endianness: "LE" | "BE",
  data: unknown,
  length?: number,
  includeLength?: boolean
) {

  if (length === undefined) {
    throw new Error("Length must be provided for fixed length strings");
  }

  if (includeLength === true) {
    throw new Error("includeLength must be false for fixed length strings");
  }

  const buffer = Buffer.alloc(length);

  if (typeof data !== "string") {
    throw new Error("Data must be a string");
  }

  buffer.write(data.substring(0, length));

  return buffer;
}
