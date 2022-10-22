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
const ambulanceServiceModel = require('../../models/AmbulanceAlert/AmbulanceServiceModel');
const ambulanceQuotesBookingModel = require('../../models/AmbulanceAlert/ambulanceQuotesModel');

// Ambulance serivce

// mangae ambulance services and drivers
exports.updateAmbulaceServices = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    if (req.params.type === 'services') {
        const services = await ambulanceServiceModel.find().distinct('name');

        const [filterValue] = await Promise.all([
            req.body.services.every((v) => services.includes(v))
        ]);
        if (!filterValue) {
            return next(
                new AppError('Please select the valid ambulance services.', 400)
            );
        }
        req.query.objData = {
            'ambulance.ambulanceService': {
                $elemMatch: { hiwpmasasssID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'ambulance.ambulanceService': {
                hiwpmasasssID: req.query.serviceId
            }
        };
        req.query.push = {
            'ambulance.ambulanceService': {
                hiwpmasasssID: req.query.serviceId,
                ambulanceNumber: req.body.ambulanceNumber,
                location: {
                    type: 'Point',
                    coordinates: [req.body.longitude, req.body.latitude]
                },
                services: req.body.services,
                creatdBy: 'admin'
            }
        };
    } else if (req.params.type === 'drivers') {
        req.query.objData = {
            'ambulance.driverDetails': {
                $elemMatch: { hiwaddusID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'ambulance.driverDetails': {
                hiwaddusID: req.query.serviceId
            }
        };
        req.query.push = {
            'ambulance.driverDetails': {
                hiwaddusID: req.query.serviceId,
                name: req.body.name,
                createdBy: 'admin',
                phone: req.body.phone,
                driverProfile: req.body.driverProfile
            }
        };
    }
    const a = await partnerModel.findOneAndUpdate(
        {
            hiwpmID: req.params.vendorId,
            ...req.query.objData
        },
        {
            $pull: { ...req.query.pull }
        }
    );

    if (
        req.params.type === 'drivers' &&
        req.body.driverProfile === 'undefined'
    ) {
        [[req.body.driverProfile]] = await Promise.all([
            a.ambulance.driverDetails.filter(
                (el) => el.hiwaddusID === req.query.serviceId
            )
        ]);
        req.body.driverProfile = req.body.driverProfile.driverProfile;
        req.query.push = {
            'ambulance.driverDetails': {
                hiwaddusID: req.query.serviceId,
                name: req.body.name,
                createdBy: 'admin',
                phone: req.body.phone,
                driverProfile: req.body.driverProfile
            }
        };
    }

    if (req.params.service === 'manage') {
        const b = await partnerModel.updateOne(
            {
                hiwpmID: req.params.vendorId
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

// assign data for get ambulance seercice
exports.assignDataToFindVendorAmbulanceBooking = (req, res, next) => {
    req.searchQuery = { providerEID: req.params.vendorId };
    return next();
};

// get all data in ambulance in booking
exports.getBookingSlots = factoryControllers.findAllData(
    ambulanceQuotesBookingModel
);

// send json for get find all the data
exports.sendJsonForAll = factoryControllers.sendJsonForAll();

// set image size for driver profile
exports.setDriverProfileSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${Math.floor(Date.now() * Math.random() * 93434 * 12)}`}`
        .split('-')
        .join('')}-ambulance-driver`;
    req.image.name = 'driverProfile';
    return next();
};

// assign data for update new status from vendor
exports.assignDataForServiceProvidersFromUser = catchAsync(
    async (req, res, next) => {
        const quote = await ambulanceQuotesBookingModel.findOne({
            hiwnrqID: req.params.quoteId
        });

        if (req.params.status === 'accepted') {
            if (quote.status !== 'responded') {
                return next(
                    new AppError(
                        `This request was already ${quote.status}.So we cant able to accept you request.`
                    )
                );
            }

            req.body.status = req.params.status;
            req.body.userRespondDescription = req.body.description;
            req.body.quoteAmount = req.body.quote;
            req.body.userRespondedBy = 'admin';
            req.body.userRespondTime = Date.now();
        } else if (req.params.status === 'rejected') {
            if (quote.status !== 'responded' && quote.status !== 'accepted') {
                return next(
                    new AppError(
                        `This request was alreaddy ${quote.status}.So we can't accept this request.`,
                        400
                    )
                );
            }
            req.body.status = req.params.status;
            req.body.userRespondDescription = req.body.description;
            req.body.quoteAmount = req.body.quote;
            req.body.userRespondedBy = 'admin';
            req.body.userRespondTime = Date.now();
        } else if (
            req.params.status === 'responded' ||
            req.params.status === 'requested' ||
            req.params.status === 'completed'
        ) {
            return next(
                new AppError(
                    `You can't able to perform this action from user side side.do it form vendor side page.`
                )
            );
        } else if (req.params.status === 'canceled') {
            return next(
                new AppError(
                    `You can't perform cancel option on single quote.Try quote batch`,
                    400
                )
            );
        } else {
            return next(new AppError('Please select the valid status.', 400));
        }
        req.updateByIdQuery = quote._id;
        req.updateQuery = req.body;
        return next();
    }
);
// assign data for update new status from vendor
exports.assignDataForServiceProvers = catchAsync(async (req, res, next) => {
    const quote = await ambulanceQuotesBookingModel.findOne({
        hiwnrqID: req.params.quoteId
    });

    if (req.params.status === 'responded') {
        if (quote.status !== 'requested') {
            return next(
                new AppError(
                    `This request was already ${quote.status}.So we cant able to accept you request.`
                )
            );
        }

        if (isNaN(req.body.quote)) {
            return next(
                new AppError('Please select the valid quote amount.', 400)
            );
        }
        req.body.status = req.params.status;
        req.body.vendorRespondDescription = req.body.description;
        req.body.quoteAmount = req.body.quote;
        req.body.respondedBy = 'admin';
        req.body.providerResponstTime = Date.now();
    } else if (
        req.params.status === 'accepted' ||
        req.params.status === 'rejected' ||
        req.params.status === 'canceled'
    ) {
        return next(
            new AppError(
                `You can't able to perform this action from vendor side.do it form user page.`
            )
        );
    } else if (req.params.status === 'completed') {
        if (quote.status !== 'accepted') {
            return next(
                new AppError(
                    `This request was already ${quote.status}.So we cant able to accept you request.`
                )
            );
        }
        req.body.status = req.params.status;
        req.body.completedBy = 'admin';
        req.body.completedTime = Date.now();
        req.body.fulfillDescription = req.body.description;
    }
    req.updateByIdQuery = quote._id;
    req.updateQuery = req.body;
    return next();
});

