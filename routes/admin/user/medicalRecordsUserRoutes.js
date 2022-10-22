// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');
const medicalRecordsControllers = require('../../../controllers/medicalRecordsControllers');

// ============================================================
// shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// ============================================================
// routes
// get medical recors for members
router.get(
    '/record-list/:userEId/:recordId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    adminControllers.assignUserIdForUser,
    medicalRecordsControllers.assignDataForGetMemberRecords,
    medicalRecordsControllers.getMemberMedicalRecords,
    medicalRecordsControllers.sendJsonForFindAll
);

// ============================================================
// export router
module.exports = router;
