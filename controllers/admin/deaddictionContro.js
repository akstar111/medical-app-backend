// ============================================================
// import libraries
const mongoose = require('mongoose');
const { v5: uunidv5, v4: uuidv4, validate: uuidValidate } = require('uuid');
let multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
var twelve = require('twentyfour-to-twelve');

// ============================================================
// import controllers
const factoryController = require('../factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../../util/catchAsync');
const AppError = require('../../util/AppError');
const encryptID = require('../../util/uuid');
const addressModel = require('../../models/shared/addUserAddressModel');
const filerDataFromRequest = require('../../util/filterObjects');

// ============================================================
// import models
const partnerModel = require('../../models/shared/partnerModel');
const deaddictionServicesModel = require('../../models/Deaddiction/deAddictionServicesModel');
const deaddictionModel = require('../../models/Deaddiction/createDeaddictionModel');
const bookDeaddictionCenterModel = require('../../models/Deaddiction/bookDeaddictionCenterModel');

// ============================================================
// create controllers
exports.assignAndVerifyPartnerData = catchAsync(async (req, res, next) => {
    let data;
    let serviceName;
    let exist;
    let service;
    let obj;
    if (req.body.statusType === 'create') {
        [data, serviceName] = await Promise.all([
            partnerModel.findOne({
                hiwpmID: req.params.partnerId,
                for: 'De-Addiction service',
                status: 'accepted'
            }),
            deaddictionServicesModel.findOne({ name: req.body.serviceName })
        ]);
        exist = await deaddictionModel.exists({
            userId: data.userId,
            serviceName: req.body.serviceName
        });
    } else if (req.body.statusType === 'update') {
        [service, serviceName] = await Promise.all([
            deaddictionModel.findOne({
                hiwdacmID: req.params.serviceId
            }),
            deaddictionServicesModel.findOne({ name: req.body.serviceName })
        ]);
        [exist, obj, data] = await Promise.all([
            deaddictionModel.exists({
                userId: service.userId,
                serviceName: req.body.serviceName
            }),
            deaddictionModel.findOne({
                userId: service.userId,
                hiwdacmID: req.params.serviceId
            }),
            partnerModel.findOne({
                userId: service.userId,
                for: 'De-Addiction service',
                status: 'accepted'
            })
        ]);
        if (obj.serviceName !== req.body.serviceName && !!exist) {
            return next(
                new AppError(
                    'This service is already existed on this vendor.',
                    400
                )
            );
        }
    }
    if (!data) {
        return next(new AppError('You are not a valid vendor.', 400));
    }
    if (!serviceName) {
        return next(new AppError('Please select the valid service name', 400));
    }
    if (req.body.statusType === 'create')
        if (exist) {
            return next(
                new AppError(
                    'You already created service on this category',
                    400
                )
            );
        }
    req.body.userId = data.userId;
    req.body.partnerId = data._id;
    if (req.body.statusType === 'create') {
        req.body.createdAt = Date.now();
        req.body.hiwdacmID = await encryptID(process.env.HEARINGAID_SECRET);
    }
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };
    req.query.userId = data.userId;
    req.body.createdBy = 'admin';

    return next();
});

// assign data for update homecare's services
exports.assignDataForUpdateHomecareServicess = (req, res, next) => {
    req.seartchQuery = {
        userId: req.query.userId,
        hiwdacmID: req.params.serviceId
    };
    return next();
};

// manage homecare facilities
exports.manageMeetTheExpertServicesServices = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.facilitieId ?? 0);
        req.query.objData = {
            'deaddiction.fecilities': {
                $elemMatch: { hiwdacfls: req.query.facilitieId }
            }
        };
        if (!req.query.facilitieId || !uuiddetails) {
            req.query.facilitieId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        if (
            req.params.service === 'manage' ||
            req.params.service === 'delete'
        ) {
            const a = await partnerModel.updateOne(
                {
                    hiwpmID: req.params.partnerId,
                    for: 'De-Addiction service',
                    ...req.query.objData
                },
                {
                    $pull: {
                        'deaddiction.fecilities': {
                            hiwdacfls: req.query.facilitieId
                        }
                    }
                }
            );
            console.log(a);
        }
        req.query.objData = {};
        if (
            req.params.service === 'manage' ||
            req.params.service === 'create'
        ) {
            const b = await partnerModel.updateOne(
                {
                    hiwpmID: req.params.partnerId,
                    for: 'De-Addiction service'
                },
                {
                    $push: {
                        'deaddiction.fecilities': {
                            hiwdacfls: req.query.facilitieId,
                            title: req.body.title,
                            description: req.body.description
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
    }
);

// assing data for cancel request
exports.assignDataForCancelDeaddictionService = catchAsync(
    async (req, res, next) => {
        if (req.body.status === 'accepted') {
            req.body.scheduledTime = twelve(req.body.scheduledTime);

            const regex = /^([0]\d|[1][0-2]):([0-5]\d)\s?(?:AM|PM)$/i;
            if (!regex.test(req.body.scheduledTime)) {
                return next(
                    new AppError(
                        'Please select the proper data time to schedule'
                    )
                );
            }
        }
        const application = await bookDeaddictionCenterModel.findOne({
            hiwbdacns: req.params.deaddictionId
        });

        req.updateOneSearch = {
            hiwbdacns: req.params.deaddictionId
        };
        req.body.vendorRespondBy = 'admin';
        req.body.vendorDescription = req.body.cause;
        req.body.vendorActionDate = Date.now();
        if (req.params.status === 'accepted') {
            if (application.status !== 'pending') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else if (req.params.status === 'rejected') {
            if (
                application.status !== 'accepted' &&
                application.status !== 'pending'
            ) {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else if (req.params.status === 'canceled') {
            return next(
                new AppError('This service only can access from user side.')
            );
        } else if (req.params.status === 'completed') {
            if (application.status !== 'accepted') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else {
            return next(new AppError(`Please select the valid status.`, 400));
        }
        req.body.status = req.params.status;

        return next();
    }
);
// assing data for cancel request
exports.assignDataForCancelDeaddictionServiceUser = catchAsync(
    async (req, res, next) => {
        const application = await bookDeaddictionCenterModel.findOne({
            hiwbdacns: req.params.deaddictionId
        });

        req.body.status = req.params.status;
        req.updateOneSearch = {
            hiwbdacns: req.params.deaddictionId
        };
        if (req.body.status === 'canceled') {
            if (application.status === 'completed') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
            req.body.userDescription = req.body.cause;
            req.body.userRespondBy = 'admin';
            req.body.userActionDate = Date.now();
        } else {
            return next(
                new AppError(
                    `You can only perform cancel service on user side.`,
                    400
                )
            );
        }
        return next();
    }
);

// get user booked homecare
exports.getUserBookedDeaddictionServices = catchAsync(
    async (req, res, next) => {
        const [books] = await bookDeaddictionCenterModel.aggregate([
            {
                $match: { userId: req.docs._id }
            },

            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $group: {
                                _id: '$hiwpmID',
                                name: { $first: '$name' },
                                phone: { $first: '$phone' },
                                city: { $first: '$city' }
                            }
                        }
                    ],
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            },
            {
                $facet: {
                    active: [
                        {
                            $match: {
                                $or: [
                                    {
                                        status: 'accepted'
                                    },
                                    {
                                        status: 'pending'
                                    }
                                ]
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                $and: [
                                    {
                                        status: { $ne: 'accepted' }
                                    },
                                    {
                                        status: { $ne: 'pending' }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]);
        req.body.books = books;
        return next();
    }
);
