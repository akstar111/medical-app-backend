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
const speakToUsVendorControllers = require('../../../controllers/speakToUsControllers');

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// shared routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// ============================================================
// mange routes
// manage schudles
router.patch(
    '/manage-availablity/:vendorId',
    adminControllers.assignDataForFindSpeakToUs,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataforGetProperData,
    speakToUsVendorControllers.checkTheDateandTimeisvalid,
    speakToUsVendorControllers.assingSpeakTousAvailablityData
);

// update speak to us counsilar stattus
router.patch(
    '/update-status/:status/:vendorId',
    adminControllers.assignDataForFindSpeakToUs,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataforGetProperData,
    speakToUsVendorControllers.assignDataForCouselingStatusUpdate,
    speakToUsVendorControllers.updateCouncilarStatus,
    speakToUsVendorControllers.sendJsonForUpdateOne
);

// ============================================================
// export router
module.exports = router;
