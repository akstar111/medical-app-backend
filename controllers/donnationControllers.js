// ============================================================
// import libraries

// ============================================================
// import models
const donnationModel = require('../models/DonnationAndCharity/newDonner');
const donnationRequestorModel = require('../models/DonnationAndCharity/newRequestorModel');
const newRequestorModel = require('../models/DonnationAndCharity/newRequestorModel');
const newProductDonnerModel = require('../models/DonnationAndCharity/newProductDonationModel');
const productRequestorModel = require('../models/DonnationAndCharity/newProductRequestorModel');
const individualProductDonationModel = require('../models/DonnationAndCharity/newIndividualProductDonnerModel');
// ============================================================
// import controllers
const factoryControllers = require('./factoryControllers');

// ============================================================
// import utiities
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');

// create new donnation
exports.createNewDonation = factoryControllers.createOne(donnationModel);
exports.createNewProductDonation = factoryControllers.createOne(
    newProductDonnerModel
);

// send json
exports.sendJsonSerive = factoryControllers.sendJson();

// assign new donnation data
exports.assignNewDonnationdata = catchAsync(async (req, res, next) => {
    // check valid patient id
    if (req.query.patientId) {
        const patient = await newRequestorModel.findOne({
            hiwnrrsID: req.query.patientId,
            verified: true
        });
        if (!patient) {
            return next(
                new AppError(
                    'Something went wrong while process your request',
                    400
                )
            );
        }
        req.body.patientId = patient._id;
        req.updatePaties = patient;
        req.body.patientEId = req.query.patientId;
    }
    req.body.createdAt = Date.now();
    req.body.userId = req.user._id;

    return next();
});
// assign new donnation data
exports.assignNewProductDonnationdata = catchAsync(async (req, res, next) => {
    // check valid patient id
    const patient = await productRequestorModel.findOne({
        hiwdcnprmID: req.params.requesterId,
        productStatus: 'waiting',
        donationStatus: false,
        verified: true
    });
    if (!patient) {
        return next(new AppError('Please select the valid patient.', 404));
    }
    req.body.hiwdcipdsID = await encryptID(process.env.DONNATION_SECRET);
    req.body.createdAt = Date.now();
    req.body.patientId = patient._id;
    req.body.patientEId = patient.hiwdcnprmID;
    req.body.userId = req.user._id;
    return next();
});

// update donation product requst
exports.updateProductDonationRequest = catchAsync(async (req, res, next) => {
    await productRequestorModel.findByIdAndUpdate(
        req.body.patientId,
        {
            productStatus: 'accepted',
            acceptedDate: Date.now()
        },
        { runValidators: true }
    );
    return next();
});

// creat new individual product donation
exports.createNewIndividualProductDonation = factoryControllers.createOne(
    individualProductDonationModel
);

// assign data for update individual product donation status
exports.updateIndividualProductRequstDeliveryStatus = catchAsync(
    async (req, res, next) => {
        const [request, donner] = await Promise.all([
            productRequestorModel.findOneAndUpdate(
                {
                    hiwdcnprmID: req.params.requestId,
                    productStatus: 'accepted',
                    donationStatus: false,
                    verified: true
                },
                {
                    productStatus: 'outofdelivery',
                    outOfDeliveryDate: Date.now()
                },
                {
                    runValidators: true
                }
            ),
            individualProductDonationModel.findOneAndUpdate(
                {
                    patientEId: req.params.requestId,
                    deliveryProductStatus: 'accepted'
                },
                {
                    deliveryProductStatus: 'outofdelivery',
                    outOfDeliveryDate: Date.now()
                },
                { new: true, runValidators: true }
            )
        ]);

        return res.status(200).json({
            status: 'Success'
        });
    }
);

