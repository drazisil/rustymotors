import { Transaction } from "@sentry/node";
import { ConnectionRecord } from "../connection.js";
import { verifyDataType } from "../packet.js";
import { getCustomerById } from "../customer.js";

export async function handleGetProfiles(connection: ConnectionRecord, data: any, transaction: Transaction) {
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

    const response = Buffer.alloc(16);
    response.writeUInt16BE(0x607, 0); // message code
    response.writeUInt16BE(0x00, 2); // length
    response.writeUInt16BE(0x0001, 4); // version
    response.writeUInt16BE(0x0000, 6); // reserved
    response.writeUInt32BE(0x00000000, 8); // length
    response.writeUInt16BE(customer.id, 12); // customer ID
    response.writeUInt16BE(0x0000, 14); // number of profiles

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
