const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

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