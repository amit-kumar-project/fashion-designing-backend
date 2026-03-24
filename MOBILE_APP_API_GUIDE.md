# 📱 Mobile App API Integration Guide

## 🌐 Base URL
```
Production: https://fashion-designing-backend.onrender.com/api
Local: http://localhost:8080/api
```

---

## 🔐 Authentication APIs

### 1️⃣ Sign Up (Create Account)

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

**Validation Errors:**
- All fields are required
- Passwords must match
- Password must be at least 6 characters
- Email must be unique
- Phone number must be unique

---

### 2️⃣ Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3️⃣ Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email",
  "data": {
    "email": "john.doe@example.com",
    "resetToken": "sample-reset-token-1234567890"
  }
}
```

**Note:** In production, this would send an actual email with a reset link.

---

### 4️⃣ Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Passwords do not match"
}
```

---

## 👤 User Management APIs

### 5️⃣ Get User Profile

**Endpoint:** `GET /api/users/:userId`

**Example:** `GET /api/users/65f8a1b2c3d4e5f6a7b8c9d0`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "createdAt": "2024-03-24T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 6️⃣ Update User Profile

**Endpoint:** `PUT /api/users/:userId`

**Request Body:**
```json
{
  "name": "John Updated",
  "bio": "Fashion designer and enthusiast",
  "profileImage": "https://example.com/profile.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

## 🎨 Design Management APIs

### 7️⃣ Create Design

**Endpoint:** `POST /api/designs`

**Request Body:**
```json
{
  "title": "Summer Collection 2024",
  "description": "A vibrant summer dress design with floral patterns",
  "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
  "imageUrl": "https://example.com/design-image.jpg",
  "tags": ["summer", "dress", "floral", "casual"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "65f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Summer Collection 2024",
    "description": "A vibrant summer dress design with floral patterns",
    "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
    "imageUrl": "https://example.com/design-image.jpg",
    "tags": ["summer", "dress", "floral", "casual"]
  }
}
```

---

### 8️⃣ Get Design by ID

**Endpoint:** `GET /api/designs/:designId`

**Example:** `GET /api/designs/65f8a1b2c3d4e5f6a7b8c9d1`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Summer Collection 2024",
    "description": "A vibrant summer dress design with floral patterns",
    "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
    "imageUrl": "https://example.com/design-image.jpg",
    "tags": ["summer", "dress", "floral", "casual"],
    "createdAt": "2024-03-24T10:30:00.000Z",
    "updatedAt": "2024-03-24T10:30:00.000Z"
  }
}
```

---

### 9️⃣ Get User's Designs

**Endpoint:** `GET /api/designs/user/:userId`

**Example:** `GET /api/designs/user/65f8a1b2c3d4e5f6a7b8c9d0`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Summer Collection 2024",
      "description": "A vibrant summer dress design",
      "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
      "imageUrl": "https://example.com/design1.jpg",
      "tags": ["summer", "dress"],
      "createdAt": "2024-03-24T10:30:00.000Z",
      "updatedAt": "2024-03-24T10:30:00.000Z"
    },
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d2",
      "title": "Winter Coat Design",
      "description": "Elegant winter coat",
      "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
      "imageUrl": "https://example.com/design2.jpg",
      "tags": ["winter", "coat"],
      "createdAt": "2024-03-23T10:30:00.000Z",
      "updatedAt": "2024-03-23T10:30:00.000Z"
    }
  ]
}
```

---

### 🔟 Search Designs

**Endpoint:** `GET /api/designs/search?q=summer`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "title": "Summer Collection 2024",
      "description": "A vibrant summer dress design",
      "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
      "imageUrl": "https://example.com/design1.jpg",
      "tags": ["summer", "dress"],
      "createdAt": "2024-03-24T10:30:00.000Z",
      "updatedAt": "2024-03-24T10:30:00.000Z"
    }
  ]
}
```

---

### 1️⃣1️⃣ Update Design

**Endpoint:** `PUT /api/designs/:designId`

**Request Body:**
```json
{
  "title": "Updated Summer Collection 2024",
  "description": "Updated description",
  "tags": ["summer", "dress", "updated"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Design updated successfully"
}
```

---

