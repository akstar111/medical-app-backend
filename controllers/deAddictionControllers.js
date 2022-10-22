// ============================================================
// import libraries
const { v5: uunidv5, v4: uuidv4, validate: uuidValidate } = require('uuid');
const { default: mongoose } = require('mongoose');
let multer = require('multer');
const AWS = require('aws-sdk');
var twelve = require('twentyfour-to-twelve');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const deaddictionModel = require('../models/Deaddiction/createDeaddictionModel');
const applydeaddictionModel = require('../models/Deaddiction/bookDeaddictionCenterModel');
const deaddictionReviewModel = require('../models/Deaddiction/deaddictionReview');
const bookDeaddictionCenterModel = require('../models/Deaddiction/bookDeaddictionCenterModel');
const jobPortalModel = require('../models/JopPortal/postJobModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const deaddicationServiceModel = require('../models/Deaddiction/deAddictionServicesModel');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const sharp = require('sharp');

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'De-Addiction service'
    };
    req.body.userId = req.user._id;

    return next();
};

// assign partner id

exports.assignandverifyPartnerId = catchAsync(async (req, res, next) => {
    const [partner, service] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'De-Addiction service'
        }),
        deaddicationServiceModel.exists({ name: req.body.serviceName })
    ]);

    if (!partner) {
        return next(
            new AppError('Please verify or create partner service.', 400)
        );
    }
    if (!service) {
        return next(new AppError('Please select the valid service name', 400));
    }
    if (!req.body.location || req.body.location.length !== 2) {
        return next(new AppError('Please select the valid location.', 400));
    }
    req.body.partnerId = partner._id;
    req.body.userId = req.user._id;
    req.body.hiwdacmID = await encryptID(process.env.HOMECARE_SECRET);
    req.body.createdAt = Date.now();
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
});

// assign partner search data
exports.assignValidPartnerSearchData = catchAsync(async (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'De-Addiction service'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.userId = req.user._id;
    // req.body.createdAt = Date.now();
    req.body = { $set: req.body };
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// create new service
exports.createNewService = factoryController.createOne(deaddictionModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// ============================================================
// home care application

// assign home care serive application search Query
exports.assignDeAddictionSearchQuery = catchAsync(async (req, res, next) => {
    const deaddiction = await deaddictionModel.findOne({
        hiwdacmID: req.params.serviceid
    });
    if (!deaddiction) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }

    req.body.deaddictionEId = req.params.serviceid;
    req.body.deAddiction = deaddiction;
    req.searchQuery = { _id: deaddiction.partnerId };

    return next();
});

// get data for home care serive
exports.checkValidPartner = factoryController.findOne(partnerModel);

// assign data for homecare service
exports.assignDeaddictionSaveQuery = catchAsync(async (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.hiwbdacns = await uunidv5(
        process.env.DEADDICTION_SECRET,
        uuidv4()
    );
    req.body.deAddictionId = req.body.deAddiction._id;
    req.body.deaddictionCenterDetails = {
        priceFrom: req.body.deAddiction.priceFrom,
        priceTo: req.body.deAddiction.priceTo,
        description: req.body.deAddiction.description,
        serviceName: req.body.deAddiction.serviceName,
        location: req.body.deAddiction.location
    };
    req.body.deaddictionEId = req.body.deAddiction.hiwdacmID;
    req.body.partnerId = req.docs._id;
    req.body.createdAt = Date.now();
    req.docs = {};
    return next();
});

// create new application for service
exports.createNewDeaddictionApplicants = factoryController.createOne(
    applydeaddictionModel
);

// send Json for application for service
exports.sendServiceJson = factoryController.sendJson();

// update home care service
exports.updateDeaddictionCenter = factoryController.updateOne(partnerModel);

// delete homecare service
exports.deleteDeaddictionService = catchAsync(async (req, res, next) => {
    await Promise.all([
        deaddictionModel.deleteOne({
            hiwdacmID: req.params.serviceid,
            userId: req.user._id
        }),
        applydeaddictionModel.deleteMany({
            deaddictionEId: req.params.serviceid,
            partnerId: req.docs._id
        })
    ]);

    return next();
});

// assign data for get all service
exports.assignGetAllServiceData = async (req, res, next) => {
    req.aggregateFilterQuery = [
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $project: {
                            city: 1
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
            $replaceRoot: { newRoot: { $mergeObjects: ['$partner', '$$ROOT'] } }
        },
        { $project: { partner: 0 } }
    ];

    return next();
};

// get all data via filter
exports.getAllDeaddictionCenter =
    factoryController.getAllFilter(deaddictionModel);

exports.sendAllFilterDataJson = factoryController.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwdacmID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -deAddictionId'
        }
    ];
    return next();
};

