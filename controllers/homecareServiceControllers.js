// ============================================================
// import libraries
const mongoose = require('mongoose');
const { v5: uunidv5, v4: uuidv4, validate: uuidValidate } = require('uuid');
let multer = require('multer');
const AWS = require('aws-sdk');
// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const homecareServiceModel = require('../models/Homecare/createHomecareServiceModel');
const applyHomeCareServiceModel = require('../models/Homecare/applyHomeCareServiceModel');
const homecareReviewModel = require('../models/Homecare/homecareReviews');
const homecareModel = require('../models/Homecare/homecareService');
const homecareservicesserviceModel = require('../models/Homecare/homecaresModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const addressModel = require('../models/shared/addUserAddressModel');

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
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Homecare service'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body = { ...req.body, 'homecare.serviceType': req.body.serviceType };
    req.body.userId = req.user._id;

    req.body = { $set: req.body };
    return next();
};

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateByIdQuery = {
        userId: req.user._id
    };

    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// create new service
exports.createNewService = factoryController.createOne(homecareServiceModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// ============================================================
// home care application

// assign home care serive application search Query
exports.assignHomeServiceApplicationSearchQuery = catchAsync(
    async (req, res, next) => {
        const homecare = await homecareservicesserviceModel.findOne({
            hiwhcssms: req.params.serviceid
        });

        if (!homecare) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    400
                )
            );
        }

        req.searchQuery = {
            _id: homecare.partnerId,
            status: 'accepted',
            for: 'Homecare service'
        };
        req.body.hiwhcssID = await uunidv5(
            process.env.HOMECARE_SECRET,
            uuidv4()
        );
        req.body.parentEID = homecare.parentEID;
        req.body.hoemcareEID = homecare.hiwhcssms;
        req.body.homecareID = homecare._id;
        return next();
    }
);

// get data for home care serive
exports.assignDataForHomeCareServiceApplication =
    factoryController.findOne(partnerModel);

// assign data for homecare service
exports.assignHomeCareServiceApplicants = (req, res, next) => {
    req.body.userId = req.user._id;

    req.body.partnerId = req.docs._id;

    req.body.createdAt = Date.now();
    req.docs = {};
    return next();
};

// create new application for service
exports.createNewHomeCareServiceApplicants = factoryController.createOne(
    applyHomeCareServiceModel
);

// send Json for application for service
exports.sendJsonForNewHomecareServiceApplicants = factoryController.sendJson();

// update home care service
exports.updateHomeCareService = factoryController.updateOne(partnerModel);

// update service type in homecare serive
exports.updateHomecareSerivesservice = catchAsync(async (req, res, next) => {
    await homecareservicesserviceModel.updateMany(
        {
            userId: req.user._id
        },
        {
            serviceType: req.body.serviceType
        },
        { new: true, runValidators: true }
    );
    return next();
});

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();
// delete homecare service
exports.deleteHomeCareService = catchAsync(async (req, res, next) => {
    await Promise.all([
        homecareServiceModel.deleteOne({
            hiwhcsns: req.params.serviceId,
            userId: req.user._id
        }),
        applyHomeCareServiceModel.deleteMany({
            subHomecareServiceEID: req.params.serviceId,
            partnerId: req.docs._id
        })
    ]);

    return next();
});

// assign data for get all service
exports.assignGetServiceData = (req, res, next) => {
    req.searchQuery = { serviceName: req.params.serviceName };

    return next();
};

// get all servie
exports.getAllHomecareSerive = factoryController.getFindAllFilter(
    homecareservicesserviceModel
);

// send json for all
exports.sendJsonAll = factoryController.sendAllFilter();

// find data by id
exports.findServiceById =
    factoryController.findOneWithPopulate(homecareServiceModel);

// assign data for homecare reivews
exports.assingHomecareReviewData = (req, res, next) => {
    req.upsertQuery = {
        userId: req.user._id,
        homecareServiceId: req.body.findOnePopulateDocs._id
    };

    req.upsertDoc = {
        $set: {
            review: req.body.review,
            rating: req.body.rating,
            userId: req.user._id,
            homecareServiceId: req.body.findOnePopulateDocs._id,
            createdAt: Date.now()
        }
    };

    return next();
};

