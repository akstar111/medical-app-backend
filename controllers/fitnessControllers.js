// ============================================================
// import packages
const { v4: uuidv4, v5: uuidv5, validate: uuidValidate } = require('uuid');
const AWS = require('aws-sdk');

// ============================================================
// import models
const workoutModel = require('../models/Fitness/workoutModel');
const partnerModel = require('../models/shared/partnerModel');
const gymModel = require('../models/Fitness/gymModel');
const nutrientsFoodModel = require('../models/Fitness/foodDetailsModel');
const goalsModel = require('../models/Fitness/setGoals');
// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import util
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const goalsReportsModel = require('../models/Fitness/goalReports');
const filerDataFromRequest = require('../util/filterObjects');
const multer = require('multer');

// ============================================================
// create controllers

// create new workout videos
exports.createNewFitnessVideo = factoryControllers.createOne(workoutModel);
// update workout videos
exports.updateFitnessVideo = factoryControllers.updateOne(workoutModel);

// send json for created workout videos
exports.sendJsonService = factoryControllers.sendJson();

// Assign data for create new workout vides
exports.assignNewFitnesData = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.body.hiwfvmID = await uuidv5(process.env.FITNESS_SECRET, uuidv4());
    const partner = await partnerModel.findOne({
        userId: req.user._id,
        status: 'accepted',
        for: 'Fitness'
    });
    if (!partner) {
        return next(new AppError('Invalid Partner or partner not found.', 400));
    }
    req.body.serviceType = partner.fitness.serviceType;
    req.body.partnerId = partner._id;
    req.body.partnerEId = partner.hiwpmID;
    return next();
});

// assign data for workout vide update
exports.assignDataForFitnessUpdate = catchAsync(async (req, res, next) => {
    const partner = await partnerModel.findOne({
        userId: req.user._id,
        status: 'accepted',
        for: 'Fitness'
    });
    if (!partner) {
        return next(new AppError('Invalid Partner or partner not found.', 400));
    }
    req.updateOneSearch = {
        hiwfvmID: req.params.videoId,
        partnerId: partner._id,
        partnerEId: partner.hiwpmID,
        serviceType: partner.fitness.serviceType
    };
    return next();
});

// update workout video
exports.updateFitnessvideo = factoryControllers.updateOne(workoutModel);

// send json for updated data
exports.sendJsonUpdateFitness = factoryControllers.sendJsonForUpdatedById();

// delete fitness video
exports.deleteFitnessVideo = catchAsync(async (req, res, next) => {
    const deleteVideo = await workoutModel.deleteOne({
        hiwfvmID: req.params.videoId
    });
    if (!deleteVideo.deletedCount) {
        return next(
            new AppError('Something went wrong while processing your request.')
        );
    }
    return res.status(200).json({ status: 'Success' });
});

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Fitness'
    };
    req.body.userId = req.user._id;

    return next();
};
// check the partner and councilar
exports.checkValidVendorandGYM = catchAsync(async (req, res, next) => {
    const [partner, gym] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'GYM'
        }),
        gymModel.exists({ userId: req.user._id })
    ]);

    if (!partner) {
        return next(
            new AppError('Please verify or create partner service.', 400)
        );
    }
    if (gym) {
        return next(new AppError('You already regsitered a service.', 400));
    }

    req.body.userId = req.user._id;
    req.body.partnerId = partner._id;
    req.body.createdAt = Date.now();
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.hiwfgsID = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryControllers.findOne(partnerModel);

// create new service
exports.createNewService = factoryControllers.createOne(gymModel);

// send created new service  to client
exports.sendServiceJson = factoryControllers.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        hiwfgsID: req.params.serviceid
    };

    return next();
};

// update gym service
exports.updateGYmService = factoryControllers.updateOne(gymModel);

