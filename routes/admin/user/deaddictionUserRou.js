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

// ============================================================
// create routes
// update homecare service
router.patch(
    '/update-deaddiction-status/:status/:deaddictionId',
    authControllers.protect,
    deaddictionContro.assignDataForCancelDeaddictionServiceUser,
    deAddictionControllers.cancelDeaddictionService,
    deAddictionControllers.sendJsonForDeaddictionCancelRequest
);

// ============================================================
// ============================================================
// export router
module.exports = router;
