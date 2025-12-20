import { Server, Socket } from 'socket.io';

export const setupOrderSockets = (io: Server) => {
    const orderNamespace = io.of('/orders');

    orderNamespace.on('connection', (socket: Socket) => {
        console.log('User connected to orders namespace:', socket.id);

        socket.on('join_order', (orderId: string) => {
            socket.join(orderId);
            console.log(`User ${socket.id} joined order room: ${orderId}`);
        });

        socket.on('leave_order', (orderId: string) => {
            socket.leave(orderId);
            console.log(`User ${socket.id} left order room: ${orderId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected from orders namespace:', socket.id);
        });
    });
};
