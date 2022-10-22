// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import model
const partnerModel = require('../models/shared/partnerModel');
const expertModel = require('../models/MeetTheExperts/createMeetTheExpertsModel');
const bookExpertModel = require('../models/MeetTheExperts/bookMeetTheExpertsModel');
const userModel = require('../models/shared/userModel');
const expertReview = require('../models/MeetTheExperts/meetTheExpertReviews');
const newExpertModel = require('../models/MeetTheExperts/meetTheExpert');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const meetTheExpertServiceProvicerModel = require('../models/MeetTheExperts/meetTheExpertServiceProvidersModel');

// ============================================================
// import utilities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encrypeID = require('../util/uuid');
const encryptID = require('../util/uuid');
const addressModel = require('../models/shared/addUserAddressModel');
const filerDataFromRequest = require('../util/filterObjects');

// assign partner search data
exports.assignExpertSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Meet the Expert'
    };
    req.body.userId = req.user._id;
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// create new service
exports.createNewService = factoryController.createOne(expertModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// check verified vendor and parent
exports.verifyValidPartnerissService = catchAsync(async (req, res, next) => {
    const [partner, service] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Meet the Expert'
        }),

        expertModel.exists({ userId: req.user._id })
    ]);

    if (!partner) {
        return next(
            new AppError(
                "This partner is doesn't exist or yet to be accepted",
                400
            )
        );
    }
    if (service) {
        return next(new AppError('You already registed the service', 400));
    }

    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    req.body.partnerId = partner._id;
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.hiwmtesID = await encryptID(process.env.MEET_THE_EXPERT_SECRET);
    return next();
});

// assign data for update the address
exports.assignUserUpdateAddress = (req, res, next) => {
    req.updateQuery = {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode
    };
    req.updateByIdQuery = req.user._id;
    return next();
};

// update user address
exports.updateUserAddress = factoryController.updateById(userModel);

// assign data for home care service
exports.assignMeetExpertServiceApplicants = (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.partnerId = req.docs._id;
    req.body.createdAt = Date.now();
    req.body.paymentMethod = req.body.payment;
    req.docs = {};
    return next();
};

// assign home care serive application search Query
exports.assignMeetExpertApplicationSearchQuery = catchAsync(
    async (req, res, next) => {
        const expert = await meetTheExpertServiceProvicerModel.findOne({
            hiwmtespsID: req.params.serviceId
        });
        if (!expert) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    400
                )
            );
        }

        req.body.expertEID = req.params.serviceId;
        req.body.meetTheExpertId = expert._id;
        req.searchQuery = { _id: expert.partnerId };

        req.body.hiwmthebsID = await encryptID(
            process.env.MEET_THE_EXPERT_SECRET
        );

        return next();
    }
);

// get data for home care serive
exports.assignDataForMeetExpertServiceApplication =
    factoryController.findOne(partnerModel);

// assign data for homecare service
exports.assignHomeCareServiceApplicants = (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.meetTheExpertId = req.params.serviceid;
    req.body.partnerId = req.docs._id;
    req.body.createdAt = Date.now();
    req.docs = {};
    return next();
};

// create new application for service
exports.createNewExpertServiceApplicants =
    factoryController.createOne(bookExpertModel);

// send Json for application for service
exports.sendJsonForNewExpertServiceApplicants = factoryController.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwmtesID: req.params.serviceId
    };
    return next();
};

//verify Valid partner's service
exports.verifyValidPartnerissSerive = factoryController.findOne(partnerModel);

// update meet the expoert service
exports.updateMeetheExpertService = factoryController.updateOne(expertModel);

// update meet the expert service provider via meet the eperts
exports.updateMeetTheExpertSericeProvider = catchAsync(
    async (req, res, next) => {
        await meetTheExpertServiceProvicerModel.updateMany(
            {
                parentEID: req.params.serviceId
            },
            {
                serviceNme: req.body.serviceName,
                vendorType: req.body.vendorType,
                location: req.body.location,
                facilities: req.body.facilities
            },
            {
                new: true,
                runValidators: true
            }
        );
        return next();
    }
);
// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// delete homecare service
exports.deleteMeetTheService = catchAsync(async (req, res, next) => {
    await Promise.all([
        expertModel.deleteOne({
            hiwmtesID: req.params.serviceid,
            userId: req.user._id
        }),
        bookExpertModel.deleteMany({
            expertEID: req.params.serviceid,
            partnerId: req.docs._id
        })
    ]);

    return next();
});

