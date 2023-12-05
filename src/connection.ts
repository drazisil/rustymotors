import { Socket } from "node:net";

export interface ConnectionRecord {
  id: string;
  remoteAddress: string;
  remotePort: number;
  socket?: Socket;
}

const connections: ConnectionRecord[] = [];

async function createConnectionRecord(
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
 * @param remoteAddress The remote address of the socket
 * @param remotePort The remote port of the socket
 * @param socket The socket - if provided, a new connection record will be created if one does not exist
 * @returns The connection record, or undefined if one does not exist and cannot be created
 */
export async function getConnectionIdForSocket(
  remoteAddress: string,
  remotePort: number,
  socket?: Socket
): Promise<ConnectionRecord | undefined> {
  // Find the connection record for this socket
  try {
    const connection =
      (await findConnectionRecord(remoteAddress, remotePort)) ||
      createConnectionRecord(remoteAddress, remotePort, socket);
    return connection;
  } catch (error) {
    throw new Error("Could not find or create connection record");
  }
}
