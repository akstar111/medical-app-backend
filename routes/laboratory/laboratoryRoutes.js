// ============================================================
// import libraries
const express = require('express');

// create route
const router = express.Router();

// ============================================================
// utilities
const fileUpload = require('../../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../../controllers/authControllers');
const laboratoryControllers = require('../../controllers/laboratoryControllers');

// ============================================================
// shared
router.use(authControllers.protect);

// ============================================================
// create routes

// get all laboratory router
router.get(
    '/get-all-laboratory-categories',
    laboratoryControllers.getAllLaboratoryCategoriesList,
    laboratoryControllers.sendJsonGetAllFilter
);

// update laborator routes
router.patch(
    '/update-laboratory',
    laboratoryControllers.filterNewLaboratory,
    laboratoryControllers.assignPartnerSearchData,
    // laboratoryControllers.verifyValidPartner,
    // laboratoryControllers.assignValidPartnerSearchData,
    laboratoryControllers.updateLaboratoryService,
    laboratoryControllers.sendJsonForUpdateOne
);

// ============================================================
// manege laboratory tests
router.patch(
    '/manage-laboratory-tests/:service',
    laboratoryControllers.assignPartnerSearch,
    laboratoryControllers.checkValidLaboratoryTest,
    laboratoryControllers.mangeLaboratoryTests
);

// ============================================================
// manege laboratory facilities
router.patch(
    '/manage-laboratory-facilities/:service',
    laboratoryControllers.setImageSizeForLaboratoryImage,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    laboratoryControllers.assignPartnerSearch,
    laboratoryControllers.verifyValidPartner,
    laboratoryControllers.imageNameForLaborateryFacilities,
    fileUpload.uploadFilesinAWS,
    laboratoryControllers.mangeLaboratoryFacilities
);

// add hospita room images
router.patch(
    '/add-laboratory-images/',
    laboratoryControllers.setImageSizeForLaboratory,
    fileUpload.uploadMultipleImages('images', 12),
    fileUpload.resizeMultipleImages,
    fileUpload.uploadMultipleImageOnAWS,
    laboratoryControllers.addSearchQueryFormLaboratoryImages,
    laboratoryControllers.addImagesForHospitalRooms
);

// remove hospital iamges
router.patch(
    '/remove-laboratory-images/:imageName/',
    laboratoryControllers.assignPartnerSearch,
    laboratoryControllers.verifyValidPartner,
    laboratoryControllers.addSearchQueryFormLaboratoryImages,
    laboratoryControllers.removePharmacyImages
);

// get all laborator
router.get('/get-all-laboratory', laboratoryControllers.getAllLaboratory);

// get a laboratory
router.get(
    '/get-a-laboratory/:labId',
    laboratoryControllers.assignDataForGetALaboratory,
    laboratoryControllers.getALaboratory,
    laboratoryControllers.sendJsonForGetOne
);

// update hospial booking status
router.patch(
    '/update-laboratory-booking-status/:status/:labId',
    authControllers.protect,
    laboratoryControllers.assignPartnerSearch,
    laboratoryControllers.verifyValidPartner,
    laboratoryControllers.assignDataForUpdateLaboratoryBookingStatus,
    laboratoryControllers.updateLaboratoryBooking,
    laboratoryControllers.sendJsonForUpdateOne
);

// ============================================================
// export route
module.exports = router;
