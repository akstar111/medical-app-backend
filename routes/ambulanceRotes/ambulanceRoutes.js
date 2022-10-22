// ============================================================
// import packages
const express = require('express');

// ============================================================
// set Routs
const router = express.Router();

// ============================================================
// import routes
const authControllers = require('../../controllers/authControllers');
const ambulanceControllers = require('../../controllers/ambulanceControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');
const advertisementControllers = require('../../controllers/advertisementControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');
const quoteControllers = require('../../controllers/quoteControllers');
// ============================================================
// create routes
// create new alert for ambulance
router.post(
    '/new-ambulance-alert',
    authControllers.protect,
    ambulanceControllers.assingDataForCreateNewAmbulanceAlert,
    ambulanceControllers.createNewAmbulanceAlert,
    ambulanceControllers.sendJsonForCreateNew
);

// assign ambulance driver
router.patch(
    '/assign-ambulance-driver/:serviceId/:driverId',
    ambulanceControllers.assignDataForvalidAmbulanceDriver,
    ambulanceControllers.updateAmbulanceAlert,
    ambulanceControllers.sendNotificationandJsontoDriver,
    ambulanceControllers.sendJsonForCreateNew
);
// get active
router.get(
    '/my-ambulance-request',
    authControllers.protectDriver,
    ambulanceControllers.getMyAmbulanceServices
);
// get active
router.get(
    '/ambulance-driver-started',
    authControllers.protectDriver,
    ambulanceControllers.getMyAmbulanceServicesDriverToPatient
);
// select the user location and
router.patch(
    '/start-ambulance-driver/:assignId',
    authControllers.protectDriver,
    ambulanceControllers.startFromtoToTrafficLocations
);
// get active
router.get(
    '/ambulance-driver-pickuped',
    authControllers.protectDriver,
    ambulanceControllers.getMyRequestPatienToHospital
);
// add new ampulance alert
router.patch(
    '/new-ambulance-alert/:assignId',
    authControllers.protectDriver,
    ambulanceControllers.verifyValidAmbulanceDriver
);

// update ambulance roots after pickuped the patients
router.patch(
    '/update-ambulance-route/:assignId',
    authControllers.protectDriver,
    ambulanceControllers.updateRootsAfterPickuped,
    ambulanceControllers.verifyValidAmbulanceDriver
);

// verify the driver reques
router.patch(
    '/verify-driver-request/:assignId/:driverId',
    ambulanceControllers.updateAmbulanceDeriversRequest
);

// start the patient to hospital
router.patch(
    '/ambulance-driver-to-hospital/:assignId',
    authControllers.protectDriver,
    ambulanceControllers.startDriverFromPatientToHospital
);
// complete the ambulace tracking
router.patch(
    '/fullfill-ambulance/:assignId',
    authControllers.protectDriver,
    ambulanceControllers.fullFillTheAmbulanceStatus
);

// create new ambulance driver
router.post(
    '/new-ambulance-driver',
    ambulanceControllers.assignDataForcreateAmbulanceDriver,
    ambulanceControllers.createNewAmbulanceDriver,
    ambulanceControllers.sendJsonForCreateNew
);
router.patch('/driver-otp', ambulanceControllers.generateOtp);
router.patch('/driver-verify-otp', ambulanceControllers.verifyPhone);
// update ambulance driver
router.patch(
    '/update-ambulance-driver/:driverId',
    ambulanceControllers.assignDataForUpdateAmbulanceDriver,
    ambulanceControllers.updateAmbulanceDriver,
    ambulanceControllers.sendjsonForUpdateOne
);
// create new ambulance driver
router.delete(
    '/delete-ambulance-driver/:driverId',
    ambulanceControllers.assignDataForDeleteAmbulanceDriver,
    ambulanceControllers.deleteAmbulanceDriver,
    ambulanceControllers.sendjsonForDeleteOne
);

// get ambulance service list
router.get(
    '/get-all-ambulance-service',
    ambulanceControllers.getAmbulanceServiceList
);

// create new traffic
router.post(
    '/new-traffic-police',
    ambulanceControllers.assignDataForcreatetrafficPolice,
    ambulanceControllers.createNewtrafficPolice,
    ambulanceControllers.sendJsonForCreateNew
);

// get my ambulance quotes