// assign data for  service serrch data
exports.assignDataForAllSerive = (req, res, next) => {
    req.searchQuery = { expertType: req.params.serviceName };
    return next();
};

// search data get all related service
exports.getRelatedDataFind = factoryController.getFindAllFilter(
    meetTheExpertServiceProvicerModel
);

// send json for get all service
exports.sendJsonForall = factoryController.sendAllFilter();

// get related sevend data
exports.getAllRelatedExpertData = catchAsync(async (req, res, next) => {
    const filterdData = await expertModel.aggregate([
        {
            $match: {
                partnerId: mongoose.Types.ObjectId(req.body.partnerId),
                serviceName: {
                    $ne: req.body.findOnePopulateDocs.serviceName
                }
            }
        },
        {
            $group: {
                _id: '$_id',
                bannerImage: { $first: '$bannerImage' },
                serviceName: { $first: '$serviceName' },
                name: { $first: '$name' },
                description: { $first: '$description' },
                priceFrom: { $first: '$priceFrom' },
                priceTo: { $first: '$priceTo' },
                workingTimeFrom: { $first: '$workingTimeFrom' },
                workingTimeTo: { $first: '$workingTimeTo' }
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        },
        {
            $limit: 7
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: req.body.findOnePopulateDocs,
        related: filterdData
    });
});

// assign data for expert
exports.assignDataExpertServiceIsValid = (req, res, next) => {
    req.searchQuery = { hiwmtesID: req.params.expertId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -meetTheExpertId'
        }
    ];
    return next();
};

// check valid Expert service
exports.checkValidExpertService =
    factoryController.findOneWithPopulate(expertModel);

// assign data for Expert reivews
exports.assingExpertReviewData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        meetTheExpertId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            meetTheExpertId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createExpertReview = factoryController.upsertOne(expertReview);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await expertReview.aggregate([
        {
            $match: {
                meetTheExpertId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$meetTheExpertId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await expertModel.findByIdAndUpdate(req.body.findOnePopulateDocs._id, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].length
        });
    } else {
        await expertModel.findByIdAndUpdate(req.body.findOnePopulateDocs._id, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
    return res.status(200).json({ status: 'Success' });
});

// assign data for create a service or constructions
exports.assignDataForCreateService = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.body.hiwmteMID = await encrypeID(process.env.MEET_THE_EXPERT_SECRET);
    return next();
});

// create new meet the expert
exports.createNewMeetTheExpertList =
    factoryController.createOne(newExpertModel);

