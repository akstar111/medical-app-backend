// ============================================================
// import libraries
const express = require('express');

// ============================================================
// set router
const router = express.Router();

// ============================================================
// import utilities
const fileUpload = require('../util/fileUpload');
// ============================================================
// import controllers
const hospitalPackageControllers = require('../controllers/hospitalPackageControllers');
const authControllers = require('../controllers/authControllers');
const hospitalDetailsControllers = require('../controllers/hospitalDetailsControllers');
const jobPortalControllers = require('../controllers/jobPortalControllers');
const advertisementControllers = require('../controllers/advertisementControllers');
const medicalMarketControllers = require('../controllers/medicalMarketControllers');

// ============================================================
// create routes
router.use(authControllers.protect);

router
    .route('/package/')
    .post(
        authControllers.restrictTo('admin'),
        hospitalPackageControllers.assignDataForCreateNewHospitalPackageService,
        hospitalPackageControllers.createNewHospitalPackage,
        hospitalPackageControllers.sendServiceJson
    )
    .get(
        hospitalPackageControllers.getAllHospitalPackages,
        hospitalPackageControllers.sendJsonAll
    );

// router.post(
//     '/package/new-service',
//     // hospitalPackageControllers.preventFalseHospitalPackageData,
//     hospitalPackageControllers.verifyNewHomecareServiceandPartner,
//     hospitalPackageControllers.createNewService,
//     hospitalPackageControllers.sendServiceJson
// );

// // home screen for hospital package
// router.put(
//     '/profile',
//     hospitalPackageControllers.findHospitalPackageOrCreateOne
// );

router.patch(
    '/package/manage-hospital-package/:service',
    // hospitalPackageControllers.assignPartnerSearchData,
    // hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.manageHospitalPackage
);
router.patch(
    '/package/manage-hospital-package-subcategory/:service/:categoryId',
    hospitalPackageControllers.assingPartnerSearchDataForPakcage,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.manageHospitalPackageSubCategory
);
router.patch(
    '/package/manage-hospital-package-subcategory-details/:service/:categoryId/:subCategory',
    hospitalPackageControllers.assingPartnerSearchDataForPakcage,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.manageHospitalPackageSubCategoryDetails
);
router.patch(
    '/package/manage-hospital-subcategory-package-details/:service/:categoryId/:subCategory/:packageId',
    hospitalPackageControllers.assingPartnerSearchDataForPakcage,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.manageHospitalPackageispackageListDetails
);
// get all routes
router.get(
    '/package/get-all-package/:packageName',
    hospitalPackageControllers.assignDataForGetAllHospitalPackage,
    hospitalPackageControllers.getAllPackage,
    hospitalPackageControllers.filterDataForCheckPackageData
);

// get a route
router.get(
    '/package/get-a-package/:packageName/:serviceId/',
    // hospitalPackageControllers.assignGetAServiceData,
    // hospitalPackageControllers.findServiceById,
    hospitalPackageControllers.getAHospialPackage,
    hospitalPackageControllers.sendJsonForId
);

// gethospital details
router.get(
    '/details/get-all-hospitaldetails',
    hospitalPackageControllers.getAllHospitalDetails
);

// get a hospital
router.get(
    '/details/get-a-hospital/:stream/:hospitalId',
    hospitalPackageControllers.assignDataForGetHospitalStatus,
    hospitalPackageControllers.getAHospitalDetails,
    hospitalPackageControllers.sendJsonForHospitalDetails
    // hospitalPackageControllers.assignDataForGetHospitalStatus
);

// get all tourism
router.get(
    '/tourism/get-all-hospital/:packageName',
    hospitalPackageControllers.assignDataForGetAllHospitalTourism,
    hospitalPackageControllers.getAllPackage,
    hospitalPackageControllers.filterDataForCheckTourismData
);

// get a route
router.get(
    '/tourism/get-a-tourism/:packageName/:serviceId/',
    // hospitalPackageControllers.assignGetAServiceData,
    // hospitalPackageControllers.findServiceById,
    hospitalPackageControllers.getAHospialTourism,
    hospitalPackageControllers.sendJsonForId
);

