// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const meetTheExpertContro = require('../../../controllers/admin/meetTheExpertControllers');
const meetTheExpertVendorcontrollers = require('../../../controllers/meetTheExportControllers');
const adminControllers = require('../../../controllers/admin/adminControllers');

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// shared routes
router.use(authControllers.protect, authControllers.restrictTo('admin'));

// manage meet the expert services
router.patch(
    '/manage-facilities/:service/:vendorId/',
    meetTheExpertContro.manageMeetTheExpertServicesServices
);

// assin data for create meet the expert services
router.post(
    '/create-services/:vendorId',
    meetTheExpertContro.setExpertServiceProfileSize,
    fileUpload.uploadSingleImage('serviceImage'),
    adminControllers.setSearchForExportBookingList,
    meetTheExpertVendorcontrollers.findOnePartnerForExpert,
    meetTheExpertContro.setImageName,
    fileUpload.resizeSingleImage,
    fileUpload.uploadFilesinAWS,
    meetTheExpertContro.createNewExpertServices,
    meetTheExpertContro.sendJsonForCreateOne
);

// assin data for update meet the expert services
router.patch(
    '/update-services/:vendorId/:serviceId',
    meetTheExpertContro.setExpertServiceProfileSize,
    fileUpload.uploadSingleImage('serviceImage'),
    adminControllers.setSearchForExportBookingList,
    meetTheExpertVendorcontrollers.findOnePartnerForExpert,
    meetTheExpertContro.setUpdatImageName,
    fileUpload.resizeSingleImage,
    fileUpload.uploadFilesinAWS,
    meetTheExpertVendorcontrollers.assignDataForUpdateMeetTheExpert,
    meetTheExpertVendorcontrollers.updateMeetTheExpertServices,
    meetTheExpertVendorcontrollers.sendJsonForUpdateOne
);

// update homecare service
router.patch(
    '/update-expert-status/:status/:vendorId/:expertId',
    authControllers.protect,
    adminControllers.setSearchForExportBookingListData,
    adminControllers.getVendorADeatails,
    meetTheExpertVendorcontrollers.assignDataForExpertServiceVendor,
    meetTheExpertVendorcontrollers.updateExpertStatus,
    meetTheExpertVendorcontrollers.sendJsonForUpdateOne
);
// ============================================================
// export router
module.exports = router;