// get all meet the expert
exports.getAllExperts = catchAsync(async (req, res, next) => {
    const experts = await newExpertModel.aggregate([
        {
            $facet: {
                contractors: [
                    {
                        $match: {
                            serviceType: 'contractors'
                        }
                    }
                ],
                consultants: [
                    {
                        $match: {
                            serviceType: 'consultants'
                        }
                    }
                ],
                services: [
                    {
                        $match: {
                            serviceType: 'service'
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: experts[0]
    });
});

// assign data for update meet the expert
exports.assignDataForUpdateMeetTheExpertService = (req, res, next) => {
    req.updateOneSearch = { hiwmteMID: req.params.serviceId };

    return next();
};

// assign data for update all homecare services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName && req.body.serviceType === req.oldType) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = {
        expertType: req.oldName,
        serviceType: req.oldType
    };
    req.updateAllData = {
        expertType: req.body.name,
        serviceType: req.body.serviceType
    };
    return next();
};

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await newExpertModel.findOne({
        hiwmteMID: req.params.serviceId
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
    req.oldType = data.serviceType;
    return next();
});

// update other homecare service data
exports.updateRemainingMeetTheExpertsServices = factoryController.updateAll(
    meetTheExpertServiceProvicerModel
);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });

// get a meet the expert service
exports.assignDataForGetMeetTheExpert = catchAsync(async (req, res, next) => {
    const [expert] = await meetTheExpertServiceProvicerModel.aggregate([
        {
            $match: {
                hiwmtespsID: req.params.expertId
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    { $match: { status: 'accepted' } },
                    {
                        $group: {
                            _id: '$_id',
                            bannerImage: {
                                $first: '$bannerImage'
                            },
                            address: {
                                $first: '$address'
                            },
                            email: {
                                $first: '$email'
                            },
                            phone: {
                                $first: '$phone'
                            },
                            facilities: {
                                $first: '$meettheExperts.fecilities'
                            }
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
            $lookup: {
                from: 'meet the expert service providers',
                localField: 'userId',
                foreignField: 'userId',
                pipeline: [
                    { $match: { hiwmtespsID: { $ne: req.params.expertId } } }
                ],
                as: 'related'
            }
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: expert
    });
});

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Meet the Expert'
    };
    req.body.userId = req.user._id;

    return next();
};

// assign partner search
exports.assignPartnerQuery = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Meet the Expert'
    };
    return next();
};

// manage hospital package
exports.manageMeetTheExpertServicesServices = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

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

        const a = await partnerModel.updateOne(
            {
                userId: req.user._id,
                for: 'Meet the Expert',
                ...req.query.objData
            },
            {
                $pull: { ...req.query.pull }
            }
        );
        if (
            req.params.service === 'manage' ||
            req.params.service === 'create'
        ) {
            const b = await partnerModel.updateOne(
                {
                    userId: req.user._id,
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
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, expert] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Meet the Expert'
        }),
        expertModel.findOne({
            userId: req.user._id,
            hiwmtesID: req.params.serviceId
        })
    ]);

    if (!partner || !expert) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.expertId = expert._id;
    req.body.expertEID = expert.hiwmtesID;
    req.body.parentEID = expert.hiwmtesID;
    req.body.partnerId = partner._id;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Meet the Expert',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Meet the Expert';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Meet the Expert',
        hiwnadmID: req.params.adId
    };
    return next();
};

// create new quote
exports.getDataForQuoteFromExperts = catchAsync(async (req, res, next) => {
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
                        from: 'Meet the Expert',
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

// assign data for get my qutoes
exports.assignDataForGetMyQuotes = (req, res, next) => {
    req.body = { from: 'Meet the Expert' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Meet the Expert'
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
    quotes = await Promise.all(quotes.map((el) => ({ ...el, _id: undefined })));
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// cancel requester request
exports.assignDataForCancelReques = catchAsync(async (req, res, next) => {
    req.updateAllSearchQuery = {
        for: req.params.quoteId,
        userId: req.user._id,
        from: 'Meet the Expert'
    };
    req.updateAllData = {
        proposeStatus: 'canceled',
        userActionDate: Date.now()
    };
    return next();
});

// respont quote status
exports.assignDataForQuotesRequests = (req, res, next) => {
    req.updateOneSearch = {
        hiwmmqrrsID: req.params.quoteId,
        userId: req.user._id,
        from: 'Meet the Expert',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// create new meet the expoert service provicers
exports.manageandVerifyDataFromMetttheexpertForServiceProviders = catchAsync(
    async (req, res, next) => {
        const [partner, expertType] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Meet the Expert'
            }),

            newExpertModel.findOne({ name: req.body.expertType })
        ]);

        if (!partner) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }

        if (!expertType) {
            return next(
                new AppError('Please select the proper expert type', 400)
            );
        }
        req.body.vendorType = partner.meettheExperts.vendorType;
        req.body.serviceType = partner.meettheExperts.serviceType;
        req.body.userId = req.user._id;
        req.body.partnerId = partner._id;
        req.body.hiwmtespsID = await encryptID(
            process.env.MEET_THE_EXPERT_SECRET
        );
        req.body.createdAt = Date.now();

        return next();
    }
);

// create new meet the expert service providers
exports.createNewMeetTheExertServiceProvider = factoryController.createOne(
    meetTheExpertServiceProvicerModel
);

// send json for create one
exports.sendJsonForCreateOne = factoryController.sendJson();

// assign data  updat meet the expert service providers
exports.assignDataForupdataForMeetTheExpertProvider = catchAsync(
    async (req, res, next) => {
        const [partner, expertType] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Meet the Expert'
            }),

            newExpertModel.findOne({ name: req.body.expertType })
        ]);
        if (!partner) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }

        if (!expertType) {
            return next(
                new AppError('Please select the proper expert type', 400)
            );
        }
        return next();
    }
);

