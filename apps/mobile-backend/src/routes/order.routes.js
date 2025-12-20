const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrder,
    getOrderTracking,
    cancelOrder
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth');

// POST / is open to guests as well, but protect it internally for logged in users
router.route('/')
    .post((req, res, next) => {
        if (req.body.isGuest) return next();
        return protect(req, res, next);
    }, createOrder)
    .get(protect, getMyOrders);

router.get('/:id', protect, getOrder);
router.get('/:id/tracking', getOrderTracking); // Tracking is public for guests if they have ID
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
