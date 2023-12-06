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

export function unpackBlob(
  endianness: "LE" | "BE",
  data: Buffer,
  length?: number
) {
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

export function unpackBool(endianness: "LE" | "BE", data: Buffer) {
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
    return data.subarray(0, length).toString();
  }
  throw new Error("Length must be provided for variable length string");
}

export function unpackStringFixed(
  endianness: "LE" | "BE",
  data: Buffer,
  length?: number
) {
  if (length) {
    return data.subarray(0, length).toString();
  }
  throw new Error("Length must be provided for fixed length string");
}