// get related sevend data
exports.getaHomecareService = catchAsync(async (req, res, next) => {
    const [filterdData] = await homecareservicesserviceModel.aggregate([
        {
            $match: {
                hiwhcssms: req.params.serviceId
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
        },

        {
            $lookup: {
                from: 'homecare services',
                localField: 'parter._id',
                foreignField: 'partner',
                pipeline: [
                    { $match: { hiwhcssms: { $ne: req.params.serviceId } } }
                ],
                as: 'relatedProduct'
            }
        }
    ]);
    filterdData.facilities = filterdData.partner.homecare.facilities;
    filterdData.partner.homecare = undefined;

    return res.status(200).json({
        status: 'Success',
        docs: req.body.findOnePopulateDocs,
        related: filterdData
    });
});

// send json for find by id
exports.sendJsonForId = factoryController.sendJsonForAPopulate();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwdacmID: req.params.serviceId };
    req.queryPopulate = [
        {
            path: 'reviews',
            select: 'userId rating review createdAt -homecareServiceId'
        }
    ];
    return next();
};

// create review
exports.createHomecareReview = factoryController.upsertOne(homecareReviewModel);

// calculate avaerage of homecare service
exports.updateReviewAverage = catchAsync(async (req, res, next) => {
    const stats = await homecareReviewModel.aggregate([
        {
            $match: {
                homecareServiceId: mongoose.Types.ObjectId(
                    req.body.findOnePopulateDocs._id
                )
            }
        },
        {
            $group: {
                _id: '$homecareServiceId',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await homecareServiceModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].length
            }
        );
    } else {
        await homecareServiceModel.findByIdAndUpdate(
            req.body.findOnePopulateDocs._id,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0
            }
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assign data for create new homecare service
exports.assignDataForCreateNewHomeCareService = catchAsync(
    async (req, res, next) => {
        req.body.hiwhcsmID = await uunidv5(
            process.env.HOMECARE_SECRET,
            uuidv4()
        );
        req.body.createdAt = Date.now();
        return next();
    }
);

// create new homecare service
exports.createNewHomeCareService = factoryController.createOne(homecareModel);

// get all homecare service
exports.getAllHomcareServices = factoryController.getAll(homecareModel);

// send json for get all data
exports.sendJsonAllData = factoryController.sendJsonForFindAll();

// assign data for update homecare service
exports.assignDataForUpdateHomecareService = (req, res, next) => {
    req.updateOneSearch = { hiwhcsmID: req.params.serviceId };
    return next();
};

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await partner.findOne({
        hiwhcsmID: req.params.serviceId
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

// update homecare service
exports.updateHomeCare = factoryController.updateOne(homecareModel);

// assign data for update all homecare services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};

// update other homecare service data
exports.updateRemainingHomeCareServices =
    factoryController.updateAll(homecareServiceModel);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });

// assign data for get my services
exports.assignDataForGetMyHomecareServices = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// get all my homecare service
exports.getAllMyHomecareService = factoryController.getFindAllFilter(
    applyHomeCareServiceModel
);

// send json data for client for my homecare service
exports.sendJsonGetAllMyService = factoryController.sendAllFilter();

// assing data for cancel request
exports.assignDataForCancelHomecareService = catchAsync(
    async (req, res, next) => {
        const bodydata = req.body.cause;
        const [application, partner] = await Promise.all([
            applyHomeCareServiceModel.findOne({
                hiwhcssID: req.params.homecareId
            }),
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Homecare service'
            })
        ]);
        if (!partner) {
            return next(new AppError('You are not a valid partner.', 400));
        }
        req.body = {};
        req.body.status = req.params.status;
        req.body.vendorDescription = bodydata;
        req.updateOneSearch = {
            hiwhcssID: req.params.homecareId,
            partnerId: partner._id
        };
        req.body.vendorActionDate = Date.now();
        if (
            req.body.status !== 'accepted' &&
            req.body.status !== 'rejected' &&
            req.body.status !== 'completed'
        ) {
            return next(
                new AppError(`${req.body.status} is not a valid status.`)
            );
        }
        if (req.body.status === 'accepted') {
            if (application.status !== 'pending') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else if (req.body.status === 'rejected') {
            if (
                application.status !== 'pending' &&
                req.body.status === 'accepted'
            ) {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        } else if (req.body.status === 'completed') {
            if (application.status !== 'accepted') {
                return next(
                    new AppError(
                        `The status is already ${application.status}. So we can't able to accept this request.`,
                        400
                    )
                );
            }
        }
        return next();
    }
);
// assing data for cancel request
exports.assignDataForCancelHomecareServiceFromUser = catchAsync(
    async (req, res, next) => {
        const bodydata = req.body.cause;
        req.body = {};
        req.body.status = 'canceled';
        req.body.cause = bodydata;
        req.updateOneSearch = {
            hiwhcssID: req.params.homecareId,
            userId: req.user._id,
            status: 'pending'
        };
        const application = await applyHomeCareServiceModel.findOne({
            hiwhcssID: req.params.homecareId
        });
        if (req.body.status !== 'canceled') {
            return next(
                new AppError(`${req.body.status} is not a valid status.`)
            );
        }
        if (application.status !== 'pending') {
            return next(
                new AppError(
                    `The status is already ${application.status}. So we can't able to accept this request.`,
                    400
                )
            );
        }
        return next();
    }
);

// cancel homecare service request
exports.cancelHomecareService = factoryController.updateOne(
    applyHomeCareServiceModel
);

// send json status of homecare cancel requiest
exports.sendJsonForHomecareCancelRequest =
    factoryController.sendJsonForUpdateOne();

// verify new homecare service
exports.verifyNewHomecareService = catchAsync(async (req, res, next) => {
    const [partner, homecare] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'Pending',
            for: 'Homecare service'
        }),
        homecareModel.findOne({
            hiwhcsmID: req.params.serviceId,
            name: req.body.serviceName
        })
    ]);
    if (!partner || !homecare) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    req.body.partnerId = partner._id;
    req.body.parentHomecareServiceEID = req.params.serviceId;
    req.body.hiwhcsns = await uunidv5(process.env.HOMECARE_SECRET, uuidv4());
    return next();
});

