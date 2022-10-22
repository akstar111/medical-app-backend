// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import controllers
const meetExpertControllers = require('../controllers/meetTheExportControllers');
const authControllers = require('../controllers/authControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');

// ============================================================
// create routes

router
    .route('/')
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        meetExpertControllers.assignDataForCreateService,
        meetExpertControllers.createNewMeetTheExpertList,
        meetExpertControllers.sendServiceJson
    )
    .get(authControllers.protect, meetExpertControllers.getAllExperts);
// update service
router.patch(
    '/update-expert',
    authControllers.protect,
    meetExpertControllers.filterMeettheExpertData,
    meetExpertControllers.assignPartnerQuery,
    meetExpertControllers.updateMeetTheExpert,
    meetExpertControllers.updateExpertSerivesservice
);

router
    .route('/:serviceId')
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin'),
        meetExpertControllers.getOldData,
        meetExpertControllers.assignDataForUpdateMeetTheExpertService,
        meetExpertControllers.updateMeetTheExpert,
        meetExpertControllers.assignDataForUpdateAll,
        meetExpertControllers.updateRemainingMeetTheExpertsServices,
        meetExpertControllers.sendJsonForUpdateAll
    );
// get meet the the expert services
router.get(
    '/expert-service-details/',
    authControllers.protect,
    meetExpertControllers.assignExpertSearchData,
    meetExpertControllers.verifyValidPartner,
    meetExpertControllers.getMeetTheExpertsServices,
    meetExpertControllers.assignDataforGetExpertBookinglist,
    meetExpertControllers.getMeetTheExpertsBookingList,
    meetExpertControllers.sendJsonForGetAllExpertServices
);
// assin data for create meet the expert services
router.post(
    '/create-expert-services/',
    authControllers.protect,
    meetExpertControllers.assignDataforGetExpertBookinglist,
    meetExpertControllers.findOnePartnerForExpert,
    meetExpertControllers.createNewMeetTheExertServiceProvider,
    meetExpertControllers.sendJsonForCreateOne
);

// assin data for update meet the expert services
router.patch(
    '/update-expert-services/:serviceId',
    authControllers.protect,
    meetExpertControllers.assignDataforGetExpertBookinglist,
    meetExpertControllers.findOnePartnerForExpert,
    meetExpertControllers.assignDataForUpdateMeetTheExpert,
    meetExpertControllers.updateMeetTheExpertServices,
    meetExpertControllers.sendJsonForUpdateOne
);
// update homecare service
router.patch(
    '/update-expert-status/:status/:expertId',
    authControllers.protect,
    meetExpertControllers.assignExpertSearchData,
    meetExpertControllers.verifyValidPartner,
    meetExpertControllers.assignDataForExpertServiceVendor,
    meetExpertControllers.updateExpertStatus,
    meetExpertControllers.sendJsonForUpdateOne
);
// router.post(
//     '/new-meet-the-expert/',
//     authControllers.protect,
//     meetExpertControllers.verifyValidPartnerissService,
//     meetExpertControllers.createNewService,
//     meetExpertControllers.sendServiceJson
// );
// manage meet the expert services
router.patch(
    '/manage-facilities/:service/:vendorId/',
    meetExpertControllers.manageMeetTheExpertServicesServices
);

// update meet The expert services
router.patch(
    '/update-meet-the-expert-services/:type/:service',
    authControllers.protect,
    // meetExpertControllers.assignExpertSearchData,
    // meetExpertControllers.verifyValidPartner,
    meetExpertControllers.manageMeetTheExpertServicesServices
);
// // partner update service
// router.patch(
//     '/update-service/:serviceId',
//     authControllers.protect,
//     meetExpertControllers.assignExpertSearchData,
//     meetExpertControllers.verifyValidPartner,
//     meetExpertControllers.assignValidPartnerSearchData,
//     meetExpertControllers.updateMeetheExpertService,
//     meetExpertControllers.updateMeetTheExpertSericeProvider,
//     meetExpertControllers.sendJsonForUpdateOne
// );
// router.delete(
//     '/delete-service/:serviceid',
//     authControllers.protect,
//     meetExpertControllers.assignExpertSearchData,
//     meetExpertControllers.verifyValidPartner,
//     meetExpertControllers.deleteMeetTheService,
//     meetExpertControllers.sendServiceJson
// );

// // create meet the expert service provider
// router.post(
//     '/new-meet-the-expert-services',
//     authControllers.protect,
//     meetExpertControllers.manageandVerifyDataFromMetttheexpertForServiceProviders,
//     meetExpertControllers.createNewMeetTheExertServiceProvider,
//     meetExpertControllers.sendServiceJson
// );

// // update meet the expert providers
// router.patch(
//     '/update-meet-the-expert/:serviceId',
//     authControllers.protect,
//     meetExpertControllers.assignDataForupdataForMeetTheExpertProvider,
//     meetExpertControllers.updateaMeetTheExpertServiceProvider,
//     meetExpertControllers.sendJsonForUpdateOne
// );

// // get all service though seleted serivece
// router.get(
//     '/get-all-expert-services/:serviceName',
//     authControllers.protect,
//     meetExpertControllers.assignDataForAllSerive,
//     meetExpertControllers.getRelatedDataFind,
//     meetExpertControllers.sendJsonForall
// );

// // get a route
// router.get(
//     '/get-a-expert/:expertId',
//     authControllers.protect,
//     meetExpertControllers.assignDataForGetMeetTheExpert
// );

//post new job
router.post(
    '/post-new-job/:serviceId',
    authControllers.protect,
    meetExpertControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // meetExpertControllers.checkValidVendorandPartner,
    // jobPortalControllers.assignDataForCreateNewJobPostFromMeetTheExpertService,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);
// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    meetExpertControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    meetExpertControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    meetExpertControllers.assignDataForGetApplicants,
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
    meetExpertControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    // meetExpertControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromExperts,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    meetExpertControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    meetExpertControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    meetExpertControllers.getDataForQuoteFromExperts
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    meetExpertControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    meetExpertControllers.assignDataForGetMyQuotes,
    meetExpertControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    meetExpertControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    meetExpertControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export routes
module.exports = router;
