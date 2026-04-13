# Multi-Environment Setup Guide

This project supports three different environments: **Local**, **Development**, and **Production**.

## 📁 Environment Files

The project uses different `.env` files for each environment:

- `.env.prod.local` - Local development (MongoDB on localhost)
- `.env.prod.dev` - Development environment (MongoDB Atlas dev database)
- `.env.prod.prod` - Production environment (MongoDB Atlas production database)

**Note:** These files are gitignored for security. Use the `.example` files as templates.

## 🚀 Quick Start

### 1. Create Your Environment Files

Copy the example files and customize them:

```bash
# For local development
cp .env.prod.local.example .env.prod.local

# For development environment
cp .env.prod.prod .env.prod.dev

# For production environment
cp .env.prod.prod.example .env.prod.prod
```

### 2. Configure Each Environment

Edit each `.env` file with your specific configuration:

#### `.env.prod.local` - Local Development
```env
PORT=8080
NODE_ENV=local
MONGODB_URI=mongodb://localhost:27017/fashionDesignDB
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

#### `.env.prod.dev` - Development
```env
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fashionDesignDB_dev
ALLOWED_ORIGINS=*
```

#### `.env.prod.prod` - Production
```env
PORT=8080
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fashionDesignDB
ALLOWED_ORIGINS=https://your-domain.com
JWT_SECRET=STRONG_SECRET_HERE
```

## 🎯 Running Different Environments

### Local Development (Default)
```bash
npm run dev
# or
npm run start:local
```

### Development Environment
```bash
npm run dev:dev
# or
npm run start:dev
```

### Production Environment
```bash
npm run start:prod
# or
npm run dev:prod  # with nodemon
```

## 📋 Available Scripts

| Script | Environment | Mode | Description |
|--------|------------|------|-------------|
| `npm run dev` | Local | Watch | Development with auto-reload |
| `npm run start:local` | Local | Normal | Start local server |
| `npm run dev:dev` | Development | Watch | Dev environment with auto-reload |
| `npm run start:dev` | Development | Normal | Start dev server |
| `npm run dev:prod` | Production | Watch | Prod environment with auto-reload |
| `npm run start:prod` | Production | Normal | Start production server |
| `npm start` | Production | Normal | Default production start |

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment name | `local`, `development`, `production` |
| `PORT` | Server port | `8080` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | CORS allowed origins | `*` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | `30d` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` |
| `UPLOAD_PATH` | File upload directory | `./uploads` |
| `LOG_LEVEL` | Logging level | `info` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🗄️ Database Configuration

### Local Environment
- Uses local MongoDB instance
- Database: `fashionDesignDB`
- No authentication required
- Install MongoDB locally: https://www.mongodb.com/try/download/community

### Development Environment
- Uses MongoDB Atlas
- Database: `fashionDesignDB_dev`
- Separate from production data
- Relaxed CORS settings for testing

### Production Environment
- Uses MongoDB Atlas
- Database: `fashionDesignDB`
- Production data
- Strict security settings
- Connection pooling enabled

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** in production
3. **Restrict CORS origins** in production
4. **Use different databases** for each environment
5. **Rotate credentials** regularly
6. **Enable MongoDB Atlas IP whitelist** for production

## 🚢 Deployment

### Render.com

1. Set environment variables in Render dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_strong_secret
   ```

2. Render will automatically use `npm start` which runs production mode

### Other Platforms

Set the `NODE_ENV` environment variable to control which config file is loaded:
- Heroku: Use Config Vars
- Vercel: Use Environment Variables
- AWS: Use Parameter Store or Secrets Manager

## 🧪 Testing Different Environments

```bash
# Test local
npm run start:local
curl http://localhost:8080/api/health

# Test development
npm run start:dev
curl http://localhost:8080/api/health

# Test production
npm run start:prod
curl http://localhost:8080/api/health
```

## 📊 Environment Detection

The application automatically detects and loads the correct environment:

```javascript
import config from './src/config/env.js';

console.log(config.env);        // 'local', 'development', or 'production'
console.log(config.mongoUri);   // MongoDB connection string
console.log(config.port);       // Server port
```

## 🐛 Troubleshooting

### Environment file not loading
- Check file name matches exactly (`.env.prod.local`, `.env.prod.dev`, `.env.prod.prod`)
- Ensure `NODE_ENV` is set correctly
- Check file permissions

### MongoDB connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions
- Check network connectivity

### CORS errors
- Update `ALLOWED_ORIGINS` in your environment file
- Use `*` for development, specific domains for production

## 📝 Example Workflow

1. **Local Development**
   ```bash
   # Create local env file
   cp .env.prod.local.example .env.prod.local
   
   # Start local MongoDB
   mongod
   
   # Run app
   npm run dev
   ```

2. **Deploy to Development**
   ```bash
   # Set NODE_ENV=development on your dev server
   # App will use .env.prod.dev configuration
   npm run start:dev
   ```

3. **Deploy to Production**
   ```bash
   # Set environment variables on Render/Heroku
   # App will use production configuration
   npm start
   ```

## 🔗 Related Files

- `src/config/env.js` - Environment loader
- `src/config/database.js` - Database configuration
- `index.js` - Application entry point
- `package.json` - NPM scripts

---

**Need help?** Check the main README.md or create an issue.
