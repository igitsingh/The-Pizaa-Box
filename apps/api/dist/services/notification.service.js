"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const db_1 = __importDefault(require("../config/db"));
const templates_1 = require("../lib/notifications/templates");
const logger_provider_1 = require("../lib/notifications/providers/logger.provider");
const sms_provider_1 = require("../lib/notifications/providers/sms.provider");
const whatsapp_provider_1 = require("../lib/notifications/providers/whatsapp.provider");
class NotificationService {
    constructor() {
        this.providers = [];
        // ALWAYS enable Logger
        this.providers.push(new logger_provider_1.LoggerProvider());
        // Conditionals for other providers
        if (process.env.ENABLE_SMS === 'true') {
            this.providers.push(new sms_provider_1.SMSProvider());
        }
        if (process.env.ENABLE_WHATSAPP === 'true') {
            this.providers.push(new whatsapp_provider_1.WhatsAppProvider());
        }
        // Email provider can be added similarly
    }
    async notify(event, payload) {
        const message = templates_1.NotificationTemplates[event](payload);
        // We run all providers in parallel, but we catch errors individually so one failure doesn't stop others
        // And importantly, we DO NOT throw error back to the caller (Safe Mode)
        const promises = this.providers.map(async (provider) => {
            try {
                const success = await provider.send(event, payload, message);
                // Log to Database
                if (payload.orderId) {
                    await this.logToDB(payload.orderId, provider.name, event, success ? 'SENT' : 'SKIPPED', message);
                }
            }
            catch (error) {
                console.error(`[NotificationService] Failed to send via ${provider.name}`, error);
                // Log failure to DB
                if (payload.orderId) {
                    await this.logToDB(payload.orderId, provider.name, event, 'FAILED', message, error.message);
                }
            }
        });
        await Promise.all(promises);
    }
    async logToDB(orderId, channel, event, status, message, error) {
        try {
            await db_1.default.notificationLog.create({
                data: {
                    orderId,
                    channel,
                    event,
                    status,
                    message,
                    error
                }
            });
        }
        catch (dbError) {
            console.error('[NotificationService] Failed to save log to DB', dbError);
        }
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
