// ============================================================
// import packages
const { default: mongoose } = require('mongoose');
const AWS = require('aws-sdk');
const twentyfourToTwelve = require('twentyfour-to-twelve');
// ============================================================
// import model
const partnerModel = require('../models/shared/partnerModel');
const opticalModel = require('../models/Opticals/opticalModels');
const opticalOrderModel = require('../models/Opticals/opticalOrderModel');
const addressModel = require('../models/shared/addUserAddressModel');
const opticalShowroomModel = require('../models/Opticals/opticalShowroomModel');
const bookObticalsStoreModel = require('../models/Opticals/bookObticalsStoreModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const opticalsReviewModel = require('../models/Opticals/opticalsReviewModel');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const multer = require('multer');
const sharp = require('sharp');

// ============================================================
// create controllers
/// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Opticals'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// assign data for opticals
exports.assignDataForUpdateOpticals = (req, res, next) => {
    req.updateOneSearch = {
        hiwpmID: req.params.serviceId,
        userId: req.user._id,
        for: 'Opticals'
    };

    return next();
};

// assign partner id for optical show room
exports.assignPartnerIdForOpticals = catchAsync(async (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.hiwosrmID = await encryptID(process.env.OPTICAL_SECRET);
    return next();
});

// filter opticals data
exports.filterOpticalShowRoomData = catchAsync(async (req, res, next) => {
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
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
});

// create new service
exports.createNewshowroom = factoryController.createOne(opticalShowroomModel);

// create new service
exports.createNewService = factoryController.createOne(opticalModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// assign showroom search data
exports.assignValidShowroomSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwonsmID: req.params.serviceid
    };
    return next();
};
// update home care service
exports.updateOpticalsShowroomService =
    factoryController.updateOne(partnerModel);

// assign partner search data
exports.assignDataForUpdateOpticalProduct = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwnopmID: req.params.serviceId
    };
    return next();
};
// update home care service
exports.updateOpticalsService = factoryController.updateOne(opticalModel);

// send created new service  to client
exports.sendServiceUpdateJson = factoryController.sendJsonForUpdateOne();

