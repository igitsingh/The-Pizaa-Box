const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyPayment,
    handlePaymentFailure,
    getPaymentStatus
} = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth');

// All routes are optional for guest
const guestProtect = async (req, res, next) => {
    try {
        const orderId = req.body.orderId || req.params.orderId;
        if (!orderId) return protect(req, res, next);

        const Order = require('../models/Order');
        const order = await Order.findById(orderId);
        if (order && order.orderType === 'guest') {
            return next();
        }
        return protect(req, res, next);
    } catch (error) {
        return protect(req, res, next);
    }
};

router.post('/create-order', guestProtect, createRazorpayOrder);
router.post('/verify', guestProtect, verifyPayment);
router.post('/failure', guestProtect, handlePaymentFailure);
router.get('/status/:orderId', guestProtect, getPaymentStatus);

module.exports = router;
