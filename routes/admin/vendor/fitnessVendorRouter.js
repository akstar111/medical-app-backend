// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import utiliteies
const fileUpload = require('../../../util/fileUpload');
// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');
const fitnessVendorControllers = require('../../../controllers/fitnessControllers');
// ============================================================
// shared routers
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// update gym equipments and facilities
router.patch(
    '/manage-fitness-services/:serviceType/:type/:service/:vendorId',
    fitnessVendorControllers.setImageSizeForFitnesEquipmentsBanner,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindFitnesGym,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    fitnessVendorControllers.imageNameForGymEquipments,
    fileUpload.uploadFilesinAWS,
    fitnessVendorControllers.managefitnessFacilities
);

// update fitness facilites
router.patch(
    '/manage-fitness-services/:serviceType/:service/:vendorId',
    adminControllers.assignDataForFindFitnesGym,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    fitnessVendorControllers.manageFitnessServices
);

// create fitness vieo
router.post(
    '/create-fitness-video/:vendorId',
    fitnessVendorControllers.setFilesForUploadCollegeDetails,
    adminControllers.assignDataForFindFitnesGym,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    fitnessVendorControllers.saveWorkoutVideosOnserver,
    fitnessVendorControllers.assignDataForcreateNewVideo,
    fitnessVendorControllers.createNewFitnessVideo,
    fitnessVendorControllers.sendjsonforcreateOne
);

// update fitness vieo
router.patch(
    '/update-fitness-video/:vendorId/:videoId',
    fitnessVendorControllers.setFilesForUploadCollegeDetails,
    adminControllers.assignDataForFindFitnesGym,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    fitnessVendorControllers.saveWorkoutVideosOnserver,
    fitnessVendorControllers.assignDataForcreateNewVideo,
    fitnessVendorControllers.updateFitnessVideo,
    fitnessVendorControllers.sendJsonForUpdateOne
);

// ============================================================
// exports router
module.exports = router;