// delete homecare service
exports.deleteOpticalsService = catchAsync(async (req, res, next) => {
    const data = await opticalModel.deleteOne({
        userId: req.user._id,
        hiwonsmID: req.params.serviceid
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

// order hearing aid
exports.orderOpticals = catchAsync(async (req, res, next) => {
    const [address, product] = await Promise.all([
        addressModel.findOne({ hiwnusID: req.params.address }).lean(),
        opticalModel.findOne({ hiwnopmID: req.params.id })
    ]);

    if (!address) {
        return next(new AppError('Address not found,', 404));
    }
    if (!product) {
        return next(new AppError('Product not found,', 404));
    }
    address._id = address.hiwnusID = address.userId = undefined;
    let datacheck = await Promise.all(
        product.frameDetails.map(async (el) => {
            if (
                el.frameType === req.body.frameType &&
                el.color === req.body.color &&
                el.availableSize === req.body.availableSize
            ) {
                req.body.opticalPrice = el.opticalPrice;
                req.body.opticalDiscountPrice = el.opticalDiscountPrice;
                req.body.hiwonsmID = await encryptID(
                    process.env.OPTICAL_SECRET
                );
                req.body.addressDetails = address;
                req.body.name = product.name;
                req.body.partnerId = product.partnerId;
                req.body.userId = req.user._id;
                req.body.createdAt = Date.now();
                req.body.materiralType = product.materiralType;
                req.body.glassFrameType = product.glassFrameType;
                req.body.glassGenderType = product.glassGenderType;
                req.body.glassType = product.glassType;
                req.body.productImage = el.frameImage;
                req.body.productImageGallery = el.frameImageGallery;
                return true;
            }
        })
    );
    datacheck = datacheck.some((el) => el === true);

    if (!datacheck) {
        return next(
            new AppError(
                'Please select the valid details for order product.',
                400
            )
        );
    }

    const orderhearingaid = await opticalOrderModel.create(req.body);
    if (!orderhearingaid) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }

    return res.status(200).json({ status: 'Success' });
});

// assing data for cancel request
exports.assignDataForCancelOpticalOrderService = (req, res, next) => {
    const bodydata = req.body.description;
    console.log(req.body);
    req.body = {};
    req.body.status = 'canceled';
    req.body.cause = bodydata;
    req.updateOneSearch = {
        hiwonsmID: req.params.orderId,
        userId: req.user._id,
        orderStatus: { $ne: 'delivered' },
        status: 'pending'
    };
    req.body.canceledDate = Date.now();
    return next();
};
// assing data for cancel booking request
exports.assignDataForCancelOpticalBookService = (req, res, next) => {
    const bodydata = req.body.description;
    req.body = {};
    req.body.status = 'canceled';
    req.body.cause = bodydata;
    req.updateOneSearch = {
        hiwosopsID: req.params.bookingId,
        userId: req.user._id
    };
    req.body.userResponseDate = Date.now();
    req.body.userResponseDescription = req.body.cause;
    return next();
};

// cancel homecare service request
exports.cancelOpticalBooking = factoryController.updateOne(
    bookObticalsStoreModel
);

// cancel homecare service request
exports.updateOpticalOrder = factoryController.updateOne(opticalOrderModel);

// send json status of homecare cancel requiest
exports.sendJsonforUpdateOne = factoryController.sendJsonForUpdateOne();

// set image size
exports.setImageSizeForOpticalProduct = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    return next();
};
// verify valid data in opticals
exports.verifyOpticalProductData = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Opticals'
        })
    ]);
    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }

    req.body.partnerId = partner._id;
    if (req.body.statusType === 'create') {
        req.body.userId = req.user._id;
        req.body.createdAt = Date.now();
        req.body.hiwnopmID = await encryptID(process.env.OPTICAL_SECRET);
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
exports.saveFilesAsJbg = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.body.frameDetails = await Promise.all(
            req.body.frameDetails.map(async (el) => {
                const image = sharp(Buffer.from(el.frameImage))
                    .resize(req.image.resizeW * 1, req.image.resizeH * 1)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 });

                const imageGallery = await Promise.all(
                    el.frameImageGallery.map((els) =>
                        sharp(Buffer.from(els))
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
                    frameImage: image,
                    frameImageGallery: imageGallery
                };
            })
        );
    } else if (req.body.statusType === 'update') {
        // const opticalProduct = await opticalModel.findOne({
        //     userId: req.user._id,
        //     partnerId: req.body.partnerId,
        //     hiwonsmID: req.params.serviceId
        // });
        // if (!opticalProduct) {
        //     return next(new AppError('Product not found', 404));
        // }
        // req.body.opticalProduct = opticalProduct;
        req.body.frameDetails = await Promise.all(
            req.body.frameDetails.map(async (el) => {
                let image, imageGallery;

                if (el.frameImage) {
                    image = sharp(Buffer.from(el.frameImage))
                        .resize(req.image.resizeW * 1, req.image.resizeH * 1)
                        .toFormat('jpeg')
                        .jpeg({ quality: 100 });
                }
                if (el.frameImageGallery) {
                    imageGallery = await Promise.all(
                        el.frameImageGallery.map((els) =>
                            sharp(Buffer.from(els))
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
                    frameImage: image,
                    frameImageGallery: imageGallery
                };
            })
        );
    }

    return next();
});

