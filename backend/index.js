const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// Fallback to public DNS servers if local Windows resolver blocks SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Use default if custom DNS servers fail to set
}

dotenv.config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Web2Cart API is running'
  });
});

// MongoDB Connection Setup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI || MONGO_URI.includes('YOUR_MONGODB_CONNECTION_STRING')) {
  console.log('⚠️ Warning: MONGO_URI is missing or unconfigured in .env');
  console.log('⚡ Starting Express server without active MongoDB connection...');
  app.listen(PORT, () => {
    console.log(`🚀 Web2Cart Server listening on port ${PORT}`);
    console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
  });
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('⚡ Connected to MongoDB successfully.');
      app.listen(PORT, () => {
        console.log(`🚀 Web2Cart Server listening on port ${PORT}`);
        console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
      });
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚡ Starting Express server anyway for health checks...');
      app.listen(PORT, () => {
        console.log(`🚀 Web2Cart Server listening on port ${PORT}`);
        console.log(`🔗 Health check available at http://localhost:${PORT}/api/health`);
      });
    });
}
