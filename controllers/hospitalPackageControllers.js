// ============================================================
// import package
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
// const packageModel = require('../models/Hospital/hospitalModel');
const hospitalPackageModel = require('../models/Hospital/hospitalPackage');
const hospitalModel = require('../models/Hospital/hospitalModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Hospital'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };

    req.body = {
        ...req.body,
        'hospital.medicalTourism': req.body.medicalTourism,
        'hospital.hospitalPackage': req.body.hospitalPackage,
        'hospital.aboutUs': req.body.aboutUs
    };
    req.body.userId = req.user._id;
    req.body = { $set: req.body };
    return next();
};

// assign partner serarch data for hospital
exports.assingPartnerSearchDataForPakcage = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        'hospital.hospitalPackage': true,
        for: 'Hospital'
    };
    return next();
};
// filter new blood bank data
exports.filterNewHospital = catchAsync(async (req, res, next) => {
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
            'city',
            'medicalTourism',
            'hospitalPackage',
            'aboutUs'
        )
    ]);

    return next();
});

// assign data for image size
exports.setImageSizeForHospitalServiceBanner = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};
// assign data for image size
exports.setImageSizeForHospitalFacilityBanner = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size
exports.setImageSizeForHospitalNearByHotels = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size restarurens
exports.setImageSizeForHospitalNearByRestaurents = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size airports
exports.setImageSizeForHospitalNearByAirports = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size airports
exports.setImageSizeForHospitalNearByTrains = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size buses
exports.setImageSizeForHospitalNearByBuses = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size
exports.setImageSizeForHospitalRoomFacilityBanner = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size
exports.setImageSizeForHospitalSpecialistBanner = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// assign data for image size for hospital room image
exports.setImageSizeForHospitalRoomImages = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;
    if (
        req.params.imgType !== 'rooms' &&
        req.params.imgType !== 'canteens' &&
        req.params.imgType !== 'guests'
    ) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
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
        ).toString(24) +
        '-hospital-' +
        req.params.imgType;
    return next();
};