// delete gym service
exports.deleteGYMService = catchAsync(async (req, res, next) => {
    const data = await gymModel.deleteOne({
        hiwfgsID: req.params.serviceid,
        partnerId: req.docs._id
    });

    if (!data.deletedCount) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                400
            )
        );
    }
    return next();
});

// assign data for set new goals
exports.assignDataForSetGoals = (req, res, next) => {
    req.body.createdAt = Date.now();
    req.upsertQuery = {
        userId: req.user._id
    };

    req.upsertDoc = {
        $set: {
            userId: req.user._id,
            walking: req.body.walking,
            waterDrink: req.body.waterDrink,
            calories: req.body.calories,
            createdAt: Date.now()
        }
    };
    return next();
};

// assign data for get today goals
exports.assignDataforGetTodayGoald = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id
    };
    return next();
};

// get my goal report
exports.getMyGoal = factoryControllers.findOne(goalsModel);

// send json fro get one
exports.sendJsonForGetOne = factoryControllers.sendJsonForFindOne();

// set goal report
exports.assignDataforUpserGoalReport = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.upsertQuery = {
        userId: req.user._id,
        date: new Date(new Date().setHours(0, 0, 0, 0))
    };

    req.upsertDoc = {
        $set: {
            userId: req.user._id,
            walking: req.body.walking,
            waterDrink: req.body.waterDrink,
            calories: req.body.calories,
            createdAt: Date.now(),
            walked: 0,
            drinked: 0,
            burned: 0,
            date: new Date(new Date().setHours(0, 0, 0, 0))
        }
    };
    return next();
});
// assig data for setGoal Reports
exports.assignDataForSetReports = catchAsync(async (req, res, next) => {
    const [report, goal] = await Promise.all([
        goalsReportsModel.findOne({
            userId: req.user._id,
            date: new Date(new Date().setHours(0, 0, 0, 0))
        }),
        goalsModel.findOne({ useId: req.user._id })
    ]);
    if (report) {
        return res.status(200).json({
            status: 'Success'
        });
    }
    req.body = {
        userId: req.user._id,
        walking: goal.walking,
        waterDrink: goal.waterDrink,
        calories: goal.calories,
        createdAt: Date.now(),
        walked: 0,
        drinked: 0,
        burned: 0,
        date: new Date(new Date().setHours(0, 0, 0, 0))
    };
    return next();
});

// create new service
exports.createNewGoal = factoryControllers.upsertOne(goalsModel);

// create upsert goal report service
exports.upsertGoalReport = factoryControllers.upsertOne(goalsReportsModel);

// create new goal report
exports.createNewGoalReport = factoryControllers.createOne(goalsReportsModel);

// send json for create one
exports.sendjsonforcreateOne = factoryControllers.sendJson();

// get all workout videos
exports.getAllWorkoutValues = factoryControllers.getAll(workoutModel);

// send json for get all data
exports.sendJsonForAllWorkOutVideos = factoryControllers.sendJsonForFindAll();

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwfvmID: req.params.serviceId };
    return next();
};

// find data by id
exports.findServiceById = factoryControllers.findOne(workoutModel);

// send json for find by id
exports.sendJsonForId = factoryControllers.sendJsonForId();

// assign data for gym

// assign data for get a service
exports.assignGetAGYMData = (req, res, next) => {
    req.searchQuery = {
        hiwpmID: req.params.serviceId,
        for: 'Fitness',
        status: 'accepted'
    };
    return next();
};

// find data by id
exports.findGYMById = factoryControllers.findOne(partnerModel);

// send json for find a gym
exports.sendJsonForGetAGym = factoryControllers.sendJsonForFindOne();

// get all gym
exports.getAllGYMValues =
    factoryControllers.getFindAllFilterWithSelectedFields(partnerModel);

// send json for get all data
exports.sendJsonForAllGYM = factoryControllers.sendAllFilter();

