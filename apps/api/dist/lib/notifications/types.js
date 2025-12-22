"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationChannel = exports.NotificationEvent = void 0;
var NotificationEvent;
(function (NotificationEvent) {
    NotificationEvent["ORDER_PLACED"] = "ORDER_PLACED";
    NotificationEvent["ORDER_ACCEPTED"] = "ORDER_ACCEPTED";
    NotificationEvent["ORDER_PREPARING"] = "ORDER_PREPARING";
    NotificationEvent["OUT_FOR_DELIVERY"] = "OUT_FOR_DELIVERY";
    NotificationEvent["DELIVERED"] = "DELIVERED";
    NotificationEvent["SCHEDULED_ORDER_CONFIRMED"] = "SCHEDULED_ORDER_CONFIRMED";
})(NotificationEvent || (exports.NotificationEvent = NotificationEvent = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["LOG"] = "LOG";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["WHATSAPP"] = "WHATSAPP";
    NotificationChannel["EMAIL"] = "EMAIL";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
