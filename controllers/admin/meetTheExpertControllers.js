// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import controllers
const factoryController = require('../factoryControllers');
// ============================================================
// import utilities
const AppError = require('../../util/AppError');
const catchAsync = require('../../util/catchAsync');
const encryptID = require('../../util/uuid');

// ============================================================
// import modles
const partnerModel = require('../../models/shared/partnerModel');
const expertServiceModel = require('../../models/MeetTheExperts/meetTheExpertServiceProvidersModel');
const expertService = require('../../models/MeetTheExperts/meetTheExpert');
const bookExpertServiceModel = require('../../models/MeetTheExperts/bookMeetTheExpertsModel');
// manage hospital package
exports.manageMeetTheExpertServicesServices = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
        req.params.type = 'facilities';
        if (req.params.type === 'facilities') {
            req.query.objData = {
                'meettheExperts.fecilities': {
                    $elemMatch: { hiwmtefssID: req.query.serviceId }
                }
            };
            if (!req.query.serviceId || !uuiddetails) {
                req.query.serviceId = await encryptID(
                    process.env.JOP_PORTAL_SECRET
                );
                req.query.objData = {};
            }
            req.query.pull = {
                'meettheExperts.fecilities': {
                    hiwmtefssID: req.query.serviceId
                }
            };
            req.query.push = {
                'meettheExperts.fecilities': {
                    hiwmtefssID: req.query.serviceId,
                    title: req.body.title,
                    description: req.body.description
                }
            };
        }
        if (req.params.service === 'manage') {
            const a = await partnerModel.updateOne(
                {
                    hiwpmID: req.params.vendorId,
                    for: 'Meet the Expert',
                    ...req.query.objData
                },
                {
                    'meettheExperts.fecilities.$[id]': {
                        hiwmtefssID: req.query.serviceId,
                        title: req.body.title,
                        description: req.body.description
                    }
                },
                {
                    arrayFilters: [{ 'id.hiwmtefssID': req.query.serviceId }]
                }
            );
        }
        if (req.params.service === 'delete') {
            const b = await partnerModel.updateOne(
                {
                    hiwpmID: req.params.vendorId,
                    for: 'Meet the Expert'
                },
                {
                    $pull: { ...req.query.pull }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }
        // {
        //     $pull: { ...req.query.pull }
        // }
        if (req.params.service === 'create') {
            const b = await partnerModel.updateOne(
                {
                    hiwpmID: req.params.vendorId,
                    for: 'Meet the Expert'
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
            console.log(b);
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// set image size for Expert service
exports.setExpertServiceProfileSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    req.image.name = 'serviceImage';
    return next();
};

// set image name
exports.setImageName = (req, res, next) => {
    req.image.imagename = `${`${`${req.body.userId
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.body.hiwmtespsID.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}expert-service-image`;
    return next();
};
// set image name
exports.setUpdatImageName = (req, res, next) => {
    req.image.imagename = `${`${`${req.body.userId
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}expert-service-image`;
    return next();
};

// create new expert services
exports.createNewExpertServices =
    factoryController.createOne(expertServiceModel);

// send json for create one
exports.sendJsonForCreateOne = factoryController.sendJson();

// // assing data for cancel request

// get user booked expert
exports.getUserBookedExpertServices = catchAsync(async (req, res, next) => {
    const [books] = await bookExpertServiceModel.aggregate([
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
    console.log(books);
    req.body.books = books;
    return next();
});

// // assing data for cancel request
exports.assignDataForExpertServiceUser = catchAsync(async (req, res, next) => {
    const application = await bookExpertServiceModel.findOne({
        hiwmthebsID: req.params.expertId
    });
    if (!application) {
        return next(new AppError('No service found', 404));
    }
    req.body.status = req.params.status;

    req.updateOneSearch = {
        hiwmthebsID: req.params.expertId
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
    return next();
});
// update expert staus
exports.updateExpertStatus = factoryController.updateOne(
    bookExpertServiceModel
);

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();
