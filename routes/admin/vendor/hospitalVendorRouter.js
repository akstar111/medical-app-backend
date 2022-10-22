// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');
// vendor controllers
const hospitalVendorControllers = require('../../../controllers/hospitalPackageControllers');

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// shared routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// ============================================================
// ============================================================
// ============================================================
// Pacakge

router.patch(
    '/package/manage-hospital-package/:service/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForUpdateHospitalPackage,
    hospitalVendorControllers.manageHospitalPackage
);
router.patch(
    '/package/manage-hospital-package-subcategory/:service/:vendorId/:categoryId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForUpdateHospitalPackage,
    hospitalVendorControllers.manageHospitalPackageSubCategory
);
router.patch(
    '/package/manage-hospital-package-subcategory-details/:service/:vendorId/:categoryId/:subCategory',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForUpdateHospitalPackage,
    hospitalVendorControllers.manageHospitalPackageSubCategoryDetails
);
router.patch(
    '/package/manage-hospital-subcategory-package-details/:service/:vendorId/:categoryId/:subCategory/:packageId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignDataForUpdateHospitalPackage,
    hospitalVendorControllers.manageHospitalPackageispackageListDetails
);

// mange hospital service
router.patch(
    '/manage-hospital-services/:vendorId/:service/',
    hospitalVendorControllers.setImageSizeForHospitalServiceBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalServiceImageName,
    hospitalVendorControllers.checkIfTheServiceisAlreadyExist,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageHospitalServices
);

// manage hospital facilitie
router.patch(
    '/manage-hospital-facilities/:vendorId/:service',
    hospitalVendorControllers.setImageSizeForHospitalFacilityBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalFacilitymageName,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageHospitalFacilities
);

// manage hospital specialist
router.patch(
    '/manage-hospital-specialist/:vendorId/:service',
    hospitalVendorControllers.setImageSizeForHospitalSpecialistBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitaSpecialistmageName,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageHospitalSpecialist
);

// manage hospital room specialist
router.patch(
    '/manage-hospital-room-facilities/:vendorId/:service',
    hospitalVendorControllers.setImageSizeForHospitalRoomFacilityBanner,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalRoomFacilitymageName,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageHospitalRoomFacilities
);

// add hospita room images
router.patch(
    '/add-hospital-images/:imgType/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalRoomImages,
    fileUpload.uploadMultipleImages('images', 12),
    fileUpload.resizeMultipleImages,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    fileUpload.uploadMultipleImageOnAWS,
    hospitalVendorControllers.addImagesForHospitalRooms
);

// remove hospital iamges
router.patch(
    '/remove-hospital-images/:imageName/:imgType/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.removeHospitalRoomImages
);

// hospital nearby facilitiees hospital iamges
router.patch(
    '/remove-hospital-room-images/:imageName/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.removeHospitalRoomImages
);

// hospital nearby facilitiees hospital iamges
router.patch(
    '/tourism/manage-nearby-hospital-facilities/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.checkAndArrangeDataForNearByHospital,
    hospitalVendorControllers.assignDataForUpdateHospital,
    hospitalVendorControllers.updateHospitalDetails,
    hospitalVendorControllers.sendJsonForUpdateOne
);

// hospital hospital facilities
router.patch(
    '/manage-hospital-availablities/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.assignDataFordateHospitalAvailaity,
    hospitalVendorControllers.assignDataForUpdateHospital,
    hospitalVendorControllers.updateHospitalDetails,
    hospitalVendorControllers.sendJsonForUpdateOne
);
// hospital hospital facilities
router.patch(
    '/manage-hospital-specialities/:vendorId',
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.assignDataforHospitalAvailablity,
    hospitalVendorControllers.assignDataForUpdateHospital,
    hospitalVendorControllers.updateHospitalDetails,
    hospitalVendorControllers.sendJsonForUpdateOne
);

// hospital nearby facilitiees hospital iamges
router.patch(
    '/tourism/manage-nearby-hotels/:service/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalNearByHotels,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalNearbyHotels,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageNearbyHotels
);
// hospital nearby reasutarents hospital iamges
router.patch(
    '/tourism/manage-nearby-restaurents/:service/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalNearByRestaurents,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalNearbyRestaurents,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageNearbyRestaurents
);

// manage near by airports
router.patch(
    '/tourism/manage-nearby-airports/:service/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalNearByAirports,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalNearbyAirports,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageNearbyAirports
);

// manage near by trains
router.patch(
    '/tourism/manage-nearby-trains/:service/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalNearByTrains,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalNearbyTrains,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageNearbyTrains
);

// manage near by buses
router.patch(
    '/tourism/manage-nearby-buses/:service/:vendorId',
    hospitalVendorControllers.setImageSizeForHospitalNearByBuses,
    fileUpload.uploadSingleImage('image'),
    fileUpload.resizeSingleImage,
    adminControllers.assignDataForFindHospitalPackageDetail,
    adminControllers.getVendorADeatails,
    adminControllers.assignUserIdAndPartnerId,
    hospitalVendorControllers.setHospitalNearbyBuses,
    fileUpload.uploadFilesinAWS,
    hospitalVendorControllers.manageNearbyBuses
);

// ============================================================
// export router
module.exports = router;