// update patient receiving status
exports.updateIndividualProductReciveingStatus = catchAsync(
    async (req, res, next) => {
        const [request, donner] = await Promise.all([
            productRequestorModel.findOneAndUpdate(
                {
                    hiwdcnprmID: req.params.requestId,
                    productStatus: 'outofdelivery',
                    donationStatus: false,
                    verified: true
                },
                {
                    productStatus: 'received',
                    receivedDate: Date.now(),
                    donationStatus: true
                },
                {
                    runValidators: true
                }
            ),
            individualProductDonationModel.findOneAndUpdate(
                {
                    patientEId: req.params.requestId,
                    deliveryProductStatus: 'outofdelivery'
                },
                {
                    deliveryProductStatus: 'delivered',
                    deliverdDate: Date.now(),
                    donationStatus: true
                },
                { new: true, runValidators: true }
            )
        ]);
        console.log(request);
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// update requester status
exports.updateUserRequesterStatus = catchAsync(async (req, res, next) => {
    if (req.body.docs.productDonationType === 'admin') {
        return next();
    }

    const data = await productRequestorModel.findByIdAndUpdate(
        req.body.patientId,
        {
            productStatus: 'accepted'
        },
        {
            runValidators: true
        }
    );
    return next();
});

// update donnation
exports.updateRequestorDonnation = catchAsync(async (req, res, next) => {
    if (!req.query.patientId) return next();
    const data = {
        amountRecived: req.updatePaties.amountRecived * 1 + req.body.amount * 1
    };
    await newRequestorModel.findByIdAndUpdate(req.body.patientId, data, {
        new: true,
        runValidators: true
    });
    return next();
});
// assign new donnation data
exports.assignproductDonnerData = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.body.hiwpdsID = await encryptID(process.env.DONNATION_SECRET);
    req.body.userId = req.user._id;
    return next();
});
// assign new donnation data
exports.assignrequestordata = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    req.body.hiwnrrsID = await encryptID(process.env.DONNATION_SECRET);
    req.body.userId = req.user._id;
    return next();
});

// assign data for create new product donattion requester
exports.assignDataForCreateNewProductRequester = catchAsync(
    async (req, res, next) => {
        req.body.createdAt = Date.now();
        req.body.hiwdcnprmID = await encryptID(process.env.DONNATION_SECRET);
        req.body.userId = req.user._id;
        req.body.currentLocation = {
            type: 'Point',
            coordinates: [req.body.longitude, req.body.latitude]
        };
        req.body.productStatus = 'waiting';
        return next();
    }
);

// create new donation requestor
exports.createNewDonationRequestor = factoryControllers.createOne(
    donnationRequestorModel
);

// create new product donation requrester
exports.createNewProductDonationRequester = factoryControllers.createOne(
    productRequestorModel
);

// calculate monthly average
exports.caluculateMonthlyAverage = catchAsync(async (req, res, next) => {
    let a = Date.now();
    let obj;
    if (new Date().getMonth() === 0) {
        obj = {
            $and: [
                {
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
                },
                {
                    $eq: [
                        {
                            $year: {
                                $dateSubtract: {
                                    startDate: new Date(),
                                    unit: 'year',
                                    amount: 1
                                }
                            }
                        },
                        {
                            $year: '$createdAt'
                        }
                    ]
                }
            ]
        };
    } else {
        obj = {
            $and: [
                {
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
                },
                {
                    $eq: [
                        {
                            $year: new Date()
                        },
                        {
                            $year: '$createdAt'
                        }
                    ]
                }
            ]
        };
    }
    // const [montlyAverage] = await donnationModel.aggregate([
    //     {
    //         $match: {
    //             $expr: obj,
    //             donationStatus: false
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             count: { $sum: 1 },
    //             amountRecived: { $sum: '$amount' }
    //         }
    //     }
    // ]);

    // const [monthlyRequest] = await donnationRequestorModel.aggregate([
    //     {
    //         $match: {
    //             $expr: obj,
    //             verified: true
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: null,
    //             count: { $sum: 1 },
    //             requestedAmount: { $sum: '$amount' }
    //         }
    //     }
    // ]);
    const [montlyAverage, monthlyRequest, fundRequesters, productRequesters] =
        await Promise.all([
            donnationModel.aggregate([
                {
                    $match: {
                        $expr: obj,
                        donationStatus: false
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        amountRecived: { $sum: '$amount' }
                    }
                }
            ]),
            donnationRequestorModel.aggregate([
                {
                    $match: {
                        $expr: obj,
                        verified: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        requestedAmount: { $sum: '$amount' }
                    }
                }
            ]),
            donnationRequestorModel
                .find({
                    verified: true,
                    $expr: { $gt: ['$amount', '$amountRecived'] }
                })
                .select(
                    'name cause hospitalName description amount bannerImage hiwnrrsID'
                ),
            productRequestorModel.aggregate([
                {
                    $match: {
                        verified: true,
                        productStatus: 'waiting'
                    }
                }
            ])
        ]);

    req.body = {
        montlyAverage: montlyAverage ?? {},
        monthlyRequest: monthlyRequest ?? {},
        fundRequesters,
        productRequesters
    };
    return res.status(200).json({ status: 'Success', docs: req.body });
});

