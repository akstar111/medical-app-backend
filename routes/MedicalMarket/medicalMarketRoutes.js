// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');

// ============================================================
// create routes

router
    .route('/')
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        medicalMarketControllers.assignDataForCreateNewMedicalMarketList,
        medicalMarketControllers.createNewMedicalMarketList,
        medicalMarketControllers.sendServiceJson
    )
    .get(
        authControllers.protect,
        medicalMarketControllers.getAllMedicalMarketServices,
        medicalMarketControllers.sendJsonAllData
    );
// create new store
// router.post(
//     '/new-medical-market',
//     authControllers.protect,
//     medicalMarketControllers.filterMedicalMarketStoreData,
//     medicalMarketControllers.checkValidVendorandPartnerMedicalMarket,
//     medicalMarketControllers.createNewMedicalMarketStore,
//     medicalMarketControllers.sendJsonForCreateOne
// );

// // blood bank
// router.patch(
//     '/update-medical-market',
//     authControllers.protect,
//     medicalMarketControllers.assignPartnerSearchData,
//     medicalMarketControllers.verifyValidPartner,
//     medicalMarketControllers.filterMedicalMarketStoreData,
//     medicalMarketControllers.assignDataForUpdatMedicalMarketServiceProvider,
//     medicalMarketControllers.updateMedicalMarketServiceProvider,
//     medicalMarketControllers.sendJsonForUpdateOne
// );

router
    .route('/:serviceId')
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        medicalMarketControllers.getOldData,
        medicalMarketControllers.assignDataForUpdateMedicalMarketProducts,
        medicalMarketControllers.updateMedicalMarket,
        medicalMarketControllers.assignDataForUpdateAll,
        medicalMarketControllers.updateRemainingHomeCareServices,
        medicalMarketControllers.sendJsonForUpdateAll
    );

router.post(
    '/new-medical-market-product',
    authControllers.protect,
    medicalMarketControllers.verifyMedicalMarketProductService,
    medicalMarketControllers.createNewService,
    medicalMarketControllers.sendServiceJson
);

// update service
router.patch(
    '/update-service/:serviceId',
    authControllers.protect,
    medicalMarketControllers.assignPartnerSearchData,
    medicalMarketControllers.verifyValidPartner,
    medicalMarketControllers.assignDataForUpdateMedicalMarket,
    medicalMarketControllers.updateHomeCareService,
    medicalMarketControllers.sendJsonForUpdateOne
);
router.delete(
    '/delete-service/:serviceId',
    authControllers.protect,
    medicalMarketControllers.assignPartnerSearchData,
    medicalMarketControllers.verifyValidPartner,
    medicalMarketControllers.deleteMedicalMarketService,
    medicalMarketControllers.sendServiceJson
);

// // get all routes
// router.post(
//     '/get-all-service',
//     authControllers.protect,
//     medicalMarketControllers.getAllMedicalMarketProduct,
//     medicalMarketControllers.sendJsonAll
// );

// get a route
router.get(
    '/get-a-service/:serviceId',
    authControllers.protect,
    medicalMarketControllers.assignPartnerSearchData,
    medicalMarketControllers.verifyValidPartner,
    medicalMarketControllers.assignGetAServiceData,
    medicalMarketControllers.findServiceById,
    medicalMarketControllers.sendJsonForPopulateOne
);

router.patch(
    '/vendor-update/:quoteId',
    authControllers.protect,
    medicalMarketControllers.assignPartnerSearchData,
    medicalMarketControllers.verifyValidPartner,
    medicalMarketControllers.assigndataForUpdateQuote,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// get all product
router.get(
    '/get-all-products',
    authControllers.protect,
    medicalMarketControllers.assignDataForGetProducts,
    medicalMarketControllers.getAllProduct,
    medicalMarketControllers.sendJsonForFindAllWithPopulate
);

// ============================================================
// export route
module.exports = router;
