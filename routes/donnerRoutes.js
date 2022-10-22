// ============================================================
// import libraries
const express = require('express');

// create route
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../controllers/authControllers');
const donationControllers = require('../controllers/donnationControllers');

// ============================================================
// create routes
// get last month donnoers
router.get(
    '/last-month-donners',
    authControllers.protect,
    donationControllers.getLastMonthDonnersList
);

// get last month donation received patients
router.get(
    '/last-month-requests',
    authControllers.protect,
    donationControllers.getLastMonthDonationReceivedPatientsList
);

// get a route
router.get(
    '/get-a-donation-request/:serviceId',
    authControllers.protect,
    donationControllers.assignGetAServiceData,
    donationControllers.findServiceById,
    donationControllers.sendJsonForId
);

// ============================================================
// export route
module.exports = router;
