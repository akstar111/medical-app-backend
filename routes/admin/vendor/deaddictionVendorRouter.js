// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const deaddictionContro = require('../../../controllers/admin/deaddictionContro');
const deAddictionControllers = require('../../../controllers/deAddictionControllers');
const fileUpload = require('../../../util/fileUpload');
// ============================================================
// shared routers
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// deaddiction router
// create deaddiction router
router.post(
    '/new-deaddiction-service/:partnerId',
    deAddictionControllers.serviceImageProperties,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    deaddictionContro.assignAndVerifyPartnerData,
    deAddictionControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    deAddictionControllers.createDeaddictionServices,
    deAddictionControllers.sendServiceJson
);

// update deaddiction
router.patch(
    '/update-deaddiction-service/:serviceId',
    deAddictionControllers.serviceImageProperties,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    deaddictionContro.assignAndVerifyPartnerData,
    deAddictionControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    deAddictionControllers.assignDataForUpdateDeaddicionServicess,
    deAddictionControllers.updateDeaddictionServices,
    deAddictionControllers.sendJsonForUpdateOne
);

// update meet The expert services
router.patch(
    '/manage-deaddiction-facilities/:type/:service/:partnerId',
    authControllers.protect,
    deaddictionContro.manageMeetTheExpertServicesServices
);

// cancel deaddiction service
router.patch(
    '/update-deaddiction-status/:status/:deaddictionId',
    authControllers.protect,
    deaddictionContro.assignDataForCancelDeaddictionService,
    deAddictionControllers.cancelDeaddictionService,
    deAddictionControllers.sendJsonForDeaddictionCancelRequest
);
// ============================================================
// export router
module.exports = router;
