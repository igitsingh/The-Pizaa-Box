
import prisma from '../config/db';
import { NotificationEvent, NotificationPayload, NotificationChannel } from '../lib/notifications/types';
import { NotificationTemplates } from '../lib/notifications/templates';
import { NotificationProvider } from '../lib/notifications/types';
import { LoggerProvider } from '../lib/notifications/providers/logger.provider';
import { SMSProvider } from '../lib/notifications/providers/sms.provider';
import { WhatsAppProvider } from '../lib/notifications/providers/whatsapp.provider';

export class NotificationService {
    private providers: NotificationProvider[] = [];

    constructor() {
        // ALWAYS enable Logger
        this.providers.push(new LoggerProvider());

        // Conditionals for other providers
        if (process.env.ENABLE_SMS === 'true') {
            this.providers.push(new SMSProvider());
        }
        if (process.env.ENABLE_WHATSAPP === 'true') {
            this.providers.push(new WhatsAppProvider());
        }
        // Email provider can be added similarly
    }

    async notify(event: NotificationEvent, payload: NotificationPayload) {
        const message = NotificationTemplates[event](payload);

        // We run all providers in parallel, but we catch errors individually so one failure doesn't stop others
        // And importantly, we DO NOT throw error back to the caller (Safe Mode)

        const promises = this.providers.map(async (provider) => {
            try {
                const success = await provider.send(event, payload, message);

                // Log to Database
                if (payload.orderId) {
                    await this.logToDB(payload.orderId, provider.name, event, success ? 'SENT' : 'SKIPPED', message);
                }

            } catch (error: any) {
                console.error(`[NotificationService] Failed to send via ${provider.name}`, error);
                // Log failure to DB
                if (payload.orderId) {
                    await this.logToDB(payload.orderId, provider.name, event, 'FAILED', message, error.message);
                }
            }
        });

        await Promise.all(promises);
    }

    private async logToDB(
        orderId: string,
        channel: NotificationChannel,
        event: NotificationEvent,
        status: 'QUEUED' | 'SENT' | 'FAILED' | 'SKIPPED',
        message: string,
        error?: string
    ) {
        try {
            await prisma.notificationLog.create({
                data: {
                    orderId,
                    channel,
                    event,
                    status,
                    message,
                    error
                }
            });
        } catch (dbError) {
            console.error('[NotificationService] Failed to save log to DB', dbError);
        }
    }
}

export const notificationService = new NotificationService();