// get goal datas
exports.getGoalsData = catchAsync(async (req, res, next) => {
    const goals = await goalsModel.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $facet: {
                TodayGoalData: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: new Date()
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                LastMonth: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $month: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'month',
                                                amount: 1
                                            }
                                        }
                                    },
                                    {
                                        $month: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $sum: '$walking' },
                            walked: { $sum: '$walked' }
                        }
                    }
                ],
                LastWeek: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $week: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'week',
                                                amount: 1
                                            }
                                        }
                                    },
                                    {
                                        $week: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $sum: '$walking' },
                            walked: { $sum: '$walked' }
                        }
                    }
                ],
                day1: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 1
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day2: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 2
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day3: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 3
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day4: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 4
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day5: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 5
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day6: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 6
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ],
                day7: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $dayOfYear: {
                                            $dateSubtract: {
                                                startDate: new Date(),
                                                unit: 'day',
                                                amount: 7
                                            }
                                        }
                                    },
                                    {
                                        $dayOfYear: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    {
                                        $year: new Date()
                                    },
                                    {
                                        $year: '$createdAt'
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            walking: { $first: '$walking' },
                            walked: { $first: '$walked' }
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200).json({ status: 'Success', docs: goals });
});

// manage hospital package
exports.manageGymServicesandFacilites = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    if (req.params.type === 'equipment') {
        req.query.objData = {
            'gym.equipments': {
                $elemMatch: { hiwgmes: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = { 'gym.equipments': { hiwgmes: req.query.serviceId } };
        req.query.push = {
            'gym.equipments': {
                hiwgmes: req.query.serviceId,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image
            }
        };
    } else if (req.params.type === 'facilities') {
        req.query.objData = {
            'gym.fecilities': {
                $elemMatch: { hiwgmflmID: req.query.serviceId }
            }
        };
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            req.query.objData = {};
        }
        req.query.pull = {
            'gym.fecilities': { hiwgmflmID: req.query.serviceId }
        };
        req.query.push = {
            'gym.fecilities': {
                hiwgmflmID: req.query.serviceId,
                title: req.body.title,
                description: req.body.description
            }
        };
    }

    const a = await partnerModel.updateOne(
        {
            userId: req.user._id,
            for: 'Fitness',
            ...req.query.objData
        },
        {
            $pull: { ...req.query.pull }
        }
    );

    if (req.params.service === 'manage' || req.params.service === 'create') {
        const b = await partnerModel.updateOne(
            {
                userId: req.user._id,
                for: 'Fitness'
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
    return res.status(200).json({
        status: 'Success'
    });
});

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, gym] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'GYM'
        }),
        gymModel.findOne({
            userId: req.user._id,
            hiwfgsID: req.params.serviceId
        })
    ]);

    if (!partner || !gym) {
        return next(
            new AppError(
                'Something went wrong while processing you request.',
                401
            )
        );
    }
    req.body.gymId = gym._id;
    req.body.gymEID = gym.hiwfgsID;
    req.body.parentEID = gym.hiwfgsID;
    req.body.partnerId = partner._id;
    return next();
});

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'GYM',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'GYM';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'GYM',
        hiwnadmID: req.params.adId
    };
    return next();
};

