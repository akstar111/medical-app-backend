// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import utilities
const fileUpload = require('../../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const ambulanceAlertcontrollers = require('../../controllers/admin/trackAmbulanceManagement');
const ambulanceControllers = require('../../controllers/ambulanceControllers');

// ============================================================

// ============================================================
// create routes
// shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// create ambulance route
router.post(
    '/create-ambulance-driver',
    ambulanceAlertcontrollers.setAmbulanceProfileImageSize,
    fileUpload.uploadSingleImage('profileImage'),
    fileUpload.resizeSingleImage,
    ambulanceAlertcontrollers.assignDataForcreateAmbulanceDriver,
    ambulanceAlertcontrollers.assignImageNameForAmbulanceDriver,
    fileUpload.uploadFilesinAWS,
    ambulanceAlertcontrollers.createNewAmbulanceDriver,
    ambulanceAlertcontrollers.sendJsonForCreateOne
);
// create ambulance route
router.patch(
    '/update-ambulance-driver/:driverId',
    ambulanceAlertcontrollers.setAmbulanceProfileImageSize,
    fileUpload.uploadSingleImage('profileImage'),
    fileUpload.resizeSingleImage,
    ambulanceAlertcontrollers.assignImageNameForAmbulanceDriver,
    fileUpload.uploadFilesinAWS,
    ambulanceAlertcontrollers.updateNewAmbulanceDriver,
    ambulanceAlertcontrollers.sendJsonForUpdateOne
);

// create traffic
router.post(
    '/create-traffic-police',
    ambulanceAlertcontrollers.setAmbulanceProfileImageSize,
    fileUpload.uploadSingleImage('profileImage'),
    fileUpload.resizeSingleImage,
    ambulanceAlertcontrollers.assignDataForcreateTrafficPolice,
    ambulanceAlertcontrollers.assignImageNameForTrafficPolice,
    fileUpload.uploadFilesinAWS,
    ambulanceAlertcontrollers.createNewTrafficPolice,
    ambulanceAlertcontrollers.sendJsonForCreateOne
);

// update traffic police
router.patch(
    '/update-traffic-police/:policeId',
    ambulanceAlertcontrollers.setAmbulanceProfileImageSize,
    fileUpload.uploadSingleImage('profileImage'),
    fileUpload.resizeSingleImage,
    ambulanceAlertcontrollers.assignImageNameForTrafficPolice,
    fileUpload.uploadFilesinAWS,
    ambulanceAlertcontrollers.updateTrafficPolice,
    ambulanceAlertcontrollers.sendJsonForUpdateOne
);

// assign ambulace drivers
router.patch(
    '/request-management/new-request/:serviceId/:driverId',
    ambulanceControllers.assignDataForvalidAmbulanceDriver,
    ambulanceControllers.updateAmbulanceAlert,
    ambulanceControllers.sendNotificationandJsontoDriver,
    ambulanceControllers.sendJsonForCreateNew
);

// verification status
router.patch(
    '/request-management/update-verification-status/:assignId/:driverId',
    ambulanceControllers.updateAmbulanceDeriversRequest
);
// ============================================================
module.exports = router;