// update traffic
router.patch(
    '/update-traffic-police/:policeId',
    ambulanceControllers.assignDataForUpdatetrafficPolice,
    ambulanceControllers.updatetrafficPolice,
    ambulanceControllers.sendjsonForUpdateOne
);
// create new traffic
router.delete(
    '/delete-traffic-police/:policeId',
    ambulanceControllers.assignDataForDeletetrafficPolice,
    ambulanceControllers.deletetrafficPolice,
    ambulanceControllers.sendjsonForDeleteOne
);

// create combulance model
router.post(
    '/ambulance-service',
    authControllers.protect,
    authControllers.restrictTo('admin'),
    ambulanceControllers.assignDataForCreateNewAmbulanceService,
    ambulanceControllers.createNewAmbulanceService,
    ambulanceControllers.sendJsonForCreateNew
);

// get my ambulance quotes
router.get(
    '/get-my-ambulance-quotes',
    authControllers.protect,
    ambulanceControllers.searchDataForAmbulanceQuotes,
    ambulanceControllers.getPartnerAndQuotes,
    ambulanceControllers.sendMyAmbulanceQuotes
);

// get ambulnace servie
router.get(
    '/my-ambulannce-drivers',
    authControllers.protect,
    ambulanceControllers.assignPartnerSearchData,
    ambulanceControllers.verifyValidPartner,
    ambulanceControllers.sendJsonForDrivers
);

// get ambulnace servie
router.get(
    '/my-ambulannce-services',
    authControllers.protect,
    ambulanceControllers.assignPartnerSearchData,
    ambulanceControllers.verifyValidPartner,
    ambulanceControllers.sendJsonForServices
);

// update ambulance service
// upsert availablity time
// router.post(
//     '/new-ambulance-service-provider/',
//     authControllers.protect,
//     ambulanceControllers.checkValidVendorandPartner,
//     ambulanceControllers.createAmbulanceProviders,
//     ambulanceControllers.sendJsonForCreateNew
// );

// update service
router.patch(
    '/update-ambulance',
    authControllers.protect,
    ambulanceControllers.filterAmbulancePartner,
    ambulanceControllers.assignPartnerSearchData,
    // ambulanceControllers.verifyValidPartner,
    // ambulanceControllers.assignValidPartnerSearchData,
    ambulanceControllers.updateAmbulancePartner,
    ambulanceControllers.sendJsonForUpdateOne
);

// update ambulance provider
router.patch(
    '/manage-ambulance-service/:type/:service',
    authControllers.protect,
    // ambulanceControllers.assignPartnerSearchData,
    // ambulanceControllers.verifyValidPartner,
    ambulanceControllers.checkValidAmbulanceServicesAndDrivers,
    ambulanceControllers.manageAmbulanceServicesAndDrivers
    // ambulanceControllers.updateAmbulanceProviders,
    // ambulanceControllers.sendjsonForUpdateOne
);

// update ambulace request
router.patch(
    '/update-ambulance-quotes/:quoteId',
    authControllers.protect,
    ambulanceControllers.assignDataForServiceProvers,
    ambulanceControllers.updateServiceProviders,
    ambulanceControllers.sendjsonForUpdateOne
);

// set ambulance driver for private ambulance booking
router.patch(
    '/booked/select-ambulance-driver/:quoteId/:driverId/:ambulanceId',
    authControllers.protect,
    ambulanceControllers.verifyAmbulanceDriver
);


//post new job
router.post(
    '/post-new-job',
    authControllers.protect,
    ambulanceControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // jobPortalControllers.assignDataForCreateNewJobPostFromambulanceService,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);
// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    ambulanceControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    ambulanceControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    ambulanceControllers.assignDataForGetApplicants,
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
    '/create-new-advertisement',
    authControllers.protect,
    ambulanceControllers.assignDataForGetApplicants,
    // ambulanceControllers.checkValidVendorandPartnerAmbulance,
    advertisementControllers.checkValidVendorandAssignData,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    ambulanceControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    ambulanceControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    ambulanceControllers.assignDataForGetApplicants,
    quoteControllers.getDataAndCreateForQuote
    // ambulanceControllers.getDataForQuoteFromAmbulance
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    ambulanceControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    ambulanceControllers.assignDataForGetMyQuotes,
    ambulanceControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    ambulanceControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    ambulanceControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export routes
module.exports = router;
