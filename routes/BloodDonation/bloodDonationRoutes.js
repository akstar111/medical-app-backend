// ============================================================
// import libaries
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const bloodDonnationControllers = require('../../controllers/bloodDonationControllers');
const jobPortalControllers = require('../../controllers/jobPortalControllers');
const advertisementControllers = require('../../controllers/advertisementControllers');
const medicalMarketControllers = require('../../controllers/medicalMarketControllers');

// ============================================================
// import utilities
const imageUpload = require('../../util/fileUpload');

// ============================================================
// // create router
// router.post(
//     '/new-blood-bank',
//     authControllers.protect,
//     bloodDonnationControllers.filterNewBloodBankData,
//     bloodDonnationControllers.checkValidVendorandPartnerBloodBank,
//     bloodDonnationControllers.createNewBloodBank,
//     bloodDonnationControllers.sendJsonForCreateOne
// );

// blood bank
router.patch(
    '/update-blood-bank',
    authControllers.protect,
    // bloodDonnationControllers.assignPartnerSearchData,
    // bloodDonnationControllers.verifyValidPartner,
    // bloodDonnationControllers.filterNewBloodBankData,
    bloodDonnationControllers.assignDataForUpdatBloodBank,
    bloodDonnationControllers.updateBloodBank,
    bloodDonnationControllers.sendJsonForupdateOne
);

// manage bloodbank
router.patch(
    '/manage-blood-details/:service',
    authControllers.protect,
    // bloodDonnationControllers.assignPartnerSearchData,
    // bloodDonnationControllers.verifyValidPartner,
    bloodDonnationControllers.managebloodBankBloods
);

// get near by blood banks
router.get(
    '/nearby-bloodbanks',
    authControllers.protect,
    bloodDonnationControllers.getNearByBloodbanks
);
//post new job
// router.post(
//     '/post-new-job/',
//     authControllers.protect,
//     jobPortalControllers.filterValidJobData,
//     // bloodDonnationControllers.assignDataForGetApplicants,
//     jobPortalControllers.checkCategoryandSpecility,
//     jobPortalControllers.checkValidVendorandAssignData,
//     // bloodDonnationControllers.checkValidVendorandPartner,
//     // jobPortalControllers.assignDataForCreateNewJobPostFromBloodBank,
//     // jobPortalControllers.checkPartnerIdandPartnerEid,
//     jobPortalControllers.createNewPost,
//     jobPortalControllers.sendJsonForCreateOne
// );
// // update job
// router.patch(
//     '/update-my-job/:jobId',
//     authControllers.protect,
//     jobPortalControllers.filterValidJobData,
//     jobPortalControllers.checkCategoryandSpecility,
//     bloodDonnationControllers.assignDataForUpdateJobs,
//     jobPortalControllers.updateJob,
//     jobPortalControllers.sendJsonForUpdateOne
// );

// // delete(inactive) job
// router.patch(
//     '/delete-my-job/:jobId',
//     authControllers.protect,
//     bloodDonnationControllers.assignDataForUpdateJobs,
//     jobPortalControllers.preventFalseDataDelete,
//     jobPortalControllers.updateJob,
//     jobPortalControllers.sendJsonForUpdateOne
// );

// get job applicats
router.get(
    '/get-job-applicants/:jobId',
    authControllers.protect,
    bloodDonnationControllers.assignDataForGetApplicants,
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
    advertisementControllers.setimageSize,
    imageUpload.uploadSingleImage('advertisement'),
    imageUpload.resizeSingleImage,
    bloodDonnationControllers.assignDataForGetApplicants,
    advertisementControllers.checkValidVendorandAssignData,
    // bloodDonnationControllers.checkValidVendorandPartner,
    // advertisementControllers.assignDataForCreateNewJobPostFromBloodBank,
    advertisementControllers.checkValidData,
    // advertisementControllers.checkPartnerIdandPartnerEid,
    imageUpload.uploadFilesinAWS,
    advertisementControllers.createNewAdvertisement,
    advertisementControllers.sendJsonForCreateOne
);

// update advertisement
router.patch(
    '/update-my-advertisement/:adId',
    authControllers.protect,
    advertisementControllers.setimageSize,
    imageUpload.uploadSingleImage('advertisement'),
    imageUpload.resizeSingleImage,
    bloodDonnationControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.setImageName,
    imageUpload.uploadFilesinAWS,
    advertisementControllers.preventFalseAdvertisemenDataUpdate,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// delete(inactive) job
router.patch(
    '/delete-my-advertisement/:adId',
    authControllers.protect,
    bloodDonnationControllers.assignDataForUpdateAdvertisement,
    advertisementControllers.preventFalseDataDelete,
    advertisementControllers.updateAdvertisement,
    advertisementControllers.sendJsonForUpdateOne
);

// ============================================================
// create a quote
router.post(
    '/request-quotes/',
    authControllers.protect,
    bloodDonnationControllers.getDataForQuoteFromAmbulance
);

// get my quotes
router.get(
    '/get-my-quotes',
    authControllers.protect,
    bloodDonnationControllers.assignDataForGetMyQuotes,
    medicalMarketControllers.getMyActiveQuotes
);

// get my quotes
router.get(
    '/get-a-quotes/:quoteId',
    authControllers.protect,
    bloodDonnationControllers.assignDataForGetMyQuotes,
    bloodDonnationControllers.getAQuotes
);

// cancel medical market
router.patch(
    '/cancel-quote/:quoteId',
    authControllers.protect,
    bloodDonnationControllers.assignDataForCancelReques,
    medicalMarketControllers.updateMedcalquoterequestors,
    medicalMarketControllers.sendJsonForUpdateOne
);

// cancel medical market
router.patch(
    '/update-quote-status/:status/:quoteId',
    authControllers.protect,
    bloodDonnationControllers.assignDataForQuotesRequests,
    medicalMarketControllers.updateMedcalquoterequestor,
    medicalMarketControllers.sendJsonForUpdateOne
);

// ============================================================
// export router
module.exports = router;
