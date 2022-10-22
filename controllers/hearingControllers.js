/* eslint-disable no-octal */
// ============================================================
// import packages
const { default: mongoose } = require('mongoose');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const AWS = require('aws-sdk');

// ============================================================
// import model
const partnerModel = require('../models/shared/partnerModel');
const hearingAidModel = require('../models/HearingAID/createHearingAidModel');
const addressModel = require('../models/shared/addUserAddressModel');
const orderHearingaidModel = require('../models/HearingAID/orderHearingAidModel');
const bookHearingAidHospitalModel = require('../models/HearingAID/bookHearingAidHosptialModel');
const orderDifferentlyAbledProduct = require('../models/HearingAID/orderDifferentlyAbledProduct');
const differentlyabledProductModel = require('../models/HearingAID/createDifferentlyAbledProductModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const hearingAidProductModel = require('../models/HearingAID/hearingAidProductModel');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const hearingAidReviewModel = require('../models/HearingAID/hearingAidReview');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const twentyfourToTwelve = require('twentyfour-to-twelve');
const sharp = require('sharp');
const orderDifferentlyAbledProductModel = require('../models/HearingAID/orderDifferentlyAbledProduct');
const ApiFeature = require('../util/apiFeatures');

/// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Hearing AID'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

/// assign partner search data
exports.assignPartnerSearchDataForShop = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Hearing AID',
        'hearingAid.serviceType': 'shop'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

// check the partner and councilar
exports.checkValidVendorandPartnerHearingAid = catchAsync(
    async (req, res, next) => {
        const [partner, ambulance] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Hearing AID'
            }),
            hearingAidModel.exists({ userId: req.user._id })
        ]);

        if (!partner) {
            return next(
                new AppError('Please verify or create partner service.', 400)
            );
        }
        if (ambulance) {
            return next(new AppError('You already regsitered a service.', 400));
        }

        req.body.userId = req.user._id;
        req.body.partnerId = partner._id;
        req.body.createdAt = Date.now();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.body.hiwhamID = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
        return next();
    }
);

// create new service
exports.createNewService = factoryControllers.createOne(hearingAidModel);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// send created new service  to client
exports.sendServiceUpdateJson = factoryControllers.sendJsonForUpdateOne();

// update hearing aid product order
exports.updateHearingAidOrder =
    factoryControllers.updateOne(orderHearingaidModel);

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhamID: req.params.serviceid
    };
    return next();
};

// update home care service
exports.updateHearingAidService = factoryControllers.updateOne(partnerModel);

// delete homecare service
exports.deleteHearingAidService = catchAsync(async (req, res, next) => {
    const data = await hearingAidModel.deleteOne({
        userId: req.user._id,
        hiwhamID: req.params.serviceid
    });
    if (!data.deletedCount) {
        return next(
            new AppError(
                'Something went wrong while proessing your request',
                400
            )
        );
    }
    return next();
});

// ============================================================
// order hearing aid
exports.assignOrderHearingAidData = catchAsync(async (req, res, next) => {
    const [product, address] = await Promise.all([
        hearingAidModel.findById(req.params.productId),
        addressModel.findById(req.params.addressId).lean()
    ]);

    address._id = null;
    address.userId = null;
    delete address._id;
    delete address.user;
    delete address.__v;
    req.body = {
        name: product.name,
        productName: product.productName,
        price: product.price,
        productId: product._id,
        userId: req.user._id,
        address
    };
    return next();
});

// get all servie
exports.getAllHearingId = factoryControllers.getFindAllFilter(partnerModel);

// send json for all
exports.sendJsonAll = factoryControllers.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = {
        hiwpmID: req.params.serviceId,
        status: 'accepted',
        for: 'Hearing AID',
        'hearingAid.serviceType': { $ne: 'shop' }
    };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -hearingaidId'
        }
    ];
    return next();
};

// find data by id
exports.findServiceById = factoryControllers.findOne(partnerModel);

// get related sevend data
exports.getAllTopSellingHearingAidData = catchAsync(async (req, res, next) => {
    // const filterdData = await orderHearingaidModel.aggregate([
    //     {
    //         $match: {
    //             'product.productId': { $ne: req.body.findOnePopulateDocs._id }
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: '$product.productId',
    //             name: { $first: '$product.name' },
    //             bannerImage: { $first: '$product.bannerImage' },
    //             count: { $sum: 1 }
    //         }
    //     },
    //     {
    //         $sort: {
    //             count: -1
    //         }
    //     },
    //     {
    //         $limit: 7
    //     }
    // ]);

    return res.status(200).json({
        status: 'Success',
        docs: req.docs
        // topSelling: filterdData
    });
});