// update ambulance  quotes
exports.updateAmbulanceQuotes = factoryControllers.updateById(
    ambulanceQuotesBookingModel
);

// send json for update one
exports.sendJsonForUpdateById = factoryControllers.sendJsonForUpdatedById();

// get all booked data
exports.getUsersBookedData = catchAsync(async (req, res, next) => {
    const [quotes] = await ambulanceQuotesBookingModel.aggregate([
        {
            $match: {
                userId: req.docs._id
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $or: [
                                {
                                    status: 'requested'
                                },
                                {
                                    status: 'responded'
                                },
                                {
                                    status: 'accepted'
                                }
                            ]
                        }
                    },

                    {
                        $group: {
                            _id: '$batch',
                            list: {
                                $push: '$$ROOT'
                            }
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $and: [
                                {
                                    status: { $ne: 'requested' }
                                },
                                {
                                    status: { $ne: 'responded' }
                                },
                                {
                                    status: { $ne: 'accepted' }
                                }
                            ]
                        }
                    },

                    {
                        $group: {
                            _id: '$batch',
                            list: {
                                $push: '$$ROOT'
                            }
                        }
                    }
                ]
            }
        }
    ]);
    req.body.quotes = quotes;
    return next();
});

// assign data for canel all quote
exports.assignDatafoCancelAQuotes = (req, res, next) => {
    req.updateAllSearchQuery = {
        batch: req.params.quoteId,
        status: { $ne: 'completed' }
    };

    req.updateAllData = {
        status: 'canceled',
        canceledBy: 'admin',
        cancelDescription: Object.keys(req.body)[0]
    };
    return next();
};

// update all the ambulance quote
exports.updateAllAmbulanceQuotes = factoryControllers.updateAll(
    ambulanceQuotesBookingModel
);

// send json for update all
exports.sendJsonForUpdateAll = factoryControllers.sendJsonForUpdateAll();
