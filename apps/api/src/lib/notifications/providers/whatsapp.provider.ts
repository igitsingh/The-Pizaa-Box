
import { NotificationProvider, NotificationEvent, NotificationPayload, NotificationChannel } from '../types';

export class WhatsAppProvider implements NotificationProvider {
    name = NotificationChannel.WHATSAPP;

    async send(event: NotificationEvent, payload: NotificationPayload, message: string): Promise<boolean> {
        // Disabled for now
        console.log(`[WHATSAPP_PROVIDER_DISABLED] Would send to ${payload.phone}: ${message}`);
        return false;
    }
}
