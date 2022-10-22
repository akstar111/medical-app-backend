// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminAmbulanceControllers = require('../../../controllers/admin/ambulanceContro');

// create routes
//shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// update ambulance status
router.patch(
    '/update-quote-status/:status/:quoteId',
    adminAmbulanceControllers.assignDataForServiceProvidersFromUser,
    adminAmbulanceControllers.updateAmbulanceQuotes,
    adminAmbulanceControllers.sendJsonForUpdateById
);

// update ambulance status
router.patch(
    '/cancel-quote/:quoteId',
    adminAmbulanceControllers.assignDatafoCancelAQuotes,
    adminAmbulanceControllers.updateAllAmbulanceQuotes,
    adminAmbulanceControllers.sendJsonForUpdateAll,
);

// get advertisements
// ============================================================
module.exports = router;
