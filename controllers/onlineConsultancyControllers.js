// ============================================================
const { default: mongoose } = require('mongoose');
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import models
const onlineConsultancyModel = require('../models/OnlineConsultancy/onlineConsultancyModel');
const partnerModel = require('../models/shared/partnerModel');
const onlineConsultancyAvailablityModel = require('../models/OnlineConsultancy/onlineConsultancyAvailblityModel');
const bookOnlineConsultancyModel = require('../models/OnlineConsultancy/bookOnlineConsultancyModel');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');
const onlineConsultantReviewModel = require('../models/OnlineConsultancy/onlineConsultancyReviewModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');

// ============================================================
// create controllers
// assign partner search data
exports.assignExpertSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'Pending',
        for: 'Online Consultancy'
    };

    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// assign data create new service for experts
exports.assignNewServiceData = catchAsync(async (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.createAt = Date.now();
    req.body.userId = req.user._id;
    req.body.hiwocmmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
    return next();
});

// create new service
exports.createNewService = factoryControllers.createOne(onlineConsultancyModel);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {};
    req.updateQuery = req.body;
    return next();
};

// update speak to us
exports.updateOnlineConsultancy = factoryControllers.updateOne(
    onlineConsultancyModel
);

// send json for update the speak to us
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Online Consultancy'
        })
    ]);
    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }

    req.body.partnerId = partner._id;
    // req.body.availablity = partner.availablity;
    // if (!partner.availablity) {
    //     req.body.experience = partner.experience;
    //     req.body.speciality = partner.speciality;
    //     req.body.profileImage = partner.profileImage;
    //     req.body.doctorName = partner.name;
    //     req.body.category = partner.category;
    // }
    return next();
});
// verify and get details
exports.verifyVendorDatas = catchAsync(async (req, res, next) => {
    if (req.body.availablity) return next();
    const uuid = await encryptID(process.env.SPEAK_TO_US_SECRET);
    const data = {
        partnerId: req.body.partnerId,
        userId: req.user._id,
        hiwdocboEID: uuid,
        createdAt: Date.now(),
        experience: req.body.experience,
        speciality: req.body.speciality,
        profileImage: req.body.profileImage,
        doctorName: req.body.doctorName,
        category: req.body.category
    };

    await onlineConsultancyAvailablityModel.create(data);

    await onlineConsultancyModel.findByIdAndUpdate(
        req.body.doctorId,
        {
            availablity: true
        },
        {
            new: true,
            runValidators: true
        }
    );

    return next();
});

