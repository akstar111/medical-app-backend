// ============================================================
// import library
const express = require('express');

// ============================================================
// create router
const router = express.Router();

// ============================================================
// controllers
const authControllers = require('../controllers/authControllers');
const medicalRecordControllers = require('../controllers/medicalRecordsControllers');

// ============================================================
// create routes

// get all records
router.get(
    '/get-my-records',
    authControllers.protect,
    medicalRecordControllers.assignDataForGetAllMyRecords,
    medicalRecordControllers.getAllMedicalRecords,
    medicalRecordControllers.sendJsonForGetAllRecords
);

// get a records
router.get(
    '/get-a-record/:recordId',
    authControllers.protect,
    medicalRecordControllers.assignDataForGetARecord,
    medicalRecordControllers.getARecords,
    medicalRecordControllers.sendJsonForFindOneWithPopulate
);

router.post(
    '/new-record',
    authControllers.protect,
    medicalRecordControllers.assignNewServiceData,
    medicalRecordControllers.createNewService,
    medicalRecordControllers.sendServiceJson
);

router.patch(
    '/update-record/:serviceId',
    authControllers.protect,
    medicalRecordControllers.assignRecordUpdateData,
    medicalRecordControllers.updateMedicalRecords,
    medicalRecordControllers.sendJsonForupdatedMedicalRecords
);

router.delete(
    '/delete-record/:serviceId',
    authControllers.protect,
    medicalRecordControllers.deleteRecords
);
// ============================================================
// export routes
module.exports = router;
