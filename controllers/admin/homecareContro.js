// ============================================================
// import libraries
const mongoose = require('mongoose');
const { v5: uunidv5, v4: uuidv4, validate: uuidValidate } = require('uuid');
let multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');

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
const homecareModel = require('../../models/Homecare/homecareService');
const homecareservicesserviceModel = require('../../models/Homecare/homecaresModel');
const applyHomeCareServiceModel = require('../../models/Homecare/applyHomeCareServiceModel');

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
                for: 'Homecare service',
                status: 'accepted'
            }),
            homecareModel.findOne({ name: req.body.serviceName })
        ]);
        exist = await homecareservicesserviceModel.exists({
            userId: data.userId,
            serviceName: req.body.serviceName
        });
    } else if (req.body.statusType === 'update') {
        [service, serviceName] = await Promise.all([
            homecareservicesserviceModel.findOne({
                hiwhcssms: req.params.serviceId
            }),
            homecareModel.findOne({ name: req.body.serviceName })
        ]);
        [exist, obj, data] = await Promise.all([
            homecareservicesserviceModel.exists({
                userId: service.userId,
                serviceName: req.body.serviceName
            }),
            homecareservicesserviceModel.findOne({
                userId: service.userId,
                hiwhcssms: req.params.serviceId
            }),
            partnerModel.findOne({
                userId: service.userId,
                for: 'Homecare service',
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
    req.body.createdAt = Date.now();
    req.body.userId = data.userId;
    req.body.partnerId = data._id;
    req.body.hiwhcssms = await encryptID(process.env.HEARINGAID_SECRET);
    req.body.serviceType = data.homecare.serviceType;
    req.body.city = data.city;
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };

    req.query.userId = data.userId;
    req.body.createdBy = 'admin';
    req.updateOneSearch = { hiwhcssms: req.params.serviceId };
    return next();
});

// assign data for update homecare's services
exports.assignDataForUpdateHomecareServicess = (req, res, next) => {
    req.seartchQuery = {
        userId: req.query.userId,
        hiwhcssms: req.params.serviceId
    };
    return next();
};

// manage homecare facilities
exports.manageHomecareFacilities = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    if (req.params.type === 'facilities') {
        req.query.objData = {
            'homecare.facilities': {
                $elemMatch: { hiwhcmflsID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'homecare.facilities': { hiwhcmflsID: req.query.serviceId }
        };
        req.query.push = {
            'homecare.facilities': {
                hiwhcmflsID: req.query.serviceId,
                title: req.body.title,
                description: req.body.description
            }
        };
    }

    if (req.params.service !== 'delete' && req.params.service !== 'manage') {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    const a = await partnerModel.updateOne(
        {
            hiwpmID: req.params.partnerId,
            for: 'Homecare service',
            ...req.query.objData
        },
        {
            $pull: { ...req.query.pull }
        }
    );

    if (req.params.service === 'manage') {
        const b = await partnerModel.updateOne(
            {
                hiwpmID: req.params.partnerId,
                for: 'Homecare service'
            },
            {
                $push: {
                    ...req.query.push
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
       
    }
    return res.status(200).json({
        status: 'Success'
    });
});

// // assing data for cancel request
exports.assignDataForCancelHomecareServiceUser = catchAsync(
    async (req, res, next) => {
        const application = await applyHomeCareServiceModel.findOne({
            hiwhcssID: req.params.homecareId
        });
        if (!application) {
            return next(new AppError('No service found', 404));
        }
        req.body.status = req.params.status;

        req.updateOneSearch = {
            hiwhcssID: req.params.homecareId
        };

        if (req.params.status === 'canceled') {
            if (application.status === 'completed') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
            req.body.status = req.params.status;
            req.body.userDescription = req.body.cause;
            req.body.userRespondBy = 'admin';
            req.body.userActionDate = Date.now();
        } else {
            return next(
                new AppError(
                    `You can perfom only cancel service from user side.`,
                    400
                )
            );
        }
        console.log(req.body);
        return next();
    }
);

// assing data for cancel request
exports.assignDataForCancelHomecareServiceVendor = catchAsync(
    async (req, res, next) => {
        const application = await applyHomeCareServiceModel.findOne({
            hiwhcssID: req.params.homecareId
        });
        if (!application) {
            return next(new AppError('No service found', 404));
        }
        req.body.status = req.params.status;
        req.updateOneSearch = {
            hiwhcssID: req.params.homecareId
        };
        if (req.body.status === 'accepted') {
            if (application.status !== 'pending') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
             req.body.vendorDescription = req.body.cause;
             req.body.vendorRespondBy = 'admin';
             req.body.vendorActionDate = Date.now();
        } else if (req.body.status === 'rejected') {
            if (
                application.status !== 'pending' &&
                application.status !== 'accepted'
            ) {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
            req.body.vendorDescription = req.body.cause;
            req.body.vendorRespondBy = 'admin';
            req.body.vendorActionDate = Date.now();
        } else if (req.body.status === 'canceled') {
            return next(
                new AppError(
                    "You cant't able perform this action on vendor side. do it with use side.",
                    400
                )
            );
        } else if (req.body.status === 'completed') {
            if (application.status !== 'accepted') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
            req.body.vendorDescription = req.body.cause;
            req.body.vendorRespondBy = 'admin';
            req.body.vendorActionDate = Date.now();
        } else {
            return next(new AppError(`Please select the valid status.`, 400));
        }
        return next();
    }
);

// get user booked homecare
exports.getUserBookedHomecareServices = catchAsync(async (req, res, next) => {
    const [books] = await applyHomeCareServiceModel.aggregate([
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
                            phone: { $first: '$phone' }
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
});
