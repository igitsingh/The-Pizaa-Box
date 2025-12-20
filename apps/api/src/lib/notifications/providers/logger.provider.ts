
import { NotificationProvider, NotificationEvent, NotificationPayload, NotificationChannel } from '../types';

export class LoggerProvider implements NotificationProvider {
    name = NotificationChannel.LOG;

    async send(event: NotificationEvent, payload: NotificationPayload, message: string): Promise<boolean> {
        console.log(`[NOTIFICATION_LOG] [${event}] To: ${payload.customerName} (${payload.phone || 'No Phone'}) | Msg: "${message}"`);
        return true;
    }
}
