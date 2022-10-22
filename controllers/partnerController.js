// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ==============================+==============================
// import model
const partnerModel = require('../models/shared/partnerModel');
const hospitalModel = require('../models/Hospital/hospitalModel');

// import utlitieis
const encryptID = require('../util/uuid');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');

//// create new partner
// create partner
exports.createPartner = factoryController.createOne(partnerModel);
// send created json partner to client
exports.sendJsoCreatedPartner = factoryController.sendJson();

// Assign data for new partner data
exports.assignNewPartnerData = catchAsync(async (req, res, next) => {
    req.body.userId = req.user._id;
    req.body.hiwpmID = await encryptID(process.env.PARTNER_SECRET);
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.createdAt = Date.now();
    req.body.phone = req.user.phone;
    return next();
});

// validate partner data
exports.validatePartnerData = (req, res, next) => {
    // eslint-disable-next-line default-case
    switch (req.body.for) {
        case 'Blood Bank':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(
                    new AppError('Blood Bank banner should be included.', 400)
                );
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Blood bank's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            break;
        case 'Ambulance Service':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            break;
        case 'De-Addiction service':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            if (!req.body.description) {
                return next(
                    new AppError(
                        'Please write short description about your deaddication center',
                        400
                    )
                );
            }
            req.body.deaddiction = {};
            req.body.deaddiction.aboutus = req.body.description;
            break;
        case 'Fitness':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            if (!req.body.description) {
                return next(
                    new AppError(
                        'Please write short description about your deaddication center',
                        400
                    )
                );
            }
            if (!req.body.serviceType) {
                return next(
                    new AppError('Service type should be included.', 400)
                );
            }
            if (
                req.body.serviceType !== 'gym' &&
                req.body.serviceType !== 'yoga' &&
                req.body.serviceType !== 'meditation'
            ) {
                return next(new AppError('Invali service type', 400));
            }
            req.body.fitness = {};
            req.body.fitness.serviceType = req.body.serviceType;
            req.body.fitness.aboutus = req.body.description;
            req.body.serviceType = req.body.description = undefined;
            break;
        case 'Hearing AID':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            if (!req.body.description) {
                return next(
                    new AppError(
                        'Please write short description about your deaddication center',
                        400
                    )
                );
            }
            if (!req.body.serviceType) {
                return next(
                    new AppError('Service type should be included.', 400)
                );
            }
            if (req.body.serviceType === 'hospital') {
                if (!req.body.availableDoctors) {
                    return next(
                        new AppError(
                            'Available doctors should be included.',
                            400
                        )
                    );
                }
                if (!req.body.price) {
                    return next(
                        new AppError('Charging cost should be included.', 400)
                    );
                }
                req.body.hearingAid = {};
                req.body.hearingAid.serviceType = 'hospital';
                req.body.hearingAid.price = req.body.price;
                req.body.hearingAid.availableDoctors =
                    req.body.availableDoctors;
            } else if (req.body.serviceType === 'repairStore') {
                if (
                    !req.body.batteryChangeCharge ||
                    !req.body.noiseFixCharge ||
                    !req.body.cleaningCharge
                ) {
                    return next(
                        new AppError('Chatges details should be inlcuded.', 400)
                    );
                }
                req.body.hearingAid = {};
                req.body.hearingAid.serviceType = 'repairStore';
                req.body.hearingAid.batteryChangeCharge =
                    req.body.batteryChangeCharge;
                req.body.hearingAid.noiseFixCharge = req.body.noiseFixCharge;
                req.body.hearingAid.cleaningCharge = req.body.cleaningCharge;
            } else if (req.body.serviceType === 'shop') {
                req.body.hearingAid = {};
                req.body.hearingAid.serviceType = 'shop';
            } else {
                return next(
                    new AppError('Please select the valide servicet type.', 400)
                );
            }
            break;
        case 'Homecare service':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            if (!req.body.serviceType) {
                return next(
                    new AppError('Service type should be included.', 400)
                );
            }
            if (
                req.body.serviceType !== 'individual' &&
                req.body.serviceType !== 'company'
            ) {
                return next(
                    new AppError('Please select the valid servicetype', 400)
                );
            }
            req.body.homecare = {};
            req.body.homecare.serviceType = req.body.serviceType;
            break;
        case 'Hospital':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }

            if (!req.body.vendorSubtype) {
                return next(
                    new AppError('Vendor subtype should be included.', 400)
                );
            }
            if (
                req.body.vendorSubtype !== 'clinic' &&
                req.body.vendorSubtype !== 'nursing-home' &&
                req.body.vendorSubtype !== 'hospitals' &&
                req.body.vendorSubtype !== 'muti-speciality-hospital' &&
                req.body.vendorSubtype !== 'medical-college'
            ) {
                return next(new AppError('Select valid vendor subtype', 400));
            }
            req.body.hospital = {};
            req.body.hospital.aboutUs = req.body.description;
            req.body.hospital.stream = req.body.vendorSubtype;
            req.body.hospital.medicalTourism = req.body.medicalTourism ?? false;
            req.body.hospital.hospitalPackage =
                req.body.hospitalPackage ?? false;
            req.body.hospital.hospitalDetailsStatus = false;
            req.body.hospital.hospitalPackageStatus = false;
            req.body.hospital.hospitaltourismStatus = false;
            break;
        case 'Meet the Expert':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            if (!req.body.serviceType) {
                return next(
                    new AppError('Please select the service type', 400)
                );
            }
            if (
                req.body.serviceType !== 'contractors' &&
                req.body.serviceType !== 'service' &&
                req.body.serviceType !== 'consultants'
            ) {
                return next(
                    new AppError('Please select the valid service type.')
                );
            }
            if (!req.body.vendorType) {
                return next(
                    new AppError('Vendor type should be included.', 400)
                );
            }
            if (
                req.body.vendorType !== 'company' &&
                req.body.vendortype !== 'individual'
            ) {
                return next(
                    new AppError('Please select the valid vendor type.')
                );
            }
            req.body.meettheExperts = {};
            req.body.meettheExperts.serviceType = req.body.serviceType;
            req.body.meettheExperts.vendorType = req.body.vendorType;
            break;
        case 'Online Consultancy':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.speciality) {
                return next(
                    new AppError('speciality should be included.', 400)
                );
            }
            if (!req.body.category) {
                return next(new AppError('category should be included.', 400));
            }
            if (!req.body.experience) {
                return next(
                    new AppError('experience should be included.', 400)
                );
            }
            req.body.onlineConsultancy = {};
            req.body.onlineConsultancy.speciality = req.body.speciality;
            req.body.onlineConsultancy.category = req.body.category;
            req.body.onlineConsultancy.experience = req.body.experience;
            break;
        case 'Opticals':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            break;
        case 'Laboratory':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            break;
        case 'Pharmacy':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            break;
        case 'Speak To Us':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.counselingNumber) {
                return next(
                    new AppError('counseling bumber should be inluded', 400)
                );
            }
            req.body.speakToUs = {
                counselingNumber: req.body.counselingNumber
            };
            break;
        case 'Study Abroad':
            if (!req.body.profileImage) {
                return next(
                    new AppError('Profile image should be included.', 400)
                );
            }
            if (!req.body.bannerImage) {
                return next(new AppError('Banner should be included.', 400));
            }
            if (!req.body.imageGallery) {
                return next(
                    new AppError("Center's images should be included.", 400)
                );
            }
            if (!req.body.location || req.body.location.length !== 2) {
                return next(
                    new AppError(
                        'Location should be included or enter valid location.',
                        400
                    )
                );
            }
            if (!req.body.openTime || !req.body.closeTime) {
                return next(
                    new AppError(
                        'open time and close time should be included.',
                        400
                    )
                );
            }
            break;
    }
    return next();
};

