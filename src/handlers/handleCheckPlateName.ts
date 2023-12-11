import { ConnectionRecord } from "../connection.js";
import * as Sentry from "@sentry/node";

export async function handleCheckPlateName(
    connection: ConnectionRecord,
    data: any,
    transaction: Sentry.Transaction
    ) {
    const transaction2 = Sentry.startTransaction({
        name: "handleCheckPlateName",
        op: "function",
    });
    try {
        // Get the plate name
        const plateName = data[2];
        
        // Log the request
        console.log(`Check plate name request: ${plateName.toString("utf8")}`);
    
        // Create the response
        const response = Buffer.alloc(4);
        response.writeUInt16BE(0x207, 0); // message code - ack
        response.writeUInt16BE(0x0004, 2); // length
    
        // Log the response
        console.log(`Check plate name response: ${response.toString("hex")}`);
    
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
