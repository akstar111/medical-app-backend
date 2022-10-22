// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const bloodDonationContro = require('../../../controllers/admin/bloodDonationContro');

// ============================================================
// create router
// ============================================================
// shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));
// create new blood bank
router.patch(
    '/manage-blood/:service/:partnerId',
    bloodDonationContro.managebloodBankBloods
);

// ============================================================
module.exports = router;
