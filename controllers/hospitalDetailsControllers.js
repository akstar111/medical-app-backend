// ============================================================
// import packages
const { v4: uuidv4, v5: uuidv5, validate: uuidValidate } = require('uuid');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const hospitalDetailsModel = require('../models/HospitalDetails/hospitalDetailsModel');
const packageModel = require('../models/Hospital/hospitalModel');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const filerDataFromRequest = require('../util/filterObjects');
const encryptID = require('../util/uuid');

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'Pending',
        for: 'Hospital Details'
    };
    req.body.userId = req.user._id;

    return next();
};

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwhdsID: req.params.serviceid
    };

    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// create new service
exports.createNewService = factoryController.createOne(hospitalDetailsModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// ============================================================
// home care application

// assign home care serive application search Query
exports.assignHomeServiceApplicationSearchQuery = catchAsync(
    async (req, res, next) => {
        const getPartner = await hospitalDetailsModel.findById(
            req.params.serviceid
        );

        if (!getPartner) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    400
                )
            );
        }

        req.searchQuery = { _id: getPartner.partnerId };

        return next();
    }
);
// update home care service
exports.updateHospitalDetails =
    factoryController.updateOne(hospitalDetailsModel);
// send json for update new hostpital details
exports.sendJsonForHospitalDetailsUpdate =
    factoryController.sendJsonForUpdateOne();

// delete homecare service
exports.deleteHospitalDetails = catchAsync(async (req, res, next) => {
    const datas = await hospitalDetailsModel.deleteOne({
        hiwhdsID: req.params.serviceid,
        partnerId: req.docs._id
    });
    if (!datas.deletedCount)
        return next(
            new AppError(
                'Something went wrong while proessing your request',
                401
            )
        );
    return next();
});

// assign partner id
exports.assignPartnerId = catchAsync(async (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.hiwhdsID = await uuidv5(process.env.HOSPITAL_DETAILS, uuidv4());
    return next();
});

// get all servie
exports.getAllHospitalDetails =
    factoryController.getAllFilter(hospitalDetailsModel);

// send json for all
exports.sendJsonAll = factoryController.sendAllFilter();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQueryId = req.params.serviceId;
    return next();
};

// find data by id
exports.findServiceById = factoryController.findById(hospitalDetailsModel);

// send json for find by id
exports.sendJsonForId = factoryController.sendJsonForId();

// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ============================================================

// assign data for get a services
exports.assignDataForGetServices = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.selectedData = 'hospitalServices';
    return next();
};
// assign data for get a facilities
exports.assignDataForGetFacilities = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.selectedData = 'hospitalFacilities';
    return next();
};
// assign data for get a Speciallist
exports.assignDataForGetSpeciallist = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    req.selectedData = 'specialist';
    return next();
};

// get services with selected data
exports.getHospitalDetailsWithSelectedData =
    factoryController.findOneWithSelectedData(packageModel);

// exprots.prevent from showing unwanted data to clident
exports.preventLeakingGetService = async (req, res, next) => {
    req.docs = filerDataFromRequest(req.docs, 'hospitalServices');
    return next();
};
// exprots.prevent from showing unwanted data to clident
exports.preventLeakingGetFaciliteis = async (req, res, next) => {
    req.docs = filerDataFromRequest(req.docs, 'specialist');
    return next();
};

// send json for find wone wiht selected data
exports.sendJsonForSelectedData = factoryController.sendJsonForSelectedData();

