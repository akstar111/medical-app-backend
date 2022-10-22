// ============================================================
// import libraries
const express = require('express');

// create route
const router = express.Router();

// ============================================================
// utilities
const fileUpload = require('../../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const pharmacyControllers = require('../../controllers/pharmacyControllers');

// ============================================================
// shared
router.use(authControllers.protect);

// ============================================================
// create routes
// get all pharmcay categories
router.get(
    '/pharmacy-categories',
    pharmacyControllers.getAllPharmacys,
    pharmacyControllers.sendJsonForGetallFilter
);

// create my medicine details
router.get(
    '/add-medicine',
    pharmacyControllers.assignPartnerSearch,
    pharmacyControllers.verifyValidPartner,
    pharmacyControllers.assignDataForCreateMedicines,
    pharmacyControllers.createNewMedicines,
    pharmacyControllers.sendJsonForCreateOne
);

// get my requests
router.get(
    '/my-medicine-requests',
    pharmacyControllers.assignPartnerSearch,
    pharmacyControllers.verifyValidPartner,
    pharmacyControllers.getMyMedicineRequests
);

// update quote status
router.patch(
    '/update-request-status/:status/:quoteId',
    pharmacyControllers.assignPartnerSearch,
    pharmacyControllers.verifyValidPartner,
    pharmacyControllers.updateParmacyVendorReceivedRequest
);

// ============================================================
// export route
module.exports = router;
