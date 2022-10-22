// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import controllers
const homecareServiceControllers = require('../controllers/homecareServiceControllers');
const authControllers = require('../controllers/authControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');

// utill
const imageUpload = require('../util/fileUpload');

// ============================================================
// create routes

router
    .route('/')
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        homecareServiceControllers.assignDataForCreateNewHomeCareService,
        homecareServiceControllers.createNewHomeCareService,
        homecareServiceControllers.sendServiceJson
    )
    .get(
        authControllers.protect,
        homecareServiceControllers.getAllHomcareServices,
        homecareServiceControllers.sendJsonAllData
    );

// router.post(
//     '/new-homecare/',
//     authControllers.protect,
//     // homecareServiceControllers.verifyNewHomecareService,

//     homecareServiceControllers.filterNewhomcecareData,
//     homecareServiceControllers.checkValidVendorandPartnerHomecare,
//     homecareServiceControllers.createNewService,
//     homecareServiceControllers.sendServiceJson
// );

// update service
router.patch(
    '/update-homecare',
    authControllers.protect,
    homecareServiceControllers.filterNewhomcecareData,
    homecareServiceControllers.assignPartnerSearchData,
    // homecareServiceControllers.verifyValidPartner,
    // homecareServiceControllers.assignValidPartnerSearchData,
    homecareServiceControllers.updateHomeCareService,
    homecareServiceControllers.updateHomecareSerivesservice,
    homecareServiceControllers.sendJsonForUpdateOne
);

router
    .route('/:serviceId')
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        homecareServiceControllers.getOldData,
        homecareServiceControllers.assignDataForUpdateHomecareService,
        homecareServiceControllers.updateHomeCare,
        homecareServiceControllers.assignDataForUpdateAll,
        homecareServiceControllers.updateRemainingHomeCareServices,
        homecareServiceControllers.sendJsonForUpdateAll
    );

// creaate new homecare's service
// manage hearing aidproducts
router.post(
    '/new-homecare-service',
    authControllers.protect,
    homecareServiceControllers.serviceImageProperties,
    homecareServiceControllers.uploadSinglAndMultipleImage,
    homecareServiceControllers.resizeHomecareServiceImages,
    homecareServiceControllers.assignAndVerifyPartnerData,
    homecareServiceControllers.uploadFilesinAWS,
    homecareServiceControllers.createNewHomecares,
    homecareServiceControllers.sendServiceJson
);
router.patch(
    '/update-homecare-service/:serviceId',
    authControllers.protect,
    homecareServiceControllers.serviceImageProperties,
    homecareServiceControllers.uploadSinglAndMultipleImage,
    homecareServiceControllers.resizeHomecareServiceImages,
    homecareServiceControllers.assignAndVerifyPartnerData,
    homecareServiceControllers.uploadFilesinAWS,
    homecareServiceControllers.assignDataForUpdateHomecareServicess,
    homecareServiceControllers.updateHomecareSerices,
    homecareServiceControllers.sendJsonForUpdateOne
);

// update meet The expert services
router.patch(
    '/manage-homecare-facilities/:type/:service',
    authControllers.protect,
    // homecareServiceControllers.assignPartnerSearchData,
    // homecareServiceControllers.verifyValidPartner,
    homecareServiceControllers.manageMeetTheExpertServicesServices
);
// update homcare service products

// router.delete(
//     '/delete-service/:serviceId',
//     authControllers.protect,
//     homecareServiceControllers.assignPartnerSearchData,
//     homecareServiceControllers.verifyValidPartner,
//     homecareServiceControllers.assignValidPartnerSearchData,
//     homecareServiceControllers.deleteHomeCareService,
//     homecareServiceControllers.sendServiceJson
// );

// get all routes
router.get(
    '/get-all/homecare-service/:serviceName',
    authControllers.protect,
    homecareServiceControllers.assignGetServiceData,
    homecareServiceControllers.getAllHomecareSerive,
    homecareServiceControllers.sendJsonAll
);

// get a route
router.get(
    '/get-a-service/:serviceId',
    authControllers.protect,
    homecareServiceControllers.getaHomecareService
);
// cancel homecare service
router.patch(
    '/update-homecare-status/:status/:homecareId',
    authControllers.protect,
    homecareServiceControllers.assignDataForCancelHomecareService,
    homecareServiceControllers.cancelHomecareService,
    homecareServiceControllers.sendJsonForHomecareCancelRequest
);

//post new job
router.post(
    '/post-new-job/',
    authControllers.protect,
    homecareServiceControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // homecareServiceControllers.checkValidVendorandPartner,
    // jobPortalControllers.assignDataForCreateNewJobPostFromHomecareService,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);
// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    homecareServiceControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    homecareServiceControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    homecareServiceControllers.assignDataForGetApplicants,
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
    // homecareServiceControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromHomecare,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    homecareServiceControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    homecareServiceControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    homecareServiceControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    homecareServiceControllers.getDataForQuoteFromhomecares
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    homecareServiceControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    homecareServiceControllers.assignDataForGetMyQuotes,
    homecareServiceControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    homecareServiceControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    homecareServiceControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export routes
module.exports = router;
