import express from "express";
import { NextFunction } from "express-serve-static-core";
import cors from "cors";
import router from "./routes.js";
import net from "node:net";
import { getConnectionIdForSocket } from "./connection.js";
import { parseDataWithConnection } from "./packet.js";
import * as Sentry from "@sentry/node"

function requestHandlerMiddleware(req: Express.Request, res: Express.Response, next: NextFunction) {
  // Any breadcrumbs or tags added will be isolated to the request
  return Sentry.runWithAsyncContext(() => {
    return next();
  });
}

/**
 * Start an express server on ports 80 and 3000
 */
const webServer = express();
webServer.use(cors());
webServer.use(express.json());
webServer.use(requestHandlerMiddleware)
webServer.use(router);

/**
 * Create TCP servers for login, profile, game, and mcots
 */
const loginServer = net.createServer();
const profileServer = net.createServer();
const gameServer = net.createServer();
const mcotsServer = net.createServer();

/**
 * All 3 servers have the same connection handler
 */
const connectionHandler = async (socket: net.Socket) => {
  console.log(`Connection from ${socket.remoteAddress}:${socket.remotePort}`);
  const { localPort, remoteAddress, remotePort } = socket;
  const connection = await getConnectionIdForSocket(
    localPort ?? -9999,
    remoteAddress ?? "unknownAddress",
    remotePort ?? -9999,
    socket
  );

  if (!connection) {
    console.error("Failed to create connection record");
    Sentry.captureException(new Error(`Failed to create connection record`))
    return;
  }

  console.log(`Connection ID: ${connection.id}`);

  socket.on("data", async (data) => {
    await parseDataWithConnection(data, connection);
  });

  socket.on("close", () => {
    console.log("Connection closed");
  });

  socket.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "ECONNRESET") {
      console.log("Connection reset");
      return;
    }
    console.error(error);
    Sentry.captureException(error)
  });
};

loginServer.on("connection", connectionHandler);
profileServer.on("connection", connectionHandler);
gameServer.on("connection", connectionHandler);
mcotsServer.on("connection", connectionHandler);

/**
 * Export all servers
 */
export { webServer, loginServer, profileServer, gameServer, mcotsServer };
