"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const db_1 = __importDefault(require("../config/db"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    typescript: true,
});
const createPaymentIntent = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await db_1.default.order.findUnique({
            where: { id: orderId },
        });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        // Mock for development if key is placeholder
        if (process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder' || !process.env.STRIPE_SECRET_KEY) {
            console.log('Using MOCK payment intent for development');
            res.json({ clientSecret: 'mock_client_secret_for_dev' });
            return;
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Amount in cents
            currency: 'inr',
            metadata: {
                orderId: order.id,
            },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};
exports.createPaymentIntent = createPaymentIntent;
const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message} `);
        return;
    }
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        if (orderId) {
            await db_1.default.order.update({
                where: { id: orderId },
                data: { status: 'PREPARING' }, // Or a specific PAID status if we had one
            });
            // Emit socket event here if needed
        }
    }
    res.json({ received: true });
};
exports.handleWebhook = handleWebhook;
