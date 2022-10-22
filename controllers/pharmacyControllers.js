// ============================================================
// import models
const { validate } = require('uuid');
const schedule = require('node-schedule');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const pharmacyCategorieModel = require('../models/Pharmasy/pharmacyCategoriesModel');
const pharmacyMedicinesModel = require('../models/Pharmasy/pharmacyMedicinesModel');
const pharmacyMedicinesListModel = require('../models/Pharmasy/medicineDetails');
const pharmacyMedicineRequesterModel = require('../models/Pharmasy/newPharmacyMedicineRequesterModel');
const pharmacyMedicineRequestModel = require('../models/Pharmasy/newPharmacyMedicineRequestsModel');

// ============================================================
//
// get all pharmacy
exports.getAllPharmacys = factoryControllers.getAllFilter(
    pharmacyCategorieModel
);

// send json for get all filter
exports.sendJsonForGetallFilter = factoryControllers.sendAllFilter();

// assign data for get a medicint
exports.assignDataForCreateMedicines = catchAsync(async (req, res, next) => {
    const date = Date.now();
    const data = await pharmacyMedicinesListModel.find({
        hiwpmmdsID: req.body.medicines
    });
    if (data.length !== req.body.medicines.length) {
        return next(new AppError('Please enter the valid medicines.', 400));
    }
    req.body = await Promise.all(
        req.body.medicines.map(async (el) => {
            const id = await encryptID(process.env.MEDICAL_RECORD_SECRET);
            return {
                createdAt: date,
                hiwpmmmID: id,
                pharmacyID: req.docs._id,
                pharmacyEID: req.docs.hiwpmID,
                medicineEID: el
            };
        })
    );
    console.log(req.body);
    return next();
});

