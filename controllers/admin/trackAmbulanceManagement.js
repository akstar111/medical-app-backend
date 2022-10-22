// ============================================================
// import controllers
const factoryControllers = require('../factoryControllers');
// ============================================================
// import utilities
const AppError = require('../../util/AppError');
const catchAsync = require('../../util/catchAsync');
const encryptID = require('../../util/uuid');
const filterObjects = require('../../util/filterObjects');
const sendEmail = require('../../util/sendMail');

// ============================================================
// import models
const ambulanceDriverModel = require('../../models/AmbulanceAlert/ambulanceDriversModel');
const trafficPoliceModel = require('../../models/AmbulanceAlert/trafficPoliceModel');
const ambulanceAlertModel = require('../../models/AmbulanceAlert/ambulanceModel');

// get all drivers
exports.getAllAmbulanceDrivers =
    factoryControllers.getAllFilter(ambulanceDriverModel);

// get all traffic police model
exports.getAllTrafficPoliceModel =
    factoryControllers.getAllFilter(trafficPoliceModel);

// set image size for ambulance driver
exports.setAmbulanceProfileImageSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'profileImage';
    return next();
};

// assign data for create ambulance driver
exports.assignDataForcreateAmbulanceDriver = catchAsync(
    async (req, res, next) => {
        req.body.hiwaladsID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.unicId = `DRI${Math.floor(
            Math.random() * 100000000
        ).toString()}${Date.now().toString(36).slice(-3)}`;
        req.body.createdAt = Date.now();
        return next();
    }
);

// assign data for create traffic police
exports.assignDataForcreateTrafficPolice = catchAsync(
    async (req, res, next) => {
        req.body.hiwaltrsID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.unicId = `DRI${Math.floor(
            Math.random() * 100000000
        ).toString()}${Date.now().toString(36).slice(-3)}`;
        req.body.createdAt = Date.now();
        return next();
    }
);

// set homecare image name
exports.assignImageNameForAmbulanceDriver = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwaladsID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-ambulance-driver-profile`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwaladsID: req.params.driverId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.driverId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-ambulance-driver-profile`;

    return next();
};

// assign image name for ambulance driver name
exports.assignImageNameForTrafficPolice = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwaltrsID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-traffic-police-profile`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwaltrsID: req.params.policeId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.policeId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-traffic-police-profile`;
    return next();
};

// create new ambulane driver
exports.createNewAmbulanceDriver =
    factoryControllers.createOne(ambulanceDriverModel);

// create new traffic police
exports.createNewTrafficPolice =
    factoryControllers.createOne(trafficPoliceModel);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// update new ambulane driver
exports.updateNewAmbulanceDriver =
    factoryControllers.updateOne(ambulanceDriverModel);

// update traffic police
exports.updateTrafficPolice = factoryControllers.updateOne(trafficPoliceModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// get all alert data
exports.getAllNewAmbulanceAlert = catchAsync(async (req, res, next) => {
    const [requests, drivers] = await Promise.all([
        ambulanceAlertModel.find({ status: 'requested' }),
        ambulanceDriverModel
            .find({ status: 'inActive', verified: true })
            .select('driverName phone profileImage hiwaladsID')
    ]);
    req.body.requests = requests;
    req.body.drivers = drivers;
    return next();
});

// assign data for get all ambulance verify request
exports.assignDataForGetAllVerifyRequest = (req, res, next) => {
    req.searchQuery = { status: 'started', verification: 'requested' };
    return next();
};

// get all verify request
exports.getAllVerifyRequest =
    factoryControllers.findAllData(ambulanceAlertModel);
