// ============================================================
// import models
const _ = require('lodash');
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');

// ============================================================
// import models
const newBloodDonnerModel = require('../models/BloodDonation/addNewBloodDonnerModel');
const bloodRequestorModel = require('../models/BloodDonation/bloodRequestorModel');
const bloodRequestsModel = require('../models/BloodDonation/requestBloodModel');
const partnerModel = require('../models/shared/partnerModel');
const bloodBankModel = require('../models/BloodDonation/bloodBankModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');

// ============================================================
// create controllers
// assind data for create mnew donner
exports.assignDataForCreateNewBloodDonner = catchAsync(
    async (req, res, next) => {
        req.body.hiwbdndID = await encryptID(process.env.BLOOD_DONATION_SECRET);
        req.body.userId = req.user._id;
        req.body.createdAt = Date.now();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude]
        };
        return next();
    }
);

// create new blood donner
exports.createNewBloodDonner =
    factoryControllers.createOne(newBloodDonnerModel);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// assind data for update blood donner
exports.assignDataForUpdateBloodDonner = catchAsync(async (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwbdndID: req.params.userId
    };
    return next();
});

// create new blood donner
exports.updateBloodDonner = factoryControllers.updateOne(newBloodDonnerModel);

// send json for create one
exports.sendJsonForupdateOne = factoryControllers.sendJsonForFindOne();

// assign data for create new blood reques
exports.assignDataandGetAvailableMembers = catchAsync(
    async (req, res, next) => {
        const [lat, lug] = [req.body.latitude, req.body.longitude];
        let len = 1;
        let donners = [];
        while (len <= 4) {
            const radios = (len * 5) / 6378.1;

            // eslint-disable-next-line no-await-in-loop
            donners = await newBloodDonnerModel.find({
                lastDonatedDate: {
                    $lte: new Date(new Date() - 90 * 60 * 60 * 24 * 1000)
                },
                location: {
                    $geoWithin: {
                        $centerSphere: [[lug, lat], radios]
                    }
                },
                bloodGroup: req.body.bloodGroup
            });

            if (donners.length >= process.env.BLOOD_DONNERS_LIMIT * 1) {
                break;
            }
            len += 1;
        }

        if (!donners.length) {
            return next(
                new AppError(
                    "Sorry we couldn't find any donners in 20km radios.",
                    404
                )
            );
        }
        donners = _.sampleSize(donners, process.env.BLOOD_DONNERS_LIMIT * 1);
        len = 0;

        req.body.donners = [];
        req.body.userId = req.user._id;
        req.body.createdAt = Date.now();
        req.body.hiwnbrID = await encryptID(process.env.BLOOD_DONATION_SECRET);
        req.body.location = {
            type: 'Point',
            coordinates: [lug, lat]
        };

        while (len < donners.length) {
            // eslint-disable-next-line no-await-in-loop
            const uuid = await encryptID(process.env.BLOOD_DONATION_SECRET);
            const obj = {
                requesterName: req.body.patientName,
                requsterContactName: req.body.contactName,
                requesterPhone: req.body.phoneNumber,
                requesterBloodType: req.body.bloodGroup,
                requesterRequiredUnits: req.body.unitsRequird,
                requestersRequiredDate: req.body.requriedDate,
                hospitalName: req.body.hospitalName,
                hospitalAddress: req.body.hospitalAddress,
                opertionType: req.body.opertionType,
                description: req.body.description,
                location: req.body.location,
                userId: req.user._id,
                hiwnrqID: uuid,
                batch: req.body.hiwnbrID,
                donnerEID: donners[len].hiwbdndID,
                donnerUserID: donners[len].userId,
                createdAt: Date.now()
            };
            req.body.donners.push(obj);
            len += 1;
        }

        return next();
    }
);

// send request to usera and create new reques
exports.createBloodRequest = catchAsync(async (req, res, next) => {
    const [reqstr, reqs] = await Promise.all([
        bloodRequestorModel.updateOne(
            { userId: req.user._id, status: 'active' },
            req.body,
            {
                upsert: true,
                returnNewDocument: true,
                runValidators: true
            }
        ),
        bloodRequestsModel.create(req.body.donners)
    ]);
    if (!reqstr || !reqs) {
        return next(
            new AppError(
                'Somthing went wrong while processing your request',
                500
            )
        );
    }
    return res.status(200).json({
        status: 'Success'
    });
});

