const mongoose = require("mongoose");

async function connectDatabase() {
   const uri = process.env.MONGO_URI;

   if (!uri) {
      throw new Error("MONGO_URI is not set");
   }

   await mongoose.connect(uri);
}

async function disconnectDatabase() {
   await mongoose.disconnect();
}

module.exports = { connectDatabase, disconnectDatabase };
