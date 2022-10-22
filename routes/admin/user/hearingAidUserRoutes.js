// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const hearingaidControllers = require('../../../controllers/hearingControllers');

// ============================================================
// create routes
// update expert service
router.patch(
    '/update-hospital-booking-status/:status/:userEId/:hearingaidId',
    authControllers.protect,
    hearingaidControllers.assignDataForExpertServiceUser,
    hearingaidControllers.updateHearingAidBookingDetails,
    hearingaidControllers.sendServiceUpdateJson
);

// update heaging aid order status
router.patch(
    '/update-hearing-order-status/:status/:userEId/:orderId',
    authControllers.protect,
    hearingaidControllers.assignDataForHearingAidOrderStatus,
    hearingaidControllers.updateHearingAidOrder,
    hearingaidControllers.sendServiceUpdateJson
);

// ============================================================
// ============================================================
// export router
module.exports = router;