// assign data for Expert reivews
exports.assingSpeakTousAvailablityData = catchAsync(async (req, res, next) => {
    await Promise.all(
        req.body.availableQuota.map(async (el) => {
            await onlineConsultancyAvailablityModel.updateOne(
                {
                    userId: req.user._id,
                    councilarId: req.body.councilarId,
                    councilarEID: req.body.councilarEID,
                    partnerId: req.body.partnerId
                },
                {
                    $pull: {
                        availableQuota: {
                            day: el.day
                        }
                    }
                }
            );

            await onlineConsultancyAvailablityModel.updateOne(
                {
                    userId: req.user._id,
                    councilarId: req.body.councilarId,
                    councilarEID: req.body.councilarEID,
                    partnerId: req.body.partnerId
                },
                {
                    $push: {
                        availableQuota: {
                            day: el.day,
                            date: el.date,
                            availableTime: el.availableTime,
                            slotsInHour: el.slotsInHour,
                            pricePerSlot: el.pricePerSlot,
                            availablity: el.availablity
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        })
    );
    return res.json({
        status: 'Success'
    });
});

// check valid date and time
exports.checkTheDateandTimeisvalid = catchAsync(async (req, res, next) => {
    await Promise.all(
        req.body.availableQuota.map(async (el) => {
            if (
                JSON.stringify(req.body.availableQuota).split(`"day":${el.day}`)
                    .length > 2
            ) {
                return next(new AppError('Select the valid date .', 401));
            }
            const checkDate =
                new Date(el.date) <
                    new Date(Date.now() + 1000 * 60 * 60 * 24 * 8) &&
                new Date(el.date) > new Date(Date.now() + 1000 * 3600 * 24);
            if (!checkDate) {
                return next(new AppError('Please selct the valide date', 401));
            }

            const availableTimes = [
                '01AM',
                '01PM',
                '02AM',
                '02PM',
                '03AM',
                '03PM',
                '04AM',
                '04PM',
                '05AM',
                '05PM',
                '06AM',
                '06PM',
                '07AM',
                '07PM',
                '08AM',
                '08PM',
                '09AM',
                '09PM',
                '10AM',
                '10PM',
                '11AM',
                '11PM',
                '12AM',
                '12PM'
            ];
            el.availableTime.map((els) => {
                const a = els.split('-')[0].trim().toUpperCase();
                const b = els.split('-')[1].trim().toUpperCase();
                if (
                    !availableTimes.includes(a) ||
                    !availableTimes.includes(b)
                ) {
                    return next(
                        new AppError(
                            'Somthing went wrong while processing your requires',
                            401
                        )
                    );
                }
            });
        })
    );

    return next();
});

// assign data for active status
exports.assignDataForCouselingStatusUpdate = (req, res, next) => {
    req.updateOneSearch = {
        councilarEID: req.params.serviceId,
        userId: req.user._id
    };
    req.body = { status: req.params.status };
    return next();
};

// set status of councilar
exports.updateCouncilarStatus = factoryControllers.updateOne(
    onlineConsultancyAvailablityModel
);

// send json for updateone
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// check the cousilar available or not
// exports.checkAvailablityofCouncilar = catchAsync(async (req, res, next) => {
//     const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24)
//         .toISOString()
//         .split('T')[0];
//     const today = new Date(Date.now()).toISOString().split('T')[0];
//     const time = new Date()
//         .toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
//         .split(' ')
//         .join('');

//     let councilar = await onlineConsultancyAvailablityModel.find({
//         status: 'active',
//         availableQuota: {
//             $elemMatch: {
//                 $and: [
//                     {
//                         date: {
//                             $gte: thatDate
//                         }
//                     },
//                     {
//                         date: {
//                             $lt: nextdate
//                         }
//                     }
//                 ],
//                 availableTime: {
//                     $in: [reg]
//                 }
//             }
//         }
//     });
//     if (!councilar.length) {
//         councilar = await onlineConsultancyAvailablityModel.find({
//             status: 'active'
//         });

//         if (!councilar.length) {
//             return next(new AppError('There are no active councilar.', 404));
//         }
//     }
//     return res.status(20002).json({
//         status: 'Success',
//         docs: councilar
//     });
// });

exports.assignDataForUpdateConsultancy = (req, res, next) => {
    req.updateOneSearch = {
        partnerId: req.docs._id,
        userId: req.user._id
    };
    return next();
};

// get doctors
exports.getAvailableDoctors = catchAsync(async (req, res, next) => {
    if (!req.query.type) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    const doctors = await onlineConsultancyAvailablityModel.aggregate([
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
                            category: { $first: '$onlineConsultancy.category' },
                            speciality: {
                                $first: '$onlineConsultancy.speciality'
                            },
                            company: { $first: '$company' },
                            name: { $first: '$name' },
                            experience: {
                                $first: '$onlineConsultancy.experience'
                            },
                            profileImage: {
                                $first: '$profileImage'
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
            $project: {
                category: '$partner.category',
                speciality: '$partner.speciality',
                company: '$partner.company',
                name: '$partner.name',
                experience: '$partner.experience',
                profileImage: '$partner.profileImage',
                availableQuota: '$availableQuota',
                _id: '$hiwdocboEID'
            }
        },
        {
            $unwind: '$availableQuota'
        },
        {
            $match: {
                'availableQuota.date': { $gt: new Date() },
                'availableQuota.availablity': req.query.type
            }
        },
        { $sort: { 'availableQuota.date': -1 } }
    ]);

    if (!doctors.length) {
        return next(
            new AppError(
                'There are no doctors currently avialale. Please try again later.',
                404
            )
        );
    }
    req.query.type = undefined;
    req.searchQuery = doctors;
    return res.status(200).json({
        status: 'Success',
        docs: doctors
    });
    // return next();
});

// querydocotrs
exports.queryDoctors = factoryControllers.queryWithAggragate();

// send json for query populate
exports.sendJsonForQuery = factoryControllers.sendAllFilter();

// get a doctor
exports.getaDoctor = catchAsync(async (req, res, next) => {
    const doctors = await onlineConsultancyAvailablityModel.aggregate([
        {
            $match: {
                hiwdocboEID: req.params.serviceId
            }
        },
        {
            $unwind: '$availableQuota'
        },
        {
            $match: {
                'availableQuota.day': req.params.date * 1
            }
        }
    ]);

    if (!doctors.length) {
        return next(
            new AppError(
                'There are no doctors currently avialale. Please try again later.',
                404
            )
        );
    }
    const data = await partnerModel.findById(doctors[0].partnerId);
    if (data.status === 'pending') {
        return next(
            new AppError('Somthing went wrong while This doctor.', 401)
        );
    }

    return res.status(200).json({
        status: 'Success',
        docs: doctors
    });
});

// get check doctor and doctor appointment
exports.checkDoctorandDoctorAppoinment = catchAsync(async (req, res, next) => {
    const startDate = new Date(new Date(req.body.date).setHours(00, 00, 00));
    const endDate = new Date(new Date(req.body.date).setHours(23, 59, 59, 999));
    const [datacheck, slotcheck] = await Promise.all([
        onlineConsultancyAvailablityModel.aggregate([
            {
                $match: { hiwdocboEID: req.params.serviceId }
            },
            {
                $unwind: '$availableQuota'
            },
            {
                $match: {
                    'availableQuota.date': {
                        $gte: startDate,
                        $lte: endDate
                    },
                    'availableQuota.availableTime': { $in: [req.body.time] },
                    'availableQuota.availablity': req.body.via
                }
            }
        ]),
        bookOnlineConsultancyModel.aggregate([
            {
                $match: {
                    slotEID: req.params.serviceId,
                    time: req.body.time,
                    via: req.body.via,
                    date: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    $and: [
                        { status: { $ne: 'canceled' } },
                        { status: { $ne: 'rejected' } }
                    ]
                }
            }
        ])
    ]);
    console.log(slotcheck);
    if (
        slotcheck.length &&
        slotcheck[0].userId.toString() === req.user._id.toString()
    ) {
        return next(new AppError('You already booked this slot', 400));
    }
    if (!datacheck.length) {
        return next(new AppError('Please select the valid data to book', 400));
    }

    if (slotcheck.length >= datacheck[0].availableQuota.slotsInHour) {
        return next(
            new AppError(
                "This slot alreay reached it's limit. please chage the day of the slot."
            )
        );
    }
    req.body = {
        hiwdocboEID: await encryptID(process.env.ONLINE_CONSULTANT_SECRET),
        doctorEID: datacheck[0].doctorEID,
        slotEID: datacheck[0].hiwdocboEID,
        date: req.body.date,
        time: req.body.time,
        via: datacheck[0].availableQuota.availablity,
        createdAt: Date.now(),
        userId: req.user._id,
        description: req.body.description,
        bookType: 'online'
    };
    return next();
});

// book new user
exports.bookOnlineConsultant = factoryControllers.createOne(
    bookOnlineConsultancyModel
);

// cancel requester request
exports.assignDataForCancelReques = catchAsync(async (req, res, next) => {
    req.updateOneSearch = {
        hiwdocboEID: req.params.slotId,
        userId: req.user._id,
        $and: [{ status: { $ne: 'canceled' } }, { status: { $ne: 'rejected' } }]
    };
    req.body.cancelTime = Date.now();
    req.body.status = 'canceled';
    return next();
});

// cancel requerster
exports.updateOnlineConsultancySlotBokking = factoryControllers.updateOne(
    bookOnlineConsultancyModel
);

// assign data for get a service
exports.assignGetACunsultantData = (req, res, next) => {
    req.searchQuery = { hiwdocboEID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -consultantId'
        }
    ];
    return next();
};

// find data by id
exports.findServiceById = factoryControllers.findOneWithPopulate(
    onlineConsultancyAvailablityModel
);

// assign data for market product reivews
exports.assingDMarketData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        consultantId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            consultantId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createOpticalsReview = factoryControllers.upsertOne(
    onlineConsultantReviewModel
);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await onlineConsultantReviewModel.aggregate([
        {
            $match: {
                consultantId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$consultantId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await onlineConsultancyAvailablityModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].length
            }
        );
    } else {
        await onlineConsultancyAvailablityModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            }
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Online Consultancy',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body = { from: 'Online Consultancy' };
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Online Consultancy',
        hiwnadmID: req.params.adId
    };
    return next();
};

// create new quote
exports.getDataForQuoteFromOnlineConsultancy = catchAsync(
    async (req, res, next) => {
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
                            from: 'Online Consultancy',
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
    }
);

// assign data for get my qutoes
exports.assignDataForGetMyQuotes = (req, res, next) => {
    req.body = { from: 'Online Consultancy' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Online Consultancy'
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
        from: 'Online Consultancy'
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
        from: 'Online Consultancy',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};
