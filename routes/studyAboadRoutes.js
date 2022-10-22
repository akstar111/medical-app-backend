// ============================================================
// import libraries
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// import controllers
const studyAbroadControllers = require('../controllers/studeAbroadControlles');
const authControllers = require('../controllers/authControllers');

// ============================================================
// create routes
// router.post(
//     '/new-service',
//     authControllers.protect,
//     studyAbroadControllers.assignPartnerSearchData,
//     studyAbroadControllers.verifyValidPartner,
//     studyAbroadControllers.assignPartnerId,
//     studyAbroadControllers.createNewService,
//     studyAbroadControllers.sendServiceJson
// );

// update service
router.patch(
    '/update-study-abroad',
    authControllers.protect,
    // studyAbroadControllers.assignPartnerSearchData,
    // studyAbroadControllers.verifyValidPartner,
    // studyAbroadControllers.assignValidPartnerSearchData,
    // studyAbroadControllers.updateStudyAbroad,
    studyAbroadControllers.filterStudyAbroadData,
    studyAbroadControllers.assignDataForUpdateStudyAbroad,
    studyAbroadControllers.updateStudyAboard,
    studyAbroadControllers.sendServiceJsonupdateOne
);

// router updatedata
router.patch(
    '/update-course-details',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.assignDataForUpdateCourseDetails,
    studyAbroadControllers.updateStudyAbroad,
    studyAbroadControllers.sendServiceJsonupdateOne
);

// router updatedata
router.patch(
    '/update-college-details',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartnerAndServices,
    studyAbroadControllers.setFilesForUploadCollegeDetails,
    studyAbroadControllers.resizeCollegeDetailsImages,
    studyAbroadControllers.uploadCollegeDetailsFilesOnAWS,
    // studyAbroadControllers.assignDataForUpdateCollegeDetails,
    studyAbroadControllers.updateStudyAbroadByID,
    studyAbroadControllers.sendJsonForUpdateById
);

// router updatedata
router.patch(
    '/update-facilities-details',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.assignDataForUpdateFaciliesDetails,
    studyAbroadControllers.updateStudyAbroad,
    studyAbroadControllers.sendServiceJsonupdateOne
);

router.delete(
    '/delete-service/:serviceid',
    authControllers.protect,
    studyAbroadControllers.assignPartnerSearchData,
    studyAbroadControllers.verifyValidPartner,
    studyAbroadControllers.assignValidPartnerSearchData,
    studyAbroadControllers.verifyValidPartnerissSerive,
    studyAbroadControllers.deleteStudyAbroadService,
    studyAbroadControllers.sendServiceJson
);

router.post(
    '/new-admission/',
    authControllers.protect,
    studyAbroadControllers.createNewAdmission,
    studyAbroadControllers.sendServiceJson
);

// router get
router.get(
    '/get-colleges',
    authControllers.protect,
    studyAbroadControllers.assignDAtaForFindAllData,
    studyAbroadControllers.getAllColleges,
    studyAbroadControllers.sendJsonForGetAllFilter
);

router.get(
    '/get-a-college/:collegeId',
    authControllers.protect,
    studyAbroadControllers.assignDataForGetAColleges,
    studyAbroadControllers.getACollege,
    studyAbroadControllers.sendJsonForGetOne
);

// export routes
module.exports = router;
