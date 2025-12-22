"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTemplates = void 0;
const date_fns_1 = require("date-fns");
const types_1 = require("./types");
exports.NotificationTemplates = {
    [types_1.NotificationEvent.ORDER_PLACED]: (payload) => `🍕 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been placed successfully. Total: ₹${payload.amount}.`,
    [types_1.NotificationEvent.SCHEDULED_ORDER_CONFIRMED]: (payload) => `⏰ The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} is scheduled for ${payload.scheduledFor ? (0, date_fns_1.format)(new Date(payload.scheduledFor), 'MMM d, h:mm a') : 'future'}. We’ll notify you when we start preparing it.`,
    [types_1.NotificationEvent.ORDER_ACCEPTED]: (payload) => `👨‍🍳 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been accepted and is being queued.`,
    [types_1.NotificationEvent.ORDER_PREPARING]: (payload) => `🔥 The Pizza Box: We have started preparing your order #${payload.orderId.slice(-6).toUpperCase()}. It will be ready soon!`,
    [types_1.NotificationEvent.OUT_FOR_DELIVERY]: (payload) => `🚴 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} is out for delivery.`,
    [types_1.NotificationEvent.DELIVERED]: (payload) => `✅ The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been delivered. Enjoy your meal!`
};
