// ============================================================
// import packages
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import controllers
const factoryControllers = require('../factoryControllers');

// ============================================================
// import utilities
const AppError = require('../../util/AppError');
const catchAsync = require('../../util/catchAsync');
const encryptID = require('../../util/uuid');
const filterObjects = require('../../util/filterObjects');

// ============================================================
// import models
const partnerModel = require('../../models/shared/partnerModel');
const userModel = require('../../models/shared/userModel');
const bloodDonnerModel = require('../../models/BloodDonation/addNewBloodDonnerModel');
const bloodRequesterModel = require('../../models/BloodDonation/bloodRequestorModel');
const bloodRequestsModel = require('../../models/BloodDonation/requestBloodModel');

// manage hospital package
exports.managebloodBankBloods = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
    req.query.objData = {
        'bloodBank.bloodDetails': {
            $elemMatch: { hiwbbbdID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    if (req.params.service === 'manage' || req.params.service === 'delete') {
        const a = await partnerModel.updateOne(
            {
                hiwpmID: req.params.partnerId,
                for: 'Blood Bank',
                ...req.query.objData
            },
            {
                $pull: {
                    'bloodBank.bloodDetails': { hiwbbbdID: req.query.serviceId }
                }
            }
        );
        console.log(a);
    }
    if (req.params.service === 'manage') {
        const b = await partnerModel.updateOne(
            {
                userId: req.user._id,
                for: 'Blood Bank'
            },
            {
                $push: {
                    'bloodBank.bloodDetails': {
                        hiwbbbdID: req.query.serviceId,
                        bloodType: req.body.bloodType,
                        availableUnits: req.body.availableUnits,
                        lastUpdate: Date.now()
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(b);
    }
    return res.status(200).json({
        status: 'Success'
    });
});

// create new blood donner
exports.setDonnerIdSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    req.image.name = 'idProof';
    return next();
};

// create new uniqueid
exports.assignDataFoManageDonner = catchAsync(async (req, res, next) => {
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };
    if (req.body.statusType === 'create') {
        req.body.hiwbdndID = await encryptID(process.env.DONNATION_SECRET);
        req.body.createdAt = Date.now();
        req.body.userId = req.docs._id;
    } else if (req.body.statusType === 'update') {
        req.updateOneSearch = {
            userId: req.docs._id,
            hiwbdndID: req.params.donnerId
        };
    }
    return next();
});

// set image name
exports.setImageIDProofName = (req, res, next) => {
    req.image.imagename = `${`${`${req.params.userEId
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.body.hiwbdndID.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-blood-donner-id-image`;
    return next();
};
// set image name
exports.setImageIDProofNameForUpdate = (req, res, next) => {
    req.image.imagename = `${`${`${req.params.userEId
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.donnerId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-blood-donner-id-image`;
    return next();
};

// create new blood donner
exports.createNewBloodDonner = factoryControllers.createOne(bloodDonnerModel);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// create new blood donner
exports.updateBloodDonner = factoryControllers.updateOne(bloodDonnerModel);

// assign data for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// assign data for update blood requester
exports.assignDataForUpdateBloodRequsterStatus = (req, res, next) => {
    console.log(req.body);
    if (req.body.status !== 'inActive' && req.body.status !== 'completed') {
        return next(
            new AppError(
                'You can perform only inActive or completed from this service',
                400
            )
        );
    }
    req.updateOneSearch = {
        userId: req.docs._id,
        hiwnbrID: req.params.requesterId
    };
    return next();
};

// update user status
exports.updateBloodRequester = catchAsync(async (req, res, next) => {
    let requester;
    let request;

    if (req.body.status === 'canceled') {
        [requester, request] = ['inActive', 'canceled'];
    } else if (req.body.status === 'received')
        [requester, request] = ['completed', 'completed'];
    else
        return next(
            new AppError(
                'Somthing went wrong while processing your request',
                400
            )
        );

    const [reqs, reqstr] = await Promise.all([
        bloodRequesterModel.findOneAndUpdate(
            { userId: req.docs._id, status: 'active' },
            { status: requester },
            {
                new: true,
                runValidators: true
            }
        ),
        bloodRequestsModel.updateMany(
            {
                userId: req.docs._id,
                $or: [
                    { status: 'requested' },
                    { status: 'rejected' },
                    { status: 'accepted' }
                ]
            },
            { status: request },
            {
                new: true,
                runValidators: true
            }
        )
    ]);
    return res.status(200).json({
        status: 'Success'
    });
});

// assign data for update user request status
exports.assignDataForUpdateBloodRequestStatus = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            donnerUserID: req.docs._id,
            hiwnrqID: req.params.requestId
        };

        const donner = await bloodRequestsModel.findOne(req.updateOneSearch);
        if (!donner) {
            return next(new AppError('Request is not valid.', 400));
        }
        if (req.body.status === 'accepted') {
            if (donner.status !== 'requested') {
                return next(
                    new AppError(
                        `This Request status is already ${donner.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else if (req.body.status === 'rejected') {
            if (donner.status !== 'requested' && donner.status !== 'accepted') {
                return next(
                    new AppError(
                        `This Request status is already ${donner.status}. So we can't able to accept this request.`
                    )
                );
            }
        } else {
            return next(new AppError('Not a valid request', 400));
        }
        req.body = {
            status: req.body.status,
            donnerResponseDate: Date.now(),
            donnerResponseBy: 'admin'
        };
        return next();
    }
);
// update user blood request
exports.updateUserBloodRequest =
    factoryControllers.updateOne(bloodRequestsModel);
