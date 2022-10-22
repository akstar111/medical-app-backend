// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const orgonModel = require('../models/OrgonDonation/organDonationModel');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'Pending',
        for: 'Orgon Donation'
    };
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// assign partner id
exports.assignPartnerId = (req, res, next) => {
    req.body.partnerId = req.docs._id;
    return next();
};

// create new service
exports.createNewService = factoryController.createOne(orgonModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.searchQuery = { userId: req.user._id, _id: req.params.orgonId };

    req.updateByIdQuery = req.params.orgonId;
    req.updateQuery = req.body;
    return next();
};

//verify Valid partner's service
exports.verifyValidPartnerissSerive = factoryController.findOne(orgonModel);

// update home care service
exports.updateOrgaonDonation = factoryController.updateById(orgonModel);

// delete orgon service
exports.deleteOrgaonDonation = catchAsync(async (req, res, next) => {
    await orgonModel.findByIdAndDelete(req.params.orgonId);

    return next();
});
