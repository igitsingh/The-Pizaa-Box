"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = exports.InvoiceService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const date_fns_1 = require("date-fns");
class InvoiceService {
    async generateInvoice(order) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', (err) => {
                reject(err);
            });
            // --- HEADER ---
            doc.fontSize(20).text('The Pizza Box', { align: 'right' });
            doc.fontSize(10).text('123 Pizza Street, Food City, India', { align: 'right' });
            doc.text(`GSTIN: ${process.env.RESTAURANT_GSTIN || '27ABCDE1234F1Z5'}`, { align: 'right' });
            doc.moveDown();
            // --- INVOICE DETAILS ---
            doc.fontSize(16).text('TAX INVOICE', { align: 'left' });
            doc.moveDown(0.5);
            doc.fontSize(10);
            doc.text(`Invoice No: ${order.invoiceNumber || 'N/A'}`);
            doc.text(`Invoice Date: ${order.invoiceGeneratedAt ? (0, date_fns_1.format)(new Date(order.invoiceGeneratedAt), 'dd/MM/yyyy') : (0, date_fns_1.format)(new Date(), 'dd/MM/yyyy')}`);
            doc.text(`Order ID: TPB${String(order.orderNumber).padStart(5, '0')}`);
            doc.moveDown();
            // --- CUSTOMER DETAILS ---
            doc.text('Bill To:', { underline: true });
            doc.text(order.user?.name || order.customerName || 'Guest Customer');
            doc.text(order.user?.phone || order.customerPhone || '');
            if (order.user?.email)
                doc.text(order.user.email);
            doc.moveDown();
            // --- TABLE HEADER ---
            const tableTop = 250;
            const itemX = 50;
            const qtyX = 300;
            const priceX = 370;
            const totalX = 450;
            doc.font('Helvetica-Bold');
            doc.text('Item', itemX, tableTop);
            doc.text('Qty', qtyX, tableTop);
            doc.text('Price', priceX, tableTop);
            doc.text('Total', totalX, tableTop);
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
            doc.font('Helvetica');
            // --- ITEMS ---
            let y = tableTop + 25;
            order.items.forEach((item) => {
                const itemName = item.name;
                // Variants string
                let variantStr = '';
                if (item.variants && Object.values(item.variants).length > 0) {
                    variantStr = Object.values(item.variants).map((v) => v.label).join(', ');
                }
                doc.text(itemName, itemX, y, { width: 240 });
                if (variantStr) {
                    doc.fontSize(8).fillColor('gray').text(`(${variantStr})`, itemX, y + 12);
                    doc.fontSize(10).fillColor('black');
                }
                doc.text(item.quantity.toString(), qtyX, y);
                doc.text(item.price.toFixed(2), priceX, y);
                doc.text((item.price * item.quantity).toFixed(2), totalX, y);
                y += variantStr ? 30 : 20;
            });
            doc.moveTo(50, y).lineTo(550, y).stroke();
            y += 10;
            // --- SUMMARY ---
            const summaryX = 350;
            const valueX = 450;
            doc.text('Subtotal:', summaryX, y);
            doc.text(Number(order.subtotal || 0).toFixed(2), valueX, y);
            y += 15;
            // Tax Breakup
            if (order.taxBreakup) {
                const tax = order.taxBreakup;
                if (tax.cgstAmount > 0) {
                    doc.text(`CGST (${tax.cgstRate}%):`, summaryX, y);
                    doc.text(Number(tax.cgstAmount).toFixed(2), valueX, y);
                    y += 15;
                }
                if (tax.sgstAmount > 0) {
                    doc.text(`SGST (${tax.sgstRate}%):`, summaryX, y);
                    doc.text(Number(tax.sgstAmount).toFixed(2), valueX, y);
                    y += 15;
                }
            }
            else if (order.tax > 0) {
                // Fallback if breakup is missing but tax exists
                doc.text('Tax:', summaryX, y);
                doc.text(Number(order.tax).toFixed(2), valueX, y);
                y += 15;
            }
            doc.font('Helvetica-Bold');
            doc.text('Grand Total:', summaryX, y);
            doc.text(Number(order.total).toFixed(2), valueX, y);
            // Payment Info
            y += 30;
            doc.fontSize(10).font('Helvetica');
            doc.text(`Payment Method: ${order.paymentMethod}`, 50, y);
            doc.text(`Status: ${order.paymentStatus}`, 50, y + 15);
            // Footer
            doc.fontSize(8).text('Thank you for dining with us!', 50, 700, { align: 'center', width: 500 });
            doc.end();
        });
    }
}
exports.InvoiceService = InvoiceService;
exports.invoiceService = new InvoiceService();
