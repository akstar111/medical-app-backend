// ============================================================
// import libraris
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
const speakToUsControllers = require('../../controllers/speakToUsControllers');
const authControllers = require('../../controllers/authControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');

// ============================================================
// // create routes
// router.post(
//     '/new-service',
//     authControllers.protect,
//     speakToUsControllers.assignExpertSearchData,
//     speakToUsControllers.verifyValidPartner,
//     speakToUsControllers.assignNewServiceData,
//     speakToUsControllers.createNewService,
//     speakToUsControllers.sendServiceJson
// );

// // update new vendor
// router.patch(
//     '/update-service',
//     authControllers.protect,
//     speakToUsControllers.assignExpertSearchData,
//     speakToUsControllers.verifyValidPartner,
//     speakToUsControllers.assignDataForUpdateClinic,
//     speakToUsControllers.updateSpeakToUs,
//     speakToUsControllers.sendJsonForUpdateOne
// );

// create speak to us availablity
router.post(
    '/create-speaktous',
    authControllers.protect,
    speakToUsControllers.checkValidVendorandPartner,
    speakToUsControllers.assignDataForCreateNewAvailablity,
    speakToUsControllers.createSpeakToUsAvailablity,
    speakToUsControllers.handleAfterAvalablityCreatetion
);

// upsert availablity time
router.patch(
    '/manage-availablity/',
    authControllers.protect,
    speakToUsControllers.checkTheDateandTimeisvalid,
    speakToUsControllers.checkValidVendorandPartner,
    speakToUsControllers.verifyVendorDatas,
    speakToUsControllers.assingSpeakTousAvailablityData
);

// update the active and inactive
router.patch(
    '/set-councilar-status/:status',
    authControllers.protect,
    speakToUsControllers.checkValidVendorandPartner,
    speakToUsControllers.assignDataForCouselingStatusUpdate,
    speakToUsControllers.updateCouncilarStatus,
    speakToUsControllers.sendJsonForUpdateOne
);

// get available
router.get(
    '/get-available-councilar',
    authControllers.protect,
    speakToUsControllers.checkAvailablityofCouncilar
);

// //post new job
// router.post(
//     '/post-new-job/:serviceId',
//     authControllers.protect,
//     jobPortalControllers.checkValidVendorandAssignData,
//     // speakToUsControllers.checkValidVendorandPartner,
//     // jobPortalControllers.assignDataForCreateNewJobPostFromSpeakToUs,
//     // jobPortalControllers.checkPartnerIdandPartnerEid,
//     jobPortalControllers.createNewPost,
//     jobPortalControllers.sendJsonForCreateOne
// );

// ============================================================
// export router
module.exports = router;
