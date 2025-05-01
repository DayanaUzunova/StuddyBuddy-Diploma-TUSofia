require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const router = require('./routes/userRoutes');


start();
function start() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(router);

  // Connect to MongoDB
  connectDB();

  // Test Route
  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};