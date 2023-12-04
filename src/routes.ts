import { Router } from "express";
import { authUser } from "./auth.js";
import { getShardList } from "./shard.js";

// This array is a byte array that represents the response from the server
// It tells the game that there are no updates available
const PATCH_RESPONSE = Buffer.from([
  0xca, 0xfe, 0xbe, 0xef, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03,
]);

type AuthLoginQuery = {
  username: string;
  password: string;
  serviceID: string;
  version: string;
};

/**
 * Export all routes
 */
const router = Router();

// Log all requests to the console
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Add a GET route for /AuthLogin that expects query parameters of username, password, serviceID, and version
router.get("/AuthLogin", (req, res) => {
  const { username, password, serviceID, version } = req.query as AuthLoginQuery;

  res.setHeader("Content-Type", "text/plain");
  res.send(authUser(username, password, serviceID, version));

});

// Add a GET route for /ShardList/
router.get("/ShardList/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.send(getShardList());
});

// Add a POST route to the router for /games/EA_Seattle/MotorCity/UpdateInfo
router.post("/games/EA_Seattle/MotorCity/UpdateInfo", (req, res) => {
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(PATCH_RESPONSE);
});

/**
 * Add a POST route to the router for /games/EA_Seattle/MotorCity/NPS*
 */
router.post("/games/EA_Seattle/MotorCity/NPS*", (req, res) => {
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(PATCH_RESPONSE);
});

/**
 * Add a POST route to the router for /games/EA_Seattle/MotorCity/MCO
 */
router.post("/games/EA_Seattle/MotorCity/MCO", (req, res) => {
  res.setHeader("Content-Type", "application/octet-stream");
  res.send(PATCH_RESPONSE);
});

export default router;