// find data by id
exports.findServiceById =
    factoryController.findOneWithPopulate(deaddictionModel);

// send json for find by id
exports.sendJsonForId = factoryController.sendJsonForAPopulate();

// assign data for Expert reivews
exports.assingDeAddictionReviewData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        deAddictionId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            deAddictionId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createDeaddictionReview = factoryController.upsertOne(
    deaddictionReviewModel
);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await deaddictionReviewModel.aggregate([
        {
            $match: {
                deAddictionId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$deAddictionId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await deaddictionModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].length
            }
        );
    } else {
        await deaddictionModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            }
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assing data for cancel request
exports.assignDataForCancelDeaddictionService = (req, res, next) => {
    const bodydata = req.body.cause;
    req.body = {};
    req.body.status = 'canceled';
    req.body.cause = bodydata;
    req.updateOneSearch = {
        hiwbdacns: req.params.serviceId,
        userId: req.user._id
    };
    return next();
};

// cancel homecare service request
exports.cancelDeaddictionService = factoryController.updateOne(
    applydeaddictionModel
);

// send json status of homecare cancel requiest
exports.sendJsonForDeaddictionCancelRequest =
    factoryController.sendJsonForUpdateOne();

// assign data for get a services
exports.assignDataForGetServices = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.selectedData = 'services';
    return next();
};
// assign data for get a faciliteis
exports.assignDataForGetFeciliteis = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.selectedData = 'fecilities';
    return next();
};

// get services with selected data
exports.getDeaddictionCenteWithSelectedData =
    factoryController.findOneWithSelectedData(deaddictionModel);

// exprots.prevent from showing unwanted data to clident
exports.preventLeakingGetService = async (req, res, next) => {
    req.docs = filerDataFromRequest(req.docs, 'services');
    return next();
};

// exprots.prevent from showing unwanted data to clident
exports.preventLeakingGetFacilities = async (req, res, next) => {
    req.docs = filerDataFromRequest(req.docs, 'fecilities');
    return next();
};
// send json for find wone wiht selected data
exports.sendJsonForSelectedData = factoryController.sendJsonForSelectedData();

