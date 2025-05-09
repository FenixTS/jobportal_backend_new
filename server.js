const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cache the database connection
let cachedDb = null;

// MongoDB Connection with serverless-friendly options
const connectDB = async (retryCount = 0) => {
  try {
    // If we have a cached connection, return it
    if (cachedDb) {
      console.log('Using cached database connection');
      return cachedDb;
    }

    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in environment variables');
      return;
    }

    console.log(`Attempting to connect to MongoDB... (Attempt ${retryCount + 1})`);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 10000,
      retryWrites: true,
      w: 'majority',
      ssl: true
    };

    // Parse the connection string to check format
    const uri = process.env.MONGO_URI;
    if (!uri.includes('mongodb+srv://')) {
      throw new Error('Invalid MongoDB URI format. Must use mongodb+srv:// for Atlas');
    }

    // Try to connect with a timeout
    const connectPromise = mongoose.connect(uri, options);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('MongoDB Connected Successfully');

    // Cache the connection
    cachedDb = mongoose.connection;

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected Successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB Connection Error:', err);
      cachedDb = null; // Clear cache on error
      if (retryCount < 3) {
        console.log(`Retrying connection... (${retryCount + 1}/3)`);
        setTimeout(() => connectDB(retryCount + 1), 2000);
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB Disconnected');
      cachedDb = null; // Clear cache on disconnect
      if (retryCount < 3) {
        console.log(`Retrying connection... (${retryCount + 1}/3)`);
        setTimeout(() => connectDB(retryCount + 1), 2000);
      }
    });

    return cachedDb;

  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    cachedDb = null; // Clear cache on error
    if (retryCount < 3) {
      console.log(`Retrying connection... (${retryCount + 1}/3)`);
      setTimeout(() => connectDB(retryCount + 1), 2000);
    }
    throw err;
  }
};

// Connect to MongoDB
connectDB().catch(console.error);

// Middleware to check database connection
const checkDBConnection = async (req, res, next) => {
  try {
    if (!cachedDb || cachedDb.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    res.status(503).json({
      message: 'Database connection not ready',
      state: cachedDb ? cachedDb.readyState : 0,
      mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
      connectionState: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }[cachedDb ? cachedDb.readyState : 0],
      lastError: err.message || null,
      connectionString: process.env.MONGO_URI ? 
        process.env.MONGO_URI.replace(/mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://****:****@') : 
        'not configured'
    });
  }
};

// Basic route for root
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to Job Portal API',
    database: cachedDb && cachedDb.readyState === 1 ? 'connected' : 'disconnected',
    mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
    connectionState: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[cachedDb ? cachedDb.readyState : 0],
    lastError: null,
    connectionString: process.env.MONGO_URI ? 
      process.env.MONGO_URI.replace(/mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://****:****@') : 
      'not configured'
  });
});

// Apply database connection check to all API routes
app.use('/api', checkDBConnection);

// Routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/drafts', require('./routes/draftRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = cachedDb ? cachedDb.readyState : 0;
  res.status(200).json({ 
    status: 'ok',
    database: dbState === 1 ? 'connected' : 'disconnected',
    dbState: dbState,
    mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
    connectionState: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbState],
    connectionString: process.env.MONGO_URI ? 
      process.env.MONGO_URI.replace(/mongodb(\+srv)?:\/\/[^:]+:[^@]+@/, 'mongodb$1://****:****@') : 
      'not configured',
    lastError: null
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {},
    database: cachedDb && cachedDb.readyState === 1 ? 'connected' : 'disconnected',
    mongoUri: process.env.MONGO_URI ? 'configured' : 'not configured',
    connectionState: {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[cachedDb ? cachedDb.readyState : 0],
    lastError: err.message || null
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 