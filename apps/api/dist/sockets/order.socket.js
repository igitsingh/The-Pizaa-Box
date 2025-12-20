"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupOrderSockets = void 0;
const setupOrderSockets = (io) => {
    const orderNamespace = io.of('/orders');
    orderNamespace.on('connection', (socket) => {
        console.log('User connected to orders namespace:', socket.id);
        socket.on('join_order', (orderId) => {
            socket.join(orderId);
            console.log(`User ${socket.id} joined order room: ${orderId}`);
        });
        socket.on('leave_order', (orderId) => {
            socket.leave(orderId);
            console.log(`User ${socket.id} left order room: ${orderId}`);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected from orders namespace:', socket.id);
        });
    });
};
exports.setupOrderSockets = setupOrderSockets;