// deaddiction controllers
exports.updateDeaddicationService = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        services: { $elemMatch: { hiwdacslsID: req.query.serviceId } }
    };
    if (!req.query.serviceId || !uuiddetails) {
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    // if (req.params.service === 'update' || req.params.service === 'delete') {
    const a = await deaddictionModel.updateOne(
        {
            userId: req.user._id,
            ...req.query.objData
        },
        {
            $pull: { services: { hiwdacslsID: req.query.serviceId } }
        }
    );
    req.query.objData = {};
    // }

    if (req.params.service === 'update' || req.params.service === 'create') {
        const b = await deaddictionModel.updateOne(
            {
                userId: req.user._id,
                ...req.query.objData
            },
            {
                $push: {
                    services: {
                        hiwdacslsID: req.query.serviceId,
                        serviceName: req.body.serviceName,
                        serviceDescription: req.body.serviceDescription,
                        priceFrom: req.body.priceFrom,
                        priceTo: req.body.priceTo,
                        serviceImage: req.body.serviceImage
                    }
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
// deaddiction controllers
exports.updateDeaddicationFacilities = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.facilitieId ?? 0);
    console.log(req.query.facilitieId);
    req.query.objData = {
        'deaddiction.fecilities': {
            $elemMatch: { hiwdacfls: req.query.facilitieId }
        }
    };
    if (!req.query.facilitieId || !uuiddetails) {
        req.query.facilitieId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    if (req.params.service === 'manage' || req.params.service === 'delete') {
        const a = await partnerModel.updateOne(
            {
                userId: req.user._id,
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
    if (req.params.service === 'manage' || req.params.service === 'create') {
        const b = await partnerModel.updateOne(
            {
                userId: req.user._id,
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
});

// get a hospital package
exports.assignDataForGetAHospitalPackage = catchAsync(
    async (req, res, next) => {
        const [center] = await deaddictionModel.aggregate([
            {
                $match: {
                    hiwdacmID: req.params.centerId
                }
            },
            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            }
        ]);
        if (!center) {
            return next(
                new AppError(
                    'This deaddction center is no longer available.',
                    404
                )
            );
        }
        if (center.partner.status !== 'accepted') {
            return next(
                new AppError('Something went wrong with this center.', 401)
            );
        }

        return res.status(200).json({
            status: 'Success',
            docs: center
        });
    }
);

// assign data for booking slot
exports.verifyandGetDataofBooking = catchAsync(async (req, res, next) => {
    const [booking] = await partnerModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                status: 'accepted',
                for: 'De-Addiction service'
            }
        },
        {
            $lookup: {
                from: 'book de-addiction centers',
                localField: '_id',
                foreignField: 'partnerId',
                pipeline: [
                    {
                        $match: { deaddictionEId: req.params.addictionCenterId }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            name: { $first: 'name' },
                            phone: { $first: 'phone' },
                            problem: { $first: 'problem' },
                            createdAt: { $first: 'createdAt' },
                            deaddictionEId: { $first: 'deaddictionEId' },
                            status: { $first: 'status' },
                            hiwbdacns: { $first: '$hiwbdacns' }
                        }
                    }
                ],
                as: 'bookingList'
            }
        }
    ]);
    console.log(JSON.stringify(booking));
    req.docs = await Promise.all(
        booking.bookingList.map((el) => {
            return filerDataFromRequest(
                el,
                'name',
                'phone',
                'problem',
                'createdAt',
                'deaddictionEId',
                'status',
                'hiwbdacns'
            );
        })
    );
    return res.status(200).json({
        status: 'Success',
        docs: req.docs
    });
});

// verify and book deaddiction center
exports.verifyandBookDeaddictionCenter = catchAsync(async (req, res, next) => {
    if (req.body.status === 'accepted') {
        req.body.scheduledTime = twelve(req.body.scheduledTime);

        const regex = /^([0]\d|[1][0-2]):([0-5]\d)\s?(?:AM|PM)$/i;
        if (!regex.test(req.body.scheduledTime)) {
            return next(
                new AppError('Please select the proper data time to schedule')
            );
        }
    }
    const [center, [slot]] = await Promise.all([
        deaddictionModel.findOne({
            userId: req.user._id,
            hiwdacmID: req.params.addictionCenterId
        }),
        bookDeaddictionCenterModel.aggregate([
            {
                $match: {
                    deaddictionEId: req.params.addictionCenterId,
                    hiwbdacns: req.params.bookingId
                }
            },
            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partner'
                }
            },
            {
                $unwind: '$partner'
            }
        ])
    ]);

    if (!center) {
        return next(
            new AppError(
                'Something went wrong while process whiel processing your request.',
                401
            )
        );
    }

    if (!slot || slot?.partner?.status !== 'accepted') {
        return next(
            new AppError(
                'Are you sure your are valide partner or verified vendor',
                401
            )
        );
    }
    req.updateOneSearch = {
        partnerId: slot.partner._id,
        hiwbdacns: req.params.bookingId
    };
    req.body = filerDataFromRequest(
        req.body,
        'status',
        'cause',
        'scheduledTime',
        'scheduledDate'
    );
    req.body.actionDate = Date.now();
    req.body.vendorDescription = req.body.cause;
    req.body.vendorActionDate = req.body.actionDate;
    return next();
});

// update deaddiction center
exports.updateBookDeaddictionCenter = factoryController.updateOne(
    bookDeaddictionCenterModel
);

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, deaddication] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'De-Addiction service'
        }),
        deaddictionModel.findOne({
            userId: req.user._id,
            hiwdacmID: req.params.serviceId
        })
    ]);
    if (!partner || !deaddication) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.deaddicationId = deaddication._id;
    req.body.deaddicationEID = deaddication.hiwdacmID;
    req.body.parentEID = deaddication.hiwdacmID;
    req.body.partnerId = partner._id;
    req.body.availablity = deaddication.availablity;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'De-Addiction service',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};
// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'De-Addiction service',
        hiwnadmID: req.params.adId
    };
    return next();
};

// create new quote
exports.getDataForQuoteFromDeaddiction = catchAsync(async (req, res, next) => {
    const docs = await Promise.all(
        req.body.map(async (el) => {
            const uuid = await encryptID(process.env.MEDICAL_MARKET_SECRET);

            const datas = await medicalMarketProductsModel.aggregate([
                {
                    $match: {
                        productStream: el.productName
                    }
                },
                {
                    $group: { _id: '$partnerId' }
                },
                {
                    $lookup: {
                        from: 'partners',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'partners'
                    }
                },
                {
                    $unwind: '$partners'
                },
                {
                    $match: { 'partners.status': 'accepted' }
                },
                {
                    $group: {
                        _id: '$partners._id'
                    }
                }
            ]);

            return await Promise.all(
                datas.map(async (els) => {
                    console.log(els);
                    const reqs = {
                        productName: el.productName,
                        proposalDate: el.proposalDate,
                        productDescription: el.productDescription,
                        quantity: el.quantity,
                        hiwmmqrrsID: await encryptID(
                            process.env.MEDICAL_MARKET_SECRET
                        ),
                        userId: req.user._id,
                        for: uuid,
                        from: 'De-Addiction service',
                        requestPartner: els._id,
                        createdAt: Date.now()
                    };
                    return await Promise.all([
                        medicalMarketQuoteRequesterModel.create(reqs)
                    ]);
                })
            );
        })
    );

    const check = docs.some((el) => !!el);
    if (!check) {
        return next(
            new AppError('No related vendors found in your serach', 404)
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// cancel requester request
exports.assignDataForCancelReques = catchAsync(async (req, res, next) => {
    req.updateAllSearchQuery = {
        for: req.params.quoteId,
        userId: req.user._id,
        from: 'De-Addiction service'
    };
    req.updateAllData = {
        proposeStatus: 'canceled',
        userActionDate: Date.now()
    };
    return next();
});

// get my active quotes

// respont quote status
exports.assignDataForQuotesRequests = (req, res, next) => {
    req.updateOneSearch = {
        hiwmmqrrsID: req.params.quoteId,
        userId: req.user._id,
        from: 'De-Addiction service',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'De-Addiction service'
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'requestPartner',
                foreignField: '_id',
                as: 'partners'
            }
        },
        {
            $unwind: '$partners'
        },
        {
            $project: {
                _id: 1,
                productName: 1,
                proposalDate: 1,
                productDescription: 1,
                quantity: 1,
                proposeStatus: 1,
                createdAt: 1,
                'partners.name': 1
            }
        }
    ]);
    quotes = await Promise.all(
        quotes.map((el) => {
            return { ...el, _id: undefined };
        })
    );
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'De-Addiction service';
    return next();
};

// assign data for get my qutoes
exports.assignDataForGetMyQuotes = (req, res, next) => {
    req.body = { from: 'De-Addiction service' };
    return next();
};

// assign data for create new deaddiction services
exports.assignDataForCreateDeaddictionService = catchAsync(
    async (req, res, next) => {
        req.body.hiwdasmID = await uunidv5(
            process.env.HOMECARE_SECRET,
            uuidv4()
        );
        req.body.createdAt = Date.now();
        return next();
    }
);

// create new deaddication serives
exports.createNewHomeCareService = factoryController.createOne(
    deaddicationServiceModel
);

// get all homecare service
exports.getAllDeaddicationServices = factoryController.getAll(
    deaddicationServiceModel
);

// send json for get all data
exports.sendJsonAllData = factoryController.sendJsonForFindAll();

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await deaddicationServiceModel.findOne({
        hiwdasmID: req.params.serviceId
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

// assign data for update deaddiction service
exports.assignDataForUpdateDeaddicationService = (req, res, next) => {
    req.updateOneSearch = { hiwdasmID: req.params.serviceId };
    return next();
};

// // update homecare service
// exports.updateDeaddictionServices = factoryController.updateOne(
//     deaddicationServiceModel
// );

// assign data for update all homecare services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};

// update other deaddication service data
exports.updateRemainingDeaddicationServices =
    factoryController.updateAll(deaddictionModel);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });

// get deaddiction
exports.getPartneraService = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'De-Addiction service',
            status: 'accepted'
        })
    ]);
    console.log(req.user._id);
    if (!partner) {
        return next(
            new AppError(
                'Vendor verification was pending. or vendor doesnot exist.',
                400
            )
        );
    }
    req.query.from = 'De-Addiction service';
    req.body.partner = partner;
    return next();
});