// update service from partner
router.patch(
    '/update-hospital',
    hospitalPackageControllers.filterNewHospital,
    hospitalPackageControllers.assignPartnerSearchData,
    // hospitalPackageControllers.verifyValidPartner,
    // hospitalPackageControllers.assignValidPartnerSearchData,
    hospitalPackageControllers.updatePackageService,
    hospitalPackageControllers.sendServiceJson
);
// manage hospital services
router.patch(
    '/manage-hospital-services/:service',
    hospitalPackageControllers.setImageSizeForHospitalServiceBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalServiceImageName,
    hospitalPackageControllers.checkIfTheServiceisAlreadyExist,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageHospitalServices
);
// manage hospital facilitie
router.patch(
    '/manage-hospital-facilities/:service',
    hospitalPackageControllers.setImageSizeForHospitalFacilityBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalFacilitymageName,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageHospitalFacilities
);

// manage hospital facilitie
router.patch(
    '/manage-hospital-room-facilities/:service',
    hospitalPackageControllers.setImageSizeForHospitalRoomFacilityBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalRoomFacilitymageName,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageHospitalRoomFacilities
);

// manage hospital specilaist
router.patch(
    '/manage-hospital-specialist/:service',
    hospitalPackageControllers.setImageSizeForHospitalSpecialistBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitaSpecialistmageName,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageHospitalSpecialist
);

// add hospita room images
router.patch(
    '/add-hospital-images/:imgType',
    hospitalPackageControllers.setImageSizeForHospitalRoomImages,
    fileUpload.uploadMultipleImages('images', 12),
    fileUpload.resizeMultipleImages,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    fileUpload.uploadMultipleImageOnAWS,
    hospitalPackageControllers.addImagesForHospitalRooms
);

// remove hospital iamges
router.patch(
    '/remove-hospital-images/:imageName/:imgType',
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.removeHospitalRoomImages
);

// hospital nearby hospital facilites
router.patch(
    '/manage-nearby-hospital-facilities',
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.checkAndArrangeDataForNearByHospital,
    hospitalPackageControllers.assignDataForUpdateHospital,
    hospitalPackageControllers.updateHospitalDetails,
    hospitalPackageControllers.sendJsonForUpdateOne
);

// manage hospital availablities
router.patch(
    '/manage-hospital-availablities',
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.assignDataFordateHospitalAvailaity,
    hospitalPackageControllers.assignDataForUpdateHospital,
    hospitalPackageControllers.updateHospitalDetails,
    hospitalPackageControllers.sendJsonForUpdateOne
);

// manage hospital specialities
router.patch(
    '/manage-hospital-specialities',
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.assignDataforHospitalAvailablity,
    hospitalPackageControllers.assignDataForUpdateHospital,
    hospitalPackageControllers.updateHospitalDetails,
    hospitalPackageControllers.sendJsonForUpdateOne
);

// manage near by hotels
router.patch(
    '/manage-nearby-hotels/:service',
    hospitalPackageControllers.setImageSizeForHospitalNearByHotels,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalNearbyHotels,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageNearbyHotels
);

// manage near by restaurents
router.patch(
    '/manage-nearby-restaurents/:service',
    hospitalPackageControllers.setImageSizeForHospitalNearByRestaurents,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalNearbyRestaurents,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageNearbyRestaurents
);

// manage near by airports
router.patch(
    '/manage-nearby-airports/:service',
    hospitalPackageControllers.setImageSizeForHospitalNearByAirports,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalNearbyAirports,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageNearbyAirports
);

// manage near by trains
router.patch(
    '/manage-nearby-trains/:service',
    hospitalPackageControllers.setImageSizeForHospitalNearByTrains,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalNearbyTrains,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageNearbyTrains
);

// manage near by buses
router.patch(
    '/manage-nearby-buses/:service',
    hospitalPackageControllers.setImageSizeForHospitalNearByBuses,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    hospitalPackageControllers.assignPartnerSearch,
    hospitalPackageControllers.verifyValidPartner,
    hospitalPackageControllers.setHospitalNearbyBuses,
    fileUpload.uploadFilesinAWS,
    hospitalPackageControllers.manageNearbyBuses
);

// nearby hotsd

