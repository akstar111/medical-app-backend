// ============================================================
// import package
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const laboratoryCategoriesModel = require('../models/laboratory/laboratoryCategoriesModel');
const laboratoryBookingModel = require('../models/laboratory/laboratoryBookingModel');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const twentyfourToTwelve = require('twentyfour-to-twelve');

// assign partner search data
exports.assignPartnerSearch = catchAsync(async (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Laboratory'
    };
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// filter new blood bank data
exports.filterNewLaboratory = catchAsync(async (req, res, next) => {
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

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Laboratory'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.userId = req.user._id;

    req.body = { $set: req.body };
    return next();
};

// update laboratory service
exports.updateLaboratoryService = factoryController.updateOne(partnerModel);

// send json for create one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// get all laboratorys
exports.getAllLaboratoryCategories = catchAsync(async (req, res, next) => {
    const data = await laboratoryCategoriesModel.find().distinct('name');
    req.body.services = data;
    return next();
});

// check if the data was valid
exports.checkValidLaboratoryTest = catchAsync(async (req, res, next) => {
    const [lab, partner] = await Promise.all([
        laboratoryCategoriesModel.findOne({ name: req.body.name }),
        partnerModel.findOne({
            ...req.search
        })
    ]);
    console.log(req.search);
    if (!lab) {
        return next(
            new AppError('Please select the valid name test name', 400)
        );
    }
    if (!partner) {
        return next(new AppError('Not a valid partner', 400));
    }
    const exist = partner.laboratory.availableTests.some(
        (el) => el.name === req.body.name
    );

    if (req.params.service === 'create') {
        if (exist) {
            return next(
                new AppError('This Test is already exist in you test list', 400)
            );
        }
    } else if (req.params.service === 'manage') {
        const [data] = await Promise.all(
            partner.laboratory.availableTests.filter(
                (el) => el.hiwlabatsID === req.query.serviceId
            )
        );
        if (!data) {
            return next(new AppError('Test not found', 404));
        }
        if (data.name !== req.body.name && !!exist) {
            return next(
                new AppError('This Test is already exist in you test list', 400)
            );
        }
    } else {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }
    return next();
});

// manage hospital tests
exports.mangeLaboratoryTests = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'laboratory.availableTests': {
            $elemMatch: { hiwlabatsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.params.service !== 'create') {
            return next(
                new AppError('Something went wrong please try again.', 400)
            );
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    if (req.params.service === 'create') {
        req.query.action = {
            $push: {
                'laboratory.availableTests': {
                    hiwlabatsID: req.query.serviceId,
                    name: req.body.name,
                    price: req.body.price,
                    description: req.body.description
                }
            }
        };
    } else if (req.params.service === 'manage') {
        req.query.objData = {
            'laboratory.availableTests': {
                $elemMatch: { hiwlabatsID: req.query.serviceId }
            }
        };
        const obj = {};

        req.query.action = {
            $set: {
                'laboratory.availableTests.$[id].name': req.body.name,
                'laboratory.availableTests.$[id].price': req.body.price,
                'laboratory.availableTests.$[id].description':
                    req.body.description
            }
        };
        req.query.arrayFilters = {
            arrayFilters: [{ 'id.hiwlabatsID': req.query.serviceId }]
        };
    } else if (req.params.service === 'delete') {
        req.query.objData = {
            'laboratory.availableTests': {
                $elemMatch: { hiwlabatsID: req.query.serviceId }
            }
        };
        req.query.action = {
            $pull: {
                'laboratory.availableTests': {
                    hiwlabatsID: req.query.serviceId
                }
            }
        };
    }

    const create = await partnerModel.updateOne(
        { ...req.search, ...req.query.objData },
        {
            ...req.query.action
        },
        {
            runValidators: true,
            ...req.query.arrayFilters
        }
    );
    return res.status(200).json({ status: 'Success' });
});

// manage hospital tests
exports.mangeLaboratoryFacilities = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
    if (req.params.service === 'create') {
        req.query.action = {
            $push: {
                'laboratory.fecilities': {
                    hiwlflisID: req.query.serviceId,
                    title: req.body.title,
                    bannerImage: req.body.bannerImage,
                    description: req.body.description
                }
            }
        };
    } else if (req.params.service === 'manage') {
        req.query.objData = {
            'laboratory.fecilities': {
                $elemMatch: { hiwlflisID: req.query.serviceId }
            }
        };
        const obj = {};
        if (req.body.bannerImage) {
            obj['laboratory.fecilities.$[id].bannerImage'] =
                req.body.bannerImage;
        }
        req.query.action = {
            $set: {
                'laboratory.fecilities.$[id].title': req.body.title,
                'laboratory.fecilities.$[id].description': req.body.description
            }
        };
        req.query.arrayFilters = {
            arrayFilters: [{ 'id.hiwlflisID': req.query.serviceId }]
        };
    } else if (req.params.service === 'delete') {
        req.query.objData = {
            'laboratory.fecilities': {
                $elemMatch: { hiwlflisID: req.query.serviceId }
            }
        };
        req.query.action = {
            $pull: {
                'laboratory.fecilities': {
                    hiwlflisID: req.query.serviceId
                }
            }
        };
    }

    const create = await partnerModel.updateOne(
        {
            userId: req.user._id,
            status: 'accepted',
            for: 'Laboratory',
            ...req.query.objData
        },
        {
            ...req.query.action
        },
        {
            runValidators: true,
            ...req.query.arrayFilters
        }
    );
    console.log(req.query.serviceId);
    return res.status(200).json({ status: 'Success' });
});