exports.assinDataForCancelAllPreviousRequests = catchAsync(
    async (req, res, next) => {
        await Promise.all([
            bloodRequestsModel.updateMany(
                {
                    userId: req.user._id,
                    $or: [
                        { status: 'requested' },
                        { status: 'rejected' },
                        { status: 'accepted' }
                    ]
                },
                { status: 'canceled' },
                {
                    new: true,
                    runValidators: true
                }
            ),
            bloodRequestorModel.updateMany(
                { userId: req.user._id, status: 'active' },
                {
                    status: 'inActive'
                },
                {
                    runValidators: true
                }
            )
        ]);

        return next();
    }
);

// check update blood gourps
exports.updateBloodrequest = catchAsync(async (req, res, next) => {
    let requester;
    let request;
    if (req.params.status === 'canceled') {
        [requester, request] = ['inActive', 'canceled'];
    } else if (req.params.status === 'received')
        [requester, request] = ['completed', 'completed'];
    else
        return next(
            new AppError(
                'Somthing went wrong while processing your request',
                400
            )
        );

    const [reqs, reqstr] = await Promise.all([
        bloodRequestorModel.findOneAndUpdate(
            { userId: req.user._id, status: 'active' },
            { status: requester },
            {
                new: true,
                runValidators: true
            }
        ),
        bloodRequestsModel.updateMany(
            {
                userId: req.user._id,
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

// get all blood groups
exports.assignDataForGetBloodGroup = (req, res, next) => {
    req.searchQuery = { status: 'active', userId: req.user._id };
    return next();
};
// get blood gourps
exports.getRequesterData = factoryControllers.findOne(bloodRequestorModel);

// assign data for get get blood groups
exports.assingDataForFindBloodGroups = (req, res, next) => {
    req.searchQuery = {
        bloodGroup: req.docs.bloodGroup,
        lastDonatedDate: {
            $lte: new Date(new Date() - 90 * 60 * 60 * 24 * 1000)
        }
    };
    req.queryPopulate = {
        path: 'request',
        select: 'status'
    };
    return next();
};

// get blood donners
exports.getBloodGroups =
    factoryControllers.findWithPopulate(newBloodDonnerModel);

exports.sendJsonForPopulateAll =
    factoryControllers.sendJsonForFindWithPopulate();

// assign data and verify data for check valid request
exports.assignAndVerifyDataForRequest = catchAsync(async (req, res, next) => {
    const [requester, donner, requestedDonner] = await Promise.all([
        bloodRequestorModel.findOne({
            hiwnbrID: req.params.requesterId,
            userId: req.user._id,
            status: 'active'
        }),
        newBloodDonnerModel.findOne({
            hiwbdndID: req.params.donnerId,
            lastDonatedDate: {
                $lte: new Date(new Date() - 90 * 60 * 60 * 24 * 1000)
            }
        }),
        bloodRequestsModel.findOne({
            userId: req.user._id,
            batch: req.params.requesterId,
            donnerEID: req.params.donnerId
        })
    ]);
    if (!requester || !donner) {
        return next(
            new AppError(
                'Somthing went wrong while processing you request.',
                400
            )
        );
    }

    if (requestedDonner) {
        return next(new AppError('You already requested this donner', 400));
    }
    const uuid = await encryptID(process.env.BLOOD_DONATION_SECRET);
    req.body = {
        requesterName: requester.patientName,
        requsterContactName: requester.contactName,
        requesterPhone: requester.phoneNumber,
        requesterBloodType: requester.bloodGroup,
        requesterRequiredUnits: requester.unitsRequird,
        requestersRequiredDate: requester.requriedDate,
        hospitalName: requester.hospitalName,
        hospitalAddress: requester.hospitalAddress,
        opertionType: requester.opertionType,
        description: requester.description,
        location: requester.location,
        userId: req.user._id,
        hiwnrqID: uuid,
        batch: req.params.requesterId,
        donnerEID: donner.hiwbdndID,
        donnerUserID: donner.userId,
        createdAt: Date.now()
    };
    return next();
});

// create blood dontaion request
exports.createSingleBloodRequest =
    factoryControllers.createOne(bloodRequestsModel);

// get my requests
exports.getMyBloodRequests = catchAsync(async (req, res, next) => {
    let [requester, [{ request, acceptedRequest }]] = await Promise.all([
        bloodRequestorModel.findOne({
            userId: req.user._id,
            status: 'active'
        }),
        bloodRequestsModel.aggregate([
            {
                $match: {
                    donnerUserID: req.user._id
                }
            },
            {
                $facet: {
                    request: [
                        {
                            $match: { status: 'requested' }
                        }
                    ],
                    acceptedRequest: [
                        {
                            $match: { status: 'accepted' }
                        }
                    ]
                }
            }
        ])
    ]);
    if (acceptedRequest.length) {
        const todayDate = new Date().setHours(0, 0, 0, 0);
        acceptedRequest = await Promise.all(
            acceptedRequest.map((el) => {
                let mngDate = new Date(el.requestersRequiredDate).setHours(
                    0,
                    0,
                    0,
                    0
                );
                if (todayDate === mngDate) {
                    mngDate = new Date(el.donnerResponseDate)
                        .valueOf()
                        .toString(23)
                        .slice(-6);
                    return { ...el, verifyId: mngDate };
                }
                return { ...el, verifyId: 'waiting' };
            })
        );
    }
    return res.status(200).json({
        status: 'Success',
        requester,
        request,
        acceptedRequest
    });
});

// assing data for update request data
exports.assignDataForUpdateRequestStatus = (req, res, next) => {
    if (req.params.status !== 'accepted' && req.params.status !== 'rejected') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    req.body = {};
    req.body.status = req.params.status;
    req.body.donnerResponseDate = Date.now();
    req.updateOneSearch = {
        status: 'requested',
        donnerUserID: req.user._id,
        hiwnrqID: req.params.requestId
    };
    return next();
};

// update request
exports.updateBloodRequest = factoryControllers.updateOne(bloodRequestsModel);

// assign data for find accepted peopele
// exports.getRequesterData = catchAsync(async (req, res, next) => {
//     const reques = await bloodRequestorModel.findOne({
//         userId: req.user._id,
//         status: 'active'
//     });
//     if (!reques) {
//         return res.status(404).json({ status: 'Empty' });
//     }
//     req.docs = reques;
//     return next();
// });

// find active reqeuster
exports.assignDataForFindActiveRequests = async (req, res, next) => {
    req.searchQuery = {
        batch: req.docs.hiwnbrID,
        userId: req.user._id,
        status: 'accepted'
    };
    req.queryPopulate = [
        {
            path: 'donners',
            select: 'donnerName'
        }
    ];
    return next();
};

// find all accepted datas
exports.findAllacceptedRequests =
    factoryControllers.getFindAllWithPopulateFilter(bloodRequestsModel);
// send json for filter all
exports.sendJsonForFilterAll = factoryControllers.sendAllFilter();
// send json for find all data
exports.sendJsonForFindAll = factoryControllers.sendJsonForAll();

// assign data for get valid donner
exports.assignDataForGetValidDonner = catchAsync(async (req, res, next) => {
    const [request, requester] = await Promise.all([
        bloodRequestsModel.findOne({
            status: 'accepted',
            hiwnrqID: req.params.donationId,
            userId: req.user._id
        }),
        bloodRequestorModel.findOne({
            userId: req.user._id,
            $or: [
                {
                    staus: 'completed'
                },
                {
                    staus: 'active'
                }
            ]
        })
    ]);

    if (!request) {
        return next(new AppError('Something wrong with this user.', 401));
    }
    if (!requester) {
        return next(
            new AppError('Make sure this request was active or completed.', 400)
        );
    }
    req.docs = request;
    return next();
});

// verify and updated data the date of donation and valid key
exports.verifyandUpdateDonnerandRecinverData = catchAsync(
    async (req, res, next) => {
        console.log(req.docs);
        const data = new Date(req.docs.donnerResponseDate)
            .valueOf()
            .toString(23)
            .slice(-6);
        if (data !== req.params.verifyID) {
            return next(
                new AppError('Make sure you check the valid user', 400)
            );
        }
        const [request, donner] = await Promise.all([
            bloodRequestsModel.findByIdAndUpdate(req.docs._id, {
                status: 'donated'
            }),
            newBloodDonnerModel.updateOne(
                { hiwbdndID: req.docs.donnerEID },
                {
                    lastDonatedDate: Date.now()
                }
            )
        ]);
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// check the partner and councilar
exports.checkValidVendorandPartnerBloodBank = catchAsync(
    async (req, res, next) => {
        const [partner, bloodbank] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Blood Bank'
            }),
            bloodBankModel.exists({ userId: req.user._id })
        ]);

        if (!partner) {
            return next(
                new AppError('Please verify or create partner service.', 400)
            );
        }
        if (bloodbank) {
            return next(new AppError('You already regsitered a service.', 400));
        }
        // console.log(req.body);
        req.body.userId = req.user._id;
        req.body.partnerId = partner._id;
        req.body.createdAt = Date.now();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.body.bloodBankName = partner.company;
        req.body.email = partner.email;
        req.body.hiwbdbbmID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        return next();
    }
);

// create new blood bank
exports.createNewBloodBank = factoryControllers.createOne(bloodBankModel);

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Blood Bank'
    };
    req.body.userId = req.user._id;

    return next();
};

// get my blood donners
exports.assignDataForGetMyBloodDonner = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};
// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

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
                userId: req.user._id,
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

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, bloodbank] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Blood Bank'
        }),
        bloodBankModel.findOne({
            userId: req.user._id,
            hiwbdbbmID: req.params.serviceId
        })
    ]);
    if (!partner || !bloodbank) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.phone = bloodbank.bloodBankPhone;
    req.body.email = bloodbank.email;
    req.body.bloodbankId = bloodbank._id;
    req.body.bloodbankEID = bloodbank.hiwbdbbmID;
    req.body.parentEID = bloodbank.hiwbdbbmID;
    req.body.partnerId = partner._id;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Blood Bank',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Blood Bank';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Blood Bank',
        hiwnadmID: req.params.adId
    };

    return next();
};