// save optical product to aws
exports.saveOpticalProductToAWS = catchAsync(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    if (req.body.statusType === 'create') {
        req.body.frameDetails = await Promise.all(
            req.body.frameDetails.map(async (el, index) => {
                const eID = await encryptID(process.env.OPTICAL_SECRET);

                const imageName = `${`${`${req.user._id
                    .toString()
                    .split(/[a-z]+/)
                    .join('')}-${eID.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}`;
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${imageName}-optical-product-banner.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el.frameImage
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
                    el.frameImageGallery.map(async (els, index) => {
                        const params2 = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: `${imageName}-optical-product-gallery-${index}.jpeg`,
                            ContentType: 'image/jpeg',
                            Body: els
                        };

                        const gal = await s3.upload(params2).promise();
                        return gal.Location;
                    })
                );

                if (index === 0) {
                    req.body.opticalPrice = el.opticalPrice;
                    req.body.opticalDiscountPrice = el.opticalDiscountPrice;
                    req.body.frameImage = image;
                    req.body.frameImageGallery = imageGallery;
                }
                return {
                    ...el,
                    frameImage: image,
                    frameImageGallery: imageGallery,
                    hiwopptmID: eID
                };
            })
        );
    } else if (req.body.statusType === 'update') {
        const opticalProduct = await opticalModel.findOne({
            userId: req.user._id,
            partnerId: req.body.partnerId,
            hiwnopmID: req.params.serviceId
        });
        if (!opticalProduct) {
            return next(new AppError('Product not found', 404));
        }

        req.body.frameDetails = await Promise.all(
            req.body.frameDetails.map(async (el, index) => {
                let eID = el.id;
                if (el.id === undefined) {
                     if (!el.frameImage || !el.frameImageGallery) {
                         return next(
                             new AppError(
                                 'If your are try add to new product details, make sure you added banner image and gallery images.',
                                 400
                             )
                         );
                     }
                    el.hiwopptmID = await encryptID(process.env.OPTICAL_SECRET);
                    eID = el.hiwopptmID;
                }
                let image, imageGallery, filteredData;
                if (!el.frameImage || !el.frameImageGallery) {
                    [filteredData] = await Promise.all(
                        opticalProduct.frameDetails.filter((els) => {
                            console.log(el.id, els.hiwopptmID);
                            return els.hiwopptmID === el.id;
                        })
                    );
                }
                const imageName = `${`${`${req.user._id
                    .toString()
                    .split(/[a-z]+/)
                    .join('')}-${eID.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}`;
                if (el.frameImage) {
                    const params = {
                        Bucket: process.env.AWS_BUCKET,
                        Key: `${imageName}-optical-product-banner.jpeg`,
                        ContentType: 'image/jpeg',
                        Body: el.frameImage
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
                    image = filteredData.frameImage;
                }
                if (el.frameImageGallery) {
                    imageGallery = await Promise.all(
                        el.frameImageGallery.map(async (els, index) => {
                            const params2 = {
                                Bucket: process.env.AWS_BUCKET,
                                Key: `${imageName}-optical-product-gallery-${index}.jpeg`,
                                ContentType: 'image/jpeg',
                                Body: els
                            };

                            const gal = await s3.upload(params2).promise();
                            return gal.Location;
                        })
                    );
                } else {
                    imageGallery = filteredData.frameImageGallery;
                }

                if (index === 0) {
                    req.body.opticalPrice = el.opticalPrice;
                    req.body.opticalDiscountPrice = el.opticalDiscountPrice;
                    req.body.frameImage = image;
                    req.body.frameImageGallery = imageGallery;
                }
                return {
                    ...el,
                    frameImage: image,
                    frameImageGallery: imageGallery,
                    hiwopptmID: eID
                };
            })
        );
    } else {
        return next(new AppError('Bad Request', 400));
    }

    return next();
});

// assin data for check vallid optical
exports.assigndataForCheckValidOpticalData = (req, res, next) => {
    req.searchQuery = {
        hiwonsmID: req.params.serviceId
    };
    const checkDate =
        new Date(req.body.date).setHours(00, 00, 00).valueOf() >
        new Date(Date.now()).setHours(23, 59, 59, 999).valueOf();
    if (!checkDate) {
        return next(new AppError('Please selct the valide date', 401));
    }
    return next();
};

// find one data
exports.findOneData = factoryController.findOne(opticalModel);

// assin data for book optical
exports.assignDataForBookOpticals = catchAsync(async (req, res, next) => {
    req.searchQuery = { date: req.body.date };
    let d = new Date(req.body.date);
    d = d.valueOf() + 1000 * 60 * 60 * 24;
    const nextdate = new Date(d).toISOString().split('T')[0];
    const thatDate = new Date(req.body.date).toISOString().split('T')[0];

    const getdata = await bookObticalsStoreModel.find({
        $and: [
            {
                scheduledDate: {
                    $gte: thatDate
                }
            },
            {
                scheduledDate: {
                    $lt: nextdate
                }
            }
        ]
    });

    const [data, data2] = await Promise.all([
        getdata.some(
            (el) =>
                el.userId.toString() === req.user._id.toString() &&
                el.status !== 'canceled'
        ),
        getdata.filter((el) => el.status !== 'rejected')
    ]);

    if (data) {
        return next(
            new AppError(
                'You are already booked that in opticals on that day. Please try some other date.',
                401
            )
        );
    }
    if (data2.length >= 20) {
        return next(
            new AppError('Maximum booking reached. Try some other day.', 401)
        );
    }
    req.body.createdAt = Date.now();
    req.body.scheduledDate = req.body.date;
    req.body.userId = req.user._id;
    req.body.partnerId = req.docs.partnerId;
    req.body.hiwosopsID = await encryptID(process.env.OPTICAL_SECRET);
    return next();
});