// assign data for hearing aid product reivews
exports.assingDeAddictionReviewData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        hearingaidId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            hearingaidId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createHearingAIDReview = factoryControllers.upsertOne(
    hearingAidReviewModel
);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await hearingAidReviewModel.aggregate([
        {
            $match: {
                hearingaidId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$hearingaidId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await hearingAidModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].length
            }
        );
    } else {
        await hearingAidModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            }
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assin data for book hosptal
exports.verifyandAssignDataForBookHospital = catchAsync(
    async (req, res, next) => {
        const startDate = new Date(
            new Date(req.body.date).setHours(0, 0, 0, 0)
        );
        if (
            new Date().setHours(0, 0, 0, 0) >=
            new Date(req.body.date).setHours(0, 0, 0, 0)
        ) {
            return next(
                new AppError(
                    'You can only able to book dates from tomorrow',
                    400
                )
            );
        }
        const endDate = new Date(
            new Date(req.body.date).setHours(23, 59, 59, 999)
        );
        const [partner, bookslot] = await Promise.all([
            partnerModel.findOne({
                hiwpmID: req.params.hospitalId,
                'hearingAid.serviceType': 'hospital',
                status: 'accepted'
            }),
            bookHearingAidHospitalModel.find({
                hospitalEID: req.params.hospitalId,
                bookedDate: {
                    $gte: startDate,
                    $lte: endDate
                },
                $and: [
                    { status: { $ne: 'canceled' } },
                    { status: { $ne: 'rejected' } }
                ]
            })
        ]);
        if (!partner) {
            return next(
                new AppError('Something wrong with this hospital', 400)
            );
        }
        if (bookslot.length > process.env.HEARING_AID_BOOKING_LIMIT * 1) {
            return next(
                new AppError(
                    `All slots booked on ${new Date(
                        req.body.date
                    ).toLocaleDateString()}.So please try some other dates to book.`,
                    400
                )
            );
        }
        if (bookslot.length) {
            const [someVheck] = await Promise.all([
                bookslot.some(
                    (el) =>
                        el.userId.toString() === req.user._id.toString() &&
                        el.status !== 'canceled'
                )
            ]);
            if (someVheck) {
                return next(
                    new AppError(
                        `You already booked slot on ${new Date(
                            req.body.date
                        ).toLocaleDateString()}.So please try some other dates to book.`,
                        400
                    )
                );
            }
        }
        req.body.hospitalEID = partner.hiwpmID;
        req.body.hospitalId = partner._id;
        req.body.userId = req.user._id;
        req.body.hiwbhhID = await encryptID(process.env.HEARINGAID_SECRET);
        req.body.createdAt = Date.now();

        req.body.bookedDate = req.body.date;
        return next();
    }
);

// assign data for candel hearing aid hospital bookinge
exports.assignDataforCanceHearingaidHospital = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwbhhID: req.params.bookingId,
        $or: [{ status: 'accepted' }, { status: 'requested' }]
    };

    req.body = {
        status: 'canceled',
        userResponseDescription: req.body.cause,
        userResponseDate: Date.now()
    };
    return next();
};

