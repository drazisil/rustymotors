import { type } from "os";

/**
 * If the direction is inbound, the pack function will be used to unpack data from a buffer using the pack code
 * If the direction is outbound, the pack function will be used to pack data into a buffer using the pack code
 */
export type MessageType = {
  messageId: number;
  messageName: string;
  direction: "inbound" | "outbound";
  packString: PackString;
};

const messageTypes: MessageType[] = [];

export type PackCode =
  | "LE" // Little Endian - Everything past this point is little endian
  | "BE" // Big Endian - Everything past this point is big endian
  | "SHORT" // 2 bytes - Number
  | "BYTE" // 1 byte - Number
  | "LONG" // 4 bytes - Number
  | "BLOB" // Variable length binary data - Must be preceded by a LENGTH_SHORT
  | "FLOAT" // 4 bytes - Number
  | "BOOL" // 2 bytes - Number - 0 = false, 1 = true
  // Multi-part data
  | "LENGTH_SHORT" // 2 bytes - Number - Length of the following data
  | "STRING_VAR" // Variable length string - String length is in the pack string, but not included in the packed data
  | "STRING_FIXED" // Fixed length string - Must be preceded by a LENGTH_SHORT
  | "END"; // End of pack string - Discard any remaining data

export type PackString = PackCode[];

/**
 * A record of a pack code and the function to unpack data using that pack code
 *
 * if the length is not provided, the unpack function will be called with the entire buffer
 * if the length is provided, the unpack function will be called with a buffer of that length
 */
export type Unpacker = {
  packCode: PackCode;
  direction: "inbound";
  packFunction: (endianness: "LE" | "BE", data: Buffer, length?: number) => any;
};

/**
 * A record of a pack code and the function to pack data using that pack code
 *
 * if the length is not provided, the pack function will be called with the entire buffer
 * if the length is provided, the pack function will be called with a buffer of that length
 *
 * if includeLength is true, the 2 byte length will be prepended to the buffer
 * if includeLength is false, the 2 byte length will not be prepended to the buffer
 */
export type Packer = {
  packCode: PackCode;
  direction: "outbound";
  packFunction: (
    endianness: "LE" | "BE",
    data: unknown,
    length?: number,
    includeLength?: boolean
  ) => Buffer;
};
