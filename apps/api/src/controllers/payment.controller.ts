import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    typescript: true,
});

export const createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;

        const order = await prisma.order.findUnique({
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
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message} `);
        return;
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
            await prisma.order.update({
                where: { id: orderId },
                data: { status: 'PREPARING' }, // Or a specific PAID status if we had one
            });
            // Emit socket event here if needed
        }
    }

    res.json({ received: true });
};
