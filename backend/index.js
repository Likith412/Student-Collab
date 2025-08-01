const express = require('express');
const cors = require('cors');

const { connectToMongoDB } = require('./connection');

require('dotenv').config();

const app = express();

// DB Connection
connectToMongoDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error", err));

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allow specific methods
}));

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello World'});  
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});