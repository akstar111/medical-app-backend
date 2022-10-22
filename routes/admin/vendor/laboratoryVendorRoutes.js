// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import utiliteies
const fileUpload = require('../../../util/fileUpload');
// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');
const laboratoryVendorControllers = require('../../../controllers/laboratoryControllers');
// ============================================================
// shared routers
router.use(authControllers.protect, authControllers.restrictTo('admin'));
// update hospial booking status
router.patch(
    '/update-laboratory-booking-status/:status/:vendorId/:labId',
    authControllers.protect,
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    laboratoryVendorControllers.assignDataForUpdateLaboratoryBookingStatus,
    laboratoryVendorControllers.updateLaboratoryBooking,
    laboratoryVendorControllers.sendJsonForUpdateOne
);

// ============================================================
// manege laboratory facilities
router.patch(
    '/manage-laboratory-tests/:service/:vendorId',
    adminControllers.setSearchForLaboratoryService,
    laboratoryVendorControllers.checkValidLaboratoryTest,
    laboratoryVendorControllers.mangeLaboratoryTests
);

// ============================================================
// manege laboratory facilities
router.patch(
    '/manage-laboratory-facilities/:service/:vendorId',
    laboratoryVendorControllers.setImageSizeForLaboratoryImage,
    fileUpload.uploadSingleImage('bannerImage'),
    fileUpload.resizeSingleImage,
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    laboratoryVendorControllers.imageNameForLaborateryFacilities,
    fileUpload.uploadFilesinAWS,
    laboratoryVendorControllers.mangeLaboratoryFacilities
);

// add hospita room images
router.patch(
    '/add-laboratory-images/:vendorId',
    laboratoryVendorControllers.setImageSizeForLaboratory,
    fileUpload.uploadMultipleImages('images', 12),
    fileUpload.resizeMultipleImages,
    fileUpload.uploadMultipleImageOnAWS,
    adminControllers.setSearchForLaboratoryService,
    laboratoryVendorControllers.addImagesForHospitalRooms
);

// remove hospital iamges
router.patch(
    '/remove-laboratory-images/:vendorId/:imageName/',
    adminControllers.setModuleNameForLaboratory,
    adminControllers.assignDataForGetVendorDetails,
    adminControllers.getVendorADeatails,
    adminControllers.setSearchForLaboratoryService,
    laboratoryVendorControllers.removePharmacyImages
);

// ============================================================
// exports router
module.exports = router;
