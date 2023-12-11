import { ConnectionRecord } from "../connection.js";
import * as Sentry from "@sentry/node";

export async function handleCheckProfileName(
    connection: ConnectionRecord,
    data: any,
    transaction: Sentry.Transaction
    ) {
    const transaction2 = Sentry.startTransaction({
        name: "handleCheckProfileName",
        op: "function",
    });
    try {
        // Get the customer ID
        const customerId = data[1];
        
        // Get the profile name
        const profileName = data[2];
    
        // Get the game name
        const gameName = data[3];

        // Log the request
        console.log(`Check profile name request: ${profileName.toString("utf8")} for customer ${customerId} in game ${gameName.toString("utf8")}`);

        // Create the response
        const response = Buffer.alloc(4);
        response.writeUInt16BE(0x601, 0); // message code - name valid
        response.writeUInt16BE(0x0004, 2); // length

        // Log the response
        console.log(`Check profile name response: ${response.toString("hex")}`);

        // Send the response
        if (connection.socket) {
            connection.socket.write(response);
        } else {
            throw new Error("No socket found for connection");
        }
    } catch (error) {
        console.error(error);
        Sentry.captureException(error);
        transaction2.finish();
        return;
    }
    transaction2.finish();
    return;
}