// assign partner search data
exports.assignPartnerSearch = catchAsync(async (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Hospital'
    };
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// set image name for service
exports.setHospitalServiceImageName = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        hospitalServices: {
            $elemMatch: { hiwhdmsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-service`;

    return next();
});

// set image name for facilities
exports.setHospitalFacilitymageName = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        hospitalFacilities: {
            $elemMatch: { hiwhdfs: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-service`;

    return next();
});

// set image name for nearby hotels
exports.setHospitalNearbyHotels = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'nearBy.hotels': {
            $elemMatch: { hiwhtsmhdsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hotels`;

    return next();
});

// set image name for nearby restaurents
exports.setHospitalNearbyRestaurents = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'nearBy.restaurants': {
            $elemMatch: { hiwhtsmrdsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-restaurents`;

    return next();
});

// set image name for nearby airports
exports.setHospitalNearbyAirports = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'nearBy.airports': {
            $elemMatch: { hiwhtsmadsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-airports`;

    return next();
});

// set image name for nearby trains
exports.setHospitalNearbyTrains = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'nearBy.railwayStation': {
            $elemMatch: { hiwhtsmrsdsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-railway-stations`;

    return next();
});

// set image name for nearby buses
exports.setHospitalNearbyBuses = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        'nearBy.busStop': {
            $elemMatch: { hiwhtsmbssID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-buses`;

    return next();
});

// set image name for room facilities
exports.setHospitalRoomFacilitymageName = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        hospitalRoomFacilities: {
            $elemMatch: { howmhdrfID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(
                new AppError('Something went wrong with this service.', 400)
            );
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-room-facilities`;

    return next();
});

// check if the service is already exist
exports.checkIfTheServiceisAlreadyExist = catchAsync(async (req, res, next) => {
    let oldData = {};
    if (req.params.service === 'delete') {
        return next();
    }
    let [data, packs] = await Promise.all([
        hospitalModel
            .findOne({
                userId: req.user._id,
                'hospitalServices.name': req.body.name
            })
            .select('hospitalServices -partnerId'),
        hospitalPackageModel.exists({ name: req.body.name })
    ]);
    if (!packs) {
        return next(new AppError('Please select the valid service.', 400));
    }
    if (req.params.service === 'create')
        if (data) {
            return next(
                new AppError(
                    'You already created service under this section.',
                    400
                )
            );
        }
    if (req.params.service === 'manage') {
        packs = data?.hospitalServices ? data.hospitalServices : [];
        const [checkAvail] = await Promise.all(
            packs.filter((el) => el.hiwhdmsID === req.query.serviceId)
        );

        if (checkAvail?.name !== req.body.name && data) {
            return next(
                new AppError(
                    'You already created service under this section.',
                    400
                )
            );
        }
    }
    return next();
});

// set image name for specialist
exports.setHospitaSpecialistmageName = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        specialist: {
            $elemMatch: { hiwhdslsID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-specialist`;

    return next();
});

// create new service
// exports.createNewService = factoryController.createOne(packageModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// ============================================================
// home care application

// assign home care serive application search Query
// exports.assignHomeServiceApplicationSearchQuery = catchAsync(
//     async (req, res, next) => {
//         const getPartner = await packageModel.findById(req.params.serviceid);

//         if (!getPartner) {
//             return next(
//                 new AppError(
//                     'Something went wrong while processing your request.',
//                     400
//                 )
//             );
//         }

//         req.searchQuery = { _id: getPartner.partnerId };

//         return next();
//     }
// );

// verify new homecare serive
// exports.verifyNewHomecareServiceandPartner = catchAsync(
//     async (req, res, next) => {
//         const mappackage = req.body.packageDetails ?? [];

//         const [partner, package] = await Promise.all([
//             partnerModel.findOne({
//                 userId: req.user._id,
//                 status: 'accepted',
//                 for: 'Hospitals',
//                 'hospital.hospitalPackage': true
//             }),
//             packageModel.findOne({
//                 userId: req.user._id
//             })
//         ]);

//         if (!partner) {
//             return next(
//                 new AppError(
//                     'Something went wrong while processing your request.',
//                     400
//                 )
//             );
//         }
//         if (package) {
//             return next(
//                 new AppError('You already created hospital package.', 400)
//             );
//         }

//         req.body.userId = req.user._id;
//         req.body.createdAt = Date.now();
//         req.body.partnerId = partner._id;
//         req.body.hiwhppsID = await encryptID(process.env.HOSPTIAL_PACKAGE);
//         // console.log(JSON.stringify(req.body));
//         return next();
//     }
// );

// update home care service
exports.updatePackageService = factoryController.updateOne(partnerModel);

// delete homecare service
// exports.deletePackage = catchAsync(async (req, res, next) => {
//     const datas = await packageModel.deleteOne({
//         hiwhppsID: req.params.serviceid,
//         userId: req.user._id
//     });

//     if (!datas.deletedCount) {
//         return next(
//             new AppError(
//                 'Something went wrong whlile processing your request.',
//                 401
//             )
//         );
//     }

//     return next();
// });

// get all servie
exports.getAllPackage =
    factoryController.getFindAllFilterWithSelectedFields(hospitalModel);

// return return data for manual update
exports.filterDataForCheckPackageData = catchAsync(async (req, res, next) => {
    const data = [];
    for await (const val of req.body.findAllFilter) {
        const [filters] = await Promise.all(
            val.packageDetails.filter((el) => {
                return el.category === req.params.packageName;
            })
        );

        if (
            val.partnerId.status === 'accepted' &&
            val.partnerId.hospital?.hospitalPackage
        )
            data.push({
                id: val.hiwhppsID,
                package: filters,
                name: val.name,
                bannerImage: val.partnerId.bannerImage,
                city: val.city,
                address: val.partnerId.address
            });
    }

    return res.status(200).json({
        status: 'Success',
        docs: data
    });
});

// return return data for manual update hospital tourism
exports.filterDataForCheckTourismData = catchAsync(async (req, res, next) => {
    const data = [];

    for await (const val of req.body.findAllFilter) {
        // const [filters] = await Promise.all(
        //     val.hospitalServices.filter((el) => {
        //         return el.name === req.params.packageName;
        //     })
        // );
        // console.log(val.partnerId);
        if (
            val.partnerId.status === 'accepted' &&
            val.partnerId.hospital?.medicalTourism
        )
            data.push({
                id: val.hiwhppsID,
                // services: filters,
                package: req.params.packageName,
                name: val.name,
                bannerImage: val.partnerId.bannerImage,
                city: val.city,
                address: val.partnerId.address
            });
    }

    return res.status(200).json({
        status: 'Success',
        docs: data
    });
});
// send json for all
exports.sendJsonAll = factoryController.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = {
        'packageDetails.category': req.params.packageName,
        hiwhppsID: req.params.serviceId
    };
    return next();
};

// find data by id
exports.findServiceById = factoryController.findOne(hospitalModel);

// send json for find by id
exports.sendJsonForId = factoryController.sendJsonForFindOne();

// assign data for create new  service
exports.assignDataForCreateNewHospitalPackageService = catchAsync(
    async (req, res, next) => {
        req.body.createdAt = Date.now();
        req.body.hiwhppmID = await encryptID(process.env.HOSPTIAL_PACKAGE);

        return next();
    }
);

// create new medical tourism service
exports.createNewHospitalPackage =
    factoryController.createOne(hospitalPackageModel);

// get all hospitals
exports.getAllHospitalPackages =
    factoryController.getAllFilter(hospitalPackageModel);

// get all medical tourism service
exports.getAllHospitalPackageServices = catchAsync(async (req, res, next) => {
    if (!req.docs.hospital?.hospitalPackage) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    const [packs, packages] = await Promise.all([
        hospitalModel.findOne({ userId: req.user._id }),
        hospitalPackageModel.find()
    ]);
    if (!packages) {
        return next(
            new AppError('Somthing went wrong please contact the us', 401)
        );
    }
    req.body.packages = packages;
    req.body.packs = packs;
    return next();
});

// send json for get all data
exports.sendJsonAllData = factoryController.sendJsonForFindAll();

// assign data for get old data
exports.getOldData = catchAsync(async (req, res, next) => {
    const data = await hospitalPackageModel.findOne({
        hiwhppmID: req.params.serviceId
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

// assign data for update medical tourism service
exports.assignDataForUpdateHospitalPackageService = (req, res, next) => {
    req.updateOneSearch = { hiwhppmID: req.params.serviceId };

    return next();
};

// update homecare service
exports.updateHospitalPackage =
    factoryController.updateOne(hospitalPackageModel);

// assign data for update all homecare services data
exports.assignDataForUpdateAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceType: req.oldName };
    req.updateAllData = { serviceType: req.body.name };
    return next();
};

// update other homecare service data
// exports.updateRemainingHomeCareServices =
//     factoryController.updateAll(packageModel);

// send annomymus json
exports.sendJsonForUpdateAll = (req, res) =>
    res.status(200).json({
        status: 'Success'
    });

// assign Dat for get a hosptial package
// exports.assignDataForGetAHospitalPackage = catchAsync(
//     async (req, res, next) => {
//         const [package] = await packageModel.aggregate([
//             {
//                 $match: {
//                     hiwhppsID: req.params.packageId
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'partners',
//                     localField: 'partnerId',
//                     foreignField: '_id',
//                     as: 'partner'
//                 }
//             },
//             {
//                 $unwind: '$partner'
//             },
//             {
//                 $match: {
//                     'partner.hospital.hospitalPackage': true
//                 }
//             }
//         ]);
//         console.log(package);
//         if (package?.partner?.status !== 'accepted') {
//             return next(
//                 new AppError('Something went wrong with this product', 401)
//             );
//         }
//         package.partner = undefined;
//         return res.status(200).json({
//             status: 'Success',
//             docs: package
//         });
//         // return next();
//     }
// );

// find hospital package or get
// exports.findHospitalPackageOrCreateOne = catchAsync(async (req, res, next) => {
//     const [package, partner] = await Promise.all([
//         packageModel.findOne({
//             userId: req.user._id
//         }),
//         partnerModel.findOne({
//             userId: req.user._id,
//             status: 'accepted',
//             for: 'Hospitals',
//             'hospital.hospitalPackage': true
//         })
//     ]);
//     if (!partner) {
//         return next(
//             new AppError(
//                 "Somthing went wrong with your partner's Verification",
//                 401
//             )
//         );
//     }
//     if (package) {
//         return res.status(200).json({
//             status: 'Success',
//             docs: package
//         });
//     }
//     return res.status(500).json({
//         status: 'Fails',
//         message: 'Needs to create new packge.'
//     });
// });

// prevent false hospital details
exports.preventFalseHospitalPackageData = (req, res, next) => {
    req.body = filerDataFromRequest(
        req.body,
        'name',
        'phone',
        'hospitalName',
        'hospitalAddress',
        'hospitalPhone',
        'hospitalLandline',
        'city',
        'description',
        'bannerImage',
        'hospitalEmail',
        'location'
    );
    return next();
};

// manage hospital package
exports.manageHospitalPackage = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    const [partne, package, hospital] = await Promise.all([
        partnerModel.findOne({
            for: 'Hospital',
            status: 'accepted',
            hospitalPackage: true
        }),
        hospitalPackageModel.findOne({ name: req.body.category }),
        hospitalModel.findOne({
            'packageDetails.category': req.body.category,
            userId: req.user._id
        })
    ]);
    if (!partne) {
        return next(new AppError('Not valid partner.', 400));
    }
    if (hospital) {
        return next(
            new AppError(
                `You already created service under ${req.body.category}.`,
                400
            )
        );
    }
    if (!package) {
        return next(new AppError('Please enter the valid package name', 400));
    }
    req.query.objData = {
        packageDetails: {
            $elemMatch: { hiwhpdsnmID: req.query.serviceId }
        }
    };
    if (!req.query.serviceId || !uuiddetails) {
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    let checkAvailData = 'yetToUpdate';
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,
                ...req.query.objData
            },
            {
                $pull: {
                    packageDetails: {
                        hiwhpdsnmID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,
                hospitalPackage: true
            },
            {
                $push: {
                    packageDetails: {
                        hiwhpdsnmID: req.query.serviceId,
                        category: req.body.category,
                        subCategory: []
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'manage') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,

                hospitalPackage: true,
                'packageDetails.hiwhpdsnmID': req.query.serviceId
            },
            {
                $set: {
                    'packageDetails.$[cat].category': req.body.category
                }
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhpdsnmID': req.query.serviceId
                    }
                ]
            }
        );
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }

    if (checkAvailData) {
        if (
            JSON.stringify(checkAvailData.packageDetails).includes(
                'serviceTitle'
            )
        ) {
            checkAvailData = await hospitalModel.findByIdAndUpdate(
                checkAvailData._id,
                { hospitalPackageStatus: true },
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!checkAvailData) {
                return next(
                    new AppError(
                        'Something went wrong while processing you request.',
                        400
                    )
                );
            }
        } else {
            checkAvailData = await hospitalModel.findByIdAndUpdate(
                checkAvailData._id,
                { hospitalPackageStatus: false },
                {
                    new: true,
                    runValidators: true
                }
            );
        }
    } else {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }

    return res.status(200).json({
        status: 'Success'
    });
});
// manage hospital sub category
exports.manageHospitalPackageSubCategory = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
        req.query.objData = {
            'packageDetails.hiwhpdsnmID': req.params.categoryId,
            'packageDetails.subCategory.hiwhppdsID': req.query.serviceId
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        let checkAvailData = 'yetToUpdate';
        if (req.params.service === 'delete') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,

                    hospitalPackage: true,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    ...req.query.objData
                },
                {
                    $pull: {
                        'packageDetails.$.subCategory': {
                            hiwhppdsID: req.query.serviceId
                        }
                    }
                },
                { new: true, runValidators: true }
            );
        } else if (req.params.service === 'manage') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,

                    hospitalPackage: true,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhpdsnmID':
                        req.query.serviceId
                },
                {
                    $set: {
                        'packageDetails.$[cat].subCategory.$[subCat].name':
                            req.body.name
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'subCat.hiwhppdsID': req.query.serviceId
                        }
                    ]
                }
            );
        } else if (req.params.service === 'create') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,

                    hospitalPackage: true,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId
                },
                {
                    $push: {
                        'packageDetails.$[cat].subCategory': {
                            hiwhppdsID: req.query.serviceId,
                            name: req.body.name
                        }
                    }
                },
                {
                    new: true,
                    // runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'subCat.hiwhppdsID': req.query.serviceId
                        }
                    ]
                }
            );
        }
        if (checkAvailData === 'yetToUpdate') {
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    401
                )
            );
        }
        if (checkAvailData) {
            if (
                JSON.stringify(checkAvailData.packageDetails).includes(
                    'serviceTitle'
                )
            ) {
                checkAvailData = await hospitalModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: true },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                if (!checkAvailData) {
                    return next(
                        new AppError(
                            'Something went wrong while processing you request.',
                            400
                        )
                    );
                }
            } else {
                checkAvailData = await partnerModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: false },
                    {
                        new: true,
                        runValidators: true
                    }
                );
            }
        } else {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    401
                )
            );
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);
// manage hospital sub category details
exports.manageHospitalPackageSubCategoryDetails = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
        req.query.objData = {
            'packageDetails.hiwhpdsnmID': req.params.categoryId,
            'packageDetails.subCategory.hiwhppdsID': req.params.subCategory,
            'packageDetails.subCategory.packType.hiwhppscdID':
                req.query.serviceId
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        let checkAvailData = 'yetToUpdate';
        if (req.params.service === 'delete') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory,
                    ...req.query.objData
                },
                {
                    $pull: {
                        'packageDetails.$[cat].subCategory.$[sub].packType': {
                            hiwhppscdID: req.query.serviceId
                        }
                    }
                },
                {
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        }
                    ]
                }
            );
        } else if (req.params.service === 'create') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory
                },
                {
                    $push: {
                        'packageDetails.$[cat].subCategory.$[sub].packType': {
                            hiwhppscdID: req.query.serviceId,
                            packageName: req.body.packageName,
                            recommendAge: req.body.recommendAge,
                            description: req.body.description,
                            price: req.body.price
                        }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        }
                    ]
                }
            );
        } else if (req.params.service === 'manage') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory,
                    'packageDetails.subCategory.packType.hiwhppscdID':
                        req.query.serviceId
                },
                {
                    $set: {
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].packageName':
                            req.body.packageName,
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].recommendAge':
                            req.body.recommendAge,
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].description':
                            req.body.description,
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].price':
                            req.body.price
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        },
                        {
                            'pack.hiwhppscdID': req.query.serviceId
                        }
                    ]
                }
            );
        }
        if (checkAvailData === 'yetToUpdate') {
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    401
                )
            );
        }

        if (checkAvailData) {
            if (
                JSON.stringify(checkAvailData.packageDetails).includes(
                    'serviceTitle'
                )
            ) {
                checkAvailData = await hospitalModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: true },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                if (!checkAvailData) {
                    return next(
                        new AppError(
                            'Something went wrong while processing you request.',
                            400
                        )
                    );
                }
            } else {
                checkAvailData = await hospitalModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: false },
                    {
                        new: true,
                        runValidators: true
                    }
                );
            }
        } else {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    401
                )
            );
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// manage Hospital subcategorypackage details
exports.manageHospitalPackageispackageListDetails = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
        req.query.objData = {
            'packageDetails.hiwhpdsnmID': req.params.categoryId,
            'packageDetails.subCategory.hiwhppdsID': req.params.subCategory,
            'packageDetails.subCategory.packType.hiwhppscdID':
                req.params.packageId,
            'packageDetails.subCategory.packType.serviceList.hiwhpslsID':
                req.query.serviceId
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        let checkAvailData = 'yetToUpdate';

        if (req.params.service === 'delete') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory,
                    'packageDetails.subCategory.packType.hiwhppscdID':
                        req.params.packageId,
                    ...req.query.objData
                },
                {
                    $pull: {
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].serviceList':
                            {
                                hiwhpslsID: req.query.serviceId
                            }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        },
                        {
                            'pack.hiwhppscdID': req.params.packageId
                        }
                    ]
                }
            );
        } else if (req.params.service === 'create') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory,
                    'packageDetails.subCategory.packType.hiwhppscdID':
                        req.params.packageId
                },
                {
                    $push: {
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].serviceList':
                            {
                                hiwhpslsID: req.query.serviceId,
                                serviceTitle: req.body.serviceTitle,
                                services: req.body.services
                            }
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        },
                        {
                            'pack.hiwhppscdID': req.params.packageId
                        }
                    ]
                }
            );
        } else if (req.params.service === 'manage') {
            checkAvailData = await hospitalModel.findOneAndUpdate(
                {
                    userId: req.user._id,
                    'packageDetails.hiwhpdsnmID': req.params.categoryId,
                    'packageDetails.subCategory.hiwhppdsID':
                        req.params.subCategory,
                    'packageDetails.subCategory.packType.hiwhppscdID':
                        req.params.packageId,
                    'packageDetails.subCategory.packType.serviceList.hiwhpslsID':
                        req.query.serviceId
                },
                {
                    $set: {
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].serviceList.$[service].serviceTitle':
                            req.body.serviceTitle,
                        'packageDetails.$[cat].subCategory.$[sub].packType.$[pack].serviceList.$[service].services':
                            req.body.services
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'cat.hiwhpdsnmID': req.params.categoryId
                        },
                        {
                            'sub.hiwhppdsID': req.params.subCategory
                        },
                        {
                            'pack.hiwhppscdID': req.params.packageId
                        },
                        {
                            'service.hiwhpslsID': req.query.serviceId
                        }
                    ]
                }
            );
        }
        if (checkAvailData === 'yetToUpdate') {
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    401
                )
            );
        }
        if (checkAvailData) {
            if (
                JSON.stringify(checkAvailData.packageDetails).includes(
                    'serviceTitle'
                )
            ) {
                checkAvailData = await hospitalModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: true },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                if (!checkAvailData) {
                    return next(
                        new AppError(
                            'Something went wrong while processing you request.',
                            400
                        )
                    );
                }
            } else {
                checkAvailData = await hospitalModel.findByIdAndUpdate(
                    checkAvailData._id,
                    { hospitalPackageStatus: false },
                    {
                        new: true,
                        runValidators: true
                    }
                );
            }
        } else {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    401
                )
            );
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// check valid partner
// exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
//     const [partner, hospital] = await Promise.all([
//         partnerModel.findOne({
//             userId: req.user._id,
//             status: 'accepted',
//             for: 'Hospitals'
//         }),
//         packageModel.findOne({
//             userId: req.user._id,
//             hiwhppsID: req.params.serviceId
//         })
//     ]);
//     if (!partner || !hospital) {
//         return next(
//             new AppError(
//                 'Something went wrong while processing you request.',
//                 401
//             )
//         );
//     }

//     req.body.parentEID = hospital.hiwhppsID;
//     req.body.partnerId = partner._id;
//     req.body.from = 'Hospitals';
//     req.body.userId = req.user._id;
//     req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
//     req.body.createdAt = Date.now();
//     req.body.partner = true;
//     req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
//     return next();
// });

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Hospitals',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Hospitals';
    return next();
};

exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Hospitals',
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
                        from: 'Hospitals',
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
    req.body = { from: 'Hospitals' };
    return next();
};

// cancel requester request
exports.assignDataForCancelReques = catchAsync(async (req, res, next) => {
    req.updateAllSearchQuery = {
        for: req.params.quoteId,
        userId: req.user._id,
        from: 'Hospitals'
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
        from: 'Hospitals',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// assign data for hospital package
exports.assignDataForGetAllHospitalPackage = (req, res, next) => {
    req.searchQuery = {
        packageDetails: {
            $elemMatch: {
                category: req.params.packageName
            }
        }
    };
    return next();
};

// assign data for hospital tourism
exports.assignDataForGetAllHospitalTourism = (req, res, next) => {
    req.searchQuery = {
        hospitalServices: {
            $elemMatch: {
                name: req.params.packageName
            }
        }
    };
    console.log(req.params.packageName);
    return next();
};

// assign data for get hospital
exports.assignDataFotGettHospitalServices = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'hospitalServices -partnerId';
    req.body.partner = req.docs;
    return next();
};

// get hospital service and all packges
exports.getAllHospitalServicesAndPackages = catchAsync(
    async (req, res, next) => {
        const [pack, services] = await Promise.all([
            hospitalPackageModel.find().distinct('name'),
            hospitalModel
                .findOne({
                    userId: req.user._id,
                    partnerId: req.docs._id
                })
                .select('hospitalServices -partnerId')
        ]);
        if (!services) {
            return next(new AppError('Something was wrong.', 400));
        }
        req.body.service = services;
        req.body.pack = pack;
        req.body.partner = req.docs;
        req.docs = undefined;
        return next();
    }
);

// assign data for get hospital facilities
exports.assignDataFotGettHospitalFacilities = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'hospitalFacilities -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital room facilities
exports.assignDataFotGettHospitalRoomFacilities = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData =
        'hospitalRoomFacilities hospitalRoomImags hospitalCanteenImags hospitalGuestRoomImags hospitalAvailableFacilities specialitiesDetails -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital specialist
exports.assignDataFotGettHospitalSpecialist = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'specialist -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby management
exports.assignDataFotGettHospitalNearby = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearbyFacilities -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby hotels management
exports.assignDataFotGettHospitalNearbyHotels = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearBy.hotels -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby restaurants
exports.assignDataFotGettHospitalNearbyRestaurents = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearBy.restaurants -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby airports
exports.assignDataFotGettHospitalNearbyAirports = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearBy.airports -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby airports
exports.assignDataFotGettHospitalNearbyRailwayStation = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearBy.railwayStation -partnerId';
    req.body.partner = req.docs;
    return next();
};

// assign data for get hospital nearby bustops
exports.assignDataFotGettHospitalNearbyBusStops = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }

    req.searchQuery = { userId: req.user._id, partnerId: req.docs._id };
    req.selectedData = 'nearBy.busStop -partnerId';
    req.body.partner = req.docs;
    return next();
};

// get hospitals datas
exports.getHospitalDatas =
    factoryController.findOneWithSelectedData(hospitalModel);

// manage hospital pacage
exports.manageHospitalServices = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.body);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    hospitalServices: {
                        hiwhdmsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    hospitalServices: {
                        hiwhdmsID: req.query.serviceId,
                        name: req.body.name,
                        priceFrom: req.body.priceFrom,
                        priceTo: req.body.priceTo,
                        description: req.body.description,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'manage') {
        const upObj = {
            'hospitalServices.$[cat].name': req.body.name,
            'hospitalServices.$[cat].priceFrom': req.body.priceFrom,
            'hospitalServices.$[cat].priceTo': req.body.priceTo,
            'hospitalServices.$[cat].description': req.body.description,
            'hospitalServices.$[cat].priceFrom': req.body.priceFrom
        };
        if (req.body.bannerImage) {
            upObj['hospitalServices.$[cat].bannerImage'] = req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,

                hospitalPackage: true,
                'hospitalServices.hiwhdmsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhdmsID': req.query.serviceId
                    }
                ]
            }
        );
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage hospital pacage
exports.manageHospitalFacilities = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.query.serviceId, req.user._id);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    hospitalFacilities: {
                        hiwhdfs: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    hospitalFacilities: {
                        hiwhdfs: req.query.serviceId,
                        name: req.body.name,

                        description: req.body.description,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'manage') {
        const upObj = {
            'hospitalFacilities.$[cat].name': req.body.name,

            'hospitalFacilities.$[cat].description': req.body.description
        };
        if (req.body.bannerImage) {
            upObj['hospitalFacilities.$[cat].bannerImage'] =
                req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'hospitalFacilities.hiwhdfs': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhdfs': req.query.serviceId
                    }
                ]
            }
        );
        console.log(checkAvailData);
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage nearby hodels
exports.manageNearbyHotels = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.body);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    'nearBy.hotels': {
                        hiwhtsmhdsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    'nearBy.hotels': {
                        hiwhtsmhdsID: req.query.serviceId,
                        name: req.body.name,
                        foodFacility: req.body.foodFacility,
                        AC: req.body.AC,
                        location: {
                            type: 'Point',
                            coordinates: [req.body.longitude, req.body.latitude]
                        },
                        distance: req.body.distance,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(checkAvailData);
    } else if (req.params.service === 'manage') {
        const upObj = {
            'nearBy.hotels.$[cat].name': req.body.name,
            'nearBy.hotels.$[cat].foodFacility': req.body.foodFacility,
            'nearBy.hotels.$[cat].AC': req.body.AC,

            'nearBy.hotels.$[cat].location': {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            },
            'nearBy.hotels.$[cat].distance': req.body.distance
        };
        if (req.body.bannerImage) {
            upObj['nearBy.hotels.$[cat].bannerImage'] = req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'nearBy.hotels.hiwhtsmhdsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhtsmhdsID': req.query.serviceId
                    }
                ]
            }
        );
        console.log(checkAvailData);
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage nearby restaurents
exports.manageNearbyRestaurents = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';

    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    'nearBy.restaurants': {
                        hiwhtsmrdsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    'nearBy.restaurants': {
                        hiwhtsmrdsID: req.query.serviceId,
                        name: req.body.name,
                        foodType: req.body.foodType,
                        VEG: req.body.VEG,
                        location: {
                            type: 'Point',
                            coordinates: [req.body.longitude, req.body.latitude]
                        },
                        distance: req.body.distance,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(checkAvailData);
    } else if (req.params.service === 'manage') {
        const upObj = {
            'nearBy.restaurants.$[cat].name': req.body.name,
            'nearBy.restaurants.$[cat].foodType': req.body.foodFacility,
            'nearBy.restaurants.$[cat].VEG': req.body.VEG,

            'nearBy.restaurants.$[cat].location': {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            },
            'nearBy.restaurants.$[cat].distance': req.body.distance
        };
        if (req.body.bannerImage) {
            upObj['nearBy.restaurants.$[cat].bannerImage'] =
                req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'nearBy.restaurants.hiwhtsmrdsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhtsmrdsID': req.query.serviceId
                    }
                ]
            }
        );
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage nearby airports
exports.manageNearbyAirports = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.body);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    'nearBy.airports': {
                        hiwhtsmadsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    'nearBy.airports': {
                        hiwhtsmadsID: req.query.serviceId,
                        name: req.body.name,
                        city: req.body.city,
                        location: {
                            type: 'Point',
                            coordinates: [req.body.longitude, req.body.latitude]
                        },
                        distance: req.body.distance,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(checkAvailData);
    } else if (req.params.service === 'manage') {
        const upObj = {
            'nearBy.airports.$[cat].name': req.body.name,
            'nearBy.airports.$[cat].city': req.body.city,
            'nearBy.airports.$[cat].location': {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            },
            'nearBy.airports.$[cat].distance': req.body.distance
        };
        if (req.body.bannerImage) {
            upObj['nearBy.airports.$[cat].bannerImage'] = req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'nearBy.airports.hiwhtsmadsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhtsmadsID': req.query.serviceId
                    }
                ]
            }
        );
        console.log(checkAvailData);
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage nearby tarains
exports.manageNearbyTrains = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';

    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    'nearBy.railwayStation': {
                        hiwhtsmrsdsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    'nearBy.railwayStation': {
                        hiwhtsmrsdsID: req.query.serviceId,
                        name: req.body.name,
                        city: req.body.city,
                        location: {
                            type: 'Point',
                            coordinates: [req.body.longitude, req.body.latitude]
                        },
                        distance: req.body.distance,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(checkAvailData);
    } else if (req.params.service === 'manage') {
        const upObj = {
            'nearBy.railwayStation.$[cat].name': req.body.name,
            'nearBy.railwayStation.$[cat].city': req.body.city,
            'nearBy.railwayStation.$[cat].location': {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            },
            'nearBy.railwayStation.$[cat].distance': req.body.distance
        };
        if (req.body.bannerImage) {
            upObj['nearBy.railwayStation.$[cat].bannerImage'] =
                req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'nearBy.railwayStation.hiwhtsmrsdsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhtsmrsdsID': req.query.serviceId
                    }
                ]
            }
        );
        console.log(checkAvailData);
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage nearby buses
exports.manageNearbyBuses = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.body);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    'nearBy.busStop': {
                        hiwhtsmbssID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    'nearBy.busStop': {
                        hiwhtsmbssID: req.query.serviceId,
                        name: req.body.name,
                        city: req.body.city,
                        location: {
                            type: 'Point',
                            coordinates: [req.body.longitude, req.body.latitude]
                        },
                        distance: req.body.distance,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
        console.log(checkAvailData);
    } else if (req.params.service === 'manage') {
        const upObj = {
            'nearBy.busStop.$[cat].name': req.body.name,
            'nearBy.busStop.$[cat].city': req.body.city,
            'nearBy.busStop.$[cat].location': {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            },
            'nearBy.busStop.$[cat].distance': req.body.distance
        };
        if (req.body.bannerImage) {
            upObj['nearBy.busStop.$[cat].bannerImage'] = req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.updateOne(
            {
                userId: req.user._id,
                'nearBy.busStop.hiwhtsmbssID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhtsmbssID': req.query.serviceId
                    }
                ]
            }
        );
        console.log(checkAvailData);
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// manage hospital pacage
exports.manageHospitalRoomFacilities = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    hospitalRoomFacilities: {
                        howmhdrfID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    hospitalRoomFacilities: {
                        howmhdrfID: req.query.serviceId,
                        name: req.body.name,

                        description: req.body.description,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'manage') {
        const upObj = {
            'hospitalRoomFacilities.$[cat].name': req.body.name,

            'hospitalRoomFacilities.$[cat].description': req.body.description
        };
        if (req.body.bannerImage) {
            upObj['hospitalRoomFacilities.$[cat].bannerImage'] =
                req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,

                hospitalPackage: true,
                'hospitalRoomFacilities.howmhdrfID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.howmhdrfID': req.query.serviceId
                    }
                ]
            }
        );
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});
// manage hospital pacage
exports.manageHospitalSpecialist = catchAsync(async (req, res, next) => {
    let checkAvailData = 'yetToUpdate';
    console.log(req.ip);
    if (req.params.service === 'delete') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $pull: {
                    specialist: {
                        hiwhdslsID: req.query.serviceId
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'create') {
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id
            },
            {
                $push: {
                    specialist: {
                        hiwhdslsID: req.query.serviceId,
                        name: req.body.name,

                        successRate: req.body.successRate,
                        posistion: req.body.posistion,
                        bannerImage: req.body.bannerImage
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );
    } else if (req.params.service === 'manage') {
        const upObj = {
            'specialist.$[cat].name': req.body.name,
            'specialist.$[cat].successRate': req.body.successRate,

            'specialist.$[cat].posistion': req.body.posistion
        };
        if (req.body.bannerImage) {
            upObj['specialist.$[cat].bannerImage'] = req.body.bannerImage;
        }
        checkAvailData = await hospitalModel.findOneAndUpdate(
            {
                userId: req.user._id,
                'specialist.hiwhdslsID': req.query.serviceId
            },
            {
                $set: upObj
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [
                    {
                        'cat.hiwhdslsID': req.query.serviceId
                    }
                ]
            }
        );
    }
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// add images for hospitals
exports.addImagesForHospitalRooms = catchAsync(async (req, res, next) => {
    const limit = await hospitalModel.findOne({
        userId: req.user._id,
        partnerId: req.docs._id
    });
    let fos = '';
    if (req.params.imgType === 'rooms') {
        fos = 'hospitalRoomImags';
    } else if (req.params.imgType === 'canteens') {
        fos = 'hospitalCanteenImags';
    } else if (req.params.imgType === 'guests') {
        fos = 'hospitalGuestRoomImags';
    } else {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }

    let check = limit[fos].length + req.body.images.length <= 12;

    if (!check) {
        return next(
            new AppError(
                'You can only upload 12 image of your hospital room',
                400
            )
        );
    }
    check = {};
    check[fos] = req.body.images;
    const data = await hospitalModel.findOneAndUpdate(
        {
            userId: req.user._id,
            partnerId: req.docs._id
        },
        {
            $push: check
        },
        {
            new: true,
            runValidators: true
        }
    );
    if (!data) {
        console.log('considerV1');
        return next(new AppError('Somthing went wrong.Please try again', 400));
    }
    return res.status(200).json({ status: 'Success' });
});

// remove hospital image
exports.removeHospitalRoomImages = catchAsync(async (req, res, next) => {
    let datas = `${req.params.imageName}$`;
    datas = new RegExp(datas, 'ig');
    let fos = '';
    if (req.params.imgType === 'rooms') {
        fos = 'hospitalRoomImags';
    } else if (req.params.imgType === 'canteens') {
        fos = 'hospitalCanteenImags';
    } else if (req.params.imgType === 'guests') {
        fos = 'hospitalGuestRoomImags';
    } else {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    const obj = {};
    obj[fos] = datas;
    const data = await hospitalModel.updateOne(
        {
            userId: req.user._id,
            partnerId: req.docs._id
        },
        {
            $pull: obj
        }
    );
    if (!data.modifiedCount) {
        return next(
            new AppError(
                'Something went wrong whlile processing you request',
                400
            )
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assign data for updaate hospital nearby facilities
exports.assignDataForUpdateHospital = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partnerId: req.docs._id
    };
    return next();
};
// assign data for update nearby hospital deatils
exports.checkAndArrangeDataForNearByHospital = (req, res, next) => {
    if (!req.docs.hospital?.medicalTourism) {
        return next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
    }
    req.body.nearbyFacilities = { ...req.body };
    return next();
};

// assign data for update nearby hospital deatils
exports.assignDataFordateHospitalAvailaity = (req, res, next) => {
    req.body.hospitalAvailableFacilities = { ...req.body };
    return next();
};

// assign data for update nearby hospital specialite
exports.assignDataforHospitalAvailablity = (req, res, next) => {
    req.body.specialitiesDetails = { ...req.body };
    return next();
};
// update hosptial
exports.updateHospitalDetails = factoryController.updateOne(hospitalModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// get hospital package
exports.getAHospialPackage = catchAsync(async (req, res, next) => {
    const [docs] = await hospitalModel.aggregate([
        {
            $match: {
                'packageDetails.category': req.params.packageName,
                hiwhppsID: req.params.serviceId
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
                            'hospital.hospitalPackage': true
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            aboutUs: '$hospital.aboutUs'
                        }
                    }
                ],
                as: 'partners'
            }
        },
        {
            $unwind: '$partners'
        },
        {
            $project: {
                packageDetails: 1,
                name: 1,
                city: 1,
                stream: 1,
                aboutUs: '$partners.aboutUs'
            }
        }
    ]);
    if (!docs) {
        return next(
            new AppError('Something went wrong while this package.', 401)
        );
    }
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get a tourism
// get hospital package
exports.getAHospialTourism = catchAsync(async (req, res, next) => {
    const [docs] = await hospitalModel.aggregate([
        {
            $match: {
                'hospitalServices.name': req.params.packageName,
                hiwhppsID: req.params.serviceId
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
                            'hospital.medicalTourism': true
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            website: 1,
                            email: 1,
                            centerPhone: 1,
                            centerLandLine: 1,
                            profileImage: 1,
                            imageGallery: 1,
                            openTime: 1,
                            closeTime: 1,
                            location: 1,
                            status: 1,
                            address: 1,
                            bannerImage: 1,
                            country: 1,
                            aboutUs: '$hospital.aboutUs'
                        }
                    }
                ],
                as: 'partners'
            }
        },
        {
            $unwind: '$partners'
        },

        {
            $replaceRoot: {
                newRoot: { $mergeObjects: ['$partners', '$$ROOT'] }
            }
        },
        { $project: { partners: 0 } }
        // {
        //     $project: {
        //         _id: 0,
        //         hospitalServices: 1,
        //         name: 1,
        //         city: 1,
        //         stream: 1,
        //         hospitalFacilities: 1,
        //         specialist: 1,
        //         nearbyFacilities: 1,
        //         nearBy: 1,
        //         partners: 1,
        //         website: 1,
        //         email: 1,
        //         centerPhone: 1,
        //         centerLandLine: 1,
        //         profileImage: 1,
        //         imageGallery: 1,
        //         openTime: 1,
        //         closeTime: 1,
        //         location: 1,
        //         status: 1,
        //         address: 1,
        //         bannerImage: 1,
        //         country: 1,
        //         aboutUs: 1
        //     }
        // }
    ]);
    if (!docs) {
        return next(
            new AppError('Something went wrong while this package.', 401)
        );
    }
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get all hospital details
exports.getAllHospitalDetails = catchAsync(async (req, res, next) => {
    const filterObj = { match: {} };
    if (req.query?.search) {
        filterObj.match = {
            $text: {
                $search: req.query.search
            }
        };
    }
    if (req.query?.type) {
        filterObj.match = { ...filterObj.match, stream: req.query.type };
    }
    if (req.query?.location) {
        filterObj.match = { ...filterObj.match, city: req.query.location };
    }

    const docs = await hospitalModel.aggregate([
        {
            $match: {
                ...filterObj.match
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
                    },
                    {
                        $project: {
                            _id: 0,
                            address: 1,
                            bannerImage: 1
                        }
                    }
                ],
                as: 'partners'
            }
        },
        {
            $unwind: '$partners'
        },
        {
            $project: {
                name: 1,
                city: 1,
                stream: 1,
                address: '$partners.address',
                bannerImage: '$partners.bannerImage',
                id: '$hiwhppsID'
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get a hospital details
exports.assignDataForGetHospitalStatus = (req, res, next) => {
    req.searchQuery = {
        hiwhppsID: req.params.hospitalId,
        stream: req.params.stream
    };
    req.queryPopulate = [
        {
            path: 'partner',
            select: 'website email centerPhone centerLandLine profileImage imageGallery openTime closeTime location country'
        }
    ];
    // req.querySelect =
    //     'name city stream hospital hospitalServices hospitalFacilities specialist hospitalRoomFacilities hospitalRoomImags -partnerId';
    return next();
};

// get a hospital details
exports.getAHospitalDetails =
    factoryController.findOneWithPopulate(hospitalModel);

// exoports.  get hospital detaila
exports.sendJsonForHospitalDetails = (req, res, next) => {
    let docs = req.body.findOnePopulateDocs;
    if (!docs.partnerId?.status) {
        return next(
            new AppError('Something went wrong with this details', 400)
        );
    }

    docs.aboutUs = docs.partnerId.hospital.aboutUs;
    docs.address = docs.partnerId.address;
    docs.bannerImage = docs.partnerId.bannerImage;
    docs.website = docs.partner[0].website;
    docs.email = docs.partner[0].email;
    docs.centerPhone = docs.partner[0].centerPhone;
    docs.centerLandLine = docs.partner[0].centerLandLine;
    docs.profileImage = docs.partner[0].profileImage;
    docs.imageGallery = docs.partner[0].imageGallery;
    docs.openTime = docs.partner[0].openTime;
    docs.closeTime = docs.partner[0].closeTime;
    docs.country = docs.partner[0].country;
    docs.nearbyFacilities =
        docs.nearBy =
        docs.hospitalDetailsStatus =
        docs.hospitalPackageStatus =
        docs.hospitaltourismStatus =
        docs.userId =
        docs.partnerId =
        docs.partnerEId =
        docs.hiwhppsID =
        docs.packageDetails =
        docs.partner =
        docs.id =
            undefined;

    return res.status(200).json({
        status: 'Success',
        docs
    });
};

// get all tourism
