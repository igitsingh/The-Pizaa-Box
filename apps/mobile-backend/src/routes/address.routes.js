const express = require('express');
const router = express.Router();
const {
    getMyAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require('../controllers/address.controller');
const { protect } = require('../middlewares/auth');

// All routes are protected (require authentication)
router.use(protect);

router.route('/')
    .get(getMyAddresses)
    .post(createAddress);

router.route('/:id')
    .get(getAddress)
    .put(updateAddress)
    .delete(deleteAddress);

router.put('/:id/set-default', setDefaultAddress);

module.exports = router;
