# 🔐 Chat Application - API Routes Guide

## Server Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create .env file** (copy from .env.example):
   ```bash
   cp .env.example .env
   ```
   Update with your MongoDB URI and port

3. **Start Server:**
   ```bash
   npm run dev    # Development (with nodemon)
   npm start      # Production
   ```

---

## 📡 API Endpoints

### 1️⃣ **User Login**
- **Endpoint:** `POST /api/auth/login`
- **Description:** Login user with email and password
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "statusCode": 200,
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "user@example.com",
      "fullName": "John Doe",
      "status": "online",
      "avatar": null,
      "isActive": true,
      "createdAt": "2025-04-09T10:30:00.000Z"
    }
  }
  ```
- **Error Response (401):**
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
    "statusCode": 401
  }
  ```

---

### 2️⃣ **User Logout**
- **Endpoint:** `POST /api/auth/logout`
- **Description:** Logout user and set status to offline
- **Request Body:**
  ```json
  {
    "userId": "507f1f77bcf86cd799439011"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Logout successful",
    "statusCode": 200
  }
  ```

---

### 3️⃣ **Get User Profile**
- **Endpoint:** `GET /api/auth/profile/:userId`
- **Description:** Fetch user profile by ID
- **URL Parameter:**
  - `userId`: User MongoDB ID
- **Example Request:**
  ```
  GET http://localhost:9000/api/auth/profile/507f1f77bcf86cd799439011
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "statusCode": 200,
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "user@example.com",
      "fullName": "John Doe",
      "status": "online",
      "isActive": true
    }
  }
  ```

---

### 4️⃣ **Update User Status**
- **Endpoint:** `PUT /api/auth/status`
- **Description:** Update user status (online/offline/away)
- **Request Body:**
  ```json
  {
    "userId": "507f1f77bcf86cd799439011",
    "status": "away"
  }
  ```
- **Valid Status Values:** `online` | `offline` | `away`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Status updated successfully",
    "statusCode": 200,
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "user@example.com",
      "status": "away",
      "isActive": true
    }
  }
  ```

---

## 🧪 Postman Examples

### Login Request
```
Method: POST
URL: http://localhost:9000/api/auth/login
Headers:
  Content-Type: application/json

Body (JSON):
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Update Status Request
```
Method: PUT
URL: http://localhost:9000/api/auth/status
Headers:
  Content-Type: application/json

Body (JSON):
{
  "userId": "507f1f77bcf86cd799439011",
  "status": "online"
}
```

---

## 🔌 Socket.IO Events

### **Connection Events**
```javascript
socket.on('user-joined', (data) => {
  console.log(data.message);
  console.log(data.usersOnline); // Number of online users
});

socket.on('online-users', (count) => {
  console.log('Users online:', count);
});
```

### **Messaging Events**
```javascript
// Send message
socket.emit('user-message', 'Hello everyone!');

// Receive message
socket.on('message', (data) => {
  console.log(data.from, data.message, data.timestamp);
});
```

### **Typing Indicator**
```javascript
// User is typing
socket.emit('typing', { isTyping: true });

// Receive typing indicator
socket.on('user-typing', (data) => {
  console.log(data.userId, 'is typing:', data.isTyping);
});
```

### **Disconnection**
```javascript
socket.on('user-left', (data) => {
  console.log(data.message);
  console.log('Users online:', data.usersOnline);
});
```

---

## 📋 File Structure
```
├── index.js                      # Main server file
├── package.json
├── .env                          # Environment variables
├── model/
│   └── user.model.js            # User schema & login logic
├── routers/
│   └── auth.routes.js           # API routes
├── middle/
│   └── auth.middleware.js       # Authentication middleware
├── lib/
│   └── db.js                    # Database connection
├── service/                      # (Future: Business logic)
└── public/                       # (Future: Frontend files)
```

---

## 🚀 Quick Test Commands

### cURL - Login
```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### cURL - Update Status
```bash
curl -X PUT http://localhost:9000/api/auth/status \
  -H "Content-Type: application/json" \
  -d '{"userId":"507f1f77bcf86cd799439011","status":"online"}'
```

---

## ✅ Features Implemented

✨ User login with password hashing (bcrypt)
✨ User status management (online/offline/away)
✨ User profile retrieval
✨ Account active check
✨ Error handling & validation
✨ Socket.IO real-time messaging
✨ Typing indicator
✨ User join/leave notifications

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Password hidden in responses
- ✅ Email validation
- ✅ Account active verification
- ✅ Session-based authentication
- ✅ Error messages don't reveal user existence
- ✅ Timestamps on all records

---

## 📝 Next Steps

1. Implement **JWT tokens** for stateless auth
2. Add **user registration** endpoint
3. Implement **message persistence** in database
4. Add **friend list/contacts** feature
5. Implement **message history** retrieval
6. Add **file upload** capability
7. Implement **notification** system
