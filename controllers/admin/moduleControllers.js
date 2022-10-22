// ============================================================
// import pakcages
const multer = require('multer');

// ============================================================
// import controllers
const factoryControllers = require('../factoryControllers');

// ============================================================
// import utilities
const AppError = require('../../util/AppError');
const catchAsync = require('../../util/catchAsync');
const encryptID = require('../../util/uuid');
const filterObjects = require('../../util/filterObjects');

// ============================================================
// import models
const homecareServices = require('../../models/Homecare/homecareService');
const homecareServiceModel = require('../../models/Homecare/homecaresModel');
const deaddictionService = require('../../models/Deaddiction/deAddictionServicesModel');
const deaddictionServiceModel = require('../../models/Deaddiction//createDeaddictionModel');
const ambulanceService = require('../../models/AmbulanceAlert/AmbulanceServiceModel');
const partnerModel = require('../../models/shared/partnerModel');
const hospitalPackagesModel = require('../../models/Hospital/hospitalPackage');
const hospitalModel = require('../../models/Hospital/hospitalModel');
const foodNutritionModel = require('../../models/Fitness/foodDetailsModel');
const pharmacyCategoriesModel = require('../../models/Pharmasy/pharmacyCategoriesModel');
const laboratoryCategoriesModel = require('../../models/laboratory/laboratoryCategoriesModel');
const jobCategoriesModel = require('../../models/JopPortal/jobCategoriesModel');
const pharmacyMedicinesModel = require('../../models/Pharmasy/medicineDetails');

//  get all homecare services
exports.getAllHomecareServices = factoryControllers.getAll(homecareServices);

//  get all deaddiction services
exports.getAllDeaddictionServices =
    factoryControllers.getAll(deaddictionService);

//  get all ambulance services
exports.getAllAmbulanceServices = factoryControllers.getAll(ambulanceService);

//  get all ambulance services
exports.getAllHospitalPackages = factoryControllers.getAll(
    hospitalPackagesModel
);

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
// set image size for ambulance driver
exports.setbannerImageSize = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};
// set image size for ambulance driver
exports.setbannerImageSizeForDeaddicationCenter = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    req.image.gallery = 'serviceImages';

    return next();
};

// reqize iamge and image gallery
exports.resizeHomecareServiceImages = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create')
        if (!req.files.image || !req.files.imageGallery)
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
// assign data for create new homecare  servicse
exports.assignDataForcreateNewHomecareServices = catchAsync(
    async (req, res, next) => {
        req.body.hiwhcsmID = await encryptID(process.env.SPEAK_TO_US_SECRET);

        req.body.createdAt = Date.now();
        return next();
    }
);
// assign data for create new pharmacy categories
exports.assignDataForcreateNewPharmacyCategories = catchAsync(
    async (req, res, next) => {
        req.body.hiwpclImID = await encryptID(process.env.SPEAK_TO_US_SECRET);

        req.body.createdAt = Date.now();
        return next();
    }
);

// assign data for create new pharmacy medicines
exports.assignDataForcreateNewPharmacyMedicines = catchAsync(
    async (req, res, next) => {
        req.body.hiwpmmdsID = await encryptID(process.env.SPEAK_TO_US_SECRET);

        req.body.createdAt = Date.now();
        return next();
    }
);
// assign data for create new laboratory categories
exports.assignDataForcreateNewLaboratoryCategories = catchAsync(
    async (req, res, next) => {
        req.body.hiwlbycmID = await encryptID(process.env.SPEAK_TO_US_SECRET);

        req.body.createdAt = Date.now();
        return next();
    }
);
// assign data for create new deaddiction  servicse
exports.assignDataForcreateNewDeaddictionServices = catchAsync(
    async (req, res, next) => {
        req.body.hiwdasmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        return next();
    }
);
// assign data for create new ambulance  servicse
exports.assignDataForcreateNewAmbulanceServices = catchAsync(
    async (req, res, next) => {
        req.body.hiwaanasmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        return next();
    }
);

// assign data for create new hospital package
exports.assignDataForcreateNewHospitalPackage = catchAsync(
    async (req, res, next) => {
        req.body.hiwhppmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        return next();
    }
);

// assign data for create new nutritions
exports.assignDataForcreateNewNutritions = catchAsync(
    async (req, res, next) => {
        req.body.hiwfndID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        return next();
    }
);

// set homecare image name
exports.assignImageNameForHomecareService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhcsmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-homecare-bannerimage`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwhcsmID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-homecare-bannerimage`;
    return next();
};

// set pharmacy image name
exports.assignImageNameForPharmacy = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwpclImID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-pharmacy-categories`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwpclImID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-pharmacy-categories`;
    return next();
};

