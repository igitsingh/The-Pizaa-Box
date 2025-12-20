
import { format } from 'date-fns';
import { NotificationEvent, NotificationPayload } from './types';

export const NotificationTemplates: Record<NotificationEvent, (payload: NotificationPayload) => string> = {
    [NotificationEvent.ORDER_PLACED]: (payload) =>
        `🍕 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been placed successfully. Total: ₹${payload.amount}.`,

    [NotificationEvent.SCHEDULED_ORDER_CONFIRMED]: (payload) =>
        `⏰ The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} is scheduled for ${payload.scheduledFor ? format(new Date(payload.scheduledFor), 'MMM d, h:mm a') : 'future'}. We’ll notify you when we start preparing it.`,

    [NotificationEvent.ORDER_ACCEPTED]: (payload) =>
        `👨‍🍳 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been accepted and is being queued.`,

    [NotificationEvent.ORDER_PREPARING]: (payload) =>
        `🔥 The Pizza Box: We have started preparing your order #${payload.orderId.slice(-6).toUpperCase()}. It will be ready soon!`,

    [NotificationEvent.OUT_FOR_DELIVERY]: (payload) =>
        `🚴 The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} is out for delivery.`,

    [NotificationEvent.DELIVERED]: (payload) =>
        `✅ The Pizza Box: Your order #${payload.orderId.slice(-6).toUpperCase()} has been delivered. Enjoy your meal!`
};
