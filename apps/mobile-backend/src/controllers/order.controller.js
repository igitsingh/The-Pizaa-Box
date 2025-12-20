const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Address = require('../models/Address');

/**
 * @desc    Create new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { addressId, paymentMethod, isGuest, guestAddress, guestPhone, cartItems } = req.body;

        let orderData = {
            paymentProvider: paymentMethod,
            paymentStatus: 'pending',
            orderStatus: paymentMethod === 'cod' ? 'accepted' : 'created'
        };

        if (isGuest) {
            if (!guestAddress || !guestPhone || !cartItems || cartItems.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing guest details: address, phone, or cart items'
                });
            }

            orderData.orderType = 'guest';
            orderData.guestPhone = guestPhone;
            orderData.addressSnapshot = guestAddress;
            orderData.items = cartItems;

            // Calculate totals for guest order (since guest doesn't have a backend cart)
            const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);
            const deliveryFee = parseFloat(process.env.DELIVERY_FEE) || 40;
            const taxRate = parseFloat(process.env.TAX_RATE) || 0.05;
            const taxAmount = Math.round(subtotal * taxRate);

            orderData.subtotal = subtotal;
            orderData.discountAmount = 0; // Guest doesn't support coupons in initial version
            orderData.deliveryFee = deliveryFee;
            orderData.taxAmount = taxAmount;
            orderData.grandTotal = subtotal + deliveryFee + taxAmount;

        } else {
            // Logged-in user logic
            if (!addressId || !paymentMethod) {
                return res.status(400).json({
                    success: false,
                    error: 'Please provide addressId and paymentMethod'
                });
            }

            // Get user's cart
            const cart = await Cart.findOne({ userId: req.user._id });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Cart is empty'
                });
            }

            // Get address
            const address = await Address.findOne({
                _id: addressId,
                userId: req.user._id
            });
            if (!address) {
                return res.status(404).json({
                    success: false,
                    error: 'Address not found'
                });
            }

            // Recalculate cart totals
            await cart.calculateTotals();

            orderData.userId = req.user._id;
            orderData.addressSnapshot = {
                label: address.label,
                line1: address.line1,
                line2: address.line2,
                locality: address.locality,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            };
            orderData.items = cart.items.map(item => ({
                menuItemId: item.menuItemId,
                nameSnapshot: item.nameSnapshot,
                priceSnapshot: item.priceSnapshot,
                quantity: item.quantity,
                selectedOptions: item.selectedOptions,
                lineTotal: item.lineTotal
            }));
            orderData.subtotal = cart.subtotal;
            orderData.discountAmount = cart.discountAmount;
            orderData.deliveryFee = cart.deliveryFee;
            orderData.taxAmount = cart.taxAmount;
            orderData.grandTotal = cart.grandTotal;

            // Clear cart after order creation
            cart.items = [];
            cart.couponCode = null;
            cart.discountAmount = 0;
            cart.subtotal = 0;
            cart.taxAmount = 0;
            cart.grandTotal = 0;
            await cart.save();
        }

        const order = await Order.create(orderData);

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all orders for current user
 * @route   GET /api/orders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;

        const query = { userId: req.user._id };
        if (status) {
            query.orderStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('items.menuItemId', 'name imageUrl');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get order tracking/timeline
 * @route   GET /api/orders/:id/tracking
 * @access  Private
 */
exports.getOrderTracking = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).select('orderStatus timeline placedAt');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: {
                currentStatus: order.orderStatus,
                placedAt: order.placedAt,
                timeline: order.timeline
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Can only cancel if not already delivered or cancelled
        if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                error: `Cannot cancel order with status: ${order.orderStatus}`
            });
        }

        // Can only cancel if payment is not completed (for online payments)
        if (order.paymentProvider === 'razorpay' && order.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Cannot cancel paid orders. Please contact support for refund.'
            });
        }

        order.orderStatus = 'cancelled';
        order.addTimelineEntry('cancelled', 'Order cancelled by customer');
        await order.save();

        res.json({
            success: true,
            message: 'Order cancelled successfully',
            data: order
        });
    } catch (error) {
        next(error);
    }
};
