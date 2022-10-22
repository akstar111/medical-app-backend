// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import controllers
const deaddictionControllers = require('../controllers/deAddictionControllers');
const authControllers = require('../controllers/authControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');
const fileUpload = require('../util/fileUpload');

// ============================================================
// create routes

router
    .route('/')
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        deaddictionControllers.assignDataForCreateDeaddictionService,
        deaddictionControllers.createNewHomeCareService,
        deaddictionControllers.sendServiceJson
    )
    .get(
        authControllers.protect,
        deaddictionControllers.getAllDeaddicationServices,
        deaddictionControllers.sendJsonAllData
    );

router
    .route('/update-deaddiction-service/:serviceId')
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        deaddictionControllers.getOldData,
        deaddictionControllers.assignDataForUpdateDeaddicationService,
        deaddictionControllers.updateDeaddictionServices,
        deaddictionControllers.assignDataForUpdateAll,
        deaddictionControllers.updateRemainingDeaddicationServices,
        deaddictionControllers.sendJsonForUpdateAll
    );

// // create new deaaddication services
// router.post(
//     '/new-deaddiction-center',
//     authControllers.protect,
//     deaddictionControllers.assignandverifyPartnerId,
//     deaddictionControllers.createNewService,
//     deaddictionControllers.sendServiceJson
// );
// // update service
router.patch(
    '/update-deaddiction-center/',
    authControllers.protect,
    deaddictionControllers.filterDeaddictionData,
    // deaddictionControllers.assignPartnerSearchData,
    // deaddictionControllers.verifyValidPartner,
    deaddictionControllers.assignValidPartnerSearchData,
    deaddictionControllers.updateDeaddictionCenter,
    deaddictionControllers.sendServiceJson
);
router.post(
    '/new-deaddiction-service',
    authControllers.protect,
    deaddictionControllers.serviceImageProperties,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    deaddictionControllers.assignAndVerifyPartnerData,
    deaddictionControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    deaddictionControllers.createDeaddictionServices,
    deaddictionControllers.sendServiceJson
);
router.patch(
    '/update-deaddiction-services/:serviceId',
    authControllers.protect,
    deaddictionControllers.serviceImageProperties,
    fileUpload.uploadSinglAndMultipleImage,
    fileUpload.resizeImageAndGallerys,
    deaddictionControllers.assignAndVerifyPartnerData,
    deaddictionControllers.assignImageNameForDeaddictionService,
    fileUpload.uploadFilesinAWSVariable,
    deaddictionControllers.assignDataForUpdateDeaddictionService,
    deaddictionControllers.updateDeaddictionServices,
    deaddictionControllers.sendJsonForUpdateOne
);
// // get services
// router.get(
//     '/get-deaddiction-services',
//     authControllers.protect,
//     deaddictionControllers.assignDataForGetServices,
//     deaddictionControllers.getDeaddictionCenteWithSelectedData,
//     deaddictionControllers.preventLeakingGetService,
//     deaddictionControllers.sendJsonForSelectedData
// );

// // update services
// router.patch(
//     '/manage-deadication-services/:service',
//     authControllers.protect,
//     deaddictionControllers.updateDeaddicationService
// );
// // get facilities
// router.get(
//     '/get-deaddiction-facilities',
//     authControllers.protect,
//     deaddictionControllers.assignDataForGetFeciliteis,
//     deaddictionControllers.getDeaddictionCenteWithSelectedData,
//     deaddictionControllers.preventLeakingGetFacilities,
//     deaddictionControllers.sendJsonForSelectedData
// );

// update services
router.patch(
    '/manage-deadication-facilities/:service',
    authControllers.protect,
    deaddictionControllers.updateDeaddicationFacilities
);

router.delete(
    '/delete-deaddiction-center/:serviceid',
    authControllers.protect,
    deaddictionControllers.assignPartnerSearchData,
    deaddictionControllers.verifyValidPartner,
    deaddictionControllers.assignValidPartnerSearchData,
    deaddictionControllers.deleteDeaddictionService,
    deaddictionControllers.sendServiceJson
);

// get all service
router.get(
    '/get-all-deaddiction-centers',
    authControllers.protect,
    deaddictionControllers.assignGetAllServiceData,
    deaddictionControllers.getAllDeaddictionCenter,
    deaddictionControllers.sendAllFilterDataJson
);

// get a route
router.get(
    '/get-a-deaddiction-center/:centerId',
    authControllers.protect,
    deaddictionControllers.assignDataForGetAHospitalPackage
);

// get de-addication booking
router.get(
    '/get-deaddication-booking-slots/:addictionCenterId',
    authControllers.protect,
    deaddictionControllers.verifyandGetDataofBooking
);

// manage the booking slots
router.patch(
    '/manage-deaddication-booking-slots/:bookingId/:addictionCenterId',
    authControllers.protect,
    deaddictionControllers.verifyandBookDeaddictionCenter,
    deaddictionControllers.updateBookDeaddictionCenter,
    deaddictionControllers.sendJsonForUpdateOne
);

//post new job
router.post(
    '/post-new-job/',
    authControllers.protect,
    deaddictionControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // deaddictionControllers.checkValidVendorandPartner,
    // jobPortalControllers.assignDataForCreateNewJobPostFromDeaddiction,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);

// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    deaddictionControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    deaddictionControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    deaddictionControllers.assignDataForGetApplicants,
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
    '/create-new-advertisement/',
    authControllers.protect,
    deaddictionControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    // deaddictionControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromDeaddiction,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    deaddictionControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    deaddictionControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    deaddictionControllers.getDataForQuoteFromDeaddiction
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    deaddictionControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);
// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    deaddictionControllers.assignDataForGetMyQuotes,
    deaddictionControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    deaddictionControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    deaddictionControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);
// ============================================================
// export routes
module.exports = router;
