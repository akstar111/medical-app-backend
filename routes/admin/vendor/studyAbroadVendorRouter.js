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
// vendor controllers
const studyAbroadVendorControllers = require('../../../controllers/studeAbroadControlles');

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// shared routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// ============================================================
// update college details
router.patch(
    '/update-college-details/:vendorId',
    adminControllers.assignDataForStudyAboradVendor,
    studyAbroadVendorControllers.setFilesForUploadCollegeDetails,
    studyAbroadVendorControllers.resizeCollegeDetailsImages,
    studyAbroadVendorControllers.uploadCollegeDetailsFilesOnAWS,
    studyAbroadVendorControllers.updateStudyAbroadByID,
    studyAbroadVendorControllers.sendJsonForUpdateById
);
// update course details
router.patch(
    '/update-course-details/:vendorId',
    adminControllers.assignDataForStudyAboradVendor,
    adminControllers.assignDataForStudyAbraoadCourseDetails,
    studyAbroadVendorControllers.assignDataForUpdateCourseDetails,
    studyAbroadVendorControllers.updateStudyAbroad,
    studyAbroadVendorControllers.sendServiceJsonupdateOne
);

// update facilities details
router.patch(
    '/update-facilities-details/:vendorId',
    adminControllers.assignDataForStudyAboradVendor,
    adminControllers.assignDataForStudyAbraoadCourseDetails,
    studyAbroadVendorControllers.assignDataForUpdateFaciliesDetails,
    studyAbroadVendorControllers.updateStudyAbroad,
    studyAbroadVendorControllers.sendServiceJsonupdateOne
);

// ============================================================
// export router
module.exports = router;