// book new slot
exports.bookHearingAidHospital = factoryControllers.createOne(
    bookHearingAidHospitalModel
);

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, hearingAid] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Hearing AID'
        }),
        hearingAidModel.findOne({
            userId: req.user._id,
            hiwhamID: req.params.serviceId
        })
    ]);
    if (!partner || !hearingAid) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.hearingAidId = hearingAid._id;
    req.body.hearingAidEID = hearingAid.hiwhamID;
    req.body.parentEID = hearingAid.hiwhamID;
    req.body.partnerId = partner._id;
    req.body.availablity = hearingAid.availablity;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Hearing AID',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Hearing AID';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Hearing AID',
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
                        proposalDate: el.proposalDate,
                        productDescription: el.productDescription,
                        quantity: el.quantity,
                        hiwmmqrrsID: await encryptID(
                            process.env.MEDICAL_MARKET_SECRET
                        ),
                        userId: req.user._id,
                        for: uuid,
                        from: 'Hearing AID',
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
    req.body = { from: 'Hearing AID' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Hearing AID'
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
        from: 'Hearing AID'
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
        from: 'Hearing AID',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// hearing aid controllers
exports.updateHearingAidProducts = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.facilitieId ?? 0);

    req.query.objData = {
        services: { $elemMatch: { hiwdacfls: req.query.facilitieId } }
    };
    if (!req.query.facilitieId || !uuiddetails) {
        req.query.facilitieId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    // if (req.params.service === 'update' || req.params.service === 'delete') {
    const a = await deaddictionModel.updateOne(
        {
            userId: req.user._id,
            ...req.query.objData
        },
        {
            $pull: { fecilities: { hiwdacfls: req.query.facilitieId } }
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
                    fecilities: {
                        hiwdacfls: req.query.facilitieId,
                        name: req.body.name,
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

// assign data for createinga new hearing aid product
exports.assignAndVerifyPartnerData = catchAsync(async (req, res, next) => {
    const [data] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            'hearingAid.serviceType': 'shop'
        })
    ]);
    if (!data) {
        return next(new AppError('You are not a valid vendor.', 400));
    }

    req.body?.productDetails &&
        (req.body.productDetails = await Promise.all(
            req.body.productDetails.map(async (el) => {
                const uuid = await encryptID(process.env.HEARINGAID_SECRET);
                return {
                    color: el.color,
                    size: el.size,
                    price: el.price,
                    discountPrice: el.discountPrice,
                    bannerImage: el.bannerImage,
                    imageGallery: el.imageGallery,
                    hiwhapdsID: uuid
                };
            })
        ));

    req.body.createdAt = Date.now();
    req.body.userId = req.user._id;
    req.body.partnerId = data._id;
    req.body.hiwhapnsID = await encryptID(process.env.HEARINGAID_SECRET);
    req.body.address = data.address;
    return next();
});

// assign data fo rverify partner
exports.assignDataForFindPartner = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Hearing AID',
        'hearingAid.serviceType': 'shop'
    };
    return next();
};

// verify valid data in opticals
exports.verifyHeaingaidProductData = catchAsync(async (req, res, next) => {
    req.body.city = req.docs.city;
    req.body.address = req.docs.address;
    req.body.partnerId = req.docs._id;
    if (req.body.statusType === 'create') {
        req.body.userId = req.user._id;
        req.body.createdAt = Date.now();
        req.body.hiwhapnsID = await encryptID(process.env.OPTICAL_SECRET);
    } else if (req.body.statusType !== 'update') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    return next();
});

// save json
exports.saveFilesAsJbgForHearingAidProduct = catchAsync(
    async (req, res, next) => {
        if (req.body.statusType === 'create') {
            req.body.productDetails = await Promise.all(
                req.body.productDetails.map(async (el) => {
                    const image = sharp(Buffer.from(el.bannerImage))
                        .resize(req.image.resizeW * 1, req.image.resizeH * 1)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 });

                    const imageGallery = await Promise.all(
                        el.imageGallery.map((els2) =>
                            sharp(Buffer.from(els2))
                                .resize(
                                    req.image.resizeW * 1,
                                    req.image.resizeH * 1
                                )
                                .toFormat('jpeg')
                                .jpeg({ quality: 90 })
                        )
                    );
                    return {
                        ...el,
                        bannerImage: image,
                        imageGallery: imageGallery
                    };
                })
            );
        } else if (req.body.statusType === 'update') {
            req.body.productDetails = await Promise.all(
                req.body.productDetails.map(async (el) => {
                    let image, imageGallery;

                    if (el.bannerImage) {
                        image = sharp(Buffer.from(el.bannerImage))
                            .resize(
                                req.image.resizeW * 1,
                                req.image.resizeH * 1
                            )
                            .toFormat('jpeg')
                            .jpeg({ quality: 100 });
                    }
                    if (el.imageGallery) {
                        imageGallery = await Promise.all(
                            el.imageGallery.map((els2) =>
                                sharp(Buffer.from(els2))
                                    .resize(
                                        req.image.resizeW * 1,
                                        req.image.resizeH * 1
                                    )
                                    .toFormat('jpeg')
                                    .jpeg({ quality: 90 })
                            )
                        );
                    }
                    return {
                        ...el,
                        bannerImage: image,
                        imageGallery: imageGallery
                    };
                })
            );
        }

        return next();
    }
);

