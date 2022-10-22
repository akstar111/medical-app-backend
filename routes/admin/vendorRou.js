// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const adminControllers = require('../../controllers/admin/adminControllers');

// ============================================================
// create routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// get all packgeges
router.get(
    '/get-all-vendors/:moduleName',
    adminControllers.assignDataForGetAllVendors,
    adminControllers.getAllVendors,
    adminControllers.sendJsonForFilter
);

// get -a vendor
// router.get('/get-a-vendor/:vendorId', adminControllers.getAVendor);

// update vendor profile
router.patch(
    '/update-vender/:moduleName/:vendorId',
    adminControllers.assignDataForUpdatePartner,
    adminControllers.updatePartner,
    adminControllers.sendJsonForUpdateOne
);

// update vendor status
router.patch(
    '/update-partner-status/:status/:partnerId',
    adminControllers.assignDataForUpdatePartnerStatus,
    adminControllers.updatePartnerStatus,
    adminControllers.sendJsonForUpdateOne
);
// ============================================================
module.exports = router;
