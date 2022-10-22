// ============================================================
// import packages

// ============================================================
// import models
const workoutModel = require('../models/Fitness/workoutModel');
const partnerModel = require('../models/shared/partnerModel');
const gymModel = require('../models/Fitness/gymModel');
const goalsModel = require('../models/Fitness/setGoals');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import util
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const differentlyabledProductModel = require('../models/HearingAID/createDifferentlyAbledProductModel');
const orderDifferentlyAbledProductModel = require('../models/HearingAID/orderDifferentlyAbledProduct');

// filter new blood bank data
exports.filterDifferentlyAbledData = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'name',
            'phone',
            'centerPhone',
            'centerLandLine',
            'location',
            'openTime',
            'closeTime',
            'address',
            'serviceType',
            'city'
        )
    ]);

    return next();
});

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Differently Abled'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.userId = req.user._id;

    req.body = { $set: req.body };
    return next();
};

// assign data for find partner sseearch data
exports.assignDataForFindPartnerData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Differently Abled'
    };
    req.body.userId = req.user._id;
    return next();
};

// update differently abled porduct
exports.updateDifferentlyAbled = factoryControllers.updateOne(partnerModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

/// assign partner search data for differently abled
exports.assignPartnerSearchDataForDifferently = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Differently Abled'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// get-product data
exports.getDifferentlyAbledProducts = catchAsync(async (req, res, next) => {
    const [products, [product]] = await Promise.all([
        differentlyabledProductModel.find({
            userId: req.user._id,
            partnerId: req.docs._id
        }),
        orderDifferentlyAbledProductModel.aggregate([
            {
                $match: {
                    partnerId: req.docs._id
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    pipeline: [{ $project: { name: 1, phone: 1 } }],
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $facet: {
                    active: [
                        {
                            $match: {
                                $and: [
                                    {
                                        orderStatus: { $ne: 'delivered' }
                                    },
                                    { status: 'pending' }
                                ]
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                $and: [
                                    {
                                        orderStatus: 'delivered'
                                    },
                                    { status: 'delivered' }
                                ]
                            }
                        }
                    ]
                }
            }
        ])
    ]);

    req.body.products = products;
    req.body.orders = product;
    return next();
});

// set service images name
exports.serviceImagePropertiesForDiff = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    req.image.gallery = 'imageGallery';

    return next();
};

// assign partner id
exports.assignPartnerIdDifferentlyabled = catchAsync(async (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.userId = req.user._id;
    if (req.body.statusType === 'create') {
        req.body.hiwhapdpID = await encryptID(process.env.HEARINGAID_SECRET);
        req.body.createdAt = Date.now();
    }
    return next();
});

// set image name
exports.assignImageNameForHearingaidService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhapdpID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-differently-abled-bannerimage`;
        req.image.galleryName = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhapdpID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-differently-abled-gallery`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwhapdpID: req.params.productId };
    if (!req.image.image && !req.image.imageGallery) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.productId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-differently-abled-bannerimage`;
    req.image.galleryName = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.productId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-differently-abled-gallery`;
    return next();
};

// create new differenly abled proudct
exports.createNewDifferenlyAbledProuct = factoryControllers.createOne(
    differentlyabledProductModel
);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// assign partner search data
exports.assignValidPartnerSearchDataAnd = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhapdpID: req.params.productId
    };
    return next();
};

// update home care service
exports.updateDifferentlyabledService = factoryControllers.updateOne(
    differentlyabledProductModel
);

// assign data for update the differently product order status
exports.assignDataforUpdateDifferentlyProductStatus = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            partnerId: req.docs._id,
            hiwdaposID: req.params.orderId
        };
        const order = await orderDifferentlyAbledProductModel.findOne({
            partnerId: req.docs._id,
            hiwdaposID: req.params.orderId
        });
        if (!order) {
            return next(new AppError('Product not found', 404));
        }
        let status = req.params.status;
        const obj = {};
        if (status === 'accepted') {
            if (order.orderStatus !== 'placed' || order.status !== 'pending') {
                return next(
                    new AppError(
                        `This order is already ${order.orderStatus}. So, we can't accept your request.`
                    )
                );
            }
            obj.acceptedDate = Date.now();
        } else if (status === 'rejected') {
            if (
                (order.orderStatus !== 'accepted' &&
                    order.orderStatus !== 'placed') ||
                order.status !== 'pending'
            ) {
                return next(
                    new AppError(
                        `This order is already ${order.orderStatus}. So, we can't accept your request.`
                    )
                );
            }
            obj.status = 'rejected';
            obj.rejectedDate = Date.now();
        } else if (status === 'shipped') {
            if (
                order.orderStatus !== 'accepted' ||
                order.status !== 'pending'
            ) {
                return next(
                    new AppError(
                        `This order is already ${order.orderStatus}. So, we can't accept your request.`
                    )
                );
            }
            obj.shippedDate = Date.now();
        } else if (status === 'outofdelivery') {
            if (order.orderStatus !== 'shipped' || order.status !== 'pending') {
                return next(
                    new AppError(
                        `This order is already ${order.orderStatus}. So, we can't accept your request.`
                    )
                );
            }
            obj.outOfDeliveryDate = Date.now();
        } else if (status === 'delivered') {
            if (
                order.orderStatus !== 'outofdelivery' ||
                order.status !== 'pending'
            ) {
                return next(
                    new AppError(
                        `This order is already ${order.orderStatus}. So, we can't accept your request.`
                    )
                );
            }
            obj.deliveredDate = Date.now();
            obj.status = 'delivered';
        } else {
            return next(new AppError('Please select valid status.', 400));
        }
        req.body = { orderStatus: status, ...obj };
        return next();
    }
);

// update differnly abled product order
exports.updateDifferentlyAbledProductOrder = factoryControllers.updateOne(
    orderDifferentlyAbledProductModel
);

// // assing data for differetnly order
exports.assignDataForDifferentlyOrderStatus = catchAsync(
    async (req, res, next) => {
        const application = await orderDifferentlyAbledProductModel.findOne({
            hiwdaposID: req.params.orderId
        });
        if (!application) {
            return next(new AppError('No service found', 404));
        }
        req.body.status = req.params.status;
        req.updateOneSearch = {
            hiwdaposID: req.params.orderId
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
            req.body.status = 'canceled';
            req.body.cancelDescription = req.body.cause;
            req.body.userRespondBy = 'admin';
            req.body.canceledDate = Date.now();
        } else {
            return next(
                new AppError(
                    `You can perfom only cancel service from user side.`,
                    400
                )
            );
        }

        return next();
    }
);

// get all differently abled products
exports.getAllDifferentlyAbledProducts = catchAsync(async (req, res, next) => {
    const diff = await differentlyabledProductModel.aggregate([
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            status: 'accepted',
                            for: 'Differently Abled'
                        }
                    },
                    {
                        $project: {
                            __v: 1,
                            _id: 0
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: diff
    });
});

// get a differently abled product
exports.getADifferentlyAbledProduct = catchAsync(async (req, res, next) => {
    const diff = await differentlyabledProductModel.aggregate([
        {
            $match: {
                hiwhapdpID: req.params.productId
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            status: 'accepted',
                            for: 'Differently Abled'
                        }
                    },
                    {
                        $project: {
                            __v: 1,
                            _id: 0
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        }
    ]);
    if (!diff) {
        return next(new AppError('Product not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs: diff
    });
});
