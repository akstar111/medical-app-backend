// ============================================================
// import libraries

// ============================================================
// import models
const medicalRecordModel = require('../models/MedicalRecords/medicalRecord');
const memberModel = require('../models/shared/membersModel');

// ============================================================
// import utlities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');

// ============================================================
// controllers
const factoryControllers = require('./factoryControllers');

// assign data create new service for experts
exports.assignNewServiceData = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.body.userId = req.user._id;
    req.body.hiwmrmID = await encryptID(process.env.MEDICAL_RECORD_SECRET);
    const data = await memberModel.findOne({
        userId: req.user._id,
        hiwmID: req.body.member
    });
    if (!data) {
        return next(new AppError('Member was not found.', 404));
    }
    req.body.memberEId = data.hiwmID;
    return next();
});

// create new service
exports.createNewService = factoryControllers.createOne(medicalRecordModel);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// assign data for update
exports.assignRecordUpdateData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwmrmID: req.params.serviceId
    };
    return next();
};

// update medical records
exports.updateMedicalRecords = factoryControllers.updateOne(medicalRecordModel);

// send json for updated
exports.sendJsonForupdatedMedicalRecords =
    factoryControllers.sendJsonForUpdateOne();

// delete medical records
exports.deleteRecords = catchAsync(async (req, res, next) => {
    const del = await medicalRecordModel.deleteOne({
        hiwmrmID: req.params.serviceId,
        userId: req.user._id
    });
    if (!del.deletedCount) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    return res.status(200).json({
        status: 'Success'
    });
});

// assign data for get all my records
exports.assignDataForGetAllMyRecords = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.queryPopulate = 'member';
    return next();
};

// get all medical records
exports.getAllMedicalRecords =
    factoryControllers.getFindAllWithPopulateFilter(medicalRecordModel);

// send json for find all
exports.sendJsonForGetAllRecords = factoryControllers.sendAllFilter();

// get all medical records
exports.getMedicalRecordsThroughMember = catchAsync(async (req, res, next) => {
    const records = await memberModel.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $lookup: {
                from: 'medical records',
                localField: 'hiwmID',
                foreignField: 'memberEId',
                pipeline: [
                    {
                        $match: { userId: req.user._id }
                    }
                ],
                as: 'records'
            }
        }
    ]);
    console.log(records);
    req.body.records = records;
    return next();
});

// assign data for get a records
exports.assignDataForGetARecord = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwmrmID: req.params.recordId
    };
    req.queryPopulate = 'member';
    return next();
};

// get a records
exports.getARecords =
    factoryControllers.findOneWithPopulate(medicalRecordModel);

// send json for get a data
exports.sendJsonForFindOneWithPopulate =
    factoryControllers.sendJsonForFindOneWithPopulate();

// assign data for get my records
exports.assignDataForGetMemberRecords = (req, res, next) => {
    req.searchQuery = {
        memberEId: req.params.recordId,
        userId: req.user._id
    };
    return next();
};

// find medical records
exports.getMemberMedicalRecords =
    factoryControllers.findAllData(medicalRecordModel);

// get all records
exports.sendJsonForFindAll = factoryControllers.sendJsonForAll();