### 1️⃣2️⃣ Delete Design

**Endpoint:** `DELETE /api/designs/:designId`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Design deleted successfully"
}
```

---

## 📱 Mobile App Integration Code Examples

### React Native / Expo

```javascript
const API_BASE_URL = 'https://fashion-designing-backend.onrender.com/api';

// 1. Sign Up
const signUp = async (name, email, phoneNumber, password, confirmPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phoneNumber,
        password,
        confirmPassword
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save userId to AsyncStorage
      await AsyncStorage.setItem('userId', data.data.userId);
      await AsyncStorage.setItem('userEmail', data.data.email);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

// 2. Login
const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Save user data
      await AsyncStorage.setItem('userId', data.data.userId);
      await AsyncStorage.setItem('userEmail', data.data.email);
      await AsyncStorage.setItem('userName', data.data.name);
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// 3. Forgot Password
const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

// 4. Create Design
const createDesign = async (title, description, imageUrl, tags) => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    
    const response = await fetch(`${API_BASE_URL}/designs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        userId,
        imageUrl,
        tags
      }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Create design error:', error);
    throw error;
  }
};

// 5. Get User's Designs
const getUserDesigns = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    
    const response = await fetch(`${API_BASE_URL}/designs/user/${userId}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Get designs error:', error);
    throw error;
  }
};

// 6. Search Designs
const searchDesigns = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/designs/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Search designs error:', error);
    throw error;
  }
};
```

### Flutter / Dart

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'https://fashion-designing-backend.onrender.com/api';
  
  // 1. Sign Up
  static Future<Map<String, dynamic>> signUp({
    required String name,
    required String email,
    required String phoneNumber,
    required String password,
    required String confirmPassword,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/signup'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'name': name,
        'email': email,
        'phoneNumber': phoneNumber,
        'password': password,
        'confirmPassword': confirmPassword,
      }),
    );
    
    final data = json.decode(response.body);
    
    if (data['success']) {
      // Save user data
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', data['data']['userId']);
      await prefs.setString('userEmail', data['data']['email']);
      return data['data'];
    } else {
      throw Exception(data['error']);
    }
  }
  
  // 2. Login
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'password': password,
      }),
    );
    
    final data = json.decode(response.body);
    
    if (data['success']) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', data['data']['userId']);
      await prefs.setString('userEmail', data['data']['email']);
      await prefs.setString('userName', data['data']['name']);
      return data['data'];
    } else {
      throw Exception(data['error']);
    }
  }
  
  // 3. Create Design
  static Future<Map<String, dynamic>> createDesign({
    required String title,
    required String description,
    required String imageUrl,
    required List<String> tags,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('userId');
    
    final response = await http.post(
      Uri.parse('$baseUrl/designs'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'title': title,
        'description': description,
        'userId': userId,
        'imageUrl': imageUrl,
        'tags': tags,
      }),
    );
    
    final data = json.decode(response.body);
    
    if (data['success']) {
      return data['data'];
    } else {
      throw Exception(data['error']);
    }
  }
  
  // 4. Get User Designs
  static Future<List<Map<String, dynamic>>> getUserDesigns() async {
    final prefs = await SharedPreferences.getInstance();
    final userId = prefs.getString('userId');
    
    final response = await http.get(
      Uri.parse('$baseUrl/designs/user/$userId'),
    );
    
    final data = json.decode(response.body);
    
    if (data['success']) {
      return List<Map<String, dynamic>>.from(data['data']);
    } else {
      throw Exception(data['error']);
    }
  }
}
```

---

## 🔧 Important Notes

1. **User ID Storage**: After signup/login, save the `userId` in local storage (AsyncStorage/SharedPreferences)
2. **Error Handling**: Always check the `success` field in responses
3. **Image URLs**: Store image URLs as strings. Use image upload services like Cloudinary, AWS S3, or Firebase Storage
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS**: Already configured to accept requests from all origins

---

## 🧪 Testing the APIs

Use Postman or cURL to test:

```bash
# Health Check
curl https://fashion-designing-backend.onrender.com/api/health

# Sign Up
curl -X POST https://fashion-designing-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phoneNumber": "+1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST https://fashion-designing-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
