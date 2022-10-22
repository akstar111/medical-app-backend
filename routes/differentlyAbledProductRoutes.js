// ============================================================
// import libraries
const express = require('express');

// create route
const router = express.Router();

// ============================================================
// utilities
const fileUpload = require('../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../controllers/authControllers');
const differentlyAbledControllers = require('../controllers/differentlyAbledControllers');

// update service
router.patch(
    '/update-differenly-abled',
    authControllers.protect,
    differentlyAbledControllers.filterDifferentlyAbledData,
    differentlyAbledControllers.assignPartnerSearchData,
    // differentlyAbledControllers.verifyValidPartner,
    // differentlyAbledControllers.assignValidPartnerSearchData,
    differentlyAbledControllers.updateDifferentlyAbled,
    differentlyAbledControllers.sendJsonForUpdateOne
);

// ============================================================
router.post(
    '/create-new-product',
    authControllers.protect,
    differentlyAbledControllers.serviceImagePropertiesForDiff,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    differentlyAbledControllers.assignDataForFindPartnerData,
    differentlyAbledControllers.verifyValidPartner,
    differentlyAbledControllers.assignPartnerIdDifferentlyabled,
    differentlyAbledControllers.assignImageNameForHearingaidService,
    fileUpload.uploadFilesinAWSVariable,
    differentlyAbledControllers.createNewDifferenlyAbledProuct,
    differentlyAbledControllers.sendServiceJson
);

// update hearing aid
router.patch(
    '/update-product/:productId',
    authControllers.protect,
    differentlyAbledControllers.serviceImagePropertiesForDiff,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    differentlyAbledControllers.assignDataForFindPartnerData,
    differentlyAbledControllers.verifyValidPartner,
    differentlyAbledControllers.assignPartnerIdDifferentlyabled,
    differentlyAbledControllers.assignImageNameForHearingaidService,
    fileUpload.uploadFilesinAWSVariable,
    differentlyAbledControllers.assignValidPartnerSearchDataAnd,
    differentlyAbledControllers.updateDifferentlyabledService,
    differentlyAbledControllers.sendJsonForUpdateOne
);

// update differntly able product status
router.patch(
    '/update-order-status/:status/:orderId',
    authControllers.protect,
    differentlyAbledControllers.assignDataForFindPartnerData,
    differentlyAbledControllers.verifyValidPartner,
    differentlyAbledControllers.assignDataforUpdateDifferentlyProductStatus,
    differentlyAbledControllers.updateDifferentlyAbledProductOrder,
    differentlyAbledControllers.sendJsonForUpdateOne
);

// get all hearinga id products
router.get(
    '/get-all-differently-abled-products',
    authControllers.protect,
    differentlyAbledControllers.getAllDifferentlyAbledProducts
);

// get a differetlya bled product
router.get(
    '/get-a-differently-abled-product/:productId',
    authControllers.protect,
    differentlyAbledControllers.getADifferentlyAbledProduct
);

// ============================================================
// export route
module.exports = router;
