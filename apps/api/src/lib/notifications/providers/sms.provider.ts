
import { NotificationProvider, NotificationEvent, NotificationPayload, NotificationChannel } from '../types';

export class SMSProvider implements NotificationProvider {
    name = NotificationChannel.SMS;

    async send(event: NotificationEvent, payload: NotificationPayload, message: string): Promise<boolean> {
        // Disabled for now
        console.log(`[SMS_PROVIDER_DISABLED] Would send to ${payload.phone}: ${message}`);
        return false;
    }
}
