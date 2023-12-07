import e from "express";
import {
  packShort,
  packByte,
  packLong,
  packBlob,
  packFloat,
  packBool,
  packStringVar,
  packStringFixed,
} from "./packers.js";
import {
  unpackBool,
  unpackByte,
  unpackFloat,
  unpackLong,
  unpackShort,
  unpackLengthShort,
  unpackStringFixed,
  unpackStringVar,
  unpackBlob,
} from "./unpackers.js";
import { VERSIONED_GAME_HEADER } from "./packStrings.js";
import { PackCode, PackString, Packer, Unpacker } from "./constants.js";

export const unpackers: Unpacker[] = [
  {
    packCode: "SHORT",
    direction: "inbound",
    packFunction: unpackShort,
  },
  {
    packCode: "BYTE",
    direction: "inbound",
    packFunction: unpackByte,
  },
  {
    packCode: "LONG",
    direction: "inbound",
    packFunction: unpackLong,
  },
  {
    packCode: "BLOB",
    direction: "inbound",
    packFunction: unpackBlob,
  },
  {
    packCode: "FLOAT",
    direction: "inbound",
    packFunction: unpackFloat,
  },
  {
    packCode: "BOOL",
    direction: "inbound",
    packFunction: unpackBool,
  },
  {
    packCode: "LENGTH_SHORT",
    direction: "inbound",
    packFunction: unpackLengthShort,
  },
  {
    packCode: "STRING_VAR",
    direction: "inbound",
    packFunction: unpackStringVar,
  },
  {
    packCode: "STRING_FIXED",
    direction: "inbound",
    packFunction: unpackStringFixed,
  },
];

export const packers: Packer[] = [
  {
    packCode: "SHORT",
    direction: "outbound",
    packFunction: packShort,
  },
  {
    packCode: "BYTE",
    direction: "outbound",
    packFunction: packByte,
  },
  {
    packCode: "LONG",
    direction: "outbound",
    packFunction: packLong,
  },
  {
    packCode: "BLOB",
    direction: "outbound",
    packFunction: packBlob,
  },
  {
    packCode: "FLOAT",
    direction: "outbound",
    packFunction: packFloat,
  },
  {
    packCode: "BOOL",
    direction: "outbound",
    packFunction: packBool,
  },

  {
    packCode: "STRING_VAR",
    direction: "outbound",
    packFunction: packStringVar,
  },
  {
    packCode: "STRING_FIXED",
    direction: "outbound",
    packFunction: packStringFixed,
  },
];

function getDataLength(packCode: PackCode, value: unknown) {
  switch (packCode) {
    case "SHORT":
      return 2;
    case "BYTE":
      return 1;
    case "LONG":
      return 4;
    case "BLOB":
      return (value as Buffer).length;
    case "FLOAT":
      return 4;
    case "BOOL":
      return 2;
    case "LENGTH_SHORT":
      return 2;
    case "STRING_VAR":
      return (value as Buffer).length / 2;
    case "STRING_FIXED":
      return (value as Buffer).length / 2;
    case "VERSIONED_GAME_HEADER":
      return 12;
  }
  throw new Error(`No data length found for pack code ${packCode}`);
}

/**
 * Given a pack code and data, unpack the data into an array
 */