// save optical product to aws
exports.saveHearingaidProductToAWS = catchAsync(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    if (req.body.statusType === 'create') {
        req.body.productDetails = await Promise.all(
            req.body.productDetails.map(async (el, index) => {
                const eID = await encryptID(process.env.OPTICAL_SECRET);
                const imageName = `${`${`${req.user._id
                    .toString()
                    .split(/[a-z]+/)
                    .join('')}-${eID.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${imageName}-hearingaid-product-banner.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el.bannerImage
                };
                let image = '';
                try {
                    image = await s3.upload(params).promise();
                    image = image.Location;
                } catch (error) {
                    return next(
                        new AppError(
                            'Somehing went wrong while processing your request.Please try again.',
                            401
                        )
                    );
                }
                const imageGallery = await Promise.all(
                    el.imageGallery.map(async (els2, index) => {
                        const params2 = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: `${imageName}-hearingaid-product-gallery-${index}.jpeg`,
                            ContentType: 'image/jpeg',
                            Body: els2
                        };

                        const gal = await s3.upload(params2).promise();
                        return gal.Location;
                    })
                );

                const subDetails = await Promise.all(
                    el.subDetails.map(async (els, index2) => {
                        const esID = await encryptID(
                            process.env.OPTICAL_SECRET
                        );

                        if (index === 0 && index2 === 0) {
                            req.body.price = els.price;
                            req.body.discountPrice = els.discountPrice;
                            req.body.bannerImage = image;
                            req.body.imageGallery = imageGallery;
                        }
                        return {
                            ...els,
                            hiwhaicscpID: esID
                        };
                    })
                );
                return {
                    ...el,
                    subDetails,
                    hiwhapdsID: eID,
                    bannerImage: image,
                    imageGallery: imageGallery
                };
            })
        );
    } else if (req.body.statusType === 'update') {
        const hearingaidProduct = await hearingAidProductModel.findOne({
            userId: req.user._id,
            partnerId: req.docs._id,
            hiwhapnsID: req.params.hearingaidId
        });

        if (!hearingaidProduct) {
            return next(new AppError('Product not found', 404));
        }
        req.body.productDetails = await Promise.all(
            req.body.productDetails.map(async (el, index) => {
                let eID = el.id;
                if (el.id === undefined) {
                    if (!el.bannerImage || !el.imageGallery) {
                        return next(
                            new AppError(
                                'If your are try add to new product details, make sure you added banner image and gallery images.',
                                400
                            )
                        );
                    }
                    el.hiwhapdsID = await encryptID(process.env.OPTICAL_SECRET);
                    eID = el.hiwhapdsID;
                }

                let image, imageGallery, filteredData;
                if (!el.bannerImage || !el.imageGallery) {
                    [filteredData] = await Promise.all(
                        hearingaidProduct.productDetails.filter((els) => {
                            return els.hiwhapdsID === el.id;
                        })
                    );
                }
                const imageName = `${`${`${req.user._id
                    .toString()
                    .split(/[a-z]+/)
                    .join('')}-${eID.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}`;
                if (el.bannerImage) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET,
                        Key: `${imageName}-hearingaid-product-banner.jpeg`,
                        ContentType: 'image/jpeg',
                        Body: el.bannerImage
                    };

                    try {
                        image = await s3.upload(params).promise();
                        image = image.Location;
                    } catch (error) {
                        return next(
                            new AppError(
                                'Somehing went wrong while processing your request.Please try again.',
                                401
                            )
                        );
                    }
                } else {
                    image = filteredData.bannerImage;
                }
                if (el.imageGallery) {
                    imageGallery = await Promise.all(
                        el.imageGallery.map(async (els, index) => {
                            const params2 = {
                                Bucket: process.env.AWS_BUCKET,
                                Key: `${imageName}-hearingaid-product-gallery-${index}.jpeg`,
                                ContentType: 'image/jpeg',
                                Body: els
                            };

                            const gal = await s3.upload(params2).promise();
                            return gal.Location;
                        })
                    );
                } else {
                    imageGallery = filteredData.imageGallery;
                }

                const subDetails = await Promise.all(
                    el.subDetails.map(async (els, index2) => {
                        let eID2 = els.id;
                        if (els.id === undefined) {
                            els.hiwhaicscpID = await encryptID(
                                process.env.OPTICAL_SECRET
                            );
                            eID2 = els.hiwhaicscpID;
                        }

                        if (index === 0) {
                            req.body.price = els.price;
                            req.body.discountPrice = els.price;
                            req.body.bannerImage = image;
                            req.body.imageGallery = imageGallery;
                        }

                        return {
                            ...els,

                            hiwhaicscpID: eID
                        };
                    })
                );
                return {
                    ...el,
                    subDetails,
                    hiwhapdsID: eID,
                    bannerImage: image,
                    imageGallery: imageGallery
                };
            })
        );
    } else {
        return next(new AppError('Bad Request', 400));
    }

    return next();
});
// set image for hearing aid product
// set image size
exports.setImageSizeForHearingAidProduct = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    return next();
};

// create new product
exports.createNewHearingAid = factoryControllers.createOne(
    hearingAidProductModel
);

// assign data for get all hearing aid
exports.assignDataForGetAllHearingAid = (req, res, next) => {
    req.searchQuery = { status: 'accepted', for: 'Hearing AID' };
    return next();
};

// filter hearinga id partner data
exports.filterOpticalShowRoomData = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'name',
            'phone',
            'centerPhone',
            'centerLandLine',
            'latitude',
            'longtitude',
            'openTime',
            'closeTime',
            'address',
            'batteryChanging',
            'noiceFixing',
            'cleaningCharge',
            'city'
        )
    ]);

    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longtitude, req.body.latitude]
    };
    if (req.body.batteryChanging)
        req.body = {
            ...req.body,
            'hearingAid.batteryChangeCharge': req.body.batteryChanging,
            'hearingAid.noiseFixCharge': req.body.noiceFixing,
            'hearingAid.cleaningCharge ': req.body.cleaningCharge * 1
        };
    req.body = { $set: req.body };
    console.log(req.body);
    return next();
});

// assign data for opticals
exports.assignDataForUpdateOpticals = (req, res, next) => {
    req.updateOneSearch = {
        hiwpmID: req.params.hearingaidID,
        userId: req.user._id,
        for: 'Hearing AID'
    };

    return next();
};

// get booking data for the hospital
exports.getHearingAidHospitalBookingData = catchAsync(
    async (req, res, next) => {
        if (req.docs.hearingAid.serviceType !== 'hospital') {
            return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
        }
        const [booking] = await bookHearingAidHospitalModel.aggregate([
            {
                $match: {
                    hospitalId: req.docs._id
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
                                        $project: {
                                            name: 1,
                                            phone: 1
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
                                $or: [
                                    {
                                        status: 'rejected'
                                    },
                                    {
                                        status: 'canceled'
                                    },
                                    {
                                        status: 'not-arrived'
                                    },
                                    {
                                        status: 'completed'
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
                                        $project: {
                                            name: 1,
                                            phone: 1
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
        ]);
        req.body.booking = booking;
        return next();
    }
);

// get-product data
exports.getHearingaidProduct = catchAsync(async (req, res, next) => {
    if (req.docs.hearingAid.serviceType !== 'shop') {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }
    const [products, [orders]] = await Promise.all([
        hearingAidProductModel.find({
            userId: req.user._id,
            partnerId: req.docs._id
        }),
        orderHearingaidModel.aggregate([
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
    req.body.orders = orders;
    return next();
});

// assign data for find partnter
exports.assignDataForFindParterForHearingaidHospital = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        'hearingAid.serviceType': 'hospital'
    };
    return next();
};

// assign data for update the status
exports.assignDataForUpdateHospitalBookingStatus = catchAsync(
    async (req, res, next) => {
        const [booking] = await Promise.all([
            bookHearingAidHospitalModel.findOne({
                hiwbhhID: req.params.hearingaidId
            })
        ]);

        if (req.params.status === 'accepted') {
            if (booking.status !== 'requested') {
                return next(
                    new AppError(
                        `This request is already ${booking.status}. So, we can't accept your request.`,
                        400
                    )
                );
            }
            req.body.scheduleTime = twentyfourToTwelve(req.body.time);

            const regex = /^([0]\d|[1][0-2]):([0-5]\d)\s?(?:AM|PM)$/i;
            if (!regex.test(req.body.scheduleTime)) {
                return next(
                    new AppError(
                        'Please select the proper data time to schedule'
                    )
                );
            }
            req.body.vendorActionDate = Date.now();
            req.body.vendorResposnse = req.body.description;
        } else if (req.params.status === 'rejected') {
            if (
                booking.status !== 'requested' &&
                booking.status !== 'accepted'
            ) {
                return next(
                    new AppError(
                        `This request is already ${booking.status}. So, we can't accept your request.`,
                        400
                    )
                );
            }
            req.body.vendorResposnse = req.body.description;
        } else if (req.params.status === 'not-arrived') {
            if (booking.status !== 'accepted') {
                return next(
                    new AppError(
                        `This request is already ${booking.status}. So, we can't accept your request.`,
                        400
                    )
                );
            }
            req.body.notArrivedResposnse = req.body.description;
            req.body.notArrivedResposnseDate = Date.now();
        } else {
            return next(new AppError('Please select the valide status', 400));
        }
        req.updateOneSearch = {
            hospitalId: req.docs._id,
            hiwbhhID: req.params.hearingaidId
        };
        req.body.status = req.params.status;
        return next();
    }
);

// update hospital booking status
exports.updateHearingaidHospitalBookingStatus = factoryControllers.updateOne(
    bookHearingAidHospitalModel
);

// assign data for update optical product
// assign partner search data
exports.assignDataForUpdateHearingaidProduct = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhapnsID: req.params.hearingaidId
    };
    return next();
};
// update hearign aid product
exports.updateHearingAidProduct = factoryControllers.updateOne(
    hearingAidProductModel
);

