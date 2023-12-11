import { ConnectionRecord } from "./connection.js";
import { MessageType } from "./constants.js";
import { handleCheckPlateName } from "./handlers/handleCheckPlateName.js";
import { handleCheckProfileName } from "./handlers/handleCheckProfileName.js";
import { handleGetProfiles } from "./handlers/handleGetProfiles.js";
import { handleLogin } from "./handlers/handleLogin.js";
import { unpack } from "./packing/index.js";
import {
  SERVER_HEADER,
  SERVER_MESSAGE,
  check_plate_name_inbound,
  check_profile_name_inbound,
  get_profiles_inbound,
  login_inbound,
} from "./packing/packStrings.js";
import * as Sentry from "@sentry/node";

export function verifyDataType(data: any, type: string) {
  if (typeof data !== type) {
    throw new Error(`Data ${data} must be a ${type}, got ${typeof data}`);
  }
}

const gameMessageTypes: MessageType[] = [
  {
    messageId: 0x501, // 1281
    messageName: "login",
    direction: "inbound",
    packString: login_inbound,
    handler: handleLogin,
  },
  {
    messageId: 0x532, // 1330
    messageName: "get profiles",
    direction: "inbound",
    packString: get_profiles_inbound,
    handler: handleGetProfiles,
  },
  {
    messageId: 0x533, // 1331
    messageName: "check profile name",
    direction: "inbound",
    packString: check_profile_name_inbound,
    handler: handleCheckProfileName,
  },
  {
    messageId: 0x534, // 1332
    messageName: "check plate name",
    direction: "inbound",
    packString: check_plate_name_inbound,
    handler: handleCheckPlateName,
  },
];

async function parseGameMessage(
  data: Buffer,
  connection: ConnectionRecord,
  transaction: Sentry.Transaction
) {
  // Start a transaction
  const transaction2 = Sentry.startTransaction({
    name: "parseGameMessage",
    op: "function",
  });

  // Get the message ID
  const messageId = data.readUInt16BE(0);

  // Get the message type
  const messageType = gameMessageTypes.find(
    (messageType) => messageType.messageId === messageId
  );

  // If the message type is not found, throw an error
  if (!messageType) {

    throw new Error(`No message type found for message ID ${messageId}`);
  }

  // Log the message type
  console.log(`Message type: ${messageType.messageName}`);

  // Unpack the message
  const unpackedMessage = unpack(messageType.packString, data);

  // Log the unpacked message
  console.log(`Unpacked message: ${unpackedMessage}`);

  // Handle the message
  await messageType.handler(connection, unpackedMessage, transaction);

  // Finish the transaction
  transaction2.finish();

  return;
}

async function parseServerMessage(
  data: Buffer,
  connection: ConnectionRecord,
  transaction: Sentry.Transaction
) {
  // Start a transaction
  const transaction2 = Sentry.startTransaction({
    name: "parseServerMessage",
    op: "function",
  });

  // Verify the message is long enough
  if (data.length < 15) {
    throw new Error(`Message is too short: ${data.toString("hex")}`);
  }

  // Unpack the message
  const unpackedMessage = unpack(SERVER_MESSAGE, data);

  // Log the unpacked message
  console.log(`Unpacked message: ${unpackedMessage}`);

  // Verify the message signature
  const sig = (unpackedMessage[0] as Array<any>)[1] as string;
  if (sig !== "TOMC") {
    throw new Error(`Invalid message signature: ${sig}`);
  }

  // Check the message flags
  const flags = data.readUInt16BE(6);
}

export async function parseDataWithConnection(
  data: Buffer,
  connection: ConnectionRecord
) {
  const transaction = Sentry.startTransaction({
    name: "parseDataWithConnection",
    op: "function",
  });
  try {
    // Log the data
    console.log(`Data: ${data.toString("hex")}`);

    // What type of message is this?

    const gamePorts = [8226, 8228, 7003];

    const serverPorts = [43300];

    if (gamePorts.includes(connection.localPort)) {
      // This is a game message
      return parseGameMessage(data, connection, transaction);
    }

    if (serverPorts.includes(connection.localPort)) {
      // This is an transaction server message
      return parseServerMessage(data, connection, transaction);
    }

    throw new Error(
      `Unknown local port ${connection.localPort} for connection ${connection.id}`
    );

    transaction.finish();
  } catch (error) {
    console.error(error);
    Sentry.captureException(error);
    transaction.finish();
    return;
  }
}
