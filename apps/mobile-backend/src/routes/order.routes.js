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

// All routes are protected
router.use(protect);

router.route('/')
    .post(createOrder)
    .get(getMyOrders);

router.get('/:id', getOrder);
router.get('/:id/tracking', getOrderTracking);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
