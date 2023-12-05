import { ConnectionRecord } from "./connection.js";
import { MessageType, PackCode, Packer, Unpacker } from "./constants.js";
import { unpack, unpackers } from "./packing/index.js";

const messageTypes: MessageType[] = [
    {
        messageId: 0x501,
        messageName: "login",
        direction: "inbound",
        packString: ["BE", "SHORT", "SHORT", "SHORT", "SHORT", "LONG"],
    }
];



export async function parseDataWithConnection(
  data: Buffer,
  connection: ConnectionRecord
) {
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
}