// assign data for get all data withh selected value
exports.assignDataForAllWithSelectedData = async (req, res, next) => {
    req.selectedata = 'name cause hospitalName description amount bannerImage';
    req.filterQuery = {
        verified: true,
        $expr: { $gt: ['$amount', '$amountRecived'] }
    };

    return next();
};

// get all donnation requests
exports.getAllDonationRequests =
    factoryControllers.findAllWithQueryAndSelectdData(donnationRequestorModel);

// send json for all requests
exports.sendJsonSEriveDataWithSelectedData =
    factoryControllers.sendJsonForAllWithSelected();

// assign data for get all donnation requests
exports.assignDataForDonnationRequest = (req, res, next) => {
    const data = req.body;
    req.body = {};
    req.body = data;
    console.log(Date.now());
    return next();
};

// assign data for get a service
exports.assignGetAServiceData = (req, res, next) => {
    req.searchQuery = { hiwnrrsID: req.params.serviceId };
    return next();
};

// find data by id
exports.findServiceById = factoryControllers.findOne(donnationRequestorModel);

// send json for find by id
exports.sendJsonForId = factoryControllers.sendJsonForFindOne();

// get last month donners list
exports.getLastMonthDonnersList = catchAsync(async (req, res, next) => {
    const lastMonthDonners = await donnationModel.aggregate([
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
            $group: {
                _id: '$_id',
                name: { $first: '$name' },
                address: {
                    $first: '$address'
                },
                about: { $first: '$about' },
                amount: { $first: '$amount' },
                view: { $first: '$view' },
                bannerImage: { $first: '$bannerImage' }
            }
        }
    ]);
    const a = await Promise.all(
        lastMonthDonners.map((el) => {
            if (!el.view) {
                const obj = {
                    name: 'Anonymous',
                    _id: 'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg',
                    address: 'Anonymous',
                    about: 'Anonymous',
                    amount: el.amount
                };

                el = obj;
                return el;
            }

            return el;
        })
    );

    return res.status(200).json({
        status: 'Success',
        docs: a
    });
});

// get las month donation received patients

exports.getLastMonthDonationReceivedPatientsList = catchAsync(
    async (req, res, next) => {
        const patientDetails = await donnationRequestorModel.aggregate([
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
                    },
                    verified: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    bannerImage: { $first: '$bannerImage' },
                    name: { $first: '$name' },
                    hospitalCity: { $first: '$hospitalCity' },
                    description: { $first: '$description' },
                    requestedAmount: { $first: '$amount' },
                    receivedAmount: { $first: '$amountRecived' }
                }
            }
        ]);

        return res.status(200).json({
            status: 'Success',
            docs: patientDetails
        });
    }
);

// assign data for get my donation history
exports.assignDataForGetAllDonationHistory = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id
    };
    req.queryPopulate = 'patient';
    return next();
};

// get all fund donation
exports.getAllFundDonationHistory =
    factoryControllers.getFindAllWithPopulateFilter(donnationModel);

// assign data forgetall donation requst history
exports.asssignDataForGetAllDonationHistory = (req, res, next) => {
    req.searchQuery = { userId: req.user._id };
    return next();
};

// get all donation request history
exports.getAllDonationRequstHistoty =
    factoryControllers.findAllData(newRequestorModel);

// my donation request
exports.mydonationRequests = catchAsync(async (req, res, next) => {
    const [fund, product] = await Promise.all([
        newRequestorModel.aggregate([
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
                                donationStatus: true
                            }
                        }
                    ],
                    history: [
                        {
                            $match: { donationStatus: false }
                        }
                    ]
                }
            }
        ]),
        productRequestorModel.aggregate([
            {
                $match: { userId: req.user._id }
            },
            {
                $facet: {
                    active: [
                        {
                            $match: {
                                donationStatus: true
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                donationStatus: false
                            }
                        }
                    ]
                }
            }
        ])
    ]);

    return res.status(200).json({
        status: 'Success',
        product,
        fund
    });
});

// my donations
exports.myDonations = catchAsync(async (req, res, next) => {
    const [fund, bulk, patient] = await Promise.all([
        donnationModel.aggregate([
            {
                $match: {
                    userId: req.user._id
                }
            }
        ]),
        newProductDonnerModel.aggregate([
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
                                donationStatus: false
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                donationStatus: true
                            }
                        }
                    ]
                }
            }
        ]),
        individualProductDonationModel.aggregate([
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
                                donationStatus: false
                            }
                        }
                    ],
                    history: [
                        {
                            $match: {
                                donationStatus: true
                            }
                        }
                    ]
                }
            }
        ])
    ]);

    return res.status(200).json({
        status: 'Success',
        fund,
        bulk,
        patient
    });
});
