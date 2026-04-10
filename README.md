# 🚀 Real-Time Chat Application with Socket.io

A full-featured real-time chat application built with Node.js, Express, MongoDB, and Socket.io for instant messaging integration.

## ✨ Features

### Authentication & User Management
- ✅ User registration (signup) with validation
- ✅ User login with password hashing (bcrypt)
- ✅ User logout with status update
- ✅ Password confirmation on signup
- ✅ Username and email availability check
- ✅ User profile retrieval
- ✅ Account deactivation

### Real-Time Communication
- ✅ Real-time messaging via Socket.io
- ✅ Typing indicator
- ✅ User online/offline status
- ✅ User join/leave notifications
- ✅ Online users count

### User Statuses
- ✅ Online - User is actively using the app
- ✅ Offline - User is not connected
- ✅ Away - User is idle

### Security
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ Password hidden in API responses
- ✅ Email validation
- ✅ Account active verification
- ✅ Session-based authentication
- ✅ Error handling without revealing sensitive data

---

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Real-Time-Chat-Application-Socket.io-Integration-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
4. **Update .env with your MongoDB URI:**
   ```
   MONGO_URI=mongodb://localhost:27017/chat-app
   # or MongoDB Atlas
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/chat-app
   
   PORT=9000
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

5. **Start MongoDB (if running locally):**
   ```bash
   # Windows
   mongod
   
   # macOS
   brew services start mongodb-community
   ```

6. **Run the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Server will start at:**
   ```
   http://localhost:9000
   ```

---

## 📁 Project Structure

```
Real-Time-Chat-Application-Socket.io-Integration-/
├── index.js                      # Main server configuration
├── package.json                  # Dependencies
├── .env.example                  # Environment variables template
├── API_GUIDE.md                  # API documentation
├── README.md                     # This file
│
├── model/
│   └── user.model.js            # User schema & login logic
│
├── routers/
│   └── auth.routes.js           # Authentication API routes
│
├── middle/
│   └── auth.middleware.js       # Authentication middleware
│
├── lib/
│   └── db.js                    # Database connection
│
├── service/
│   └── user.service.js          # User business logic
│
└── public/                       # Frontend files (to be added)
```

---

## 🔐 API Endpoints

### Authentication Routes

#### 1. **User Signup**
```
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "John Doe"
}
```

#### 2. **User Login**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 3. **User Logout**
```
POST /api/auth/logout
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

#### 4. **Get User Profile**
```
GET /api/auth/profile/:userId
```

#### 5. **Update User Status**
```
PUT /api/auth/status
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "status": "online"
}
```

#### 6. **Check Username Availability**
```
GET /api/auth/check-username/john_doe
```

#### 7. **Check Email Availability**
```
GET /api/auth/check-email/john@example.com
```

#### 8. **Get All Users**
```
GET /api/auth/users
```

#### 9. **Search Users**
```
GET /api/auth/search?q=john
```

#### 10. **Delete Account**
```
POST /api/auth/delete-account
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "password": "password123"
}
```

---

## 🔌 Socket.IO Events

### Client to Server (emit)

```javascript
// Send message
socket.emit('user-message', 'Hello everyone!');

// Update typing status
socket.emit('typing', { isTyping: true });
```

### Server to Client (on)

```javascript
// Receive message
socket.on('message', (data) => {
  console.log(data.from, data.message, data.timestamp);
});

// User joined notification
socket.on('user-joined', (data) => {
  console.log(data.message);
  console.log('Users online:', data.usersOnline);
});

// Online users count
socket.on('online-users', (count) => {
  console.log('Users online:', count);
});

// Typing indicator
socket.on('user-typing', (data) => {
  console.log(data.userId, 'is typing:', data.isTyping);
});

// User left notification
socket.on('user-left', (data) => {
  console.log(data.message);
  console.log('Users online:', data.usersOnline);
});
```

---

## 🧪 Testing with Postman

1. **Download Postman** from [postman.com](https://www.postman.com/)

2. **Signup a new user:**
   - Method: POST
   - URL: `http://localhost:9000/api/auth/signup`
   - Body (JSON):
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "test123",
       "confirmPassword": "test123",
       "fullName": "Test User"
     }
     ```

3. **Login:**
   - Method: POST
   - URL: `http://localhost:9000/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "test123"
     }
     ```

4. Save the returned userId for other requests

---

## 🔄 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  username: String (unique, required, 3-30 chars),
  email: String (unique, required, valid email),
  password: String (hashed, required, 6+ chars),
  fullName: String,
  avatar: String,
  status: String (enum: ['online', 'offline', 'away']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Development

### Available Commands

```bash
# Start server in development mode (auto-reload with nodemon)
npm run dev

# Start server in production mode
npm start

# Install dependencies
npm install

# Update .env file
cp .env.example .env
```

### Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ORM
- **bcrypt** - Password hashing
- **socket.io** - Real-time communication
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

---

## 🔒 Security Best Practices Implemented

1. **Password Security**
   - Passwords hashed with bcrypt (10 salt rounds)
   - Never stored in plain text
   - Passwords excluded from API responses

2. **Data Validation**
   - Email format validation
   - Username length validation
   - Password strength checks
   - Required field validation

3. **Error Handling**
   - Generic error messages (don't reveal user existence)
   - Validation error details
   - Proper HTTP status codes

4. **User Account**
   - Account active verification
   - Deactivation instead of deletion
   - Session-based authentication
   - Status tracking

---

## 🚀 Next Steps / To-Do

- [ ] Implement JWT tokens for stateless authentication
- [ ] Add password reset functionality
- [ ] Implement email verification on signup
- [ ] Add message persistence in database
- [ ] Create friend list/contact management
- [ ] Implement message history retrieval
- [ ] Add file upload/sharing capability
- [ ] Implement message encryption
- [ ] Add notification system
- [ ] Create admin panel
- [ ] Add rate limiting
- [ ] Implement two-factor authentication
- [ ] Add message reactions/emojis
- [ ] Create group chat functionality
- [ ] Add voice/video calling (WebRTC)

---

## 📚 API Documentation

For detailed API documentation with examples, see [API_GUIDE.md](./API_GUIDE.md)

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify network connectivity

### Port Already in Use
- Change PORT in .env file
- Or kill process using the port

### Socket.IO Connection Issues
- Check CORS settings in index.js
- Ensure client is using correct server URL
- Check browser console for errors

### Password Hashing Slow
- This is normal with bcrypt
- 10 salt rounds = ~100ms per hash
- Reduce salt rounds if needed (not recommended)

---

## 📞 Support

For issues or questions:
1. Check API_GUIDE.md for API documentation
2. Review console logs for errors
3. Check browser developer console
4. Ensure all dependencies are installed

---

## 📄 License

MIT License - Feel free to use this project

---

## 👨‍💻 Author

Created with ❤️ for real-time communication

---

**Happy Chatting! 🎉**