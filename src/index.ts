import express from "express";
import cors from "cors";
import router from "./routes.js";
import net from "node:net";

/**
 * Start an express server on ports 80 and 3000
 */
const webServer = express();
webServer.use(cors());
webServer.use(express.json());
webServer.use(router);

/**
 * Start a TCP server that listens on port 8226
 */
const loginServer = net.createServer();
const profileServer = net.createServer();
const gameServer = net.createServer();

/**
 * All 3 servers have the same connection handler
 */
const connectionHandler = (socket: net.Socket) => {
  socket.on("data", (data) => {
    console.log(data);
  });
}

loginServer.on("connection", connectionHandler);
profileServer.on("connection", connectionHandler);
gameServer.on("connection", connectionHandler);




/**
 * Export all servers
 */
export { webServer, loginServer, profileServer, gameServer };
