import { type } from "os";
import { ConnectionRecord } from "./connection.js";
import { PackString } from "./packing/constants.js";
import { Transaction } from "@sentry/node";

/**
 * If the direction is inbound, the pack function will be used to unpack data from a buffer using the pack code
 * If the direction is outbound, the pack function will be used to pack data into a buffer using the pack code
 */
export type MessageType = {
  messageId: number;
  messageName: string;
  direction: "inbound" | "outbound";
  packString: PackString;
  handler: (connection: ConnectionRecord, data: any, transaction: Transaction) => Promise<void>;
};

const messageTypes: MessageType[] = [];