exports.checkAlreadyExistPartner = catchAsync(async (req, res, next) => {
    const partner = await partnerModel.findOne({
        userId: req.user._id,
        for: req.body.for
    });
    if (partner) {
        return next(
            new AppError(
                'You already created a partner service on this option',
                400
            )
        );
    }
    return next();
});

// crete data if there is need
exports.createDataForIfNeed = catchAsync(async (req, res, next) => {
    switch (req.body.for) {
        case 'Hospital':
            const { userId, city } = req.body.docs;
            const eID = await encryptID(process.env.PARTNER_SECRET);
            await hospitalModel.create({
                userId,
                city,
                name: req.body.docs.company,
                partnerId: req.body.docs._id,
                partnerEId: req.body.docs.hiwpmID,
                createdAt: Date.now(),
                hiwhppsID: eID,
                stream: req.body.vendorSubtype
            });
        default:
            return next();
    }
});

// assign data for get parters
exports.assignDataForGetPartners = (req, res, next) => {
    req.filterQuery = { userId: req.user._id, status: 'accepted' };
    req.selectedata = 'for hiwpmID profileImage address company';
    return next();
};

// get all partners
exports.getAllAcceptedPartners = factoryController.findAllData(partnerModel);

// send json for get all selecter data with query exports
exports.sendJsonForGetAllSelectedquery = factoryController.sendJsonForAll();

// assign data for get a partner
exports.assignDataForGetAPartner = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, hiwpmID: req.params.partnerId };
    return next();
};

// get a partnere
exports.getAPartner = factoryController.findOne(partnerModel);

// send json for get one partner
exports.sendJsonForGetOne = factoryController.sendJsonForFindOne();