// router.delete(
//     '/package/delete-service/:serviceid',
//     hospitalPackageControllers.assignPartnerSearchData,
//     hospitalPackageControllers.verifyValidPartner,
//     hospitalPackageControllers.assignValidPartnerSearchData,
//     hospitalPackageControllers.deletePackage,
//     hospitalPackageControllers.sendServiceJson
// );

// get a package
// router.get(
//     '/package/get-a-package/:packageId',
//     hospitalPackageControllers.assignDataForGetAHospitalPackage
// );
// router
//     .route('/package/:serviceId')
//     .patch(
//         authControllers.restrictTo('admin'),
//         hospitalPackageControllers.getOldData,
//         hospitalPackageControllers.assignDataForUpdateHospitalPackageService,
//         hospitalPackageControllers.updateHospitalPackage,
//         hospitalPackageControllers.assignDataForUpdateAll,
//         hospitalPackageControllers.updateRemainingHomeCareServices,
//         hospitalPackageControllers.sendJsonForUpdateAll
//     );
// ============================================================
// hospital Details
// get services
// router.get(
//     '/details/get-hospital-details-services',
//     authControllers.protect,
//     hospitalDetailsControllers.assignDataForGetServices,
//     hospitalDetailsControllers.getHospitalDetailsWithSelectedData,
//     hospitalDetailsControllers.preventLeakingGetService,
//     hospitalDetailsControllers.sendJsonForSelectedData
// );

// // manage hospital details
// router.patch(
//     '/details/manage-services/:type/:service',
//     authControllers.protect,
//     hospitalDetailsControllers.updateHospitalDetailsService
// );

// // get hospital facilites
// router.get(
//     '/details/get-hospital-details-facilities',
//     authControllers.protect,
//     hospitalDetailsControllers.assignDataForGetFacilities,
//     hospitalDetailsControllers.getHospitalDetailsWithSelectedData,
//     hospitalDetailsControllers.preventLeakingGetFaciliteis,
//     hospitalDetailsControllers.sendJsonForSelectedData
// );
// // manage hospital details
// router.patch(
//     '/details/manage-facilites/:service',
//     authControllers.protect,
//     hospitalDetailsControllers.updateHospitalDetailsFacilites
// );
// // get hospital specialist
// router.get(
//     '/details/get-hospital-details-specialist',
//     authControllers.protect,
//     hospitalDetailsControllers.assignDataForGetSpeciallist,
//     hospitalDetailsControllers.getHospitalDetailsWithSelectedData,
//     hospitalDetailsControllers.preventLeakingGetFaciliteis,
//     hospitalDetailsControllers.sendJsonForSelectedData
// );
// // manage hospital details
// router.patch(
//     '/details/manage-specialist/:service',
//     authControllers.protect,
//     hospitalDetailsControllers.updateHospitalDetailsSpecialist
// );

// ============================================================
// job
//post new job
router.post(
    '/post-new-job/:serviceId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForGetApplicants,
    jobPortalControllers.checkValidVendorandAssignData,
    // jobPortalControllers.checkValidVendorandAssignData,
    // hospitalPackageControllers.checkValidVendorandPartner,
    // jobPortalControllers.checkPartnerIdandPartnerEid,
    jobPortalControllers.createNewPost,
    jobPortalControllers.sendJsonForCreateOne
);

// update job
router.patch(
    '/update-my-job/:jobId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataUpdate,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-job/:jobId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForUpdateJobs,
    jobPortalControllers.preventFalseDataDelete,
    jobPortalControllers.updateJob,
    jobPortalControllers.sendJsonForUpdateOne
);

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForGetApplicants,
    jobPortalControllers.getJobApplicats
);

// get a job
router.get(
    '/get-applicant-profile/:applicantId',
    authControllers.protect,
    jobPortalControllers.getJobApplication
);

// ============================================================
// advertise ment
// create new advertisement
router.post(
    '/create-new-advertisement/:serviceId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForGetApplicants,

    // hospitalPackageControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromHospital,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// quotes

// request quotes
router.post(
    '/request-quotes/',
    authControllers.protect,
    hospitalPackageControllers.getDataForQuoteFromDeaddiction
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    hospitalPackageControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);
// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:quoteId',
    authControllers.protect,
    hospitalPackageControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export routes
module.exports = router;
