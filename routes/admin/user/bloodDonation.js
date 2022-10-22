// ============================================================
// import packages
const express = require('express');

// ============================================================
// creaate router
const router = express.Router();

// ============================================================
// import utilities
const fileUpload = require('../../../util/fileUpload');

// ============================================================
// import controllers
const authControllers = require('../../../controllers/authControllers');
const bloodDonnationContro = require('../../../controllers/admin/bloodDonationContro');
const adminControllers = require('../../../controllers/admin/adminControllers');
// ============================================================
// shared
router.use(authControllers.protect, authControllers.restrictTo('admin'));
// ============================================================
// create router
// create new blood donner
router.post(
    '/create-new-donner/:userEId',
    bloodDonnationContro.setDonnerIdSize,
    fileUpload.uploadSingleImage('idProof'),
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonnationContro.assignDataFoManageDonner,
    bloodDonnationContro.setImageIDProofName,
    fileUpload.resizeSingleImage,
    fileUpload.uploadFilesinAWS,
    bloodDonnationContro.createNewBloodDonner,
    bloodDonnationContro.sendJsonForCreateOne
);

// update blood donner
router.patch(
    '/update-donner/:userEId/:donnerId',
    bloodDonnationContro.setDonnerIdSize,
    fileUpload.uploadSingleImage('idProof'),
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonnationContro.assignDataFoManageDonner,
    bloodDonnationContro.setImageIDProofNameForUpdate,
    fileUpload.resizeSingleImage,
    fileUpload.uploadFilesinAWS,
    bloodDonnationContro.updateBloodDonner,
    bloodDonnationContro.sendJsonForUpdateOne
);

// update blood requester status
router.patch(
    '/update-requester-status/:userEId/:requesterId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonnationContro.updateBloodRequester
);

// update request status
router.patch(
    '/update-request-status/:userEId/:requestId',
    adminControllers.assignDataForGetAUser,
    adminControllers.getAUser,
    bloodDonnationContro.assignDataForUpdateBloodRequestStatus,
    bloodDonnationContro.updateUserBloodRequest,
    bloodDonnationContro.sendJsonForUpdateOne
);

// blood donation
// ============================================================
module.exports = router;