export function unpack(packCode: PackString, data: Buffer) {
  let dataOffset = 0;
  let packStringIndex = 0;
  let length;
  let endianness: "LE" | "BE" = "BE";
  let code: PackCode = "BE";

  // Create a new array of unknowns to store the unpacked data
  const unpackedData: unknown[] = [];

  // Loop through the pack string
  while (packStringIndex < packCode.length) {
    // Get the pack code
    code = packCode[packStringIndex];

    console.log(
      `Unpacking ${code} at offset ${dataOffset}, index ${packStringIndex}`
    );

    if (code === "END") {
      break;
    }

    // If the code is an endianness code, change the endianness
    if (code === "LE" || code === "BE") {
      endianness = code;
      packStringIndex++;
      continue;
    }

    // If the pack code is a length prefix, get the length
    if (code === "LENGTH_SHORT") {
      length = unpackLengthShort(endianness, data.subarray(dataOffset));

      console.log(`Length: ${length}`);

      // Move the offset past the length prefix
      dataOffset += 2;

      // Move the index past the pack code
      packStringIndex++;

      continue;
    }

    // If the pack code is a nested pack string, unpack the nested pack string
    if (code === "VERSIONED_GAME_HEADER") {
      // Get the nested pack string
      const nestedPackString = VERSIONED_GAME_HEADER;


      // Unpack the nested pack string
      const unpackedNested = unpack(nestedPackString, data.subarray(dataOffset));

      // Add the unpacked nested data to the array
      unpackedData.push(unpackedNested);

      // Advance the offset past the unpacked nested data
      dataOffset += getDataLength(code, unpackedNested);

      // Advance the index past the nested pack string
      packStringIndex++;

      continue;
    }

    // Get the unpacker for this pack code
    const unpacker = unpackers.find((unpacker) => unpacker.packCode === code);

    // If there is no unpacker, throw an error
    if (!unpacker) {
      throw new Error(`No unpacker found for pack code ${code}`);
    }

    // Unpack the data
    const unpacked = unpacker.packFunction(
      endianness,
      data.subarray(dataOffset),
      length
    );

    console.log(`Adding type ${typeof unpacked} to unpacked data`);

    // Add the unpacked data to the array
    unpackedData.push(unpacked);

    // If the length was provided, move the offset past the length
    if (length) {
      dataOffset += length;
    } else {
      // Advance the offset past the unpacked data
      dataOffset += getDataLength(code, unpacked);
    }

    // Reset the length
    length = undefined;

    console.log(`New offset: ${dataOffset}`);

    // Advance the index past the pack code
    packStringIndex++;

    // If the offset is past the end of the data, break out of the loop
    if (dataOffset > data.length) {
      break;
    }
  }

  // If the offset is not at the end of the data, log a warning
  if (dataOffset !== data.length && code !== "END") {
    console.warn(
      `Offset ${dataOffset} is not at the end of the data (${data.length})`
    );
    console.log(`Remaining data: ${data.subarray(dataOffset).toString("hex")}`);
  }

  // Return the unpacked data
  return unpackedData;
}

/**
 * Given a pack code and data, pack the data into a buffer
 * @param packCode
 * @param data
 */
export function pack(packCode: PackString, data: unknown[]) {
  let dataIndex = 0;
  let writeIndex = 0;
  let packStringIndex = 0;
  let length;
  let endianness: "LE" | "BE" = "BE";
  let code: PackCode = "BE";

  // Create a large buffer to store the packed data
  const packedData = Buffer.alloc(1024);

  // Loop through the pack string
  while (packStringIndex < packCode.length) {
    // Get the pack code
    code = packCode[packStringIndex];

    console.log(
      `Packing ${code} at data index ${dataIndex}, pack string index ${packStringIndex}`
    );

    if (code === "END") {
      break;
    }

    // If the code is an endianness code, change the endianness
    if (code === "LE" || code === "BE") {
      endianness = code;
      packStringIndex++;
      continue;
    }

    // Log the data
    console.log(
      `Data: ${data[dataIndex]} (${typeof data[dataIndex]} bytes) with length ${
        data[dataIndex].length
      }`
    );

    // If the pack code is a length prefix, pack the data as a length prefix
    if (code === "LENGTH_SHORT") {
      // Set the length
      length = data[dataIndex] as number;

      console.log(`Length: ${length}`);

      // Move the offset past the length prefix
      dataIndex++;

      // Move the index past the pack code
      packStringIndex++;

      continue;
    }

    // Get the packer for this pack code
    const packer = packers.find((packer) => packer.packCode === code);

    // If there is no packer, throw an error
    if (!packer) {
      throw new Error(`No packer found for pack code ${code}`);
    }

    // Pack the data
    const packed = packer.packFunction(endianness, data[dataIndex], length);

    console.log(`Adding packed ${packed.toString("hex")} to packed data`);

    // Add the packed data to the buffer
    packedData.set(packed, writeIndex);

    // If the length was provided, move the offset past the length
    if (length) {
      writeIndex += length;
    } else {
      // Advance the offset past the unpacked data
      writeIndex += getDataLength(code, packed);
    }

    // Reset the length
    length = undefined;

    console.log(`New offset: ${dataIndex}`);

    // Advance the index past the pack code
    packStringIndex++;

    // Advance the data index
    dataIndex++;
  }

  // If the offset is not at the end of the data, log a warning
  if (dataIndex !== data.length && code !== "END") {
    console.warn(
      `Offset ${data[dataIndex]} is not at the end of the data (${data.length})`
    );
    console.log(`Remaining data: ${data.slice(dataIndex)}`);
  }

  // Return the packed data
  return packedData.subarray(0, writeIndex);
}
