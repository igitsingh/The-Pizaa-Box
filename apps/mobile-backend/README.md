# 🍕 The Pizza Box - Mobile Backend

MongoDB + Express backend for The Pizza Box Android application.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 5+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your credentials

# Run development server
npm run dev
```

Server will start on: **http://localhost:5002**

## 📚 Documentation

- **API Docs:** http://localhost:5002/docs
- **Full Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Testing Guide:** [tests/README.md](./tests/README.md)

## 🏗️ Project Structure

```
mobile-backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Express app
├── tests/               # Test files
├── .env.example         # Environment template
├── package.json
└── README.md
```

## 🔧 Environment Variables

Required environment variables:

```env
# Server
PORT=5002
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/thepizzabox

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=30d

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Firebase (FCM)
FCM_PROJECT_ID=your_project_id
FCM_CLIENT_EMAIL=your_client_email
FCM_PRIVATE_KEY=your_private_key
```

## 📦 Features

### ✅ Implemented
- User authentication (JWT)
- Menu browsing & search
- Shopping cart with auto-calculations
- Order management with timeline
- Razorpay payment integration
- Address management
- Push notifications (FCM)
- Admin panel APIs
- Comprehensive testing
- API documentation (Swagger)

### 🎯 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Payments:** Razorpay
- **Notifications:** Firebase Cloud Messaging
- **Testing:** Jest + Supertest
- **Documentation:** Swagger/OpenAPI

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test
```

## 📊 API Endpoints

**Total Endpoints:** 45

- **Auth:** 5 endpoints
- **Menu:** 5 endpoints
- **Cart:** 7 endpoints
- **Orders:** 5 endpoints
- **Payments:** 4 endpoints
- **Address:** 6 endpoints
- **Notifications:** 3 endpoints
- **Admin:** 10 endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for details.

## 🔐 Security

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- Error handling
- CORS configuration
- Helmet security headers

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t pizza-box-api .
docker run -p 5001:5001 pizza-box-api
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run `npm test`
5. Submit pull request

## 📞 Support

For issues or questions:
- Email: support@thepizzabox.in
- Documentation: http://localhost:5002/docs

## 📄 License

MIT License - see LICENSE file

---

**Built for The Pizza Box Android App** 🍕
