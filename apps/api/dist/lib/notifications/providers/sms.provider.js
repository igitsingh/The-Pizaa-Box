"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSProvider = void 0;
const types_1 = require("../types");
class SMSProvider {
    constructor() {
        this.name = types_1.NotificationChannel.SMS;
    }
    async send(event, payload, message) {
        // Disabled for now
        console.log(`[SMS_PROVIDER_DISABLED] Would send to ${payload.phone}: ${message}`);
        return false;
    }
}
exports.SMSProvider = SMSProvider;