// assign data for update the hearingaid product order status
exports.assignDataforUpdateHearingaidProductStatus = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            partnerId: req.docs._id,
            hiwonhas: req.params.orderId
        };
        const order = await orderHearingaidModel.findOne({
            partnerId: req.docs._id,
            hiwonhas: req.params.orderId
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

// set image name
exports.assignImageNameForHearingaidService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhapdpID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-hearingaid-bannerimage`;
        req.image.galleryName = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhapdpID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-hearingaid-gallery`;
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
        .join('')}-hearingaid-bannerimage`;
    req.image.galleryName = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.productId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hearingaid-gallery`;
    return next();
};

// get my hearing aid hospita booking
exports.getMyHearingAidBooking = catchAsync(async (req, res, next) => {
    const [booking] = await bookHearingAidHospitalModel.aggregate([
        { $match: { userId: req.user._id } },
        {
            $lookup: {
                from: 'partners',
                localField: 'hospitalId',
                foreignField: '_id',
                pipeline: [
                    {
                        $project: {
                            company: 1,
                            centerPhone: 1,
                            profileImage: 1,
                            _id: 0
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
                                    status: 'requested'
                                },
                                {
                                    status: 'accepted'
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
                                    status: { $ne: 'requested' }
                                },
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

    console.log({
        name: req.docs.name,
        id: req.docs.hiwuueidmID,
        profileImage: req.docs.profileImage,
        phone: req.docs.phone
    });
    req.body.booking = booking;
    return next();
});

// get my hospita orders
exports.getMyHearingAidOrders = catchAsync(async (req, res, next) => {
    const [orders] = await orderHearingaidModel.aggregate([
        { $match: { userId: req.user._id } },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            status: 'pending'
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            status: { $ne: 'pending' }
                        }
                    }
                ]
            }
        }
    ]);

    req.body.orders = orders;
    return next();
});

// get my differenly abled product
exports.getMyDifferentlyAbledOrders = catchAsync(async (req, res, next) => {
    const [orders] = await orderDifferentlyAbledProductModel.aggregate([
        { $match: { userId: req.user._id } },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            status: 'pending'
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            status: { $ne: 'pending' }
                        }
                    }
                ]
            }
        }
    ]);

    req.body.orders = orders;
    return next();
});