// create new quote
exports.getDataForQuoteFromExperts = catchAsync(async (req, res, next) => {
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
                        from: 'GYM',
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
    req.body = { from: 'GYM' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'GYM'
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
        from: 'GYM'
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
        from: 'GYM',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// assign data for get all gym
exports.assignDataForGetAllGym = (req, res, next) => {
    req.searchQuery = {
        status: 'accepted',
        for: 'Fitness',
        'fitness.serviceType': req.params.type
    };
    req.selectedData = 'company profileImage address city hiwpmID';
    return next();
};

// get all work out videos
exports.getAllworkoutValues = catchAsync(async (req, res, next) => {
    const workoutVideos = await workoutModel.aggregate([
        {
            $match: {
                serviceType: req.params.type
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
                            status: 'accepted'
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: workoutVideos
    });
});

// get a fitness video
exports.getAFitnessVideo = catchAsync(async (req, res, next) => {
    const [video] = await workoutModel.aggregate([
        { $match: { hiwfvmID: req.params.videoId } },
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            status: 'accepted'
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        }
    ]);

    if (!video) {
        return next(new AppError('Video not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs: video
    });
});

// create image name for equipmets
exports.imageNameForGymEquipments = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
    }

    req.image.imagename = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.query.serviceId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-gym-equipments`;
    return next();
});

// manage service failities of fitness
exports.managefitnessFacilities = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
    req.query.arrayFilters = {};
    req.query.objData = {};
    if (req.params.serviceType === 'gym') {
        if (req.params.type === 'equipments') {
            if (!req.query.serviceId || !uuiddetails) {
                req.query.serviceId = await encryptID(
                    process.env.JOP_PORTAL_SECRET
                );
            }
            if (req.params.service === 'create') {
                req.query.objData = { 'fitness.serviceType': 'gym' };
                req.query.action = {
                    $push: {
                        'fitness.equipments': {
                            hiwgmesID: req.query.serviceId,
                            name: req.body.name,
                            bannerImage: req.body.bannerImage,
                            description: req.body.description
                        }
                    }
                };
            } else if (req.params.service === 'manage') {
                req.query.objData = {
                    'fitness.serviceType': 'gym',
                    'fitness.equipments': {
                        $elemMatch: { hiwgmesID: req.query.serviceId }
                    }
                };
                const obj = {};
                if (req.body.bannerImage) {
                    obj['fitness.equipments.$[id].bannerImage'] =
                        req.body.bannerImage;
                }
                req.query.action = {
                    $set: {
                        'fitness.equipments.$[id].name': req.body.name,
                        ...obj,
                        'fitness.equipments.$[id].description':
                            req.body.description
                    }
                };
                req.query.arrayFilters = {
                    arrayFilters: [{ 'id.hiwgmesID': req.query.serviceId }]
                };
            } else if (req.params.service === 'delete') {
                req.query.objData = {
                    'fitness.serviceType': 'gym',
                    'fitness.equipments': {
                        $elemMatch: { hiwgmesID: req.query.serviceId }
                    }
                };
                req.query.action = {
                    $pull: {
                        'fitness.equipments': {
                            hiwgmesID: req.query.serviceId
                        }
                    }
                };
            }
        }
    }
    if (req.params.type === 'facilities') {
    }
    const create = await partnerModel.updateOne(
        {
            userId: req.user._id,
            status: 'accepted',
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
    return res.status(200).json({ status: 'Success' });
});
const multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not a image type please upload the image', 400),
            false
        );
    }
}
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

// set fiiles for study aborad college
exports.setFilesForUploadCollegeDetails = upload.fields([
    {
        name: 'video'
    }
]);

// create new fitnes video
exports.saveWorkoutVideosOnserver = catchAsync(async (req, res, next) => {
    if (req.body.statusType === 'create') {
        if (!req.files.video) {
            return next(new AppError('Video should be include.', 400));
        }
    } else {
        req.updateOneSearch = {
            userId: req.user._id,
            hiwfvmID: req.params.videoId
        };
    }
    if (!req.files.video) {
        return next();
    }

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });
    const uuiddetails = uuidValidate(req.params.videoId ?? 0);

    if (!req.params.videoId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.params.videoId = await encryptID(process.env.JOP_PORTAL_SECRET);
    }

    const workoutName = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.params.videoId.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}-fitness-video`;
    if (req.files.video?.length) {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${workoutName}.mp4`,
            ContentType: 'video/mp4',
            Body: req.files.video[0].buffer
        };
        try {
            const video = await s3.upload(params).promise();
            req.body.video = video.Location;
        } catch (err) {
            return next(
                new AppError(
                    'Somehing went wrong while processing your request.Please try again.',
                    401
                )
            );
        }
    }

    return next();
});

// assignd data for create new dfitness
exports.assignDataForcreateNewVideo = (req, res, next) => {
    req.body.partnerId = req.docs._id;
    req.body.partnerEId = req.docs.hiwpmID;
    req.body.uploadedBy = 'partner';
    req.body.serviceType = req.docs.fitness.serviceType;
    req.body.createdAt = Date.now();
    req.body.hiwfvmID = req.params.videoId;
    req.body.instruction = req.body.instruction.split(',');
    req.body.shortDescription = req.body.description;
    return next();
};

// fitness services
exports.manageFitnessServices = catchAsync(async (req, res, next) => {
    const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

    req.query.objData = {};
    req.query.action = {};
    req.query.arrayFilters = {};
    if (!req.query.serviceId || !uuiddetails) {
        if (req.body.statusType !== 'create') {
            return next(new AppError('Something went wrong.', 400));
        }
        req.query.serviceId = await encryptID(process.env.JOP_PORTAL_SECRET);
        req.query.objData = {};
    }
    if (req.params.serviceType === 'facilities') {
        if (req.params.service === 'create') {
            req.query.action = {
                $push: {
                    'fitness.fecilities': {
                        hiwgmflmID: req.query.serviceId,
                        title: req.body.title,
                        description: req.body.description
                    }
                }
            };
        } else if (req.params.service === 'manage') {
            req.query.objData = {
                'fitness.fecilities': {
                    $elemMatch: { hiwgmflmID: req.query.serviceId }
                }
            };
            req.query.action = {
                $set: {
                    'fitness.fecilities.$[id].title': req.body.title,
                    'fitness.fecilities.$[id].description': req.body.description
                }
            };
            req.query.arrayFilters = {
                arrayFilters: [{ 'id.hiwgmflmID': req.query.serviceId }]
            };
        } else if (req.params.service === 'delete') {
            req.query.objData = {
                'fitness.facilities': {
                    $elemMatch: { hiwgmflmID: req.query.serviceId }
                }
            };
            req.query.action = {
                $pull: {
                    'fitness.fecilities': {
                        hiwgmflmID: req.query.serviceId
                    }
                }
            };
        }
    }
    console.log(req.query.action);
    const create = await partnerModel.updateOne(
        {
            userId: req.user._id,
            status: 'accepted',
            for: 'Fitness',
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
    console.log(create);
    return res.status(200).json({ status: 'Success' });
});

// filter data for fitness datas
exports.filterNewFitnessData = catchAsync(async (req, res, next) => {
    console.log(req.body);
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'name',
            'phone',
            'centerPhone',
            'centerLandLine',
            'location',
            'longtitude',
            'latitude',
            'openTime',
            'closeTime',
            'address',
            'city'
        )
    ]);

    return next();
});
// assign data for update blood bank
exports.assignDataForUpdatFitness = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Fitness'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longtitude, req.body.latitude]
    };
    return next();
};

// update fitness
exports.updateFitness = factoryControllers.updateOne(partnerModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// assign data for image size
exports.setImageSizeForFitnesEquipmentsBanner = (req, res, next) => {
    req.image = {};
    req.image.resizeW = 400;
    req.image.resizeH = 400;

    req.image.name = 'bannerImage';
    return next();
};

// get vendo's fitnessvide
exports.assignDatatoGetVendorFitnessVideos = (req, res, next) => {
    req.searchQuery = { partnerId: req.docs._id };
    return next();
};

// get all videos
exports.getVendorFitnesVideos = factoryControllers.findAllData(workoutModel);

// assign data for get all food details
exports.getAllFoodDetails = factoryControllers.getAllFilter(nutrientsFoodModel);

// send json for get all food details
exports.sendJsonForGetallFoodDetails = factoryControllers.sendAllFilter();
