# Testing Guide

## Overview

This directory contains automated tests for The Pizza Box Mobile Backend API.

## Test Structure

```
tests/
├── setup.js          # Test configuration
├── auth.test.js      # Authentication tests
├── cart.test.js      # Cart functionality tests
└── README.md         # This file
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests with coverage:
```bash
npm run test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

## Test Coverage

Current test coverage includes:

### Authentication (auth.test.js)
- ✅ User registration
- ✅ Duplicate phone validation
- ✅ Required field validation
- ✅ User login
- ✅ Invalid credentials handling
- ✅ Get current user profile
- ✅ Token validation

### Cart (cart.test.js)
- ✅ Get empty cart
- ✅ Add items to cart
- ✅ Update item quantity
- ✅ Remove items from cart
- ✅ Clear cart
- ✅ Price calculations (subtotal, tax, delivery, total)
- ✅ Coupon application (if applicable)

## Test Database

Tests use a separate test database: `thepizzabox_test`

The database is automatically cleaned before each test to ensure isolation.

## Writing New Tests

### Test Template:

```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');

describe('Feature Name', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Setup for each test
    });

    it('should do something', async () => {
        const res = await request(app)
            .get('/api/endpoint')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Descriptive**: Use clear test descriptions
4. **Coverage**: Aim for >80% code coverage
5. **Fast**: Keep tests fast and focused

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test
  env:
    MONGODB_URI: ${{ secrets.MONGODB_TEST_URI }}
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env.test
- Verify network connectivity

### Test Timeouts
- Increase timeout in jest.config.js
- Check for hanging database connections
- Ensure proper cleanup in afterAll/afterEach

### Failed Tests
- Check test database state
- Verify environment variables
- Review error messages carefully

## Future Tests

Planned test coverage:
- [ ] Order creation and management
- [ ] Payment verification (mocked)
- [ ] Address management
- [ ] Menu operations
- [ ] Admin operations
- [ ] Notification system

## Contact

For issues or questions about tests, please contact the development team.