// create new quote
exports.getDataForQuoteFromAmbulance = catchAsync(async (req, res, next) => {
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
                        proposalDate: Date.now(),
                        productDescription: el.productDescription,
                        quantity: el.quantity,
                        hiwmmqrrsID: await encryptID(
                            process.env.MEDICAL_MARKET_SECRET
                        ),
                        userId: req.user._id,
                        for: uuid,
                        from: 'Blood Bank',
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
    req.body = { from: 'Blood Bank' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Blood Bank'
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
        from: 'Blood Bank'
    };
    console.log(req.updateAllSearchQuery);
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
        from: 'Blood Bank',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus =
        req.params.status === 'accepted'
            ? 'accepted'
            : req.params.status === 'rejected'
            ? 'rejected-by-user'
            : () => {
                  return next(
                      new AppError(
                          'Something went wrong while processing your request',
                          400
                      )
                  );
              };
    req.body.userDescription = req.body.cause;
    req.body.userActionDate = Date.now();
    return next();
};

// filter new blood bank data
exports.filterNewBloodBankData = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'contactPersonName',
            'contactPersonPhone',
            'email',
            'bloodBankPhone',
            'landline',
            'openTime',
            'closeTime',
            'location',
            'address'
        )
    ]);
    return next();
});

// assign data for update blood bank
exports.assignDataForUpdatBloodBank = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Blood Bank'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
};
// update bloodbank
exports.updateBloodBank = factoryControllers.updateOne(partnerModel);

