# 📚 The Pizza Box Mobile API Documentation

## Overview

Complete REST API documentation for The Pizza Box Android application backend.

## 🌐 API Base URL

- **Development:** `http://localhost:5002`
- **Production:** `https://api.thepizzabox.in`

## 📖 Interactive Documentation

Access the interactive Swagger UI documentation:

**Local:** http://localhost:5002/docs

**Features:**
- ✅ Try out all endpoints
- ✅ See request/response examples
- ✅ Test authentication
- ✅ View all schemas

## 🔐 Authentication

Most endpoints require JWT authentication.

### Getting a Token:

1. **Register:** `POST /api/auth/register`
2. **Login:** `POST /api/auth/login`
3. **Use token:** Add header `Authorization: Bearer YOUR_TOKEN`

### Example:
```bash
curl -X POST http://localhost:5002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "password": "password123"}'
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

## 📍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/me` - Update profile (Protected)
- `PUT /api/auth/change-password` - Change password (Protected)

### Menu
- `GET /api/menu/categories` - List all categories
- `GET /api/menu/items` - List menu items (with filters)
- `GET /api/menu/items/:id` - Get single item
- `GET /api/menu/bestsellers` - Get bestseller items

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/items/:itemId` - Remove from cart (Protected)
- `POST /api/cart/apply-coupon` - Apply coupon (Protected)
- `DELETE /api/cart/coupon` - Remove coupon (Protected)
- `POST /api/cart/clear` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - List user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `GET /api/orders/:id/tracking` - Track order (Protected)
- `PUT /api/orders/:id/cancel` - Cancel order (Protected)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order (Protected)
- `POST /api/payments/verify` - Verify payment (Protected)
- `POST /api/payments/failure` - Handle payment failure (Protected)
- `GET /api/payments/status/:orderId` - Get payment status (Protected)

### Address
- `GET /api/users/me/addresses` - List addresses (Protected)
- `POST /api/users/me/addresses` - Create address (Protected)
- `GET /api/users/me/addresses/:id` - Get address (Protected)
- `PUT /api/users/me/addresses/:id` - Update address (Protected)
- `DELETE /api/users/me/addresses/:id` - Delete address (Protected)
- `PUT /api/users/me/addresses/:id/set-default` - Set default (Protected)

### Notifications
- `POST /api/notifications/register-token` - Register FCM token (Protected)
- `DELETE /api/notifications/unregister-token` - Unregister token (Protected)
- `GET /api/notifications/tokens` - List tokens (Protected)

### Admin (Admin Only)
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/menu/categories` - List categories
- `POST /api/admin/menu/categories` - Create category
- `PUT /api/admin/menu/categories/:id` - Update category
- `DELETE /api/admin/menu/categories/:id` - Delete category
- `GET /api/admin/menu/items` - List menu items
- `POST /api/admin/menu/items` - Create menu item
- `PUT /api/admin/menu/items/:id` - Update menu item
- `DELETE /api/admin/menu/items/:id` - Delete menu item

## 📦 Response Format

All responses follow this format:

### Success Response:
```json
{
  "success": true,
  "data": { ... },
  "count": 10,  // For list endpoints
  "total": 100  // For paginated endpoints
}
```

### Error Response:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔍 Query Parameters

### Pagination:
```
?page=1&limit=20
```

### Filtering:
```
?status=delivered&from=2024-01-01&to=2024-12-31
```

### Search:
```
?search=margherita&isVeg=true
```

## 📊 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

Use the Swagger UI to test endpoints or use tools like:
- Postman
- Insomnia
- cURL
- HTTPie

## 📥 Postman Collection

Download the Postman collection:
```
GET /docs.json
```

Import this JSON into Postman for easy testing.

## 🚀 Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

## 🔒 Security

- All passwords are hashed with bcrypt
- JWT tokens expire in 30 days
- HTTPS required in production
- CORS configured for allowed origins

## 📞 Support

For API issues or questions:
- Email: support@thepizzabox.in
- Documentation: http://localhost:5002/docs

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- Complete CRUD operations
- Payment integration
- Push notifications
- Admin panel support

---

**Built with ❤️ for The Pizza Box Android App**
