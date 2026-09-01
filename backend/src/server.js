const http = require("http");

// Load env vars before anything else reads process.env.
require("dotenv").config();

const { connectDatabase, disconnectDatabase } = require("./config/database");
const { connectRedis, disconnectRedis } = require("./config/redis");
const { startQueueWorker, stopQueueWorker } = require("./config/queue");

const PORT = process.env.PORT || 8000;

// Hard kill the process if the cleanup hangs past this.
const SHUTDOWN_TIMEOUT_MS = 30000;

let server = null;

// Connect to the dependencies first, then start accepting HTTP traffic.
async function startServer() {
   try {
      await connectDatabase();
      console.log("MongoDB connected");

      await connectRedis();
      console.log("Redis connected");

      startQueueWorker();
      console.log("Queue worker started");

      const app = require("./app");
      server = http.createServer(app);

      server.listen(PORT, () => {
         console.log(`Server is running on http://localhost:${PORT}`);
      });
   } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
   }
}

// Graceful shutdown: stop taking new requests, close the connections, exit.
async function shutdown(signal) {
   console.log(`\n${signal} received, shutting down`);

   // Safety net, so shutdown never hangs forever.
   const forceExit = setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
   }, SHUTDOWN_TIMEOUT_MS);

   forceExit.unref();

   try {
      if (server) {
         // Let the in-flight requests finish before closing the listener.
         await new Promise((resolve, reject) => {
            server.close(err => (err ? reject(err) : resolve()));
         });
      }

      await stopQueueWorker();
      await disconnectRedis();
      await disconnectDatabase();

      console.log("Cleanup complete, exiting");
      process.exit(0);
   } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
   }
}

// Ctrl+C (SIGINT) and the container/orchestrator stop (SIGTERM).
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
