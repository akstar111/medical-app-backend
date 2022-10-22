// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import controllers
const hospitalDetailsControllers = require('../controllers/hospitalDetailsControllers');
const authControllers = require('../controllers/authControllers');

// ============================================================
// create routes
router.post(
    '/new-service',
    authControllers.protect,
    hospitalDetailsControllers.assignPartnerSearchData,
    hospitalDetailsControllers.verifyValidPartner,
    hospitalDetailsControllers.assignPartnerId,
    hospitalDetailsControllers.createNewService,
    hospitalDetailsControllers.sendServiceJson
);

// update service
router.patch(
    '/update-service/:serviceid',
    authControllers.protect,
    hospitalDetailsControllers.assignPartnerSearchData,
    hospitalDetailsControllers.verifyValidPartner,
    hospitalDetailsControllers.assignValidPartnerSearchData,

    hospitalDetailsControllers.updateHospitalDetails,
    hospitalDetailsControllers.sendJsonForHospitalDetailsUpdate
);
router.delete(
    '/delete-service/:serviceid',
    authControllers.protect,
    hospitalDetailsControllers.assignPartnerSearchData,
    hospitalDetailsControllers.verifyValidPartner,
    hospitalDetailsControllers.assignValidPartnerSearchData,

    hospitalDetailsControllers.deleteHospitalDetails,
    hospitalDetailsControllers.sendServiceJson
);

// get all routes
router.post(
    '/get-all-service',
    authControllers.protect,
    hospitalDetailsControllers.getAllHospitalDetails,
    hospitalDetailsControllers.sendJsonAll
);

// get a route
router.get(
    '/get-a-service/:serviceId',
    authControllers.protect,
    hospitalDetailsControllers.assignGetAServiceData,
    hospitalDetailsControllers.findServiceById,
    hospitalDetailsControllers.sendJsonForId
);

// ============================================================
// export routes
module.exports = router;
