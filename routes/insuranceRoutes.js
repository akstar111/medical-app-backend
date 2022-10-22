const express = require('express');

// ============================================================
// Import controllers
const authControllers = require('../controllers/authControllers');
const insuranceControllers = require('../controllers/insuranceController');

const router = express.Router();

router.post(
    '/check-valid-insurance-data-1',
    insuranceControllers.checkInsurancePage1Data
);
router.post(
    '/check-valid-insurance-data-2',
    insuranceControllers.checkInsurancePage2Data
);

router.post(
    '/new-insurance-register',
    authControllers.protect,
    insuranceControllers.checkInsuranceDatas,
    insuranceControllers.assignInsuranceRegisterData,
    insuranceControllers.createInsurance,
    insuranceControllers.sendJsonInsurance
);

// renew insurance
router.patch(
    '/renew-insurance/:insuranceId',
    authControllers.protect,
    insuranceControllers.checkRenewInsuranceData,
    insuranceControllers.updateInsuraceValidity,
    insuranceControllers.sendJsonForUpdatedById
);

module.exports = router;
