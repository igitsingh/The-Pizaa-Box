"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppProvider = void 0;
const types_1 = require("../types");
class WhatsAppProvider {
    constructor() {
        this.name = types_1.NotificationChannel.WHATSAPP;
    }
    async send(event, payload, message) {
        // Disabled for now
        console.log(`[WHATSAPP_PROVIDER_DISABLED] Would send to ${payload.phone}: ${message}`);
        return false;
    }
}
exports.WhatsAppProvider = WhatsAppProvider;
