// ============================================================
// import models
const _ = require('lodash');
const { validate: uuidValidate } = require('uuid');

// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utilities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');

// ============================================================
// import models
const newBloodDonnerModel = require('../models/BloodDonation/addNewBloodDonnerModel');
const bloodRequestorModel = require('../models/BloodDonation/bloodRequestorModel');
const bloodRequestsModel = require('../models/BloodDonation/requestBloodModel');
const partnerModel = require('../models/shared/partnerModel');
const bloodBankModel = require('../models/BloodDonation/bloodBankModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');

// create new quote
exports.getDataAndCreateForQuote = catchAsync(async (req, res, next) => {
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
            if (!datas.length) {
                return next(
                    new AppError(
                        `You selected product ${el.productName} has no vendors currently available.`,
                        404
                    )
                );
            }
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
                        from: req.query.from,
                        requestedPartnerEID: els.hiwpmID,
                        requestPartnerID: els._id,
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
            new AppError('No related vendors found in your search.', 404)
        );
    }
    return res.status(200).json({ status: 'Success' });
});
