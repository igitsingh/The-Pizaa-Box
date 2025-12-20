
export enum NotificationEvent {
    ORDER_PLACED = 'ORDER_PLACED',
    ORDER_ACCEPTED = 'ORDER_ACCEPTED',
    ORDER_PREPARING = 'ORDER_PREPARING',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    DELIVERED = 'DELIVERED',
    SCHEDULED_ORDER_CONFIRMED = 'SCHEDULED_ORDER_CONFIRMED'
}

export enum NotificationChannel {
    LOG = 'LOG',
    SMS = 'SMS',
    WHATSAPP = 'WHATSAPP',
    EMAIL = 'EMAIL'
}

export interface NotificationPayload {
    orderId: string;
    customerName: string;
    amount: number;
    phone?: string;
    email?: string;
    scheduledFor?: string; // ISO String
}

export interface NotificationProvider {
    name: NotificationChannel;
    send(event: NotificationEvent, payload: NotificationPayload, message: string): Promise<boolean>;
}
