// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');
const opticalControllers = require('../../../controllers/admin/opticalsAdminControllers');
// ============================================================
// vendor controllers
const opticalVendorController = require('../../../controllers/opticalControllers');

// ============================================================
// shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));
// ============================================================
router.patch(
    '/update-order-status/:status/:userEId/:orderId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalControllers.assignDataForOpticalOrdersGet,
    opticalVendorController.assignDataForCancelOpticalOrderService,
    opticalVendorController.updateOpticalOrder,
    opticalVendorController.sendJsonforUpdateOne
);
router.patch(
    '/update-booking-status/:status/:userEId/:bookingId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    opticalControllers.assignDataForOpticalOrdersGet,
    opticalVendorController.assignDataForCancelOpticalBookService,
    opticalVendorController.cancelOpticalBooking,
    opticalVendorController.sendJsonforUpdateOne
);

// ============================================================
// export router
module.exports = router;
