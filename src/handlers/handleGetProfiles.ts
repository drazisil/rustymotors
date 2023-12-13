import { Transaction } from "@sentry/node";
import { ConnectionRecord } from "../connection.js";
import { verifyDataType } from "../packet.js";
import { getCustomerById } from "../customer.js";

export async function handleGetProfiles(
  connection: ConnectionRecord,
  data: any,
  transaction: Transaction
) {
  // Verify the data type
  verifyDataType(data[1], "number");

  // Get the customer ID
  const customerId = data[1] as number;

  // Get the customer
  const customer = getCustomerById(customerId);

  // If the customer is not found, throw an error
  if (!customer) {
    throw new Error(`No customer found with ID ${customerId}`);
  }

  // Log the customer
  console.log(`Customer name: ${customer.name}`);

  const response = Buffer.alloc(145);
  response.writeUInt16BE(0x607, 0); // message code
  response.writeUInt16BE(0x00, 2); // length
  response.writeUInt16BE(0x0101, 4); // version
  response.writeUInt16BE(0x0000, 6); // reserved
  response.writeUInt32BE(0x00000000, 8); // length

  response.writeUInt16BE(0x02, 12); // Profile Count

  // =========== Don't touch below this line ===========

  response.writeUInt16BE(0x4d, 14); // container size? // 0x4d = 77
  
  response.writeUInt32BE(1, 16); //Customer id?

  // =========== Don't touch below this line ===========

  response.writeUInt32BE(1, 20); // profile id
  response.writeUInt32BE(44, 24); // shard id

  response.writeUInt32BE(0x41424344, 28); // Don't know what this is for, displays as DCBA in the log, after the profile name

  response.writeUInt16BE(0x3d3d, 32); 

  response.writeUInt16BE(0x4d6f, 34); // Start of profile name #1 - 33 bytes

  response.writeUInt16BE(0x6c6c, 36); //
  response.writeUInt16BE(0x7920, 38); // number of profiles
  response.writeUInt16BE(0x4d3d, 40); // number of profiles
  response.writeUInt16BE(0x3d3d, 42); // number of profiles
  response.writeUInt16BE(0x3d3d, 44); // number of profiles
  response.writeUInt16BE(0x3d3d, 46); // number of profiles
  response.writeUInt16BE(0x3d3d, 48); // number of profiles
  response.writeUInt16BE(0x3d3d, 50); // number of profiles
  response.writeUInt16BE(0x3d3d, 52); // number of profiles
  response.writeUInt16BE(0x3d3d, 54); // number of profiles
  response.writeUInt16BE(0x3d3d, 56); // number of profiles
  response.writeUInt16BE(0x3d3d, 58); // number of profiles
  response.writeUInt16BE(0x3d3d, 60); // number of profiles
  response.writeUInt16BE(0x3d3d, 62); // number of profiles
  response.writeUInt16BE(0x3d54, 64); // number of profiles // last 2 bytes of profile name #1

  // =========== Don't touch above this line ===========

//   response.writeInt8(0x00, 66); // number of profiles
//   response.writeInt8(0x54, 67); // number of profiles
//   response.writeUInt16BE(0x4142, 68); // number of profiles
//   response.writeUInt16BE(0x3d3d, 70); // number of profiles
//   response.writeUInt16BE(0x3d3d, 72); // number of profiles
//   response.writeUInt16BE(0x3d3d, 74); // number of profiles
//   response.writeUInt16BE(0x3d3d, 76); // number of profiles
//   response.writeUInt16BE(0x3d3d, 78); // number of profiles
//   response.writeUInt16BE(0x3d3d, 80); // number of profiles
//   response.writeUInt16BE(0x3d3d, 82); // number of profiles
//   response.writeUInt16BE(0x3d3d, 84); // number of profiles
//   response.writeUInt16BE(0x3d3d, 86); // number of profiles
//   response.writeUInt16BE(0x3d3d, 88); // number of profiles
  response.writeUInt16BE(0x4d, 91); // number of profiles
//   response.writeUInt16BE(0x3d3d, 92); // number of profiles
//   response.writeUInt16BE(0x3d3d, 94); // number of profiles
//   response.writeUInt16BE(0x3d3d, 96); // number of profiles
//   response.writeInt8(0x3d, 98); // number of profiles

  // =========== Don't touch below this line ===========

  response.writeInt32BE(2, 99); // profile id #2
  response.writeInt32BE(88, 103); // shard id #2

  response.writeUInt32BE(0x41424344, 107); // Don't know what this is for, displays as DCBA in the log, after the profile name

  response.writeUInt16BE(0x3d0d, 111); // number of profiles

  response.writeUInt16BE(0x4d3d, 113); //  start of profile name #2 ?
  response.writeUInt16BE(0x3d3d, 115); //
  response.writeUInt16BE(0x3d3d, 117); //
  response.writeUInt16BE(0x3d3d, 119); //
  
  response.writeUInt16BE(0x3d3d, 121); //
  response.writeUInt16BE(0x3d3d, 123); //
  response.writeUInt16BE(0x3d3d, 125); //
  response.writeUInt16BE(0x3d3d, 127); //
  response.writeUInt16BE(0x3d3d, 129); //
  response.writeUInt16BE(0x3d3d, 131); //
  response.writeUInt16BE(0x3d3d, 133); //
  response.writeUInt16BE(0x3d3d, 135); //
  response.writeUInt16BE(0x3d3d, 137); //
  response.writeUInt16BE(0x3d3d, 139); //
  response.writeUInt16BE(0x3d3d, 141); //
  response.writeUInt16BE(0x3d3d, 143); // // last 2 bytes of profile name #2
  
//   response.writeUInt16BE(0x3d3d, 145); //
//   response.writeUInt16BE(0x3d3d, 147); //
//   response.writeUInt16BE(0x3d3d, 149); //
//   response.writeUInt16BE(0x3d3d, 151); //
//   response.writeUInt16BE(0x3d3d, 153); //
//   response.writeUInt16BE(0x3d3d, 155); //
//   response.writeUInt16BE(0x3d3d, 157); //
//   response.writeUInt16BE(0x3d3d, 159); //
//   response.writeUInt16BE(0x3d3d, 161); //
//   response.writeUInt16BE(0x3d3d, 163); //
//   response.writeUInt16BE(0x3d3d, 165); //
//   response.writeUInt16BE(0x3d3d, 167); //
//   response.writeUInt16BE(0x3d3d, 169); //
//   response.writeUInt16BE(0x3d3d, 171); //
//   response.writeUInt16BE(0x3d3d, 173); //
//   response.writeUInt16BE(0x3d3d, 175); //
//   response.writeUInt16BE(0x3d3d, 177); //
//   response.writeUInt16BE(0x3d3d, 179); //
//   response.writeUInt16BE(0x3d3d, 181); //
//   response.writeUInt16BE(0x3d3d, 183); //
//   response.writeUInt16BE(0x3d3d, 185); //
//   response.writeUInt16BE(0x3d3d, 187); //
//   response.writeUInt16BE(0x3d3d, 189); //

  // Get the length of the response
  const length = response.length;

  // Write the length to the response
  response.writeUInt16BE(length, 2);
  response.writeUInt32BE(length, 8);

  // Log the login response
  console.log(`Login response: ${response.toString("hex")}`);

  // Send the login response
  if (connection.socket) {
    connection.socket.write(response);
    connection.socket.write(response); // Another login response for some reason
  } else {
    throw new Error("No socket found for connection");
  }

  return;
}
