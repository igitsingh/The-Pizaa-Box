"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerProvider = void 0;
const types_1 = require("../types");
class LoggerProvider {
    constructor() {
        this.name = types_1.NotificationChannel.LOG;
    }
    async send(event, payload, message) {
        console.log(`[NOTIFICATION_LOG] [${event}] To: ${payload.customerName} (${payload.phone || 'No Phone'}) | Msg: "${message}"`);
        return true;
    }
}
exports.LoggerProvider = LoggerProvider;
