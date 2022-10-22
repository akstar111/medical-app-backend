// ============================================================
// create package
const express = require('express');

// ============================================================
// set routes
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../controllers/authControllers');
const hearingControllers = require('../controllers/hearingControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');
const fileUpload = require('../util/fileUpload');
// ============================================================
// // create route(don't allow to create products)
// router.post(
//     '/new-hearingaid-service',
//     authControllers.protect,
//     hearingControllers.checkValidVendorandPartnerHearingAid,
//     hearingControllers.createNewService,
//     hearingControllers.sendServiceJson
// );

//

// // update hearing aid
router.patch(
    '/update-hearinaid/:hearingaidID',
    authControllers.protect,
    hearingControllers.filterOpticalShowRoomData,
    hearingControllers.assignDataForUpdateOpticals,
    // hearingControllers.assignPartnerSearchData,
    // hearingControllers.verifyValidPartner,
    // hearingControllers.assignValidPartnerSearchData,
    hearingControllers.updateHearingAidService,
    hearingControllers.sendServiceUpdateJson
);

// manage hearing aidproducts
router.post(
    '/new-hearingaid-product/',
    authControllers.protect,
    // hearingControllers.assignAndVerifyPartnerData,
    hearingControllers.setImageSizeForHearingAidProduct,
    hearingControllers.assignDataForFindPartner,
    hearingControllers.verifyValidPartner,
    hearingControllers.verifyHeaingaidProductData,
    hearingControllers.saveFilesAsJbgForHearingAidProduct,
    hearingControllers.saveHearingaidProductToAWS,
    hearingControllers.createNewHearingAid,
    hearingControllers.sendServiceJson
);

// update hearing aid product
router.patch(
    '/update-hearingaid-product/:hearingaidId',
    authControllers.protect,
    hearingControllers.setImageSizeForHearingAidProduct,
    hearingControllers.assignDataForFindPartner,
    hearingControllers.verifyValidPartner,
    hearingControllers.saveFilesAsJbgForHearingAidProduct,
    hearingControllers.saveHearingaidProductToAWS,
    hearingControllers.assignDataForUpdateHearingaidProduct,
    hearingControllers.updateHearingAidProduct,
    hearingControllers.sendServiceUpdateJson
);

// update hospial booking status
router.patch(
    '/update-hospital-booking-status/:status/:hearingaidId',
    authControllers.protect,
    hearingControllers.assignDataForFindParterForHearingaidHospital,
    hearingControllers.verifyValidPartner,
    hearingControllers.assignDataForUpdateHospitalBookingStatus,
    hearingControllers.updateHearingaidHospitalBookingStatus,
    hearingControllers.sendServiceUpdateJson
);
// update hearing aid product order status
// update optical's order status
router.patch(
    '/update-order-status/:status/:orderId',
    authControllers.protect,
    hearingControllers.assignPartnerSearchData,
    hearingControllers.verifyValidPartner,
    hearingControllers.assignDataforUpdateHearingaidProductStatus,
    hearingControllers.updateHearingAidOrder,
    hearingControllers.sendServiceUpdateJson
);

// delete hearinga aid
// router.delete(
//     '/delete-service/:serviceid',
//     authControllers.protect,
//     hearingControllers.assignPartnerSearchData,
//     hearingControllers.verifyValidPartner,
//     hearingControllers.assignValidPartnerSearchData,

//     hearingControllers.deleteHearingAidService,
//     hearingControllers.sendServiceUpdateJson
// );

// get all routes
router.get(
    '/get-all-hearingaid',
    authControllers.protect,
    hearingControllers.assignDataForGetAllHearingAid,
    hearingControllers.getAllHearingId,
    hearingControllers.sendJsonAll
);

// get all hearing aid product id
router.get(
    '/get-all-hearingaid/:type',
    authControllers.protect,
    hearingControllers.assignDataForGetAllHearingaid,
    hearingControllers.getAllHearingaidPartners,
    hearingControllers.sendJsonForGetAllFilterData
);

// get a route
router.get(
    '/get-a-service/:serviceId',
    authControllers.protect,
    // hearingControllers.assignPartnerSearchData,
    // hearingControllers.verifyValidPartner,
    hearingControllers.assignGetAServiceData,
    hearingControllers.findServiceById,
    hearingControllers.getAllTopSellingHearingAidData
);

// get a hearinga id product
router.get(
    '/get-a-hearingaid-product/:productId',
    authControllers.protect,
    hearingControllers.getAHearingAidProduct
);

// // delete hearinga aid
// router.delete(
//     '/delete-service/:serviceid',
//     authControllers.protect,
//     hearingControllers.assignPartnerSearchData,
//     hearingControllers.verifyValidPartner,
//     hearingControllers.assignValidPartnerSearchData,

//     hearingControllers.deleteHearingAidService,
//     hearingControllers.sendServiceUpdateJson
// );

//post new job
router.post(
    '/post-new-job/:serviceId',
    authControllers.protect,
    hearingControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // hearingControllers.checkValidVendorandPartner,
    // jobPortalControllers.assignDataForCreateNewJobPostFromHearingAid,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);

// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    hearingControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    hearingControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    hearingControllers.assignDataForGetApplicants,
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
    hearingControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    // hearingControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromHearingAID,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    hearingControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    hearingControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    hearingControllers.getDataForQuoteFromAmbulance
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    hearingControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    hearingControllers.assignDataForGetMyQuotes,
    hearingControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    hearingControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    hearingControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export route
module.exports = router;