// get homecare
exports.getPartneranService = catchAsync(async (req, res, next) => {
    const [partner, services, deaddiction] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'De-Addiction service',
            status: 'accepted'
        }),
        (
            await deaddicationServiceModel.find().select('name').lean()
        ).map((el) => el.name),
        deaddictionModel.find({ userId: req.user._id })
    ]);

    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    req.query.from = 'De-Addiction service';
    req.body.partner = partner;
    req.body.services = services;
    req.body.deaddiction = deaddiction;
    return next();
});

// filter new blood bank data
exports.filterDeaddictionData = catchAsync(async (req, res, next) => {
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

            'city'
        )
    ]);

    return next();
});

// set service images name
exports.serviceImageProperties = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    req.image.gallery = 'serviceImages';

    return next();
};
let multerStorage = multer.memoryStorage();
function multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not a image type please upload the image', 400),
            false
        );
    }
}
let upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

// single image and multiple images
exports.uploadSinglAndMultipleImage = upload.fields([
    {
        name: 'bannerImage',
        maxCount: 1
    },
    {
        name: 'serviceImages',
        maxCount: 6
    }
]);

const uploadData = () => {};

// assign data for create new optical product
exports.getNewOpticalProductImage = catchAsync(async (req, res, next) => {});

exports.resizeDeaddictionServiceImages = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create')
        if (!req.files.bannerImage || !req.files.serviceImages)
            return next(
                new AppError(
                    'Banner image and service image should be included.',
                    400
                )
            );
    // image cover
    if (req.files.bannerImage)
        req.image.bannerImage = sharp(req.files.bannerImage[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 });

    // images
    if (req.files?.serviceImages?.length) {
        req.image.imageGallery = [];
        await Promise.all(
            req.files.serviceImages.map(async (el, i) => {
                const data = sharp(el.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 });

                req.image.imageGallery.push(data);
            })
        );
    }
    return next();
});

