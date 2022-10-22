/* eslint-disable no-octal */
// ============================================================
// import models

const advertisementModel = require('../models/shared/advertisementModel');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const partnerModel = require('../models/shared/partnerModel');

// ============================================================
// create controllers

// assign data for post a new job form Deaddiction center
exports.assignDataForCreateNewJobPostFromDeaddiction = catchAsync(
    async (req, res, next) => {
        req.body.from = 'De-Addiction service';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// check the partner and councilar
exports.checkValidVendorandAssignData = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: req.body.from
        })
    ]);

    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.location = [req.body.latitude, req.body.longitude];
    req.body.userId = req.user._id;
    req.body.partner = true;
    req.body.createdAt = Date.now();
    req.body.partnerId = partner._id;
    req.body.partnerEID = partner.hiwpmID;
    req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
    req.body.createdAt = Date.now();
    req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
    req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
    if (!req.body.location || req.body.location.length !== 2) {
        return next(
            new AppError(
                'Locaion should be included or enter valid location.',
                400
            )
        );
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.body.hiwnadmID.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}advertisement`;
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };

    return next();
});
// assign data for post a new job from ambulanceSerivice
exports.assignDataForCreateNewJobPostFromAmbulance = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Ambulance Service';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job from ambulanceSerivice
exports.assignDataForCreateNewJobPostFromBloodBank = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Blood Bank';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwnadmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}advertisement`;

        return next();
    }
);
// assign data for post a new job from ambulanceSerivice
exports.assignDataForCreateNewJobPostFromOpticals = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Opticals';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job from online consultance
exports.assignDataForCreateNewJobPostFromOnlineCondsultancy = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Online Consultancy';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job from meet the experts
exports.assignDataForCreateNewJobPostFromExperts = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Meet the Expert';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job from meet the experts
exports.assignDataForCreateNewJobPostFromGYM = catchAsync(
    async (req, res, next) => {
        req.body.from = 'GYM';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job from meet the experts
exports.assignDataForCreateNewJobPostFromHomecare = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Homecare service';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        return next();
    }
);
// assign data for post a new job from hearing aid
exports.assignDataForCreateNewJobPostFromHearingAID = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Hearing AID';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form Deaddiction center
exports.assignDataForCreateNewJobPostFromHospital = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Hospitals';
        req.body.userId = req.user._id;
        req.body.hiwnadmID = await encryptID(process.env.ADVERTISEMENT_SECRET);
        req.body.createdAt = Date.now();
        req.body.startDate = new Date(req.body.startDate).setHours(00, 00, 00);
        req.body.endDate = new Date(req.body.endDate).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);

// check partner id and partner encrypt id is updated
exports.checkPartnerIdandPartnerEid = (req, res, next) => {
    if (!req.body.parentEID || !req.body.partnerId) {
        return next(
            new AppError(
                'Somthing went wrong while processing your requrest',
                400
            )
        );
    }
    return next();
};

// create new job portal
exports.createNewAdvertisement =
    factoryControllers.createOne(advertisementModel);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// prevent false data
exports.preventFalseAdvertisemenDataUpdate = async (req, res, next) => {
    req.body = filerDataFromRequest(req.body, 'adImage');
    return next();
};

// creaet aupdate advertisement
exports.updateAdvertisement = factoryControllers.updateOne(advertisementModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// prevent false data
exports.preventFalseDataDelete = async (req, res, next) => {
    req.body = { status: 'inActive' };
    return next();
};

// assign  data to get my advertisement
exports.getMyadvertisements = catchAsync(async (req, res, next) => {
    const advertisement = await advertisementModel.find({
        userId: req.user._id,
        from: req.query.from,
        status: 'active'
    });
    req.body.advertisement = advertisement;
    return next();
});

// get valida data
exports.checkValidData = (req, res, next) => {
    if (
        !req.body.startDate ||
        !req.body.endDate ||
        new Date(req.body.startDate) < new Date() ||
        new Date(req.body.startDate) > new Date(req.body.endDate)
    ) {
        return next(new AppError('Please select the valide date.', 400));
    }
    // req.body.location = [req.body.latitude, req.body.longitude];
    req.body.paidAmount = 300;

    return next();
};

// set image size for advertisement
exports.setimageSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 800;
    req.image.resizeH = 160;
    return next();
};

// assign data for get a advertisement
exports.assignDataForGetAAdvertisement = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwnadmID: req.params.adId,
        from: req.query.from
    };
    return next();
};

// get a advertisement
exports.getAAdvertisement = factoryControllers.findOne(advertisementModel);

// set image name
exports.setImageName = (req, res, next) => {
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.adId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}advertisement`;
    return next();
};