// send json for create one
exports.createNewMedicines = factoryControllers.createOne(
    pharmacyMedicinesModel
);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// assign partner search data
exports.assignPartnerSearch = catchAsync(async (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Pharmacy'
    };
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// get neary by medicsl
exports.getNearByMedcals = catchAsync(async (req, res, next) => {
    let arr = [];
    await Promise.all(
        req.body.medicines.map((el) => {
            arr.push({ medicineEID: el });
        })
    );
    const [medicals, medicine] = await Promise.all([
        partnerModel.aggregate([
            {
                $match: {
                    location: {
                        $geoWithin: {
                            $center: [
                                [req.body.location[1], req.body.location[0]],
                                process.env.PHARMACY_ORDER_DISTANCE / 3963.2
                            ]
                        }
                    },
                    for: 'Pharmacy',
                    status: 'accepted'
                }
            },
            {
                $lookup: {
                    from: 'pharmacy medicines',
                    localField: 'hiwpmID',
                    foreignField: 'pharmacyEID',
                    pipeline: [
                        {
                            $match: {
                                $or: arr
                            }
                        },
                        {
                            $count: 'score'
                        },
                        {
                            $project: {
                                check: {
                                    $cond: {
                                        if: {
                                            $eq: ['$score', arr.length]
                                        },
                                        then: true,
                                        else: false
                                    }
                                }
                            }
                        }
                    ],
                    as: 'partner'
                }
            },
            { $unwind: '$partner' },
            { $match: { 'partner.check': true } }
        ]),
        pharmacyMedicinesListModel
            .find({ hiwpmmdsID: req.body.medicines })
            .select('-createdAt -id')
    ]);
    const id = await encryptID(process.env.MEDICAL_RECORD_SECRET);
    arr = [];
    const requsest = await Promise.all(
        medicals.map(async (el) => {
            const uuid = await encryptID(process.env.MEDICAL_RECORD_SECRET);
            arr.push({
                medicines: medicine,
                partnerId: el._id,
                partnerEId: el.hiwpmID,
                hiwnpmrsmsID: uuid,
                createdAt: Date.now(),
                batch: id
            });
        })
    );
    const requsester = {
        medicines: medicine,
        userId: req.user._id,
        hiwpmrmsID: id,
        createdAt: Date.now()
    };
    await Promise.all([
        pharmacyMedicineRequestModel.create(arr),
        pharmacyMedicineRequesterModel.create(requsester)
    ]);
    return res.json({ status: 'Success' });
});

// get my medicine request
exports.getMyMedicineRequests = catchAsync(async (req, res, next) => {
    const docs = await pharmacyMedicineRequestModel.aggregate([
        {
            $match: {
                partnerId: req.docs._id
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $and: [
                                {
                                    status: { $ne: 'completed' }
                                },
                                {
                                    status: { $ne: 'missed' }
                                }
                            ]
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $or: [
                                {
                                    status: 'completed'
                                },
                                {
                                    status: 'missed'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// assing Data for update status
exports.updateParmacyVendorReceivedRequest = catchAsync(
    async (req, res, next) => {
        const getQuote = await pharmacyMedicineRequestModel.findOne({
            partnerId: req.docs._id,
            hiwnpmrsmsID: req.params.quoteId
        });
        req.body = {};
        const reqs = {};
        if (!getQuote) {
            return next(new AppError('Request not found.', 404));
        }
        const requester = await pharmacyMedicineRequesterModel.findOne({
            hiwpmrmsID: getQuote.batch
        });
        if (!requester) {
            return next(new AppError('Requester not found', 400));
        }
        if (requester.status === 'canceled') {
            return next(new AppError('Request is already canceled.', 400));
        }
        if (req.params.status === 'responded') {
            if (
                getQuote.status !== 'pending' ||
                requester.status !== 'requested'
            ) {
                return next(new AppError(`Invalid request.`, 400));
            }
            req.body.respondedTime = Date.now();
            reqs.status = 'responded';
            reqs.respondedTime = Date.now();
        } else if (req.params.status === 'packed') {
            if (
                getQuote.status !== 'responded' ||
                requester.status !== 'responded'
            ) {
                return next(new AppError(`Invalid request.`, 400));
            }
            req.body.packedTime = Date.now();
        } else if (req.params.status === 'outofdelivery') {
            if (
                getQuote.status !== 'packed' ||
                requester.status !== 'responded'
            ) {
                return next(new AppError(`Invalid request.`, 400));
            }
            req.body.outofdeliveryTime = Date.now();
        } else if (
            req.params.status === 'completed' ||
            requester.status !== 'responded'
        ) {
            if (getQuote.status !== 'outofdelivery') {
                return next(new AppError(`Invalid request.`, 400));
            }
            req.body.completedTime = Date.now();
            reqs.completedTime = Date.now();
            reqs.status = 'completed';
        } else {
            return next(new AppError('Please select the valid status', 400));
        }

        const staus = await Promise.all([
            pharmacyMedicineRequestModel.findByIdAndUpdate(
                getQuote._id,
                { ...req.body, status: req.params.status },
                {
                    runValidators: true
                }
            ),
            pharmacyMedicineRequesterModel.findByIdAndUpdate(
                requester._id,
                reqs,
                { runValidators: true }
            )
        ]);
        if (req.params.status === 'responded')
            await pharmacyMedicineRequestModel.updateMany(
                {
                    batch: getQuote.batch,
                    status: 'pending'
                },
                { status: 'missed' },
                {
                    runValidators: true
                }
            );
        return res.status(200).json({
            status: 'Success'
        });
    }
);

//update quote status
exports.updateUserAQuoteStatus = catchAsync(async (req, res, next) => {
    const status = await pharmacyMedicineRequestModel.findOne({
        hiwnpmrsmsID: req.params.quoteId
    });
    if (!status) {
        return next(new AppError('Request not found.', 404));
    }
    if (status.status === 'canceld') {
        return next(new AppError('This quote is already canceld', 400));
    }
    const reqst = await pharmacyMedicineRequesterModel.findOne({
        hiwpmrmsID: status.batch,
        userId: req.user._id
    });
    if (!reqst) {
        return next(new AppError('Invalid requester', 400));
    }
    if (req.params.status === 'canceled') {
        if (status.status !== 'responded' && status.status !== 'pending') {
            return next(
                new AppError(`You request was already ${status.status}.`, 400)
            );
        }
    } else {
        return next(new AppError('Please select the valid status', 400));
    }
    await pharmacyMedicineRequestModel.findByIdAndUpdate(status._id, {
        status: req.params.status,
        canceledTime: Date.now()
    });
    return res.status(200).json({
        status: 'Success'
    });
});

// update quote status
exports.updatePharmacyRequestStatus = catchAsync(async (req, res, next) => {
    let [request, requester] = await Promise.all([
        pharmacyMedicineRequestModel.find({ batch: req.params.requestId }),
        pharmacyMedicineRequesterModel.findOne({
            hiwpmrmsID: req.params.requestId
        })
    ]);
    if (!requester) {
        return next(new AppError('Request not found', 400));
    }
    if (requester.status === 'completed') {
        return next(new AppError('Request already completed.', 400));
    }
    [request] = await Promise.all([
        request.some(
            (el) =>
                el.status === 'packed' ||
                el.status === 'outofdelivery' ||
                el.status === 'completed'
        )
    ]);
    if (request) {
        return next(new AppError('Invalid request', 400));
    }
    await Promise.all([
        pharmacyMedicineRequestModel.updateMany(
            { batch: req.params.requestId },
            {
                status: 'canceled',
                canceledTime: Date.now()
            }
        ),
        pharmacyMedicineRequesterModel.updateOne(
            {
                hiwpmrmsID: req.params.requestId
            },
            {
                canceledTime: Date.now(),
                status: 'canceled'
            }
        )
    ]);
    return res.status(200).json({ status: 'Success' });
});

// get my pharcy order request
exports.getMyPharmacyOrderRequest = catchAsync(async (req, res, next) => {
    const docs = await pharmacyMedicineRequesterModel.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $and: [
                                {
                                    status: { $ne: 'completed' }
                                },
                                {
                                    status: { $ne: 'canceled' }
                                }
                            ]
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $or: [
                                {
                                    status: 'completed'
                                },
                                {
                                    status: 'canceled'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get a order request
exports.getAPharmacyOrderRequest = catchAsync(async (req, res, next) => {
    const docs = await pharmacyMedicineRequesterModel.aggregate([
        {
            $match: {
                hiwpmrmsID: req.params.orderId,
                userId: req.user._id
            }
        },
        {
            $lookup: {
                from: 'pharmacy medicine requests',
                localField: 'hiwpmrmsID',
                foreignField: 'batch',
                pipeline: [
                    {
                        $match: {
                            $and: [
                                { status: { $ne: 'requested' } },
                                { status: { $ne: 'missed' } },
                                { status: { $ne: 'canceled' } }
                            ]
                        }
                    }
                ],
                as: 'response'
            }
        }
    ]);
    console.log({ hiwpmrmsID: req.params.orderId, userId: req.user._id });
    return res.status(200).json({
        status: 'Success',
        docs
    });
});
