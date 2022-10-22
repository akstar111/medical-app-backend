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
// create routes
// update homecare service
router.patch(
    '/update-homecare-status/:status/:homecareId',
    authControllers.protect,
    homecareContro.assignDataForCancelHomecareServiceUser,
    homecareServiceControllers.cancelHomecareService,
    homecareServiceControllers.sendJsonForHomecareCancelRequest
);

// ============================================================
// ============================================================
// export router
module.exports = router;
