// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// upload files
const uploadFiles = require('../../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const opticalControllers = require('../../controllers/opticalControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');
const advertisementControllers = require('../../controllers/advertisementControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');

// ============================================================
// // create router
// router.post(
//     '/',
//     authControllers.protect,
//     opticalControllers.assignPartnerSearchData,
//     opticalControllers.verifyValidPartner,
//     opticalControllers.assignPartnerIdForOpticals,
//     opticalControllers.createNewshowroom,
//     opticalControllers.sendServiceJson
// );

// // update hearing aid
router.patch(
    '/update-opticals/:serviceId',
    authControllers.protect,
    opticalControllers.filterOpticalShowRoomData,
    opticalControllers.assignDataForUpdateOpticals,
    // opticalControllers.verifyValidPartner,
    // opticalControllers.assignValidPartnerSearchData,
    opticalControllers.updateOpticalsShowroomService,
    opticalControllers.sendServiceUpdateJson
);
router.post(
    '/new-optical-product/',
    authControllers.protect,
    opticalControllers.setImageSizeForOpticalProduct,
    opticalControllers.verifyOpticalProductData,
    opticalControllers.saveFilesAsJbg,
    opticalControllers.saveOpticalProductToAWS,
    opticalControllers.createNewService,
    opticalControllers.sendServiceJson
);

// generate optical images
router.post(
    '/get-images',
    authControllers.protect,
    opticalControllers.uploadSinglAndMultipleImage,
    opticalControllers.getUploadImageData
);

// update hearing aid
router.patch(
    '/update-optical-product/:serviceId',
    authControllers.protect,
    opticalControllers.setImageSizeForOpticalProduct,
    opticalControllers.verifyOpticalProductData,
    opticalControllers.saveFilesAsJbg,
    opticalControllers.saveOpticalProductToAWS,
    // opticalControllers.assignPartnerSearchData,
    // opticalControllers.verifyValidPartner,
    opticalControllers.assignDataForUpdateOpticalProduct,
    opticalControllers.updateOpticalsService,
    opticalControllers.sendServiceUpdateJson
);

// delete hearinga aid
router.delete(
    '/delete-optical-product/:serviceid',
    authControllers.protect,
    opticalControllers.assignPartnerSearchData,
    opticalControllers.verifyValidPartner,
    opticalControllers.assignDataForUpdateOpticalProduct,
    opticalControllers.deleteOpticalsService,
    opticalControllers.sendServiceUpdateJson
);

// update optical's order status
router.patch(
    '/update-order-status/:status/:orderId',
    authControllers.protect,
    opticalControllers.assignPartnerSearchData,
    opticalControllers.verifyValidPartner,
    opticalControllers.assignDataforUpdateOpticalProductStatus,
    opticalControllers.updateOpticalOrder,
    opticalControllers.sendJsonforUpdateOne
);

// update booking status
router.patch(
    '/update-booking-status/:status/:bookingId',
    authControllers.protect,
    opticalControllers.assignPartnerSearchData,
    opticalControllers.verifyValidPartner,
    opticalControllers.assignDataforUpdateOpticalBookingStatus,
    opticalControllers.updateOpticalBookingStatus,
    opticalControllers.sendJsonforUpdateOne
);

//post new job
router.post(
    '/post-new-job/',
    authControllers.protect,
    opticalControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // opticalControllers.checkValidVendorandPartneropticals,
    // jobPortalControllers.assignDataForCreateNewJobPostFromOpticlas,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);
// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    opticalControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    opticalControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    opticalControllers.assignDataForGetApplicants,
    jobPortalControllers.getJobApplicats
);

// get a job
router.get(
    '/get-applicant-profile/:applicantId',
    authControllers.protect,
    jobPortalControllers.getJobApplication
);

// create new advertisement
router.post(
    '/create-new-advertisement/:serviceId',
    authControllers.protect,
    advertisementControllers.checkValidVendorandAssignData,
    opticalControllers.assignDataForGetApplicants,
    // opticalControllers.checkValidVendorandPartneropticals,
    // advertisementControllers.assignDataForCreateNewJobPostFromOpticals,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    opticalControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    opticalControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    opticalControllers.getDataForQuoteFromOpticals
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    opticalControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    opticalControllers.assignDataForGetMyQuotes,
    opticalControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    opticalControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    opticalControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export router
module.exports = router;
