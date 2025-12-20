import { Router } from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import express from 'express';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