// check the partner and councilar
exports.checkValidVendorandPartnerHomecare = catchAsync(
    async (req, res, next) => {
        const [partner, homecare] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: 'Homecare service'
            }),
            homecareServiceModel.exists({ userId: req.user._id })
        ]);

        if (!partner) {
            return next(
                new AppError('Please verify or create partner service.', 400)
            );
        }
        if (homecare) {
            return next(new AppError('You already regsitered a service.', 400));
        }

        req.body.userId = req.user._id;
        req.body.partnerId = partner._id;
        req.body.createdAt = Date.now();
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.body.email = partner.email;
        req.body.homecareName = partner.company;
        req.body.hiwhcsns = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
        return next();
    }
);

exports.assignAndVerifyPartnerData = catchAsync(async (req, res, next) => {
    const [data, serviceName, exists] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'Homecare service',
            status: 'accepted'
        }),
        homecareModel.findOne({ name: req.body.serviceName }),
        homecareservicesserviceModel.exists({
            userId: req.user._id,
            serviceName: req.body.serviceName
        })
    ]);
    if (req.body.statusType === 'update') {
        const obj = await homecareservicesserviceModel.findOne({
            userId: req.user._id,
            hiwhcssms: req.params.serviceId
        });

        if (obj.serviceName !== req.body.serviceName && !!exists) {
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
    if (req.body.statusType === 'create')
        if (exists) {
            return next(
                new AppError(
                    'You already created service on this category',
                    400
                )
            );
        }
    req.body.createdAt = Date.now();
    req.body.userId = req.user._id;
    req.body.partnerId = data._id;
    req.body.hiwhcssms = await encryptID(process.env.HEARINGAID_SECRET);
    req.body.serviceType = data.homecare.serviceType;
    req.body.city = data.city;
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };
    return next();
});
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
            .join('')}-${req.body.hiwhcssms.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}homecareservice-banner`;
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
                    .join('')}-${req.body.hiwhcssms.split(/[a-z]+/).join('')}`}`
                    .split('-')
                    .join('')}homecareservice-service-${i + 1}`;
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
    return next();
});

// create new homecareServie
exports.createNewHomecares = factoryController.createOne(
    homecareservicesserviceModel
);

// update homecareServie
exports.updateHomecareSerices = factoryController.updateOne(
    homecareservicesserviceModel
);

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, homecare] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Homecare service'
        }),
        homecareServiceModel.findOne({
            userId: req.user._id,
            hiwhcsns: req.params.serviceId
        })
    ]);
    console.log(partner);
    if (!partner || !homecare) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.homecareId = homecare._id;
    req.body.homecareEID = homecare.hiwhcsns;
    req.body.parentEID = homecare.hiwhcsns;
    req.body.partnerId = partner._id;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Homecare service',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body = { from: 'Homecare service' };
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Homecare service',
        hiwnadmID: req.params.adId
    };
    return next();
};

