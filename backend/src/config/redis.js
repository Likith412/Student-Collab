const { createClient } = require("redis");

// Single client instance reused across the app.
const redisClient = createClient({
   url: process.env.REDIS_URL,
});

// Log connection/runtime errors instead of crashing the process.
redisClient.on("error", err => {
   console.error("Redis client error:", err);
});

async function connectRedis() {
   await redisClient.connect();
}

async function disconnectRedis() {
   await redisClient.quit();
}

module.exports = { redisClient, connectRedis, disconnectRedis };