// assign data for get blood donners list
exports.assignDataForGetBloodDonners = (req, res, next) => {
    req.searchQuery = { userId: req.docs._id };
    return next();
};

// get blood donner
exports.getBloodDonners = factoryControllers.findAllData(newBloodDonnerModel);

// get my blood requests
exports.getUserBloodRequests = catchAsync(async (req, res, next) => {
    const [requester] = await bloodRequestorModel.aggregate([
        {
            $match: { userId: req.docs._id }
        },
        {
            $facet: {
                active: [
                    {
                        $match: { status: 'active' }
                    },
                    {
                        $lookup: {
                            from: 'blood donation blood requests',
                            localField: 'hiwnbrID',
                            foreignField: 'batch',
                            pipeline: [
                                {
                                    $match: {
                                        $or: [
                                            {
                                                status: 'accepted'
                                            },
                                            {
                                                status: 'rejected'
                                            },
                                            {
                                                status: 'donated'
                                            }
                                        ]
                                    }
                                },

                                {
                                    $lookup: {
                                        from: 'blood donation new donners',
                                        localField: 'donnerEID',
                                        foreignField: 'hiwbdndID',
                                        pipeline: [
                                            {
                                                $project: {
                                                    donnerPhone: 1,
                                                    donnerName: 1
                                                }
                                            }
                                        ],
                                        as: 'donner'
                                    }
                                },
                                { $unwind: '$donner' },
                                {
                                    $project: {
                                        status: 1,
                                        donnerName: '$donner.donnerName',
                                        donnerPhone: '$donner.donnerPhone'
                                    }
                                }
                            ],
                            as: 'requests'
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $or: [
                                { status: 'inActive' },
                                {
                                    status: 'completed'
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'blood donation blood requests',
                            localField: 'hiwnbrID',
                            foreignField: 'batch',
                            pipeline: [
                                {
                                    $match: { status: { $ne: 'requested' } }
                                },

                                {
                                    $lookup: {
                                        from: 'blood donation new donners',
                                        localField: 'donnerEID',
                                        foreignField: 'hiwbdndID',
                                        pipeline: [
                                            {
                                                $project: {
                                                    donnerPhone: 1,
                                                    donnerName: 1
                                                }
                                            }
                                        ],
                                        as: 'donner'
                                    }
                                },
                                { $unwind: '$donner' },
                                {
                                    $project: {
                                        status: 1,
                                        donnerName: '$donner.donnerName',
                                        donnerPhone: '$donner.donnerPhone'
                                    }
                                }
                            ],
                            as: 'requests'
                        }
                    }
                ]
            }
        },
        {
            $unwind: { path: '$active', preserveNullAndEmptyArrays: true }
        }
    ]);
    console.log(JSON.stringify(requester));
    !requester.active ? (requester.active = false) : '';
    req.body.requester = requester;
    return next();
});
// get my blood requests
exports.getUserReceivedBloodRequests = catchAsync(async (req, res, next) => {
    console.log(req.docs._id);
    const [requester] = await bloodRequestsModel.aggregate([
        {
            $match: { donnerUserID: req.docs._id }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $or: [
                                { status: 'requested' },
                                { status: 'accepted' }
                            ]
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $and: [
                                { status: { $ne: 'requested' } },
                                {
                                    status: { $ne: 'accepted' }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);
    req.body.requester = requester;
    return next();
});

// get my blood donation hisotry
exports.getMyBloodDonationHisotory = catchAsync(async (req, res, next) => {
    const [requester, request] = await Promise.all([
        bloodRequestorModel.find({ userId: req.user._id, status: 'completed' }),
        bloodRequestsModel.find({ userId: req.user._id, status: 'donated' })
    ]);
    return res.status(200).json({
        status: 'Success',
        requester,
        request
    });
});

// get near by blood banks
exports.getNearByBloodbanks = catchAsync(async (req, res, next) => {
    if (!req.query.latitude || !req.query.longitude) {
        return next(new AppError('Please select the location first', 400));
    }
    let length = req.query.radios ?? 20;
    length = length > 0 ? length : 20;
    const radios = length / 6378.1;
    const obj = {};

    if (req.query.blood) {
        let spli = req.query.blood.split(' ');
        spli = spli.length === 2 ? `${spli[0]}+` : spli[0];
        obj['bloodDetails.bloodType'] = spli;
    }
    console.log(radios);

    const bloodbanks = await bloodBankModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [req.query.longitude, req.query.latitude],
                    radios
                ]
            }
        },
        ...obj
    });
    if (!bloodbanks.length) {
        return res.status(404).json({
            status: 'Fail',
            message:
                'There is no available blood bank for ' + length + ' Km radios.'
        });
    }
    return res.status(200).json({
        status: 'Success',
        bloodbanks
    });
});
