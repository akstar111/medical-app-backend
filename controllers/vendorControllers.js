// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');

// get bloodbank and partner
exports.getPartner = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            for: req.params.from,
            status: 'accepted'
        })
    ]);
    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }

    req.body.partner = partner;

    return next();
});

// assing Data for partner
exports.assignPartnerBloodBank = (req, res, next) => {
    req.params.from = 'Blood Bank';
    return next();
};

// assing Data for partner expert
exports.assignPartnerExpert = (req, res, next) => {
    req.params.from = 'Meet the Expert';
    return next();
};
