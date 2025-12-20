"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
class NotificationService {
    static async sendSMS(phone, message) {
        // In a real app, integrate Twilio here
        console.log(`[SMS] To: ${phone} | Message: ${message}`);
    }
    static async sendEmail(email, subject, body) {
        // In a real app, integrate Resend/SendGrid here
        console.log(`[EMAIL] To: ${email} | Subject: ${subject} | Body: ${body}`);
    }
    static async sendOrderConfirmation(order) {
        const message = `Your order #${order.id.slice(0, 6)} has been placed successfully! Total: ₹${order.total}`;
        if (order.user.phone) {
            await this.sendSMS(order.user.phone, message);
        }
        await this.sendEmail(order.user.email, 'Order Confirmation', message);
    }
    static async sendStatusUpdate(order) {
        const message = `Update: Your order #${order.id.slice(0, 6)} is now ${order.status.replace(/_/g, ' ')}.`;
        if (order.user.phone) {
            await this.sendSMS(order.user.phone, message);
        }
        await this.sendEmail(order.user.email, 'Order Status Update', message);
    }
}
exports.NotificationService = NotificationService;