// manage hospital services controllers
exports.updateHospitalDetailsService = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    if (req.params.type === 'services') {
        req.query.objData = {
            'hospital.hospitalServices': {
                $elemMatch: { hiwhdmsID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'hospital.hospitalServices': { hiwhdmsID: req.query.serviceId }
        };
        req.query.push = {
            'hospital.hospitalServices': {
                hiwhdmsID: req.query.serviceId,
                name: req.body.name,
                description: req.body.description,
                priceFrom: req.body.priceFrom,
                priceTo: req.body.priceTo,
                bannerImage: req.body.bannerImage
            }
        };
    } else if (req.params.type === 'facilities') {
        req.query.objData = {
            'hospital.hospitalFacilities': {
                $elemMatch: { hiwhdfs: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'hospital.hospitalFacilities': { hiwhdfs: req.query.serviceId }
        };
        req.query.push = {
            'hospital.hospitalFacilities': {
                hiwhdfs: req.query.serviceId,
                name: req.body.name,
                description: req.body.description,
                bannerImage: req.body.bannerImage
            }
        };
    } else if (req.params.type === 'specialist') {
        req.query.objData = {
            'hospital.specialist': {
                $elemMatch: { hiwhdslsID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'hospital.specialist': { hiwhdslsID: req.query.serviceId }
        };
        req.query.push = {
            'hospital.specialist': {
                hiwhdslsID: req.query.serviceId,
                name: req.body.name,
                successRate: req.body.successRate,
                posistion: req.body.posistion,
                bannerImage: req.body.bannerImage
            }
        };
    } else {
        return next(
            new AppError(
                'Somthing went wrong while processing your request.',
                400
            )
        );
    }
    let checkData = 'yetToUpdate';
    if (req.params.service === 'manage' || req.params.service === 'delete') {
        checkData = await partnerModel.findOneAndUpdate(
            {
                userId: req.user._id,
                for: 'Hospital',
                ...req.query.objData
            },
            {
                $pull: { ...req.query.pull }
            },
            {
                new: true,
                runValidators: true
            }
        );

        req.query.objData = {};
    }

    if (req.params.service === 'manage') {
        checkData = await partnerModel.findOneAndUpdate(
            {
                userId: req.user._id,
                for: 'Hospital'
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
    // let checkData = await partnerModel.findOne({
    //     userId: req.user._id,
    //     for: 'Hospital'
    // });
    if (checkAvailData === 'yetToUpdate') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                401
            )
        );
    }
    if (
        !!checkData.hospital.hospitalServices.length &&
        !!checkData.hospital.hospitalFacilities.length &&
        !!checkData.hospital.specialist.length
    ) {
        checkData = await partnerModel.findOneAndUpdate(
            {
                userId: req.user._id,
                for: 'Hospital'
            },
            {
                'hospital.hospitalDetailsStatus': true
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!checkData) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.'
                )
            );
        }
    } else {
        checkData = await partnerModel.findOneAndUpdate(
            {
                userId: req.user._id,
                for: 'Hospital'
            },
            {
                'hospital.hospitalDetailsStatus': false
            },
            {
                new: true,
                runValidators: true
            }
        );
        if (!checkData) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.'
                )
            );
        }
    }
    return res.status(200).json({
        status: 'Success'
    });
});
// manage hospital services controllers
exports.updateHospitalDetailsFacilites = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        services: { $elemMatch: { hiwhdfs: req.query.serviceId } }
    };
    if (!req.query.serviceId || !uuiddetails) {
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    if (req.params.service === 'manage' || req.params.service === 'delete') {
        const a = await packageModel.updateOne(
            {
                userId: req.user._id,
                ...req.query.objData
            },
            {
                $pull: { hospitalFacilities: { hiwhdfs: req.query.serviceId } }
            }
        );
        console.log(a);
        req.query.objData = {};
    }

    if (req.params.service === 'manage') {
        const b = await packageModel.updateOne(
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
    }
    return res.status(200).json({
        status: 'Success'
    });
});
// manage hospital services controllers
exports.updateHospitalDetailsSpecialist = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {
        services: { $elemMatch: { hiwhdslsID: req.query.serviceId } }
    };
    if (!req.query.serviceId || !uuiddetails) {
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    // if (req.params.service === 'update' || req.params.service === 'delete') {
    const a = await packageModel.updateOne(
        {
            userId: req.user._id,
            ...req.query.objData
        },
        {
            $pull: { specialist: { hiwhdslsID: req.query.serviceId } }
        }
    );
    console.log(a);
    req.query.objData = {};
    // }

    if (req.params.service === 'manage') {
        const b = await packageModel.updateOne(
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
    }
    return res.status(200).json({
        status: 'Success'
    });
});
