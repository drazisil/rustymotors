import { readFileSync } from "fs";
import { getCustomerByTicket } from "../auth.js";
import { ConnectionRecord } from "../connection.js";
import { verifyDataType } from "../packet.js";
import { createPrivateKey } from "node:crypto";
import { privateDecrypt } from "crypto";
import { PackString } from "../constants.js";
import { unpack } from "../packing/index.js";

function displayStringasHex(s: string) {
  let hex = "";
  for (let i = 0; i < s.length; i++) {
    hex += s.charCodeAt(i).toString(16);
  }
  return hex;
}


function decryptSessionKey(encryptedSessionKey: string) {
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
  const decryptedSessionKeyStructure
   = privateDecrypt(
    {
      key: privateKey,
    },
    encryptedSessionKeyBuffer
  );

  // Now, we need to unpack the session key
  const packString: PackString = ["BE", "LENGTH_SHORT", "BLOB", "END"];

  // Unpack the session key
  const unpackedSessionKey = unpack(packString, decryptedSessionKeyStructure
    );

    const unpackedString = unpackedSessionKey[0] as Buffer;

    // Log the unpacked values
  console.log(`Unpacked session key: ${unpackedString.length}`);


  // Log the unpacked session key
  console.log(`Unpacked session key: ${unpackedString.toString("hex")}`);
}

export async function handleLogin(connection: ConnectionRecord, data: any) {
  console.log("Login");

  // Verify the data types
  verifyDataType(data[5], "string");
  verifyDataType(data[7], "string");
  verifyDataType(data[8], "string");

  // Assign the data to variables
  const ticket = data[5];
  const encryptedSessionKey = data[7];
  const serviveId = data[8];

  // check if the ticket is valid
  const customer = await getCustomerByTicket(ticket);

  // If the ticket is not valid, throw an error
  if (!customer) {
    throw new Error("Invalid ticket");
  }

  // Decrypt the session key
  const decryptedSessionKeyStructure
   = decryptSessionKey(encryptedSessionKey);
}
