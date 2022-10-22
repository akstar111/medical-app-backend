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
const differetnlyVendorControllers = require('../../../controllers/differentlyAbledControllers');

router.post(
    '/create-new-product/:vendorId/',
    authControllers.protect,
    differetnlyVendorControllers.serviceImagePropertiesForDiff,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    adminControllers.assignDataForFindDifferentlyAbled,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    differetnlyVendorControllers.assignPartnerIdDifferentlyabled,
    differetnlyVendorControllers.assignImageNameForHearingaidService,
    fileUpload.uploadFilesinAWSVariable,
    differetnlyVendorControllers.createNewDifferenlyAbledProuct,
    differetnlyVendorControllers.sendServiceJson
);

// update hearing aid
router.patch(
    '/update-product/:vendorId/:productId',
    authControllers.protect,
    differetnlyVendorControllers.serviceImagePropertiesForDiff,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    adminControllers.assignDataForFindDifferentlyAbled,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    differetnlyVendorControllers.assignPartnerIdDifferentlyabled,
    differetnlyVendorControllers.assignImageNameForHearingaidService,
    fileUpload.uploadFilesinAWSVariable,
    differetnlyVendorControllers.assignValidPartnerSearchDataAnd,
    differetnlyVendorControllers.updateDifferentlyabledService,
    differetnlyVendorControllers.sendJsonForUpdateOne
);

// update differntly able product status
router.patch(
    '/update-order-status/:status/:vendorId/:orderId',
    authControllers.protect,
    adminControllers.assignDataForFindDifferentlyAbled,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    differetnlyVendorControllers.assignDataforUpdateDifferentlyProductStatus,
    differetnlyVendorControllers.updateDifferentlyAbledProductOrder,
    differetnlyVendorControllers.sendJsonForUpdateOne
);

// ============================================================
// exports router
module.exports = router;
