// ============================================================
// import packages
const express = require('express');

// ============================================================
// set Routs
const router = express.Router();

// ============================================================
// import routes
const fitnessControllers = require('../controllers/fitnessControllers');
const authControllers = require('../controllers/authControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');

// ============================================================
router.use(authControllers.protect);
// ============================================================
// create routes

// update fitness
router.patch(
    '/update-fitness',
    fitnessControllers.filterNewFitnessData,
    fitnessControllers.assignDataForUpdatFitness,
    fitnessControllers.updateFitness,
    fitnessControllers.sendJsonForUpdateOne
);

router.post(
    '/new-fitness-videos',
    fitnessControllers.assignNewFitnesData,
    fitnessControllers.createNewFitnessVideo,
    fitnessControllers.sendJsonService
);

// update fitness videos
router.patch(
    '/update-fitness-videos/:videoId',

    fitnessControllers.assignDataForFitnessUpdate,
    fitnessControllers.updateFitnessvideo,
    fitnessControllers.sendJsonUpdateFitness
);

// delete fitness videos
router.delete(
    '/delete-fitness-videos/:videoId',
    authControllers.restrictTo('admin'),
    fitnessControllers.deleteFitnessVideo
);

// ============================================================
// gym
// // create routes
// router.post(
//     '/new-gym',
//
//     fitnessControllers.checkValidVendorandGYM,
//     fitnessControllers.createNewService,
//     fitnessControllers.sendServiceJson
// );

// manage facilites and equipment details
router.patch(
    '/manage-fitness-details/:type/:service/',

    // fitnessControllers.assignPartnerSearchData,
    // fitnessControllers.verifyValidPartner,
    fitnessControllers.manageGymServicesandFacilites
);

// // update service
// router.patch(
//     '/update-gym/:serviceid',

//     fitnessControllers.assignPartnerSearchData,
//     fitnessControllers.verifyValidPartner,
//     fitnessControllers.assignValidPartnerSearchData,
//     fitnessControllers.updateGYmService,
//     fitnessControllers.sendServiceJson
// );
// router.delete(
//     '/delete-gym/:serviceid',

//     fitnessControllers.assignPartnerSearchData,
//     fitnessControllers.verifyValidPartner,
//     fitnessControllers.assignValidPartnerSearchData,
//     fitnessControllers.deleteGYMService,
//     fitnessControllers.sendServiceJson
// );

// get all workout videos
router.get(
    '/get-all-workout-videos/:type',

    fitnessControllers.getAllworkoutValues
);

// get all gyms
router.get(
    '/get-all-fitness-centers/:type',
    fitnessControllers.assignDataForGetAllGym,
    fitnessControllers.getAllGYMValues,
    fitnessControllers.sendJsonForAllGYM
);

// get a video
router.get('/get-a-video/:type/:videoId', fitnessControllers.getAFitnessVideo);

// get  gym details
router.get(
    '/get-a-gym/:serviceId',
    fitnessControllers.assignGetAGYMData,
    fitnessControllers.findGYMById,
    fitnessControllers.sendJsonForGetAGym
);

// get all workout videos
router.get(
    '/get-all-workout-videos',

    fitnessControllers.getAllWorkoutValues,
    fitnessControllers.sendJsonForAllWorkOutVideos
);

// update gym equipments and facilities
router.patch(
    '/manage-fitness-services/:serviceType/:type/:service',
    fitnessControllers.managefitnessFacilities
);

// get all nutrients
router.get(
    '/get-all-foods',
    fitnessControllers.getAllFoodDetails,
    fitnessControllers.sendJsonForGetallFoodDetails
);

// // get a route
// router.get(
//     '/get-a-service/:serviceId',
//
//     fitnessControllers.assignGetAServiceData,
//     fitnessControllers.findServiceById,
//     fitnessControllers.sendJsonForGetAGym
// );

// get goal datas
router.get('/get-goals-data', fitnessControllers.getGoalsData);

//post new job
router.post(
    '/post-new-job/:serviceId',

    fitnessControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // fitnessControllers.checkValidVendorandPartner,
    // jobPortalControllers.assignDataForCreateNewJobPostFromGYM,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);
// update job
router.patch(
    '/update-my-job/:jobId',

    fitnessControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',

    fitnessControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',

    fitnessControllers.assignDataForGetApplicants,
    jobPortalControllers.getJobApplicats
);

// get a job
router.get(
    '/get-applicant-profile/:applicantId',

    jobPortalControllers.getJobApplication
);

// create new advertisement
router.post(
    '/create-new-advertisement/:serviceId',

    fitnessControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    // fitnessControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromGYM,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',

    fitnessControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',

    fitnessControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',

    fitnessControllers.getDataForQuoteFromExperts
);

// get my quotes
router.get(
    '/get-my-quotes',

    fitnessControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',

    fitnessControllers.assignDataForGetMyQuotes,
    fitnessControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',

    fitnessControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',

    fitnessControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export routes
module.exports = router;