// set pharmacy medicines image name
exports.assignImageNameForPharmacyMedicines = (req, res, next) => {
    console.log(req.body);
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwpmmdsID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-pharmacy-medicine`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwpmmdsID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-pharmacy-medicine`;
    return next();
};

// set laboratory image name
exports.assignImageNameForlaboratory = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwlbycmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-laboratory-categories`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwlbycmID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-laboratory-categories`;
    return next();
};
// set image name
exports.assignImageNameForDeaddictionService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdasmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-deaddiction-bannerimage`;
        req.image.galleryName = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdasmID.split(/[a-z]+/).join('')}`}`
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
// set ambulance image name
exports.assignImageNameForAmbulanceService = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwdacmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-ambulance-bannerimage`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwdacmID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-ambulance-bannerimage`;
    return next();
};

// set a hospital package image name
exports.assignImageNameForHospitalPackage = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhppmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-hospital-package-bannerimage`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwhppmID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-package-bannerimage`;
    return next();
};

// set a hospital package image name
exports.assignImageNameForNutritions = (req, res, next) => {
    req.body.uses = req.body.uses.split(',');
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwfndID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-food-nutrition-image`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwfndID: req.params.foodId };

    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.foodId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-food-nutrition-image`;
    return next();
};

// set a nutritions images
exports.assignImageNameForutritions = (req, res, next) => {
    if (req.body.statusType === 'create') {
        req.image.imagename = `${`${`${req.user._id
            .toString()
            .split(/[a-z]+/)
            .join('')}-${req.body.hiwhppmID.split(/[a-z]+/).join('')}`}`
            .split('-')
            .join('')}-hospital-package-bannerimage`;
        return next();
    }
    if (req.body.statusType !== 'update') {
        return next(
            new AppError('Somthing went wrong. Please try again later.', 400)
        );
    }
    req.updateOneSearch = { hiwhppmID: req.params.serviceId };
    if (!req.image.data) {
        return next();
    }
    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-hospital-package-bannerimage`;
    return next();
};
// create new homecare service
exports.createNewHomeCareService =
    factoryControllers.createOne(homecareServices);

// create new pharmacy service
exports.createNewPharmacyServices = factoryControllers.createOne(
    pharmacyCategoriesModel
);

// create new pharmacy medicnine
exports.createNewPharmacyMedicine = factoryControllers.createOne(
    pharmacyMedicinesModel
);

// create new pharmacy medicine
exports.checkValidCategorie = catchAsync(async (req, res, next) => {
    const categorie = await pharmacyCategoriesModel.findOne({
        name: req.body.categorie
    });
    console.log(req.body.categorie);
    if (!categorie) {
        return next(new AppError('Please select the valide categorie.', 400));
    }
    return next();
});

// create new laboratory service
exports.createNewLaboratoryServices = factoryControllers.createOne(
    laboratoryCategoriesModel
);

// create new deaddiction service
exports.createNewDeaddictionService =
    factoryControllers.createOne(deaddictionService);

// create new ambulance service
exports.createNewAmbulanceService =
    factoryControllers.createOne(ambulanceService);

// create new hospital package
exports.createNewHospitalPacakge = factoryControllers.createOne(
    hospitalPackagesModel
);

// create new nutritions details
exports.createNewNutritionDetails =
    factoryControllers.createOne(foodNutritionModel);

// create new nutritions details
exports.updateNutritionDetails =
    factoryControllers.updateOne(foodNutritionModel);

// update homecare services
exports.updateHomecareServices = factoryControllers.updateOne(homecareServices);

// update medicines services
exports.updateMedicines = factoryControllers.updateOne(pharmacyMedicinesModel);
// update medicines services
exports.updateMedicinesServices = factoryControllers.updateAll(
    pharmacyMedicinesModel
);
// update pharmacy categorie
exports.updatePharmacyServices = factoryControllers.updateOne(
    pharmacyCategoriesModel
);

// update deaddiction services
exports.updateDeaddictionServices =
    factoryControllers.updateOne(deaddictionService);

// update ambulance services
exports.updateAmbulanceServices =
    factoryControllers.updateOne(ambulanceService);

