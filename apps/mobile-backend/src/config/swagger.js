const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'The Pizza Box Mobile API',
            version: '1.0.0',
            description: 'Complete API documentation for The Pizza Box Android app backend',
            contact: {
                name: 'The Pizza Box',
                email: 'support@thepizzabox.in'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:5001',
                description: 'Development server'
            },
            {
                url: 'https://api.thepizzabox.in',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from login/register'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        phone: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string', enum: ['customer', 'admin'] },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                MenuItem: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        basePrice: { type: 'number' },
                        imageUrl: { type: 'string' },
                        isVeg: { type: 'boolean' },
                        isBestseller: { type: 'boolean' },
                        isAvailable: { type: 'boolean' }
                    }
                },
                Cart: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        items: { type: 'array' },
                        subtotal: { type: 'number' },
                        discountAmount: { type: 'number' },
                        deliveryFee: { type: 'number' },
                        taxAmount: { type: 'number' },
                        grandTotal: { type: 'number' }
                    }
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string', nullable: true },
                        orderType: { type: 'string', enum: ['user', 'guest'] },
                        guestPhone: { type: 'string' },
                        items: { type: 'array' },
                        addressSnapshot: { type: 'object' },
                        grandTotal: { type: 'number' },
                        orderStatus: {
                            type: 'string',
                            enum: ['created', 'accepted', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
                        },
                        paymentStatus: {
                            type: 'string',
                            enum: ['pending', 'paid', 'failed', 'refunded']
                        },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        error: { type: 'string' }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        data: { type: 'object' }
                    }
                }
            }
        },
        tags: [
            { name: 'Authentication', description: 'User authentication endpoints' },
            { name: 'Menu', description: 'Menu browsing endpoints' },
            { name: 'Cart', description: 'Shopping cart management' },
            { name: 'Orders', description: 'Order management' },
            { name: 'Payments', description: 'Payment processing' },
            { name: 'Address', description: 'Address management' },
            { name: 'Notifications', description: 'Push notifications' },
            { name: 'Admin', description: 'Admin operations' }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
