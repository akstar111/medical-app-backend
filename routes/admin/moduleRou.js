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
const adminControllers = require('../../controllers/admin/adminControllers');
const moduleControllers = require('../../controllers/admin/moduleControllers');
// ============================================================
// create router
// moudle management
// ============================================================
// ============================================================
// ============================================================
// homecare
// create new homecare service
router.post(
    '/create-homecare-services',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewHomecareServices,
    moduleControllers.assignImageNameForHomecareService,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewHomeCareService,
    moduleControllers.sendJsonForCreateOne
);
// update homecare
router.patch(
    '/update-homecare-services/:serviceId',
    moduleControllers.getOldHomecareData,
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForHomecareService,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateHomecareServices,
    moduleControllers.assignDataForUpdateRestHomcareServicesAll,
    moduleControllers.updateRemainingHomeCareServices,
    moduleControllers.sendJsonForUpdateOne
);

// ============================================================
// ============================================================
// ============================================================
// create new deaddiction service
router.post(
    '/create-deaddiction-services',
    moduleControllers.setbannerImageSize,
    moduleControllers.setbannerImageSizeForDeaddicationCenter,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    moduleControllers.assignDataForcreateNewDeaddictionServices,
    moduleControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    moduleControllers.createNewDeaddictionService,
    moduleControllers.sendJsonForCreateOne
);
// update deaddiction service
router.patch(
    '/update-deaddiction-services/:serviceId',
    moduleControllers.getOldDeaddictionData,
    moduleControllers.setbannerImageSizeForDeaddicationCenter,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    moduleControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    moduleControllers.updateDeaddictionServices,
    moduleControllers.assignDataForUpdateRestdeaddictionServicesAll,
    moduleControllers.updateRemainingDeaddictionServices,
    moduleControllers.sendJsonForUpdateOne
);
// ============================================================
// ============================================================
// ============================================================
// create new ambulance service
router.post(
    '/create-ambulance-services',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewAmbulanceServices,
    moduleControllers.assignImageNameForAmbulanceService,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewAmbulanceService,
    moduleControllers.sendJsonForCreateOne
);
// update deaddiction service
router.patch(
    '/update-ambulance-services/:serviceId',
    moduleControllers.getOldAmbulanceData,
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForAmbulanceService,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateAmbulanceServices,
    moduleControllers.updateRemainValuesinAmbulanceServices
);

// ============================================================
// ============================================================
// ============================================================
// Hospital package
router.post(
    '/create-hospital-package',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewHospitalPackage,
    moduleControllers.assignImageNameForHospitalPackage,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewHospitalPacakge,
    moduleControllers.sendJsonForCreateOne
);
// update deaddiction service
router.patch(
    '/update-hospital-package/:serviceId',
    moduleControllers.getOldHospitalPackage,
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForHospitalPackage,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateHospitalPackage,
    moduleControllers.updateRemainValuesinHospitalPackage
);

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// Fitness
router.post(
    '/fitness/new-food-nutritions',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewNutritions,
    moduleControllers.assignImageNameForNutritions,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewNutritionDetails,
    moduleControllers.sendJsonForCreateOne
);
// update nutrion food details
router.patch(
    '/fitness/update-food-nutritions/:foodId',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForNutritions,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateNutritionDetails,
    moduleControllers.sendJsonForUpdateOne
);

// ============================================================
// ============================================================
// ============================================================
// pharmacy
// create new homecare service
router.post(
    '/create-pharmacy-services',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewPharmacyCategories,
    moduleControllers.assignImageNameForPharmacy,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewPharmacyServices,
    moduleControllers.sendJsonForCreateOne
);
// update homecare
router.patch(
    '/update-pharmacy-services/:serviceId',
    moduleControllers.getOldMedicinesName,
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForPharmacy,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updatePharmacyServices,
    moduleControllers.assignDataForUpdateRestMedicinesServicesAll,
    moduleControllers.updateMedicinesServices,
    moduleControllers.sendJsonForUpdateOne
);

// create new pharmacy medicines
router.post(
    '/create-pharmacy-medicines',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewPharmacyMedicines,
    moduleControllers.assignImageNameForPharmacyMedicines,
    fileUpload.uploadFilesinAWS,
    moduleControllers.checkValidCategorie,
    moduleControllers.createNewPharmacyMedicine,
    moduleControllers.sendJsonForCreateOne
);
// update homecare
router.patch(
    '/update-pharmacy-medicines/:serviceId',

    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForPharmacyMedicines,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateMedicines,
    moduleControllers.sendJsonForUpdateOne
);

// create medicines

// ============================================================
// ============================================================
// ============================================================
// laboratory
// create new laboratory
router.post(
    '/create-laboratory-services',
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignDataForcreateNewLaboratoryCategories,
    moduleControllers.assignImageNameForlaboratory,
    fileUpload.uploadFilesinAWS,
    moduleControllers.createNewLaboratoryServices,
    moduleControllers.sendJsonForCreateOne
);
// update laboratory
router.patch(
    '/update-laboratory-services/:serviceId',
    moduleControllers.getOldHomecareData,
    moduleControllers.setbannerImageSize,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    moduleControllers.assignImageNameForHomecareService,
    fileUpload.uploadFilesinAWS,
    moduleControllers.updateHomecareServices,
    moduleControllers.assignDataForUpdateRestHomcareServicesAll,
    moduleControllers.updateRemainingHomeCareServices,
    moduleControllers.sendJsonForUpdateOne
);

// ============================================================
// ============================================================
// ============================================================
// Job categories
router.post(
    '/job/creaet-job-categories',
    moduleControllers.assignDataforCreateNewJobCategories,
    moduleControllers.createNewJobCategories,
    moduleControllers.sendJsonForCreateOne
);

// update jsob categories

// mange job sub categories
router.patch(
    '/job/manage-job-categories/:serviceId',
    moduleControllers.mangeJobsubCategories,
    moduleControllers.updateSubCategories,
    moduleControllers.sendJsonForUpdateOne
);

// ============================================================
module.exports = router;