// assign data for image size
exports.setImageSizeForLaboratoryImage = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// create image name for equipmets
exports.imageNameForLaborateryFacilities = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

        if (!req.query.serviceId || !uuiddetails) {
            if (req.body.statusType !== 'create') {
                return next(new AppError('Something went wrong.', 400));
            }
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
        }

        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-laboratory-facilities`;
        return next();
    }
);

// assign data for image size for hospital room image
exports.setImageSizeForLaboratory = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.gallery = 'images';
    req.image.multiImageName = 'images';
    req.image.galleryImagename =
        (
            Date.now() *
            Date.now() *
            1000 *
            60 *
            49 *
            Math.round(Math.random() * 10000)
        ).toString(24) + '-labimages';

    return next();
};
// add search image laboratory rooms
exports.addSearchQueryFormLaboratoryImages = (req, res, next) => {
    req.search = {
        userId: req.user._id,
        for: 'Laboratory',
        status: 'accepted'
    };
    return next();
};
// add images for hospitals
exports.addImagesForHospitalRooms = catchAsync(async (req, res, next) => {
    const docs = await partnerModel.findOne({
        ...req.search
    });
    console.log(docs);
    let check = docs.laboratory.labImages.length + req.body.images.length <= 12;

    if (!check) {
        return next(
            new AppError(
                'You can only upload 12 image of your laboratory.',
                400
            )
        );
    }

    const data = await partnerModel.findByIdAndUpdate(
        docs._id,
        {
            $push: {
                'laboratory.labImages': req.body.images
            }
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!data) {
        return next(new AppError('Partner not found.', 404));
    }
    return res.status(200).json({ status: 'Success' });
});

// remove hospital image
exports.removePharmacyImages = catchAsync(async (req, res, next) => {
    let datas = `${req.params.imageName}$`;
    datas = new RegExp(datas, 'ig');
    const data = await partnerModel.updateOne(req.search, {
        $pull: { 'laboratory.labImages': datas }
    });
    console.log(datas);
    console.log(req.search);
    if (!data.modifiedCount) {
        return next(new AppError('Image not found', 400));
    }
    return res.status(200).json({ status: 'Success' });
});

// get all laboratory
exports.getAllLaboratory = catchAsync(async (req, res, next) => {
    let obj = {};
    let obj2 = {};

    if (req.query.services) {
        const data = await Promise.all(
            req.query.services.split(',').map((el) => {
                return { 'laboratory.availableTests.name': el };
            })
        );
        obj['$and'] = data;
        obj2['$or'] = data;
    }
    const sor = {};
    if (req.query.sort * 1 === 1 || req.query.sort * 1 === -1) {
        sor['$sort'] = { price: req.query.sort * 1 };
    } else {
        sor['$sort'] = { price: 1 };
    }
    console.log(req.query);
    const data = await partnerModel.aggregate([
        {
            $match: {
                for: 'Laboratory',
                status: 'accepted',
                ...obj
            }
        },
        {
            $unwind: '$laboratory.availableTests'
        },
        {
            $match: obj2
        },
        {
            $group: {
                _id: '$hiwpmID',
                bannerImage: { $first: '$bannerImage' },
                company: { $first: '$company' },
                address: { $first: '$address' },
                price: { $sum: '$laboratory.availableTests.price' }
            }
        },
        sor
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: data
    });
});

// assign data for get a laboratory
exports.assignDataForGetALaboratory = (req, res, next) => {
    req.searchQuery = {
        status: 'accepted',
        hiwpmID: req.params.labId,
        for: 'Laboratory'
    };
    return next();
};

// get a laboratory
exports.getALaboratory = factoryController.findOne(partnerModel);

// send json for get one
exports.sendJsonForGetOne = factoryController.sendJsonForFindOne();

// verify lab details
exports.verifyLabDetails = catchAsync(async (req, res, next) => {
    const date =
        new Date().setHours(23, 59, 59, 999) <
        new Date(req.body.date).setHours(0, 0, 0, 0);
    if (!date) {
        return next(new AppError('Please select the dat from tommorrow.', 400));
    }
    const obj = {},
        obj2 = {};

    const arr = [],
        arr2 = [];
    const data = await Promise.all(
        req.body.services.split(',').map((el) => {
            arr.push({ 'laboratory.availableTests.name': el });
            arr2.push({ name: el });
        })
    );
    obj['$and'] = arr;
    obj2['$or'] = arr;

    const [[tests], category] = await Promise.all([
        partnerModel.aggregate([
            {
                $match: {
                    for: 'Laboratory',
                    status: 'accepted',
                    hiwpmID: req.params.labId,
                    ...obj
                }
            },
            { $limit: 1 },
            {
                $unwind: '$laboratory.availableTests'
            },
            {
                $match: obj2
            },
            {
                $group: {
                    _id: '$_id',
                    hiwpmId: { $first: '$hiwpmID' },
                    availableTests: {
                        $push: {
                            name: '$laboratory.availableTests.name',
                            price: '$laboratory.availableTests.price'
                        }
                    }
                }
            }
        ]),
        laboratoryCategoriesModel
            .find({ $or: arr2 })
            .limit(req.body.services.split(',').length)
            .distinct('testType')
    ]);
    const checkSame = category.every((el) => el === category[0]);

    if (category.length !== req.body.services.split(',').length) {
        return next(new AppError('Something went wrong.', 400));
    }
    if (!tests) {
        return next(new AppError('Laboratory not found', 404));
    }

    req.body.askedService = tests.availableTests;
    req.body.requestDate = req.body.date;
    req.body.createdAt = new Date();
    req.body.hiwlbbssID = await encryptID(process.env.JOP_PORTAL_SECRET);
    req.body.labId = tests._id;
    req.body.labEId = tests.hiwpmId;
    req.body.userId = req.user._id;
    req.body.bookingType = checkSame ? category[0] : 'lab';
    return next();
});

// create new order
exports.createNewLaboratoryBooking = factoryController.createOne(
    laboratoryBookingModel
);

// send josn for create one
exports.sendJsonfForCreateOne = factoryController.sendJson();

// assign dta for canel booking
exports.assignDataforCancelBooking = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        $or: [
            {
                status: 'requested'
            },
            {
                status: 'accepted'
            }
        ],
        hiwlbbssID: req.params.labId
    };
    req.body.cancelDate = Date.now();
    req.body.cancelDescription = req.body.cause;
    req.body = {
        status: 'canceled',
        cancelDate: Date.now(),
        cancelDescription: req.body.cause
    };
    return next();
};

// update order booking
exports.updateLaboratoryBooking = factoryController.updateOne(
    laboratoryBookingModel
);

// get all my laboratory booking
exports.getAllMyLaboratoryBooking = catchAsync(async (req, res, next) => {
    const request = await laboratoryBookingModel.aggregate([
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
                                    status: 'accepted'
                                },
                                {
                                    status: 'requested'
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
                                    status: { $ne: 'accepted' }
                                },
                                {
                                    status: { $ne: 'requested' }
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
        docs: request
    });
});

// get all laboratory booking
exports.getAllLaboratoryBookings = catchAsync(async (req, res, next) => {
    const [booking] = await laboratoryBookingModel.aggregate([
        {
            $match: {
                labId: req.docs._id
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
                            _id: 0
                        }
                    }
                ],
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $or: [
                                {
                                    status: 'accepted'
                                },
                                {
                                    status: 'requested'
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
                                    status: { $ne: 'accepted' }
                                },
                                {
                                    status: { $ne: 'requested' }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);
    req.body.booking = booking;
    console.log(JSON.stringify(req.body.booking));
    return next();
});

// assign data for update the status
exports.assignDataForUpdateLaboratoryBookingStatus = catchAsync(
    async (req, res, next) => {
        const [booking] = await Promise.all([
            laboratoryBookingModel.findOne({
                hiwlbbssID: req.params.labId
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
            req.body.rejectedDate = Date.now();
            req.body.rejectedResponse = req.body.description;
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
            labId: req.docs._id,
            hiwlbbssID: req.params.labId
        };
        req.body.status = req.params.status;
        return next();
    }
);

// get all laboratory
exports.getAllLaboratoryCategoriesList = factoryController.getAllFilter(
    laboratoryCategoriesModel
);

// send json for get all filter
exports.sendJsonGetAllFilter = factoryController.sendAllFilter();
