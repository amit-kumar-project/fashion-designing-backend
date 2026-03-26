# Fashion Design Mobile App Backend

A standard RESTful API structure for a fashion designing mobile application built with Express.js and MongoDB.

## 🏗️ Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── userController.js    # User-related operations
│   └── designController.js  # Design-related operations
├── middleware/
│   ├── index.js            # CORS, security, rate limiting setup
│   └── errorHandler.js     # Error handling middleware
├── models/
│   ├── User.js             # User model and database operations
│   └── Design.js           # Design model and database operations
├── routes/
│   ├── index.js            # Main route configuration
│   ├── userRoutes.js       # User endpoints
│   └── designRoutes.js     # Design endpoints
└── utils/                  # Utility functions (to be added)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment files:
   ```bash
   # Quick setup using script
   ./setup-env.sh
   
   # Or manually copy example files
   cp .env.local.example .env.local
   cp .env.dev.example .env.dev
   cp .env.prod.example .env.prod
   ```

4. Update environment files with your configuration:
   - MongoDB connection string
   - Port number
   - CORS origins
   - JWT secret (for production)

5. Start the server:
   ```bash
   # Local development
   npm run dev
   
   # Development environment
   npm run start:dev
   
   # Production
   npm run start:prod
   ```

### 🌍 Multi-Environment Support

This project supports three environments:
- **Local** - Local MongoDB, relaxed security
- **Development** - MongoDB Atlas dev database, testing features
- **Production** - MongoDB Atlas production database, strict security

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for detailed configuration guide.

## 📚 API Endpoints

### Base URL: `http://localhost:8080/api`

### Users
- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Designs
- `POST /designs` - Create a new design
- `GET /designs/:id` - Get design by ID
- `GET /designs/user/:userId` - Get designs by user
- `GET /designs/search?q=query` - Search designs
- `PUT /designs/:id` - Update design
- `DELETE /designs/:id` - Delete design

### System
- `GET /` - API information
- `GET /health` - Health check

## 📝 Request/Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional for validation errors
}
```

## 🔧 Features

- ✅ RESTful API design
- ✅ MongoDB integration
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ Environment configuration
- ✅ Modular structure

## 🛡️ Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers via Helmet
- Input validation
- Error sanitization

## 📱 Mobile App Integration

This API is designed to work seamlessly with mobile apps:

- JSON responses
- Standard HTTP status codes
- RESTful endpoints
- File upload support (ready for images)
- Search functionality
- User-specific data filtering

## 🔄 Next Steps

1. Add authentication (JWT)
2. Implement file upload for design images
3. Add pagination for list endpoints
4. Create unit tests
5. Add API documentation (Swagger)
6. Implement caching strategy
