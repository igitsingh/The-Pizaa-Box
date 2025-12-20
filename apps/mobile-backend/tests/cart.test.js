const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Cart = require('../src/models/Cart');
const MenuItem = require('../src/models/MenuItem');
const MenuCategory = require('../src/models/MenuCategory');

describe('Cart API', () => {
    let token;
    let userId;
    let menuItem;
    let category;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI);
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Cart.deleteMany({});
        await MenuItem.deleteMany({});
        await MenuCategory.deleteMany({});
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        // Clear collections
        await User.deleteMany({});
        await Cart.deleteMany({});
        await MenuItem.deleteMany({});
        await MenuCategory.deleteMany({});

        // Create test user and get token
        const res = await request(app)
            .post('/api/auth/register')
            .send(global.testUser);
        token = res.body.data.token;
        userId = res.body.data.user._id;

        // Create test category and menu item
        category = await MenuCategory.create({
            name: 'Pizzas',
            slug: 'pizzas',
            isActive: true
        });

        menuItem = await MenuItem.create({
            categoryId: category._id,
            name: 'Margherita Pizza',
            slug: 'margherita-pizza',
            description: 'Classic pizza',
            basePrice: 299,
            isVeg: true,
            isAvailable: true
        });
    });

    describe('GET /api/cart', () => {
        it('should get empty cart for new user', async () => {
            const res = await request(app)
                .get('/api/cart')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toHaveLength(0);
        });
    });

    describe('POST /api/cart/items', () => {
        it('should add item to cart', async () => {
            const res = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    menuItemId: menuItem._id,
                    quantity: 2,
                    selectedOptions: []
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.items[0].quantity).toBe(2);
            expect(res.body.data.subtotal).toBe(598); // 299 * 2
        });

        it('should not add item without menuItemId', async () => {
            const res = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({ quantity: 1 });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should calculate totals correctly', async () => {
            const res = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    menuItemId: menuItem._id,
                    quantity: 1,
                    selectedOptions: []
                });

            expect(res.body.data.subtotal).toBe(299);
            expect(res.body.data.deliveryFee).toBe(40);
            expect(res.body.data.taxAmount).toBeGreaterThan(0);
            expect(res.body.data.grandTotal).toBeGreaterThan(299);
        });
    });

    describe('DELETE /api/cart/items/:itemId', () => {
        it('should remove item from cart', async () => {
            // Add item first
            const addRes = await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    menuItemId: menuItem._id,
                    quantity: 1,
                    selectedOptions: []
                });

            const itemId = addRes.body.data.items[0]._id;

            // Remove item
            const res = await request(app)
                .delete(`/api/cart/items/${itemId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toHaveLength(0);
        });
    });

    describe('POST /api/cart/clear', () => {
        it('should clear entire cart', async () => {
            // Add item first
            await request(app)
                .post('/api/cart/items')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    menuItemId: menuItem._id,
                    quantity: 1,
                    selectedOptions: []
                });

            // Clear cart
            const res = await request(app)
                .post('/api/cart/clear')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toHaveLength(0);
            expect(res.body.data.grandTotal).toBe(0);
        });
    });
});
