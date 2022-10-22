// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const expertContro = require('../../../controllers/admin/meetTheExpertControllers');

// ============================================================
// create routes
// update expert service
router.patch(
    '/update-expert-status/:status/:expertId',
    authControllers.protect,
    expertContro.assignDataForExpertServiceUser,
    expertContro.updateExpertStatus,
    expertContro.sendJsonForUpdateOne
);

// ============================================================
// ============================================================
// export router
module.exports = router;
