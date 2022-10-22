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
// vendor controllers
const opticalVendorControllesr = require('../../../controllers/opticalControllers');

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// shared routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// ============================================================
// create routes
// create new optical product
router.post(
    '/new-optical-product/:vendorId',
    adminControllers.assignDataForFindOpticalPartner,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForCreateNewOpticalProduct,
    opticalVendorControllesr.setImageSizeForOpticalProduct,
    opticalVendorControllesr.verifyOpticalProductData,
    opticalVendorControllesr.saveFilesAsJbg,
    opticalVendorControllesr.saveOpticalProductToAWS,
    opticalVendorControllesr.createNewService,
    opticalVendorControllesr.sendServiceJson
);

// update optical product
router.patch(
    '/update-optical-product/:vendorId/:serviceId',
    adminControllers.assignDataForFindOpticalPartner,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForCreateNewOpticalProduct,
    opticalVendorControllesr.setImageSizeForOpticalProduct,
    opticalVendorControllesr.verifyOpticalProductData,
    opticalVendorControllesr.saveFilesAsJbg,
    opticalVendorControllesr.saveOpticalProductToAWS,
    opticalVendorControllesr.assignDataForUpdateOpticalProduct,
    opticalVendorControllesr.updateOpticalsService,
    opticalVendorControllesr.sendServiceUpdateJson
);

// update optical's order status
router.patch(
    '/update-order-status/:status/:vendorId/:orderId',
    adminControllers.assignDataForFindOpticalPartner,
    adminControllers.getVendorADeatails,
    opticalVendorControllesr.assignDataforUpdateOpticalProductStatus,
    opticalVendorControllesr.updateOpticalOrder,
    opticalVendorControllesr.sendJsonforUpdateOne
);

// update booking status
router.patch(
    '/update-booking-status/:status/:vendorId/:bookingId',
    adminControllers.assignDataForFindOpticalPartner,
    adminControllers.getVendorADeatails,
    opticalVendorControllesr.assignDataforUpdateOpticalBookingStatus,
    opticalVendorControllesr.updateOpticalBookingStatus,
    opticalVendorControllesr.sendJsonforUpdateOne
);

// ============================================================
// export router
module.exports = router;
