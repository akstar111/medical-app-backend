// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import controllers
const tourismControllers = require('../controllers/tourismControllers');
const authControllers = require('../controllers/authControllers');

// ============================================================
// create routes

router
    .route('/')
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        tourismControllers.assignDataForCreateNewMedicalTourisumService,
        tourismControllers.createNewMedicalTourism,
        tourismControllers.sendServiceJson
    )
    .get(
        authControllers.protect,
        tourismControllers.getAllMedicalTourismServices,
        tourismControllers.sendJsonAllData
    );

router
    .route('/:serviceId')
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        tourismControllers.getOldData,
        tourismControllers.assignDataForUpdateMedicalTourismService,
        tourismControllers.updateMedicalTourism,
        tourismControllers.assignDataForUpdateAll,
        tourismControllers.updateRemainingMedicalTourismServices,
        tourismControllers.sendJsonForUpdateAll
    );

router.post(
    '/new-service/:serviceId',
    authControllers.protect,
    tourismControllers.verifyValidPartnerandService,
    tourismControllers.createNewService,
    tourismControllers.sendServiceJson
);

// update service
router.patch(
    '/update-service/:serviceId',
    authControllers.protect,
    tourismControllers.assignPartnerSearchData,
    tourismControllers.verifyValidPartner,
    tourismControllers.assignValidPartnerSearchData,
    tourismControllers.updateTourismService,
    tourismControllers.sendServiceJson
);
router.delete(
    '/delete-service/:serviceId',
    authControllers.protect,
    tourismControllers.assignPartnerSearchData,
    tourismControllers.verifyValidPartner,
    tourismControllers.deleteTourism,
    tourismControllers.sendServiceJson
);

// get all routes
router.post(
    '/get-all-service',
    authControllers.protect,
    tourismControllers.getAllTourism,
    tourismControllers.sendJsonAll
);

// get a route
router.get(
    '/get-a-service/:serviceId',
    authControllers.protect,
    tourismControllers.assignGetAServiceData,
    tourismControllers.findServiceById,
    tourismControllers.sendJsonForId
);

// ============================================================
// export routes
module.exports = router;
