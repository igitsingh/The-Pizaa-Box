const Address = require('../models/Address');
const User = require('../models/User');

/**
 * @desc    Get all addresses for current user
 * @route   GET /api/users/me/addresses
 * @access  Private
 */
exports.getMyAddresses = async (req, res, next) => {
    try {
        const addresses = await Address.find({ userId: req.user._id })
            .sort({ isDefault: -1, createdAt: -1 });

        res.json({
            success: true,
            count: addresses.length,
            data: addresses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single address
 * @route   GET /api/users/me/addresses/:id
 * @access  Private
 */
exports.getAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        res.json({
            success: true,
            data: address
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new address
 * @route   POST /api/users/me/addresses
 * @access  Private
 */
exports.createAddress = async (req, res, next) => {
    try {
        const { label, line1, line2, locality, city, state, pincode, isDefault, geoLocation } = req.body;

        // Validate required fields
        if (!label || !line1 || !locality || !city || !state || !pincode) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required address fields'
            });
        }

        // Create address
        const address = await Address.create({
            userId: req.user._id,
            label,
            line1,
            line2,
            locality,
            city,
            state,
            pincode,
            isDefault: isDefault || false,
            geoLocation
        });

        // If this is the first address or marked as default, update user's defaultAddressId
        if (isDefault) {
            await User.findByIdAndUpdate(req.user._id, {
                defaultAddressId: address._id
            });
        } else {
            // Check if this is the first address
            const addressCount = await Address.countDocuments({ userId: req.user._id });
            if (addressCount === 1) {
                address.isDefault = true;
                await address.save();
                await User.findByIdAndUpdate(req.user._id, {
                    defaultAddressId: address._id
                });
            }
        }

        res.status(201).json({
            success: true,
            data: address
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update address
 * @route   PUT /api/users/me/addresses/:id
 * @access  Private
 */
exports.updateAddress = async (req, res, next) => {
    try {
        let address = await Address.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        const { label, line1, line2, locality, city, state, pincode, isDefault, geoLocation } = req.body;

        // Update fields
        if (label) address.label = label;
        if (line1) address.line1 = line1;
        if (line2 !== undefined) address.line2 = line2;
        if (locality) address.locality = locality;
        if (city) address.city = city;
        if (state) address.state = state;
        if (pincode) address.pincode = pincode;
        if (geoLocation) address.geoLocation = geoLocation;
        if (isDefault !== undefined) address.isDefault = isDefault;

        await address.save();

        // Update user's default address if needed
        if (isDefault) {
            await User.findByIdAndUpdate(req.user._id, {
                defaultAddressId: address._id
            });
        }

        res.json({
            success: true,
            data: address
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete address
 * @route   DELETE /api/users/me/addresses/:id
 * @access  Private
 */
exports.deleteAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        const wasDefault = address.isDefault;
        await address.deleteOne();

        // If deleted address was default, set another address as default
        if (wasDefault) {
            const newDefaultAddress = await Address.findOne({ userId: req.user._id });
            if (newDefaultAddress) {
                newDefaultAddress.isDefault = true;
                await newDefaultAddress.save();
                await User.findByIdAndUpdate(req.user._id, {
                    defaultAddressId: newDefaultAddress._id
                });
            } else {
                await User.findByIdAndUpdate(req.user._id, {
                    defaultAddressId: null
                });
            }
        }

        res.json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Set address as default
 * @route   PUT /api/users/me/addresses/:id/set-default
 * @access  Private
 */
exports.setDefaultAddress = async (req, res, next) => {
    try {
        const address = await Address.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                error: 'Address not found'
            });
        }

        // Set as default (pre-save hook will handle unsetting others)
        address.isDefault = true;
        await address.save();

        // Update user's default address
        await User.findByIdAndUpdate(req.user._id, {
            defaultAddressId: address._id
        });

        res.json({
            success: true,
            data: address
        });
    } catch (error) {
        next(error);
    }
};
