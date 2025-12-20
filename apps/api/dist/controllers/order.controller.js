"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const db_1 = __importDefault(require("../config/db"));
const zod_1 = require("zod");
const socket_1 = require("../socket");
const createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(zod_1.z.object({
        itemId: zod_1.z.string(),
        name: zod_1.z.string(),
        price: zod_1.z.number(),
        quantity: zod_1.z.number(),
        options: zod_1.z.any().optional(),
        addons: zod_1.z.any().optional(),
    })),
    total: zod_1.z.number(),
    addressId: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.enum(['COD', 'UPI', 'CARD', 'NET_BANKING']).default('COD'),
    paymentStatus: zod_1.z.enum(['PENDING', 'PAID', 'FAILED']).default('PENDING'),
    paymentDetails: zod_1.z.any().optional(),
});
const createOrder = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        const { items, total, addressId, paymentMethod, paymentStatus, paymentDetails } = createOrderSchema.parse(req.body);
        const order = await db_1.default.order.create({
            data: {
                userId,
                total,
                status: 'PENDING',
                // @ts-ignore - addressId might not be in schema yet, but we will add it
                addressId: addressId,
                paymentMethod,
                paymentStatus,
                paymentDetails: paymentDetails || {},
                items: {
                    create: items.map((item) => ({
                        itemId: item.itemId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        options: item.options,
                        addons: item.addons,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
        // Notify admin (or specific room)
        (0, socket_1.getIO)().of('/orders').emit('new_order', order);
        // Send Notification
        const fullOrder = await db_1.default.order.findUnique({
            where: { id: order.id },
            include: { user: true }
        });
        if (fullOrder) {
            const { NotificationService } = require('../services/notification.service');
            NotificationService.sendOrderConfirmation(fullOrder);
        }
        res.status(201).json(order);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ errors: error.issues });
        }
        else {
            console.error('Create order error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
exports.createOrder = createOrder;
const getOrders = async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user?.userId;
        // @ts-ignore
        const userRole = req.user?.role;
        // If admin, return all orders. Otherwise, return only user's orders
        const whereClause = userRole === 'ADMIN' ? {} : { userId };
        const orders = await db_1.default.order.findMany({
            where: whereClause,
            include: {
                items: true,
                user: true // Include user info for admin view
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getOrders = getOrders;
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        // @ts-ignore
        const userId = req.user?.userId;
        const order = await db_1.default.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // @ts-ignore
        if (order.userId !== userId && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Access denied' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getOrder = getOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await db_1.default.order.update({
            where: { id },
            data: { status },
        });
        // Notify user via socket
        (0, socket_1.getIO)().of('/orders').to(id).emit('order_status_updated', { orderId: id, status });
        // Send Notification
        const fullOrder = await db_1.default.order.findUnique({
            where: { id },
            include: { user: true }
        });
        if (fullOrder) {
            const { NotificationService } = require('../services/notification.service');
            NotificationService.sendStatusUpdate(fullOrder);
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
