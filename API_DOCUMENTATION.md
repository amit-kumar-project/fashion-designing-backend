# Fashion Design App API Documentation

## 🌐 Base URL
**Production**: `https://fashion-designing-backend.onrender.com/api`
**Local**: `http://localhost:8080/api`

## 📱 Mobile App Integration Guide

### 🔐 Authentication Headers
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>' // For protected routes
}
```

### � Login (Access Token)
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "<JWT_ACCESS_TOKEN>",
  "expiresIn": "30m",
  "data": {
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "user@example.com",
    "phoneNumber": "+1234567890",
    "isAdmin": false
  }
}
```

### �👤 User Management APIs

#### Register User
```http
POST /api/users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Get User Profile
```http
GET /api/users/:userId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update User Profile
```http
PUT /api/users/:userId
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Fashion designer"
}
```

### 🎨 Design Management APIs

#### Create Design
```http
POST /api/designs
Content-Type: application/json

{
  "title": "Summer Collection 2024",
  "description": "A vibrant summer dress design",
  "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "imageUrl": "https://example.com/design.jpg",
  "tags": ["summer", "dress", "casual"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Summer Collection 2024",
    "description": "A vibrant summer dress design",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "imageUrl": "https://example.com/design.jpg",
    "tags": ["summer", "dress", "casual"]
  }
}
```

#### Get Design by ID
```http
GET /api/designs/:designId
```

#### Get User's Designs
```http
GET /api/designs/user/:userId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Summer Collection 2024",
      "description": "A vibrant summer dress design",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "imageUrl": "https://example.com/design.jpg",
      "tags": ["summer", "dress", "casual"],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Search Designs
```http
GET /api/designs/search?q=summer
```

#### Update Design
```http
PUT /api/designs/:designId
Content-Type: application/json

{
  "title": "Updated Summer Collection",
  "description": "Updated description"
}
```

#### Delete Design
```http
DELETE /api/designs/:designId
```

### 🏥 System APIs

### 🛡️ Admin APIs (Protected)

All admin routes require:
- Valid `Authorization: Bearer <token>` header
- Logged in user with `isAdmin: true`

#### Get All Users (Admin)
```http
GET /api/admin/users
Authorization: Bearer <JWT_TOKEN>
```

#### Get All Designs (Admin)
```http
GET /api/admin/designs
Authorization: Bearer <JWT_TOKEN>
```

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### API Information
```http
GET /api/
```

## 📱 Mobile App Integration Examples

### React Native Example
```javascript
// API Configuration
const API_BASE_URL = 'https://fashion-designing-backend.onrender.com/api';

// Create Design
const createDesign = async (designData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/designs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(designData),
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error creating design:', error);
    throw error;
  }
};

// Get User Designs
const getUserDesigns = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/designs/user/${userId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Error fetching designs:', error);
    throw error;
  }
};
```

### Flutter Example
```dart
class ApiService {
  static const String baseUrl = 'https://fashion-designing-backend.onrender.com/api';
  
  static Future<Map<String, dynamic>> createDesign(Map<String, dynamic> designData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/designs'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(designData),
    );
    
    if (response.statusCode == 201) {
      return json.decode(response.body)['data'];
    } else {
      throw Exception('Failed to create design');
    }
  }
  
  static Future<List<Map<String, dynamic>>> getUserDesigns(String userId) async {
    final response = await http.get(Uri.parse('$baseUrl/designs/user/$userId'));
    
    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(json.decode(response.body)['data']);
    } else {
      throw Exception('Failed to fetch designs');
    }
  }
}
```

## 🔧 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Validation error 1", "Validation error 2"]
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin access required)
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 📝 Notes for Mobile Development

1. **Token Storage**: Save `accessToken` securely in app storage and send in `Authorization` header.
2. **Token Expiry**: Access token expires in `30m`; on `401`, force re-login.
3. **Role Handling**: Use `isAdmin` from login response to decide whether to show admin screens.
4. **Rate Limiting**: 100 requests per 15 minutes per IP.
5. **Request Body Size**: Maximum 10MB.
6. **Error Handling**: Always check `success` field and handle `401/403` separately.

## 🚀 Testing the API

You can test the API using:
- Postman
- cURL commands
- Your mobile app's HTTP client

Example cURL:
```bash
curl -X GET https://fashion-designing-backend.onrender.com/api/health
```
