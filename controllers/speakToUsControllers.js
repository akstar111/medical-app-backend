// ============================================================
// import packages
const _ = require('lodash');
// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import models
const speaktousModel = require('../models/SpeakToUs/speaktousModel');
const partnerModel = require('../models/shared/partnerModel');
const speaktousAvailablityModel = require('../models/SpeakToUs/speaktoUsAvailblityModel');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');

// ============================================================
// create controllers
// assign partner search data
exports.assignExpertSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Speak To Us'
    };

    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

exports.assignDataForUpdateClinic = (req, res, next) => {
    req.updateOneSearch = {
        partnerId: req.docs._id,
        userId: req.user._id
    };
    return next();
};

// assign data create new service for experts
exports.assignNewServiceData = catchAsync(async (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.createAt = Date.now();
    req.body.userId = req.user._id;
    req.body.hiwstuID = await encryptID(process.env.SPEAK_TO_US_SECRET);
    return next();
});

// create new service
exports.createNewService = factoryControllers.createOne(speaktousModel);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {};
    req.updateQuery = req.body;
    return next();
};

// update speak to us
exports.updateSpeakToUs = factoryControllers.updateOne(speaktousModel);

// assign data for find my availablity
exports.assignDataForFindMyAvailablitySlots = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        partnerId: req.body.partnerId
    };
    return next();
};

// get my availablity
exports.getMyAvailablity = factoryControllers.findOne(
    speaktousAvailablityModel
);

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Speak To Us'
        })
    ]);
    if (!partner) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.partnerId = partner._id;
    req.body.partnerEId = partner.hiwpmID;

    req.body.availablity = partner.speakToUs.availablity;
    return next();
});
// verify and get details
exports.verifyVendorDatas = catchAsync(async (req, res, next) => {
    if (req.body.availablity) return next();
    const uuid = await encryptID(process.env.SPEAK_TO_US_SECRET);
    const data = {
        partnerEId: req.body.partnerEId,
        partnerId: req.body.partnerId,
        userId: req.user._id,
        hiwstpasID: uuid,
        createdAt: Date.now()
    };

    await speaktousAvailablityModel.create(data);

    await partnerModel.findByIdAndUpdate(
        req.body.partnerId,
        {
            $set: {
                'speakToUs.availablity': true
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return next();
});
//assign data for create new speak to use model
exports.assignDataForCreateNewAvailablity = catchAsync(
    async (req, res, next) => {
        if (req.body.availablity) {
            return next(new AppError('You already created Availablity', 400));
        }
        const uuid = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body = {
            partnerEId: req.body.partnerEId,
            partnerId: req.body.partnerId,
            userId: req.user._id,
            createdAt: Date.now(),
            hiwstpasID: uuid,
            status: 'inactive'
        };
        return next();
    }
);
// creaate new speak to us availblity
exports.createSpeakToUsAvailablity = factoryControllers.createOne(
    speaktousAvailablityModel
);
// handle after createing the availablitye
exports.handleAfterAvalablityCreatetion = catchAsync(async (req, res, next) => {
    const a = await partnerModel.findByIdAndUpdate(
        req.body.partnerId,
        {
            $set: { 'speakToUs.availablity': true }
        },
        { runValidators: true }
    );

    return res.status(200).json({
        status: 'Success'
    });
});
// assign data for Expert reivews
exports.assingSpeakTousAvailablityData = catchAsync(async (req, res, next) => {
    if (req.body.index >= 7) {
        return next(new AppError('Please select the valid date', 400));
    }
    const day = new Date(
        new Date().setDate(new Date().getDate() + req.body.index * 1)
    );

    await speaktousAvailablityModel.updateOne(
        {
            userId: req.user._id,
            partnerId: req.body.partnerId.partnerId
        },
        {
            $pull: {
                availableQuota: {
                    day: req.body.index
                }
            }
        }
    );
    console.log(req.body.availableTime);
    const updatedDoc = await speaktousAvailablityModel.updateOne(
        {
            userId: req.user._id,
            partnerId: req.body.partnerId.partnerId
        },
        {
            $push: {
                availableQuota: {
                    date: day,
                    day: req.body.index,
                    availableTime: req.body.availableTime
                }
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    return res.json({
        status: 'Success'
    });
});

// check valid date and time
exports.checkTheDateandTimeisvalid = catchAsync(async (req, res, next) => {
    const availableTimes = [
        '01PM',
        '02PM',
        '03PM',
        '04PM',
        '05PM',
        '06PM',
        '07PM',
        '08PM',
        '09PM',
        '10PM',
        '11PM',
        '12PM',
        '01AM',
        '02AM',
        '03AM',
        '04AM',
        '05AM',
        '06AM',
        '07AM',
        '08AM',
        '09AM',
        '10AM',
        '11AM',
        '12AM'
    ];

    req.body.availableTime = [...new Set(req.body.availableTime)];
    req.body.availableTime.map((els) => {
        const regs = new RegExp(`(?=^${els})(?=${els}$)`, 'i');
        const check = availableTimes.some((elw) => regs.test(elw));
        if (!check) {
            return next(
                new AppError(
                    'Somthing went wrong while processing your requires',
                    401
                )
            );
        }
        return els;
    });

    return next();
});

// assign data for active status
exports.assignDataForCouselingStatusUpdate = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id
    };
    req.body = { status: req.params.status === 'true' ? 'active' : 'inactive' };
    return next();
};

// set status of councilar
exports.updateCouncilarStatus = factoryControllers.updateOne(
    speaktousAvailablityModel
);

// send json for updateone
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// check the cousilar available or not
exports.checkAvailablityofCouncilar = catchAsync(async (req, res, next) => {
    const tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24)
        .toISOString()
        .split('T')[0];
    const today = new Date(Date.now()).toISOString().split('T')[0];
    const time = new Date()
        .toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
        .split(' ')
        .join('');
    const reg = new RegExp(`^${time}`, 'ig');
    let councilar = await speaktousAvailablityModel.find({
        status: 'active',
        availableQuota: {
            $elemMatch: {
                $and: [
                    {
                        date: {
                            $gte: today
                        }
                    },
                    {
                        date: {
                            $lt: tomorrow
                        }
                    }
                ],
                availableTime: {
                    $in: [reg]
                }
            }
        }
    });

    if (!councilar.length) {
        councilar = await speaktousAvailablityModel.find({
            status: 'active'
        });

        if (!councilar.length) {
            return next(new AppError('There are no active councilar.', 404));
        }
    }
    [councilar] = _.sampleSize(councilar, 1);
    return res.status(200).json({
        status: 'Success',
        docs: councilar
    });
});