// book opticals
exports.bookOpticals = factoryController.createOne(bookObticalsStoreModel);

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwhamID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -opticalsId'
        }
    ];
    return next();
};

// find data by id
exports.findServiceById = factoryController.findOneWithPopulate(opticalModel);

// assign data for hearing aid product reivews
exports.assingDOpticalsData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        opticalsId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            opticalsId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// create review
exports.createOpticalsReview = factoryController.upsertOne(opticalsReviewModel);

// calculate avaerage of expert service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await opticalsReviewModel.aggregate([
        {
            $match: {
                opticalsId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$opticalsId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0) {
        await opticalModel.findByIdAndUpdate(req.body.findOnePopulateDocs._id, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].length
        });
    } else {
        await opticalModel.findByIdAndUpdate(req.body.findOnePopulateDocs._id, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
    return res.status(200).json({ status: 'Success' });
});

// check the partner and councilar
exports.checkValidVendorandPartneropticals = catchAsync(
    async (req, res, next) => {
        const [partner, opticals] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Opticals'
            }),
            opticalShowroomModel.findOne({
                userId: req.user._id,
                hiwosrmID: req.params.serviceId
            })
        ]);
        if (!partner || !opticals) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }
        req.body.opticalsId = opticals._id;
        req.body.opticalsEID = opticals.hiwapspID;
        req.body.parentEID = opticals.hiwapspID;
        req.body.partnerId = partner._id;

        return next();
    }
);

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Opticals',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Opticals';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Opticals',
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
                        from: 'Opticals',
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
    req.body = { from: 'Opticals' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Opticals'
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
        from: 'Opticals'
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
        from: 'Opticals',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// create new quote
exports.getDataForQuoteFromOpticals = catchAsync(async (req, res, next) => {
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
                        from: 'Opticals',
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

// get all products ans orders
exports.getOpticalProductandOrders = catchAsync(async (req, res, next) => {
    const [products, [orders]] = await Promise.all([
        opticalModel.find({ userId: req.user._id }),
        opticalOrderModel.aggregate([
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
                                orderStatus: {
                                    $ne: 'delivered'
                                },
                                status: 'pending'
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                orderStatus: 'delivered',
                                status: { $ne: 'pending' }
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

const multerStorage = multer.memoryStorage();
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
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

// check if all data was visible
exports.uploadSinglAndMultipleImage = upload.fields([
    {
        name: 'image',
        maxCount: 1
    },
    {
        name: 'imageGallery',
        maxCount: 6
    }
]);

// get image values
exports.getUploadImageData = catchAsync(async (req, res, next) => {
    if (req.body.imageStatus === 'create') {
        req.files.imageGallery = await Promise.all(
            req.files.imageGallery.map((el) => el.buffer)
        );

        return res.status(200).json({
            status: 'Success',
            image: req.files.image[0].buffer,
            imageGallery: req.files.imageGallery
        });
    } else if (req.body.imageStatus === 'update') {
        let image, imageGallery;
        if (req.files.imageGallery?.length) {
            imageGallery = await Promise.all(
                req.files.imageGallery.map((el) => el.buffer)
            );
        } else {
            imageGallery = undefined;
        }
        if (req.files.image?.length && req.files.image[0]?.buffer) {
            image = req.files.image[0].buffer;
        } else {
            image = undefined;
        }

        return res.status(200).json({
            status: 'Success',
            image,
            imageGallery
        });
    } else
        return next(
            new AppError(
                'Something went wrong while processing your reques.',
                400
            )
        );
});

// assign data for update the optical product order status
exports.assignDataforUpdateOpticalProductStatus = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            partnerId: req.docs._id,
            hiwonsmID: req.params.orderId
        };
        const order = await opticalOrderModel.findOne({
            partnerId: req.docs._id,
            hiwonsmID: req.params.orderId
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

// assign data for update the optical product order status
exports.assignDataforUpdateOpticalBookingStatus = catchAsync(
    async (req, res, next) => {
        const booking = await bookObticalsStoreModel.findOne({
            partnerId: req.docs._id,
            hiwosopsID: req.params.bookingId
        });
        if (!booking) {
            return next(new AppError('Showroom not found', 404));
        }
        let status = req.params.status;
        const obj = {};
        if (status === 'accepted') {
            if (booking.status !== 'pending') {
                return next(
                    new AppError(
                        `This Booking status is already ${booking.status}. So, we can't accept your request.`
                    )
                );
            }
            obj.scheduledTime = twentyfourToTwelve(req.body.time);
            obj.vendorAcceptedDate = Date.now();
            obj.vendorAcceptedDescription = req.body.description;
        } else if (status === 'rejected') {
            if (booking.status !== 'accepted' && booking.status !== 'pending') {
                return next(
                    new AppError(
                        `This booking status is already ${booking.status}. So, we can't accept your request.`
                    )
                );
            }
            obj.VendorRejectedDate = Date.now();
            obj.VendorRejectedDescription = req.body.description;
        } else if (status === 'completed' || status === 'not-arrived') {
            if (booking.status !== 'accepted') {
                return next(
                    new AppError(
                        `This Booking status is already ${booking.status}. So, we can't accept your request.`
                    )
                );
            }
            console.log(req.body.description);
            obj.vendorStatusResponseDate = Date.now();
            obj.vendorStatusResponseDescription = req.body.description;
        } else if (status === 'canceled') {
            return next(new AppError(`This option only for user`));
        } else {
            return next(new AppError('Please select valid status.', 400));
        }
        req.updateOneSearch = {
            partnerId: req.docs._id,
            hiwosopsID: req.params.bookingId
        };
        req.body = { status, ...obj };
        return next();
    }
);

// update booking status
exports.updateOpticalBookingStatus = factoryController.updateOne(
    bookObticalsStoreModel
);

// get my opticals booking
exports.getMyOpticalsBooking = catchAsync(async (req, res, next) => {
    const [{ active, history }] = await bookObticalsStoreModel.aggregate([
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
                                    $project: {
                                        name: 1,
                                        phone: 1,
                                        profileImage: 1
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
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $project: {
                                        name: 1,
                                        phone: 1,
                                        profileImage: 1
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
    req.body.active = active;
    req.body.history = history;
    return next();
});

// get my optical orders
exports.getMyOpticalOrders = catchAsync(async (req, res, next) => {
    const [orders] = await opticalOrderModel.aggregate([
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
                            orderStatus: {
                                $ne: 'delivered'
                            },
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

// send json for get optical producta
exports.sendJsonforGetOpticalOrders = (req, res) =>
    res.status(200).json({
        status: 'Success',
        orders: req.body.orders
    });

// get my optical orders
exports.getMyOpticalBooking = catchAsync(async (req, res, next) => {
    const [booking] = await bookObticalsStoreModel.aggregate([
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
                            from: 'partners',
                            localField: 'partnerId',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$hiwpmID',
                                        name: { $first: '$company' },
                                        phone: { $first: '$centerPhone' }
                                    }
                                }
                            ],
                            as: 'partner'
                        }
                    },
                    {
                        $unwind: {
                            path: '$partner',
                            preserveNullAndEmptyArrays: true
                        }
                    }
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
                            from: 'partners',
                            localField: 'partnerId',
                            foreignField: '_id',
                            pipeline: [
                                {
                                    $group: {
                                        _id: '$hiwpmID',
                                        name: { $first: '$company' },
                                        phone: { $first: '$centerPhone' }
                                    }
                                }
                            ],
                            as: 'partner'
                        }
                    },
                    {
                        $unwind: {
                            path: '$partner',
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]
            }
        }
    ]);
    req.body.booking = booking;
    console.log(JSON.stringify(booking));
    return next();
});

// send json for get optical producta
exports.sendJsonforGetOpticalBooking = (req, res) =>
    res.status(200).json({
        status: 'Success',
        booking: req.body.booking
    });
