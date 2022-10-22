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
const hearingaidVendorControllesr = require('../../../controllers/hearingControllers');

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
    '/new-hearingaid-product/:vendorId',
    hearingaidVendorControllesr.setImageSizeForHearingAidProduct,
    adminControllers.assignDataForFindHearingaidPartner,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hearingaidVendorControllesr.verifyHeaingaidProductData,
    hearingaidVendorControllesr.saveFilesAsJbgForHearingAidProduct,
    hearingaidVendorControllesr.saveHearingaidProductToAWS,
    hearingaidVendorControllesr.createNewHearingAid,
    hearingaidVendorControllesr.sendServiceJson
);

// updatehearing aid product
router.patch(
    '/update-hearingaid-product/:vendorId/:hearingaidId',
    hearingaidVendorControllesr.setImageSizeForHearingAidProduct,
    adminControllers.assignDataForFindHearingaidPartner,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hearingaidVendorControllesr.saveFilesAsJbgForHearingAidProduct,
    hearingaidVendorControllesr.saveHearingaidProductToAWS,
    hearingaidVendorControllesr.assignDataForUpdateHearingaidProduct,
    hearingaidVendorControllesr.updateHearingAidProduct,
    hearingaidVendorControllesr.sendServiceUpdateJson
);

// updatehearing aid product
router.patch(
    '/update-order-status/:status/:vendorId/:orderId',
    adminControllers.assignDataForFindHearingaidPartner,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hearingaidVendorControllesr.assignDataforUpdateHearingaidProductStatus,
    hearingaidVendorControllesr.updateHearingAidOrder,
    hearingaidVendorControllesr.sendServiceUpdateJson
);

// update hospial booking status
router.patch(
    '/update-hospital-booking-status/:status/:vendorId/:hearingaidId',
    authControllers.protect,
    adminControllers.assignDataForFindHearingaidPartnerHospital,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hearingaidVendorControllesr.assignDataForUpdateHospitalBookingStatus,
    hearingaidVendorControllesr.updateHearingaidHospitalBookingStatus,
    hearingaidVendorControllesr.sendServiceUpdateJson
);
// ============================================================
// export router
module.exports = router;
