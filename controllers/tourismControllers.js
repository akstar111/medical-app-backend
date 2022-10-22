// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const tourismModel = require('../models/HostialTourism/hospitalTourismModel');
const medicalTourismModel = require('../models/HostialTourism/hospitalTourism');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'Pending',
        for: 'Hospital Tourism'
    };
    req.body.userId = req.user._id;

    return next();
};

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhmtmsID: req.params.serviceId
    };
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// create new service
exports.createNewService = factoryController.createOne(tourismModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// ============================================================
// home care application

// assign home care serive application search Query
exports.assignHomeServiceApplicationSearchQuery = catchAsync(
    async (req, res, next) => {
        const getPartner = await tourismModel.findById(req.params.serviceid);

        if (!getPartner) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    400
                )
            );
        }

        req.searchQuery = { _id: getPartner.partnerId };

        return next();
    }
);

// check valid partner and service
exports.verifyValidPartnerandService = catchAsync(async (req, res, next) => {
    const [partner, tourism] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'Pending',
            for: 'Meet the Expert'
        }),
        medicalTourismModel.findOne({
            name: req.body.serviceName,
            hiwmdm: req.params.serviceId
        })
    ]);

    if (!partner || !tourism) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }

    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    req.body.partnerId = partner._id;
    req.body.parentHospitalTourismEID = req.params.serviceId;
    req.body.hiwhmtmsID = await encryptID(process.env.MEDICAL_TOURISM_SECRET);
    return next();
});

// update home care service
exports.updateTourismService = factoryController.updateOne(tourismModel);

// delete medical tourism service
exports.deleteTourism = catchAsync(async (req, res, next) => {
    await tourismModel.deleteOne({
        userId: req.user._id,
        hiwhmtmsID: req.params.serviceId
    });

    return next();
});

// get all servie
exports.getAllTourism = factoryController.getAllFilter(tourismModel);

// send json for all
exports.sendJsonAll = factoryController.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwhmtmsID: req.params.serviceId };
    return next();
};

// find data by id
exports.findServiceById = factoryController.findOne(tourismModel);

// send json for find by id
exports.sendJsonForId = factoryController.sendJsonForFindOne();

// assign data for create new  service
exports.assignDataForCreateNewMedicalTourisumService = catchAsync(
    async (req, res, next) => {
        req.body.createdAt = Date.now();
        req.body.hiwmdm = await encryptID(process.env.MEDICAL_TOURISM_SECRET);
        return next();
    }
);

// create new medical tourism service
exports.createNewMedicalTourism =
    factoryController.createOne(medicalTourismModel);

// get all medical tourism service
exports.getAllMedicalTourismServices =
    factoryController.getAll(medicalTourismModel);

// send json for get all data
exports.sendJsonAllData = factoryController.sendJsonForFindAll();

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await medicalTourismModel.findOne({
        hiwmdm: req.params.serviceId
    });
    if (!data) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }
    req.oldName = data.name;
    return next();
});

// assign data for update medical tourism service
exports.assignDataForUpdateMedicalTourismService = (req, res, next) => {
    req.updateOneSearch = { hiwmdm: req.params.serviceId };

    return next();
};

// update medical tourism service
exports.updateMedicalTourism = factoryController.updateOne(medicalTourismModel);

// assign data for update all medical tourism services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }
    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};

// update other medical tourism service data
exports.updateRemainingMedicalTourismServices =
    factoryController.updateAll(tourismModel);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });
