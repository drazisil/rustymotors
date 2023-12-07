import { readFileSync } from "fs";
import { getCustomerByTicket } from "../auth.js";
import {
  ConnectionRecord,
  generateSessionKeyset,
  updateSessionKeyForCustomer,
} from "../connection.js";
import { verifyDataType } from "../packet.js";
import { createPrivateKey } from "node:crypto";
import { privateDecrypt } from "crypto";
import { PackString } from "../packing/constants.js";
import { pack, unpack } from "../packing/index.js";
import { Transaction } from "@sentry/node";

function displayStringasHex(s: string) {
  let hex = "";
  for (let i = 0; i < s.length; i++) {
    hex += s.charCodeAt(i).toString(16);
  }
  return hex;
}

function decryptSessionKey(encryptedSessionKey: string): Buffer {
  // Get the private key
  const privateKey = readFileSync("./certs/private_key.pem");

  // Change the encrypted session key to a buffer
  const encryptedSessionKeyString = encryptedSessionKey.toString();
  const encryptedSessionKeyBuffer = Buffer.from(
    encryptedSessionKeyString,
    "hex"
  );

  // Assert that the encrypted session key length is 128 bytes
  if (encryptedSessionKeyBuffer.length !== 128) {
    throw new Error(
      `Encrypted session key must be 128 bytes, got ${encryptedSessionKeyBuffer.length} bytes`
    );
  }

  // Decrypt the session key
  const decryptedSessionKeyStructure = privateDecrypt(
    {
      key: privateKey,
    },
    encryptedSessionKeyBuffer
  );

  // Now, we need to unpack the session key
  const packString: PackString = ["BE", "LENGTH_SHORT", "BLOB", "END"];

  // Unpack the session key
  const unpackedSessionKey = unpack(packString, decryptedSessionKeyStructure);

  const unpackedString = unpackedSessionKey[0] as Buffer;

  // Log the unpacked values
  console.log(`Unpacked session key: ${unpackedString.length}`);

  // Log the unpacked session key
  console.log(`Unpacked session key: ${unpackedString.toString("hex")}`);

  // Return the unpacked session key
  return unpackedString;
}

export async function handleLogin(connection: ConnectionRecord, data: any, transaction: Transaction) {
  console.log("Login");

  // Verify the data types
  verifyDataType(data[1], "string");
  verifyDataType(data[3], "string");
  verifyDataType(data[4], "string");

  // Assign the data to variables
  const ticket = data[1];
  const encryptedSessionKey = data[3];
  const serviceId = data[4];

  // check if the ticket is valid
  const customer = await getCustomerByTicket(ticket);

  // If the ticket is not valid, throw an error
  if (!customer) {
    throw new Error("Invalid ticket");
  }

  let span = transaction.startChild({
    name: "decryptSessionKey",
    op: "crypto.decipher"
  })

  // Decrypt the session key
  const sessionKey = decryptSessionKey(encryptedSessionKey);
  span.finish()
 
  // Log the session key
  console.log(`Session key: ${sessionKey.toString("hex")}`);

  span = transaction.startChild({
    name: "generateKeyset",
    op: "crypto.general"
  })
  // Generate a session keyset and save it
  const keyset = await generateSessionKeyset(customer.id, sessionKey);
  span.finish()

  // Save the session keyset
  await updateSessionKeyForCustomer(customer.id, keyset);

  // Log that we are sending the login response
  console.log("Sending login response");

  // Log the customer ID
  console.log(`Customer ID: ${customer.id}`);

  // Assemble the login response data for packing
  const loginResponseData: unknown[] = [    
    0x601, // short - message code
    0, // length short - length of all data after packing
    0x0101, // short - version
    0, // short - reserved
    0, // long - length of all data after packing
    customer.id, // long - customer ID
    0, //  long -   profile ID
    sessionKey.byteLength, // length short - length of session key (not written by packer)
    sessionKey.toString("hex"), // string fixed - session key
    sessionKey.byteLength, // short - length of session key
    false, // boo - banned
    false, // boo - gagged
    true, // boo - valid
    4, // short - length of the service ID
    4, // length short - length of the service ID (not written by packer)
    serviceId, // string fixed - service ID
    0, // short - metrics ID (not used)
  ];

  // Assemble the login response pack string
  const loginResponsePackString: PackString = [
    "BE",
    "SHORT", // message code
    "SHORT", // length of all data after packing
    "SHORT", // version
    "SHORT", // reserved
    "LONG", // length of all data after packing
    "LONG", // customer ID
    "LONG", // profile ID
    "LENGTH_SHORT", // length of session key, not written by packer
    "STRING_FIXED", // session key
    "SHORT", // length of session key, comes after session key
    "BOOL",
    "BOOL",
    "BOOL",
    "SHORT", // length of service ID, passing manually
    "LENGTH_SHORT", // length of service ID, not written by packer
    "STRING_FIXED",
    "SHORT",
    "END",
  ];

  span = transaction.startChild({
    name: "packResponse",
    op: "serialize"
  })

  // Pack the login response
  const loginResponse = pack(loginResponsePackString, loginResponseData);
  span.finish()

  // Now, we need to update the length of the login response
  const loginResponseLength = loginResponse.length;
  loginResponse.writeUInt16BE(loginResponseLength, 2);
  loginResponse.writeUInt32BE(loginResponseLength, 8);

  // Log the login response
  console.log(`Login response: ${loginResponse.toString("hex")}`);

  // Send the login response
  if (connection.socket) {
    connection.socket.write(loginResponse);
    connection.socket.write(loginResponse); // Another login response for some reason
  } else {
    throw new Error("No socket found for connection");
  }

  return;
}