exports.assignAndVerifyPartnerData = catchAsync(async (req, res, next) => {
    const [data, serviceName, exist] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'De-Addiction service',
            status: 'accepted'
        }),
        deaddicationServiceModel.findOne({ name: req.body.serviceName }),
        deaddictionModel.exists({
            userId: req.user._id,
            serviceName: req.body.serviceName
        })
    ]);
    if (req.body.statusType === 'update') {
        const obj = await deaddictionModel.findOne({
            userId: req.user._id,
            hiwdacmID: req.params.serviceId
        });

        if (obj.serviceName !== req.body.serviceName && !!exist) {
            return next(
                new AppError(
                    'You already created service on this category',
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
    if (req.body.statusType === 'create') {
        if (exist) {
            return next(
                new AppError(
                    'You already created service on this category',
                    400
                )
            );
        }
        req.body.createdAt = Date.now();
        req.body.partnerId = data._id;
        req.body.hiwdacmID = await encryptID(process.env.HEARINGAID_SECRET);
    }

    req.body.userId = req.user._id;
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };
    return next();
});
// set image name
exports.assignImageNameForDeaddictionService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        console.log(req.body);
        req.image.imagename = `${`${`${req.body.userId
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdacmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-deaddiction-bannerimage`;
        req.image.galleryName = `${`${`${req.body.userId
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdacmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-deaddiction-gallery`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwdasmID: req.params.serviceId };
    if (!req.image.image && !req.image.imageGallery) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-deaddiction-bannerimage`;
    req.image.galleryName = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-deaddiction-gallery`;
    return next();
};
// upload files on aws
exports.uploadFilesinAWS = catchAsync(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });

    if (req.image.bannerImage) {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdacmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}deaddiction-banner`;
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${req.image.imagename}.jpeg`,
            ContentType: 'image/jpeg',
            Body: req.image.bannerImage
        };
        try {
            const bannerImage = await s3.upload(params).promise();
            req.body.bannerImage = bannerImage.Location;
        } catch (err) {
            return next(
                new AppError(
                    'Somehing went wrong while processing your request.Please try again.',
                    401
                )
            );
        }
    }
    if (req.image.imageGallery?.length) {
        req.body.serviceImages = [];
        await Promise.all(
            req.image.imageGallery.map(async (el, i) => {
                const imagesname = `${`${`${req.user._id
                    .toString()
                    .split(/[a-z]+/)
                    .join('')}-${req.body.hiwdacmID.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}deaddiction-service-${i + 1}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${imagesname}.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el
                };
                try {
                    const a = await s3.upload(params).promise();
                    return req.body.serviceImages.push(a.Location);
                } catch (err) {
                    console.log(err);
                    return next(
                        new AppError(
                            'Somehing went wrong while processing your request.Please try again.',
                            401
                        )
                    );
                }
            })
        );
    }
    // console.log(req.body);
    return next();
});

// create new deaddiction
exports.createDeaddictionServices =
    factoryController.createOne(deaddictionModel);
// create new deaddiction
exports.updateDeaddictionServices =
    factoryController.updateOne(deaddictionModel);

// assign data for update homecare's services
exports.assignDataForUpdateDeaddictionService = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.body.userId,
        hiwdacmID: req.params.serviceId
    };
    console.log(req.updateOneSearch);
    return next();
};

// get homecare applicatnts
exports.getDeaddictionAppliants = catchAsync(async (req, res, next) => {
    const [applicants] = await partnerModel.aggregate([
        {
            $match: { userId: req.user._id, for: 'De-Addiction service' }
        },
        {
            $lookup: {
                from: 'book de-addiction centers',
                localField: '_id',
                foreignField: 'partnerId',
                pipeline: [
                    {
                        $facet: {
                            active: [
                                {
                                    $match: {
                                        $or: [
                                            {
                                                status: 'pending'
                                            },
                                            {
                                                status: 'accepted'
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: `de-addiction centers`,
                                        localField: 'deAddictionId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $project: { serviceName: 1 }
                                            }
                                        ],
                                        as: 'serviceName'
                                    }
                                },
                                { $unwind: '$serviceName' }
                            ],
                            history: [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                status: { $ne: 'pending' }
                                            },
                                            {
                                                status: { $ne: 'accepted' }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: `de-addiction centers`,
                                        localField: 'deAddictionId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $project: { serviceName: 1 }
                                            }
                                        ],
                                        as: 'serviceName'
                                    }
                                },
                                { $unwind: '$serviceName' }
                            ]
                        }
                    }
                ],
                as: 'applicants'
            }
        },
        {
            $unwind: '$applicants'
        },
        {
            $group: {
                _id: '$_id',
                applicants: { $first: '$applicants' }
            }
        }
    ]);
    applicants._id = undefined;
    req.body.applicants = applicants.applicants;
    return next();
});

// assign data for update homecare's services
exports.assignDataForUpdateDeaddicionServicess = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwdacmID: req.params.serviceId
    };
    console.log(req.body);
    return next();
};
