import { randomUUID } from "crypto";

const validUsers = ["mco"];

function validUserResponse(ticket: string) {
    return `Valid=TRUE\n` +
        `Ticket=${ticket}\n`;
}

function invalidUserResponse() {
    return `reasoncode=INV-199\n` +
        `reasontext=Invalid User\n` +
        `reasonurl=https://mcouniverse.com\n`;
}

/**
 * Generate a random ticket
 */
function generateTicket() {
    return randomUUID().replace(/-/g, "");
}


// This function is called when a client tries to authenticate with the server
export function authUser(
  username: string,
  password: string,
  serviceID: string,
  version: string
) {
    if (validUsers.includes(username)) {
        const ticket = generateTicket();
        return validUserResponse(ticket);
    } else {
        return invalidUserResponse();    }
}
