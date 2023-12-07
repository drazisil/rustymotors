import { ConnectionRecord } from "./connection.js";
import { MessageType,  } from "./constants.js";
import { handleLogin } from "./handlers/handleLogin.js";
import { unpack } from "./packing/index.js";
import { login_inbound } from "./packing/packStrings.js";
import * as Sentry from "@sentry/node"

export function verifyDataType(data: any, type: string) {
  if (typeof data !== type) {
    throw new Error(`Data ${data} must be a ${type}, got ${typeof data}`);
  }
}

const messageTypes: MessageType[] = [
  {
    messageId: 0x501,
    messageName: "login",
    direction: "inbound",
    packString: login_inbound,
    handler: handleLogin,
  },
];

export async function parseDataWithConnection(
  data: Buffer,
  connection: ConnectionRecord
) {
  const transaction = Sentry.startTransaction(
  {
    name: "parseDataWithConnection",
    op: "function"
  }  
  )
  try {
  console.log(`Connection ID: ${connection.id}`);
  console.log(`Data: ${data.toString("hex")}`);

  // Get the message code
  const messageCode = data.readUInt16BE(0);

  // Look up the message type by message code
  const messageType = messageTypes.find(
    (messageType) => messageType.messageId === messageCode
  );

  // If the message type is not found, throw an error
  if (!messageType) {
    throw new Error(`No message type found for message code ${messageCode}`);
  }

  // Get the pack string for this message type
  const packString = messageType.packString;

  // Unpack the data
  const unpacked = unpack(packString, data);

  console.log(unpacked);

    // Call the handler
    messageType.handler(connection, unpacked, transaction);
    transaction.finish()
  } catch (error) {
    console.error(error);
    Sentry.captureException(error)
    transaction.finish()
    Sentry.flush()
    return;
  }

}