// // assing data for cancel request
exports.assignDataForExpertServiceUser = catchAsync(async (req, res, next) => {
    const application = await bookHearingAidHospitalModel.findOne({
        hiwbhhID: req.params.hearingaidId
    });
    if (!application) {
        return next(new AppError('No service found', 404));
    }
    req.body.status = req.params.status;
    req.updateOneSearch = {
        hiwbhhID: req.params.hearingaidId
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
        req.body.userResponseDescription = req.body.cause;
        req.body.userRespondBy = 'admin';
        req.body.userResponseDate = Date.now();
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

// // assing data for hearinga id order
exports.assignDataForHearingAidOrderStatus = catchAsync(
    async (req, res, next) => {
        const application = await orderHearingaidModel.findOne({
            hiwonhas: req.params.orderId
        });
        if (!application) {
            return next(new AppError('No service found', 404));
        }
        req.body.status = req.params.status;
        req.updateOneSearch = {
            hiwonhas: req.params.orderId
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

// update hearing aid hospital status
exports.updateHearingAidBookingDetails = factoryControllers.updateOne(
    bookHearingAidHospitalModel
);

// get all hearing aid products
exports.getAllHearingaidPartners =
    factoryControllers.getFindAllFilter(partnerModel);

// send json for get all hearing aid products
exports.sendJsonForGetAllFilterData = factoryControllers.sendAllFilter();

// assign data for get all hearing aid product
exports.assignDataForGetAllHearingaid = catchAsync(async (req, res, next) => {
    if (req.params.type === 'hospital') {
        req.searchQuery = {
            status: 'accepted',
            for: 'Hearing AID',
            'hearingAid.serviceType': 'hospital'
        };
        return next();
    } else if (req.params.type === 'repairStore') {
        req.searchQuery = {
            status: 'accepted',
            for: 'Hearing AID',
            'hearingAid.serviceType': 'repairStore'
        };
        return next();
    } else if (req.params.type === 'shop') {
        const apiClass = new ApiFeature(
            hearingAidProductModel.find(req.searchQuery).populate({
                path: 'partner',
                match: { status: 'accepted' }
            }),
            req.query
        )
            .filter()
            .sort()
            .fieldSelect();
        // .pagenate();
        let product = await apiClass.query;
        product = await Promise.all(
            product.filter((el) => !!el.partner.length)
        );
        return res.status(200).json({
            status: 'Success',
            docs: product
        });
    } else {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
});

// get a hearinga id porduct
exports.getAHearingAidProduct = catchAsync(async (req, res, next) => {
    const [producData] = await hearingAidProductModel.aggregate([
        {
            $match: {
                hiwhapnsID: req.params.productId
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: { status: 'accepted' }
                    }
                ],
                as: 'partners'
            }
        }
        // {
        //     $unwind: '$partners'
        // }
    ]);
    if (!producData) {
        return next(new AppError('Product Not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs: producData
    });
});

//assign data for get my ordres
exports.assignDataForGetMyHearingaidOrders = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// find hearing aid orders
exports.getMyhearringAidOrder =
    factoryControllers.getFindAllFilter(orderHearingaidModel);

//assign data for get my ordres
exports.assignDataForGetMyDifferenlyAbledOrders = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// find hearing aid orders
exports.getMyDifferentlyAbledOrder = factoryControllers.getFindAllFilter(
    orderDifferentlyAbledProduct
);

// send json for get hearing aid
exports.sendJsonforFilter = factoryControllers.sendAllFilter();

// assign data for  get a hearing aid ordres
exports.assignDataforGetAhearingAid = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwonhas: req.params.orderId
    };
    return next();
};

// assign data for  get a fifferentyle ordres
exports.assignDataforGetAhDifferetnlyAbled = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwdaposID: req.params.orderId
    };
    return next();
};

// get a hearin aid order
exports.getAHearingAidOrder = factoryControllers.findOne(orderHearingaidModel);

// get a differently abled order
exports.getADifferentlyAbledOrder = factoryControllers.findOne(
    orderDifferentlyAbledProduct
);

// send json for get one
exports.sendJsonForGetOne = factoryControllers.sendJsonForFindOne();

// assign data for hospital booking
exports.assignDataForHospitalBooking = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.queryPopulate = { path: 'hosital' };
    return next();
};

// get all hearing aid hospital booking
exports.getAllHearingaidHospitalBooking =
    factoryControllers.getFindAllWithPopulateFilter(
        bookHearingAidHospitalModel
    );

// assigna data for get booked hearing aid hospittal
exports.assignDataForGetAheairnAidHospitalBooking = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwbhhID: req.params.bookingId
    };
    req.queryPopulate = { path: 'hosital' };
    return next();
};

// get a hearinga id bookinga
exports.getAHearingAidHospitalBooking = factoryControllers.findOneWithPopulate(
    bookHearingAidHospitalModel
);

// send json for find one with poulter
exports.sendJsonForFindOneWithPopulte =
    factoryControllers.sendJsonForFindOneWithPopulate();
