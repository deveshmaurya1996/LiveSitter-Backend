require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.DB_NAME || 'jobtracker',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: process.env.ENABLE_CONSOLE_LOG !== 'false',
    enableFile: process.env.ENABLE_FILE_LOG === 'true'
  }
};

module.exports = config; 