// create new quote
exports.getDataForQuoteFromhomecares = catchAsync(async (req, res, next) => {
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
                        from: 'Homecare service',
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
    req.body = { from: 'Homecare service' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Homecare service'
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
        from: 'Homecare service'
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
        from: 'Homecare service',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// manage hospital package
exports.manageMeetTheExpertServicesServices = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

        if (req.params.type === 'facilities') {
            req.query.objData = {
                'homecare.facilities': {
                    $elemMatch: { hiwhcmflsID: req.query.serviceId }
                }
            };
            if (!req.query.serviceId || !uuiddetails) {
                req.query.serviceId = await encryptID(
                    process.env.JOP_PORTAL_SECRET
                );
                req.query.objData = {};
            }
            req.query.pull = {
                'homecare.facilities': { hiwhcmflsID: req.query.serviceId }
            };
            req.query.push = {
                'homecare.facilities': {
                    hiwhcmflsID: req.query.serviceId,
                    title: req.body.title,
                    description: req.body.description
                }
            };
        }

        if (
            req.params.service !== 'delete' &&
            req.params.service !== 'manage'
        ) {
            return next(
                new AppError(
                    'Something went wrong while processing you request.',
                    401
                )
            );
        }
        const a = await partnerModel.updateOne(
            {
                userId: req.user._id,
                for: 'Homecare service',
                ...req.query.objData
            },
            {
                $pull: { ...req.query.pull }
            }
        );

        if (req.params.service === 'manage') {
            const b = await partnerModel.updateOne(
                {
                    userId: req.user._id,
                    for: 'Homecare service'
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
            console.log(req.query.push);
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// asssand verify data for apply new homecare serivice
exports.verifyandAssignDataForHomecareServiceApplies = catchAsync(
    async (req, res, next) => {
        const [[homecare], address] = await Promise.all([
            homecareservicesserviceModel.aggregate([
                {
                    $match: {
                        hiwhcssms: req.params.serviceid
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
        console.log(address);
        if (!homecare || !address) {
            return next(
                new AppError(
                    'Something went wrong while processing you request',
                    400
                )
            );
        }
        req.body.partnerId = homecare.partnerId;
        req.body.hoemcareEID = homecare.hiwhcssms;
        req.body.homecareID = homecare._id;
        homecare.partners = undefined;
        homecare.hiwhcssms = undefined;
        homecare.parentEID = undefined;
        homecare.parentId = undefined;
        homecare.userId = undefined;
        homecare.createdAt = undefined;
        homecare.partnerId = undefined;
        homecare._id = undefined;
        address._id = undefined;
        req.body.userId = req.user._id;
        req.body.addressDetails = address;
        req.body.hiwhcssID = await uunidv5(
            process.env.HOMECARE_SECRET,
            uuidv4()
        );
        req.body.createdAt = Date.now();
        req.body.serviceDetails = homecare;
        return next();
    }
);

// get homecare
exports.getPartneranService = catchAsync(async (req, res, next) => {
    const [partner, services, homecares] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: 'Homecare service',
            status: 'accepted'
        }),
        (await homecareModel.find().select('name').lean()).map((el) => el.name),
        homecareservicesserviceModel.find({ userId: req.user._id })
    ]);

    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    req.query.from = 'Homecare service';
    req.body.partner = partner;
    req.body.services = services;
    req.body.homecares = homecares;
    return next();
});

// filter new blood bank data
exports.filterNewhomcecareData = catchAsync(async (req, res, next) => {
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

// set service images name
exports.serviceImageProperties = (req, res, next) => {
    req.image = {};
    req.image.singleResizeW = 800;
    req.image.singleResizeH = 160;

    return next();
};
let multerStorage = multer.memoryStorage();
function multerFilter(req, file, cb) {
    console.log('hi');
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

exports.resizeHomecareServiceImages = catchAsync(async (req, res, next) => {
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

// assign data for update homecare's services
exports.assignDataForUpdateHomecareServicess = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhcssms: req.params.serviceId
    };
    return next();
};

// get homecare applicatnts
exports.getHomecareAppliants = catchAsync(async (req, res, next) => {
    const [applicants] = await partnerModel.aggregate([
        {
            $match: { userId: req.user._id, for: 'Homecare service' }
        },
        {
            $lookup: {
                from: 'home care service applications',
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
                                }
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