// update meet the expert service provider
exports.updateaMeetTheExpertServiceProvider = factoryController.updateOne(
    meetTheExpertServiceProvicerModel
);

// asssand verify data for apply new homecare serivice
exports.verifyaddressandPartner = catchAsync(async (req, res, next) => {
    const [[expert], address] = await Promise.all([
        meetTheExpertServiceProvicerModel.aggregate([
            {
                $match: {
                    hiwmtespsID: req.params.serviceId
                }
            },
            {
                $lookup: {
                    from: 'partners',
                    localField: 'partnerId',
                    foreignField: '_id',
                    as: 'partners'
                }
            },
            {
                $unwind: '$partners'
            }
        ]),
        addressModel
            .findOne({
                hiwnusID: req.params.address,
                userId: req.user._id
            })
            .lean()
    ]);
    console.log(expert);
    if (!expert || !address) {
        return next(
            new AppError(
                'Something went wrong while processing you request',
                400
            )
        );
    }
    req.body.partnerId = expert.partnerId;
    req.body.expertEID = expert.hiwmtespsID;
    req.body.meetTheExpertId = expert._id;
    expert.partners = undefined;
    expert.hiwmtespsID = undefined;
    expert.parentEID = undefined;
    expert.parentId = undefined;
    expert.userId = undefined;
    expert.createdAt = undefined;
    expert.partnerId = undefined;
    expert._id = undefined;
    address._id = undefined;
    req.body.userId = req.user._id;
    req.body.addressDetails = address;
    req.body.hiwmthebsID = await encrypeID(process.env.HOMECARE_SECRET);
    req.body.createdAt = Date.now();
    req.body.serviceDetails = expert;
    return next();
});

// assign data for get my services
exports.assignDataForGetMyExperts = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// get all my expert service
exports.getAllMyExpertService =
    factoryController.getFindAllFilter(bookExpertModel);

// send json data for client for my expert service
exports.sendJsonGetAllMyService = factoryController.sendAllFilter();

// assing data for cancel request
exports.assignDataForCancelExpertFromUser = (req, res, next) => {
    const bodydata = req.body.cause;
    req.body = {};
    req.body.status = 'canceled';
    req.body.cause = bodydata;
    req.updateOneSearch = {
        hiwmthebsID: req.params.expertId,
        userId: req.user._id,
        $or: [{ status: 'pending' }, { status: 'accepted' }]
    };
    req.body.userActioniDate = Date.now();
    return next();
};

// cancel homecare service request
exports.cancelExpertService = factoryController.updateOne(bookExpertModel);

// filter new blood bank data
exports.filterMeettheExpertData = catchAsync(async (req, res, next) => {
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
            'vendorType',
            'city'
        )
    ]);

    return next();
});

// update home care service
exports.updateMeetTheExpert = factoryController.updateOne(partnerModel);

// update remaing daa
exports.updateExpertSerivesservice = catchAsync(async (req, res, next) => {
    await meetTheExpertServiceProvicerModel.updateMany(
        {
            userId: req.user._id
        },
        { serviceType: req.body.serviceType, vendorType: req.body.vendorType },
        { runValidators: true }
    );
    return res.status(200).json({ status: 'Success' });
});

// getmeet the expert services
exports.getMeetTheExpertsServices = catchAsync(async (req, res, next) => {
    const [services, expertList] = await Promise.all([
        meetTheExpertServiceProvicerModel.find({
            partnerId: req.docs._id
        }),
        newExpertModel.find().distinct('name')
    ]);
    req.body.services = services;
    req.body.list = expertList;
    return next();
});
// search data for partner booking
exports.assignDataforGetExpertBookinglist = catchAsync(
    async (req, res, next) => {
        req.search = {
            userId: req.user._id,
            status: 'accepted',
            for: 'Meet the Expert'
        };
        return next();
    }
);

