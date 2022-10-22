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


// get advetisement
router.get(
    '/get-advertisements/:moduleName/:vendorId',
    adminControllers.assignDataForGetAdvetisement,
    adminControllers.getAdvetisement,
    adminControllers.sendJsonForGetAll
);

// get all jobs
router.get(
    '/get-jobs/:moduleName/:vendorId',
    adminControllers.assignDataForGetAllJobs,
    adminControllers.getAllJobs,
    adminControllers.sendJsonForGetAll
);

// get a job
router.get('/get-a-job/:moduleName/:jobId', adminControllers.getAJobs);

// get a applicant
router.get('/get-a-applicant/:applicantId', adminControllers.getAAppliant);

// get a quote
router.get(
    '/get-quotes/:moduleName/:vendorId',
    adminControllers.getvendorActiveQuotes
);

// ============================================================
module.exports = router;