// update hosptialPackage
exports.updateHospitalPackage = factoryControllers.updateOne(
    hospitalPackagesModel
);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// send json fro update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// assign data for get old data
exports.getOldHomecareData = catchAsync(async (req, res, next) => {
    const data = await homecareServices.findOne({
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

// assign data for get old data
exports.getOldMedicinesName = catchAsync(async (req, res, next) => {
    const data = await pharmacyCategoriesModel.findOne({
        hiwpclImID: req.params.serviceId
    });
    if (!data) {
        return next(new AppError('medicine not found.', 400));
    }
    req.oldName = data.name;
    return next();
});
// assign data for get old deaddiction data
exports.getOldDeaddictionData = catchAsync(async (req, res, next) => {
    const data = await deaddictionService.findOne({
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
    console.log('hi');
    req.oldName = data.name;
    return next();
});

// assign data for get old ambulance data
exports.getOldAmbulanceData = catchAsync(async (req, res, next) => {
    const data = await ambulanceService.findOne({
        hiwaanasmID: req.params.serviceId
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

/// assign data for get old ambulance data
exports.getOldHospitalPackage = catchAsync(async (req, res, next) => {
    const data = await hospitalPackagesModel.findOne({
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

// assign data for update all homecare services data
exports.assignDataForUpdateRestHomcareServicesAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};

// assign data for update all medicines services data
exports.assignDataForUpdateRestMedicinesServicesAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { categorie: req.oldName };
    req.updateAllData = { categorie: req.body.name };
    return next();
};

// assign data for update all deaddiction services data
exports.assignDataForUpdateRestdeaddictionServicesAll = (req, res, next) => {
    if (req.body.name === req.oldName) {
        return res.status(200).json({ status: 'Success' });
    }

    req.updateAllSearchQuery = { serviceName: req.oldName };
    req.updateAllData = { serviceName: req.body.name };
    return next();
};
// assign data for update all deaddiction services data
exports.updateRemainValuesinAmbulanceServices = catchAsync(
    async (req, res, next) => {
        if (req.body.name === req.oldName) {
            return res.status(200).json({ status: 'Success' });
        }
        const obj = {};

        const drivers = await partnerModel.updateMany(
            {
                for: 'Ambulance Service'
            },
            {
                'ambulance.ambulanceService.$[].services.$[service]':
                    req.body.name
            },
            {
                new: true,
                runValidators: true,
                arrayFilters: [{ service: req.oldName }]
            }
        );
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// assign data for update all hospital package
exports.updateRemainValuesinHospitalPackage = catchAsync(
    async (req, res, next) => {
        if (req.body.name === req.oldName) {
            return res.status(200).json({ status: 'Success' });
        }
        const drivers = await Promise.all([
            hospitalModel.updateMany(
                {
                    $or: [
                        { 'packageDetails.$.category': req.oldname },
                        { 'hospitalServices.$.name': req.oldname }
                    ]
                },
                {
                    $set: {
                        'packageDetails.$[sub].category': req.body.name,
                        'hospitalServices.$[nme].name': req.body.name
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    arrayFilters: [
                        {
                            'sub.category': req.oldName
                        },
                        {
                            'nme.name': req.oldName
                        }
                    ]
                }
            )
        ]);

        return res.status(200).json({
            status: 'Success'
        });
    }
);

// update registered homecare service data
exports.updateRemainingHomeCareServices =
    factoryControllers.updateAll(homecareServiceModel);

// update medicines service data
exports.updateRemainingHomeCareServices =
    factoryControllers.updateAll(homecareServiceModel);

// update registerd deddication service data
exports.updateRemainingDeaddictionServices = factoryControllers.updateAll(
    deaddictionServiceModel
);

// get nutritions
exports.getAllNutritions = factoryControllers.getAllFilter(foodNutritionModel);

// get all pharmacy
exports.getAllPharmacyCategories = factoryControllers.getAllFilter(
    pharmacyCategoriesModel
);

// get all medicine and categorie
exports.getAllMedicinesAndCategoreis = catchAsync(async (req, res, next) => {
    const [medicine, categories] = await Promise.all([
        pharmacyMedicinesModel.find(),
        pharmacyCategoriesModel.find().distinct('name')
    ]);

    req.body.medicines = medicine;
    req.body.categories = categories;
    return next();
});

// get all laboratory categories
exports.getAllLaboratoryCategories = factoryControllers.getAllFilter(
    laboratoryCategoriesModel
);

// assign data for create new job categoreise
exports.assignDataforCreateNewJobCategories = catchAsync(
    async (req, res, next) => {
        req.body.hiwjsmlsmID = await encryptID(process.env.SPEAK_TO_US_SECRET);

        req.body.createdAt = Date.now();
        return next();
    }
);

// creat new job categories
exports.createNewJobCategories =
    factoryControllers.createOne(jobCategoriesModel);

// mange job sub cateegories
exports.mangeJobsubCategories = catchAsync(async (req, res, next) => {
    req.updateOneSearch = { hiwjsmlsmID: req.params.serviceId };
    req.body.specialists = [...new Set(req.body.subCategories)];
    console.log(req.body);
    return next();
});

// update job categoreis
exports.updateSubCategories = factoryControllers.updateOne(jobCategoriesModel);
