// Test setup file
require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/thepizzabox_test';

// Increase timeout for database operations
jest.setTimeout(10000);

// Global test utilities
global.testUser = {
    name: 'Test User',
    phone: '9999999999',
    email: 'test@example.com',
    password: 'password123'
};

global.testAdmin = {
    name: 'Test Admin',
    phone: '8888888888',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
};
