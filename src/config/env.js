import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadEnvironment = () => {
  const env = process.env.NODE_ENV || 'local';
  
  let envFile;
  switch (env) {
    case 'production':
      envFile = '.env.prod';
      break;
    case 'development':
      envFile = '.env.dev';
      break;
    case 'local':
    default:
      envFile = '.env.local';
      break;
  }

  const envPath = resolve(__dirname, '../../', envFile);
  
  const result = dotenv.config({ path: envPath });
  
  if (result.error && env !== 'production') {
    console.warn(`⚠️  Warning: ${envFile} not found, falling back to .env`);
    dotenv.config();
  }

  console.log(`🌍 Environment: ${env.toUpperCase()}`);
  console.log(`📁 Config file: ${envFile}`);
  
  return {
    env,
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    allowedOrigins: process.env.ALLOWED_ORIGINS || '*',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30m',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    apiVersion: process.env.API_VERSION || 'v1',
    logLevel: process.env.LOG_LEVEL || 'info',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  };
};

export const config = loadEnvironment();

export default config;