// getmeet the expert booking history
exports.getMeetTheExpertsBookingList = catchAsync(async (req, res, next) => {
    const [booking] = await partnerModel.aggregate([
        {
            $match: req.search
        },
        {
            $project: {
                name: 1,
                hiwpmID: 1,
                profileImage: 1,
                bannerImage: 1,
                for: 1
            }
        },
        {
            $lookup: {
                from: 'book meet the experts',
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
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $group: {
                                                    _id: '$_id',
                                                    name: { $first: '$name' },
                                                    phone: { $first: '$phone' }
                                                }
                                            }
                                        ],
                                        as: 'user'
                                    }
                                },
                                {
                                    $unwind: '$user'
                                }
                            ],
                            history: [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                status: { $ne: 'pending    ' }
                                            },
                                            {
                                                status: { $ne: 'accepted' }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $group: {
                                                    _id: '$_id',
                                                    name: { $first: '$name' },
                                                    phone: { $first: '$phone' }
                                                }
                                            }
                                        ],
                                        as: 'user'
                                    }
                                },
                                {
                                    $unwind: '$user'
                                }
                            ]
                        }
                    }
                ],
                as: 'booking'
            }
        },
        { $unwind: '$booking' }
    ]);
    req.body.booking = booking;
    return next();
});

// send json for get all boooking,service and list
exports.sendJsonForGetAllExpertServices = (req, res) =>
    res.status(200).json({
        status: 'Success',
        facilities: req.docs.meettheExperts.fecilities,
        booking: req.body.booking.booking,
        services: req.body.services,
        expertsLists: req.body.list
    });

// assign data for find one partner
exports.findOnePartnerForExpert = catchAsync(async (req, res, next) => {
    const [partner, service] = await Promise.all([
        partnerModel.findOne(req.search),
        newExpertModel.findOne({ name: req.body.expertType })
    ]);
    if (!partner) {
        return next(new AppError('Vendor not found.', 404));
    }
    if (!service) {
        return next(new AppError('Select valid Expert type', 400));
    }
    const exist = await meetTheExpertServiceProvicerModel.exists({
        partnerId: partner._id,
        expertType: req.body.expertType
    });
    if (req.body.statusType === 'create') {
        if (exist) {
            return next(
                new AppError('This vendor is already has this service.', 400)
            );
        }
    } else if (req.body.statusType === 'update') {
        let cheks = await meetTheExpertServiceProvicerModel.find({
            partnerId: partner._id
        });
        [cheks] = await Promise.all(
            cheks.filter((el) => el.hiwmtespsID === req.params.serviceId)
        );
        if (cheks.expertType !== req.body.expertType && !!exist) {
            return next(
                new AppError('This vendor is already has this service.', 400)
            );
        }
    }
    req.body.serviceType = partner.meettheExperts.serviceType;

    req.body.vendorType = partner.meettheExperts.vendorType;
    req.body.userId = partner.userId;
    req.body.partnerId = partner._id;
    if (req.body.statusType === 'create') {
        req.body.createdAt = Date.now();
        req.body.hiwmtespsID = await encryptID(process.env.HOSPTIAL_PACKAGE);
    }
    return next();
});

// assing data for update meet the experts
exports.assignDataForUpdateMeetTheExpert = (req, res, next) => {
    req.updateOneSearch = {
        partnerId: req.body.partnerId,
        hiwmtespsID: req.params.serviceId
    };
    return next();
};

// update meet the expert services
exports.updateMeetTheExpertServices = factoryController.updateOne(
    meetTheExpertServiceProvicerModel
);

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// assing data for cancel request
exports.assignDataForExpertServiceVendor = catchAsync(
    async (req, res, next) => {
        const application = await bookExpertModel.findOne({
            hiwmthebsID: req.params.expertId,
            partnerId: req.docs._id
        });

        if (!application) {
            return next(new AppError('No Experts found', 404));
        }
        req.body.status = req.params.status;
        req.updateOneSearch = {
            hiwmthebsID: req.params.expertId
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
            // req.body.vendorRespondBy = 'admin';
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
            // req.body.vendorRespondBy = 'admin';
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
            // req.body.vendorRespondBy = 'admin';
            req.body.vendorActionDate = Date.now();
        } else {
            return next(new AppError(`Please select the valid status.`, 400));
        }
        return next();
    }
);

// update expert staus
exports.updateExpertStatus = factoryController.updateOne(bookExpertModel);
