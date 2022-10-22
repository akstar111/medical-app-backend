// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const homecareContro = require('../../../controllers/admin/homecareContro');
const homecareServiceControllers = require('../../../controllers/homecareServiceControllers');
// ============================================================
// shared routers
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// homecare router
// create homecare router
router.post(
    '/new-homecare-service/:partnerId',
    homecareServiceControllers.serviceImageProperties,
    homecareServiceControllers.uploadSinglAndMultipleImage,
    homecareServiceControllers.resizeHomecareServiceImages,
    homecareContro.assignAndVerifyPartnerData,
    homecareServiceControllers.uploadFilesinAWS,
    homecareServiceControllers.createNewHomecares,
    homecareServiceControllers.sendServiceJson
);

// update homecare
router.patch(
    '/update-homecare-service/:serviceId',
    homecareServiceControllers.serviceImageProperties,
    homecareServiceControllers.uploadSinglAndMultipleImage,
    homecareServiceControllers.resizeHomecareServiceImages,
    homecareContro.assignAndVerifyPartnerData,
    homecareServiceControllers.uploadFilesinAWS,
    homecareServiceControllers.updateHomecareSerices,
    homecareServiceControllers.sendJsonForUpdateOne
);

// update meet The expert services
router.patch(
    '/manage-homecare-facilities/:type/:service/:partnerId',
    authControllers.protect,
    homecareContro.manageHomecareFacilities
);

// update homecare service
router.patch(
    '/update-homecare-status/:status/:homecareId',
    authControllers.protect,
    homecareContro.assignDataForCancelHomecareServiceVendor,
    homecareServiceControllers.cancelHomecareService,
    homecareServiceControllers.sendJsonForHomecareCancelRequest
);
// ============================================================
// export router
module.exports = router;
