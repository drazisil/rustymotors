import {
  Cipher,
  Decipher,
  createCipheriv,
  createDecipheriv,
} from "node:crypto";
import { Socket } from "node:net";

export interface ConnectionRecord {
  id: string;
  remoteAddress: string;
  remotePort: number;
  localPort: number;
  socket?: Socket;
}

interface CipherPair {
  encrypt: Cipher;
  decrypt: Decipher;
}

interface SessionKeyset {
  customerId: number;
  gameKey: CipherPair;
  mcotsKey: CipherPair;
}

/**
 * A map of session keys by customer ID
 */
const sessionKeys: Map<number, SessionKeyset> = new Map();

const connections: ConnectionRecord[] = [];

async function createConnectionRecord(
  localPort: number,
  remoteAddress: string,
  remotePort: number,
  socket?: Socket
): Promise<ConnectionRecord> {
  if (!socket) {
    throw new Error(
      "Socket must be provided to create a new connection record"
    );
  }
  const connection: ConnectionRecord = {
    id: `${remoteAddress}:${remotePort}`,
    remoteAddress,
    remotePort,
    localPort,
    socket,
  };
  connections.push(connection);
  return connection;
}

async function findConnectionRecord(
  remoteAddress: string,
  remotePort: number
): Promise<ConnectionRecord | undefined> {
  return connections.find((connection) => {
    return (
      connection.remoteAddress === remoteAddress &&
      connection.remotePort === remotePort
    );
  });
}

/**
 * Get the connection record for a socket
 * @param localPort The local port of the socket
 * @param remoteAddress The remote address of the socket
 * @param remotePort The remote port of the socket
 * @param socket The socket - if provided, a new connection record will be created if one does not exist
 * @returns The connection record, or undefined if one does not exist and cannot be created
 */
export async function getConnectionIdForSocket(
  localPort: number,
  remoteAddress: string,
  remotePort: number,
  socket?: Socket
): Promise<ConnectionRecord | undefined> {
  // Find the connection record for this socket
  try {
    const connection =
      (await findConnectionRecord(remoteAddress, remotePort)) ||
      createConnectionRecord(localPort, remoteAddress, remotePort, socket);
    return connection;
  } catch (error) {
    throw new Error("Could not find or create connection record");
  }
}

/**
 * Get the session key for a customer
 * @param customer The customer ID
 * @returns The session key, or undefined if one does not exist
 */
export async function getSessionKeyForCustomer(
  customerId: number
): Promise<CipherPair | undefined> {
  const sessionKey = sessionKeys.get(customerId);
  if (!sessionKey) {
    return undefined;
  }
  return sessionKey.mcotsKey;
}

/**
 * Update the session keyset for a customer ID
 * @param customer The customer ID
 * @param keyset The session keyset
 */
export async function updateSessionKeyForCustomer(
  customer: number,
  keyset: SessionKeyset
) {
  sessionKeys.set(customer, keyset);
}

/**
 * Remove the session key for a customer
 * @param customer The customer ID
 */
export async function removeSessionKeyForCustomer(customer: number) {
  sessionKeys.delete(customer);
}

/**
 * Generate encryption and decryption ciphers for a given session key
 * @param sessionKey The session key
 * @returns The encryption and decryption ciphers
 */
export async function generateSessionKeyset(
  customerId: number,
  sessionKey: Buffer
): Promise<SessionKeyset> {
  // Create the mcots keypair
  const mcotsKey_encrypt = createCipheriv("rc4", sessionKey, "");
  const mcotsKey_decrypt = createDecipheriv("rc4", sessionKey, "");

  const mcotsKey: CipherPair = {
    encrypt: mcotsKey_encrypt,
    decrypt: mcotsKey_decrypt,
  };

  // Create the game keypair
  const gameKey_decrypt = createDecipheriv(
    "des-cbc",
    sessionKey.subarray(0, 8),
    Buffer.alloc(8)
  );
  const gameKey_encrypt = createCipheriv(
    "des-cbc",
    sessionKey.subarray(0, 8),
    Buffer.alloc(8)
  );

  const gameKey: CipherPair = {
    encrypt: gameKey_encrypt,
    decrypt: gameKey_decrypt,
  };

  // Return the session keyset
  return {
    customerId,
    gameKey,
    mcotsKey,
  };
}
