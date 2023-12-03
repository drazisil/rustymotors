import express from "express";
import cors from "cors";
import router from "./routes.js";

/**
 * Start an express server on ports 80 and 3000
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

/**
 * Export the express app
 */
export default app;
