require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const router = require('./router/router');
const cookieParser = require('cookie-parser');


start();
function start() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  
  
  app.use(express.json());
  app.use(cookieParser());
  app.use(router);

  connectDB();

  // Test Route
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};