// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const differendlyAbledControllers = require('../../../controllers/differentlyAbledControllers');

// update differently order status
router.patch(
    '/update-differently-abled-order-status/:status/:userEId/:orderId',
    authControllers.protect,
    differendlyAbledControllers.assignDataForDifferentlyOrderStatus,
    differendlyAbledControllers.updateDifferentlyAbledProductOrder,
    differendlyAbledControllers.sendJsonForUpdateOne
);

// export router
module.exports = router;
