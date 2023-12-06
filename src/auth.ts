import { randomUUID } from "crypto";
import { getCustomerByUsername } from "./customer.js";

/**
 * This is a map of all the sessions that are currently active.
 * The key is the ticket, and the value is the username
 */
const sessions: Map<string, string> = new Map();

/**
 * This function returns the username for a given ticket
 * @param ticket The ticket to look up
 */
export async function getCustomerByTicket(ticket: string) {
  const username = sessions.get(ticket);

  // If the username is not found, return undefined
  if (!username) {
    return undefined;
  }

  // Get the customer record for this username
  const customer = getCustomerByUsername(username);

  // If the customer is not found, return undefined
  if (!customer) {
    return undefined;
  }

  // Return the customer
  return customer;
}

function validUserResponse(ticket: string) {
  return `Valid=TRUE\n` + `Ticket=${ticket}\n`;
}

function invalidUserResponse() {
  return (
    `reasoncode=INV-199\n` +
    `reasontext=Invalid User\n` +
    `reasonurl=https://mcouniverse.com\n`
  );
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
  // Check if the username is valid
  const customer = getCustomerByUsername(username);

  // If the customer is not found, return an invalid user response
  if (!customer) {
    return invalidUserResponse();
  }

  // Check if the password is valid
  if (customer.password !== password) {
    return invalidUserResponse();
  }

  // Generate a ticket
  const ticket = generateTicket();

  // Log the ticket to the console
  console.log(`Ticket generated: ${ticket}`);

  // Add the ticket to the list of sessions
  sessions.set(ticket, username);

  // Return a valid user response
  return validUserResponse(ticket);
}

/**
 * Get all tickets
 */
export function getTickets() {
  return sessions.keys();
}
