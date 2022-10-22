// ============================================================
// import libraries
const { validate: uuidValidate } = require('uuid');
const jwt = require('jsonwebtoken');
const { default: axios } = require('axios');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const _ = require('lodash');
const polyline = require('google-polyline');
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};
initializeApp(firebaseConfig);
const db = getDatabase();

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utilities
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/AppError');
const encryptID = require('../util/uuid');
const filerDataFromRequest = require('../util/filterObjects');
const sendEmail = require('../util/sendMail');
const sendMail = require('../util/sendMail');

// ============================================================
// import models
const ambulanceModel = require('../models/AmbulanceAlert/ambulanceModel');
const ambulanceDriverModel = require('../models/AmbulanceAlert/ambulanceDriversModel');
const trafficPoliceModel = require('../models/AmbulanceAlert/trafficPoliceModel');
// const assignAmbulanceDriverModel = require('../models/AmbulanceAlert/assignAmbulanceDriverModel');
const ambulanceServiceModel = require('../models/AmbulanceAlert/AmbulanceServiceModel');
const partnerModel = require('../models/shared/partnerModel');
const ambulanceProviderModel = require('../models/AmbulanceAlert/ambulanceProvidersModel');
const ambulanceQuotesModel = require('../models/AmbulanceAlert/ambulanceQuotesModel');
const medicalMarketProductsModel = require('../models/MedicalMarket/medicalMarketProductsModel');
const medicalMarketQuoteRequesterModel = require('../models/MedicalMarket/medicalMarketQuoteRequesterModel');
const privateAmbulanceAssignModel = require('../models/AmbulanceAlert/ambulanceDriverAssigningHistoryModel');

// ============================================================
// create controllers

// ambulance driover otp generation
const driverPhoneAccountVerification = async (req, res, next, driver) => {
    try {
        const conformationToken = await driver.driverPhoneConformationToken();

        await driver.save({ validateBeforeSave: false });
        sendEmail({
            email: driver.phone,
            subject: 'OTP For driver',
            message: `MR.${driver.driverName}, There is ambulance going to cross your place. please use this id and track the ambulace. "${conformationToken}"`
        });

        return conformationToken;
    } catch (err) {
        driver.phoneVerificationToken = undefined;
        driver.phoneVerificationTokenExpires = undefined;
        await driver.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'Something went worng to send your sms.Please Try again later',
                500
            )
        );
    }
};

// assign data for create new ambulance alert
exports.assingDataForCreateNewAmbulanceAlert = catchAsync(
    async (req, res, next) => {
        req.body.hiwalbcmID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.createdAt = Date.now();
        req.body.tempUserLocation = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        req.body.assignedUser = req.user.hiwuueidmID;
        return next();
    }
);

// create new ambulance driver
exports.verifyValidAmbulanceDriver = catchAsync(async (req, res, next) => {
    let alerts;
    const obj = {};
    let traffiecMod = [];
    if (!req.upCheck) {
        if (req.driver.status === 'inActive') {
            return next(new AppError('Something was wrong .', 400));
        }
        obj.driverRequestTime = Date.now();
        alerts = await ambulanceModel
            .findOne({
                naahiwabdsID: req.params.assignId,
                status: 'started'
            })
            .lean();
        if (!alerts) {
            return next(
                new AppError('Something went wrong with this driver.', 400)
            );
        }
    } else {
        let resp;
        const startLoc = req.body.userLocation.join(',');
        const destLoc = req.body.destinationLocation.join(',');
        await axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${process.env.GOOGLE_MAP_API}`
        })
            .then((res) => {
                if (res.status !== 200 || res.data.status !== 'OK') {
                    return next(
                        new AppError(
                            'Please select the valide path for routring',
                            400
                        )
                    );
                }
                resp = res.data.routes[0].overview_polyline.points;
            })
            .catch(function (error) {
                return next(
                    new AppError(
                        'Something went wrong while processing your request',
                        400
                    )
                );
            });

        let coordinates = polyline.decode(resp);

        coordinates = await Promise.all(
            coordinates.map((el) => {
                return {
                    location: {
                        $geoWithin: {
                            $centerSphere: [[el[1], el[0]], 0.05 / 6378.1]
                        }
                    }
                };
            })
        );

        traffiecMod = trafficPoliceModel
            .find({
                $or: coordinates
            })
            .select('name phone');
        alerts = req.upCheck;
    }

    req.body.destinationLocation = {
        type: 'Point',
        coordinates: [
            req.body.destinationLocation[1],
            req.body.destinationLocation[0]
        ]
    };
    req.body.userLocation = {
        type: 'Point',
        coordinates: [req.body.userLocation[1], req.body.userLocation[0]]
    };

    const [start, police, firebase] = await Promise.all([
        ambulanceModel.findOneAndUpdate(
            { naahiwabdsID: req.params.assignId, status: 'started' },
            {
                userLocation: req.body.userLocation,
                destinationLocation: req.body.destinationLocation,
                patientImage: req.body.patientImage,
                status: req.upCheck ? 'pickuped' : 'started',
                verification: !req.upCheck ? 'requested' : alerts.verification,
                ...obj
            }
        ),
        traffiecMod,
        set(ref(db, `ambulance/${req.driver.unicId}`), {
            ...alerts,
            ...req.body
        })
    ]);

    // admin email
    await Promise.all([
        police.map((el) =>
            sendEmail({
                email: el.phone,
                subject: 'Alert For Ambulance',
                message: `MR.${el.name}, There is ambulance going to cross your place. please use this id and track the ambulace. "${req.driver.unicId}"`
            })
        ),
        !req.upCheck
            ? sendEmail({
                  email: 'muthazhagan187@gmail.com',
                  subject: 'Update ambulance alert',
                  message: `There is new driver requested for ambulance service. please verify the driver with this id adn data.."${req.driver.unicId}"`
              })
            : ''
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: start
    });
});

// assign data for create ambulance driver
exports.assignDataForcreateAmbulanceDriver = catchAsync(
    async (req, res, next) => {
        req.body.hiwaladsID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.unicId = `DRI${Math.floor(
            Math.random() * 100000000
        ).toString()}${Date.now().toString(36).slice(-3)}`;

        return next();
    }
);

// create new ambulance driver
exports.createNewAmbulanceDriver =
    factoryController.createOne(ambulanceDriverModel);

// assign data for update ambulance driver
exports.assignDataForUpdateAmbulanceDriver = (req, res, next) => {
    req.searchQuery = { hiwaladsID: req.params.driverId };
    return next();
};

// update ambulance driver
exports.updateAmbulanceDriver =
    factoryController.updateOne(ambulanceDriverModel);

// sendjson for update one
exports.sendjsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// assign data for delete ambulance driver
exports.assignDataForDeleteAmbulanceDriver = (req, res, next) => {
    req.searchQuery = { hiwaladsID: req.params.driverId };
    return next();
};

// update ambulance driver
exports.deleteAmbulanceDriver =
    factoryController.deleteOne(ambulanceDriverModel);

// sendjson for update one
exports.sendjsonForDeleteOne = factoryController.sendJsonForDeleteOne();

// assign data for create traffic
exports.assignDataForcreatetrafficPolice = catchAsync(
    async (req, res, next) => {
        req.body.hiwaltrsID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);

// create new traffic
exports.createNewtrafficPolice =
    factoryController.createOne(trafficPoliceModel);

// send json create new
exports.sendJsonForCreateNew = factoryController.sendJson();

// assign data for update traffic
exports.assignDataForUpdatetrafficPolice = (req, res, next) => {
    req.searchQuery = { hiwaltrsID: req.params.policeId };
    return next();
};

// update traffic
exports.updatetrafficPolice = factoryController.updateOne(trafficPoliceModel);

// sendjson for update one
exports.sendjsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// assign data for delete traffic
exports.assignDataForDeletetrafficPolice = (req, res, next) => {
    req.searchQuery = { hiwaltrsID: req.params.policeId };
    return next();
};

// update traffic
exports.deletetrafficPolice = factoryController.deleteOne(trafficPoliceModel);

// sendjson for update one
exports.sendjsonForDeleteOne = factoryController.sendJsonForDeleteOne();

// generate otp for ambulance driver
exports.generateOtp = catchAsync(async (req, res, next) => {
    const driver = await ambulanceDriverModel.findOne({
        unicId: req.body.userId
    });

    if (!driver) {
        return next(
            new AppError('Please check your user id. and try again.', 400)
        );
    }
    await driverPhoneAccountVerification(req, res, next, driver);

    return res.json({
        status: 'Success'
    });
});

exports.verifyPhone = catchAsync(async (req, res, next) => {
    const conformationToken = (((req.body.otp * 1) / 6) * 2).toString(32);
    const vendor = await ambulanceDriverModel.findOne({
        phoneVerificationToken: conformationToken,
        phoneVerificationTokenExpires: { $gt: Date.now() },
        unicId: req.body.userId
    });

    if (!vendor) {
        return next(
            new AppError(
                'Driver not found or otp is  invalid or has expired.Please try again'
            )
        );
    }
    vendor.phoneVerificationToken = undefined;
    vendor.phoneVerificationTokenExpires = undefined;

    await vendor.save({ validateBeforeSave: false });

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_DRIVER_SECRET, {
        expiresIn: process.env.JWT_Driver_EXPIRE
    });
    return res.status(200).json({
        status: 'Success',
        token,
        id: vendor.unicId
    });
});

// check ambulacne driver
exports.assignDataForvalidAmbulanceDriver = catchAsync(
    async (req, res, next) => {
        const [driver] = await Promise.all([
            ambulanceDriverModel.findOneAndUpdate(
                {
                    hiwaladsID: req.params.driverId,
                    verified: true,
                    status: 'inActive'
                },
                {
                    status: 'active'
                }
            )
        ]);
        if (!driver) {
            return next(
                new AppError(
                    "You can't able to register this ambulace driver ",
                    400
                )
            );
        }
        req.updateOneSearch = {
            hiwalbcmID: req.params.serviceId
        };
        req.body.ambulanceDriverID = driver._id;
        req.body.ambulanceDriverEID = driver.hiwaladsID;
        req.body.phone = driver.phone;
        req.body.driverName = driver.driverName;
        req.body.driverAssignedTime = Date.now();
        req.body.status = 'waiting';
        return next();
    }
);

//  assign new ambulance driver
exports.createNewAmbulanceAlert = factoryController.createOne(ambulanceModel);

// update ambulance alert
exports.updateAmbulanceAlert = factoryController.updateOne(ambulanceModel);

// sendMail and assign ambulance driver
exports.sendNotificationandJsontoDriver = catchAsync(async (req, res, next) => {
    await sendEmail({
        email: req.body.phone,
        subject: 'OTP For driver',
        message: `MR.${req.body.driverName}, There is ambulance was assigned you.Please check.`
    });
    return next();
});

// assignData for start driver
exports.startFromtoToTrafficLocations = catchAsync(async (req, res, next) => {
    const alerts = await ambulanceModel
        .findOne({
            hiwalbcmID: req.params.assignId,
            ambulanceDriverID: req.driver._id,
            status: 'waiting'
        })
        .lean();
    console.log({
        hiwalbcmID: req.params.assignId,
        ambulanceDriverID: req.driver._id,
        status: 'waiting'
    });
    if (!alerts) {
        return next(new AppError('Alert not found.', 404));
    }

    const startLoc = req.body.driverLocation.join(',');
    const destLoc = [
        alerts.tempUserLocation.coordinates[1],
        alerts.tempUserLocation.coordinates[0]
    ].join(',');

    let resp;
    await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${process.env.GOOGLE_MAP_API_SERVER}`
    })
        .then((res) => {
            if (!res?.data?.routes[0]?.overview_polyline?.points) {
                return next(
                    new AppError(
                        'Please select the valid location for routring',
                        400
                    )
                );
            }
            resp = res.data.routes[0].overview_polyline.points;
        })
        .catch(function (error) {
            console.log(error);
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    400
                )
            );
        });

    let coordinates = polyline.decode(resp);

    coordinates = await Promise.all(
        coordinates.map((el) => {
            return {
                location: {
                    $geoWithin: {
                        $centerSphere: [[el[1], el[0]], 0.05 / 6378.1]
                    }
                }
            };
        })
    );
    req.body.driverLocation = {
        type: 'String',
        coordinates: [req.body.driverLocation[1], req.body.driverLocation[0]]
    };
    const driver = await ambulanceModel.findOneAndUpdate(
        {
            _id: alerts._id,
            ambulanceDriverID: req.driver._id,
            status: 'waiting'
        },
        {
            driverLocation: req.body.driverLocation,
            status: 'started',
            driverToPatientStartedTime: Date.now()
        }
    );
    if (!driver) {
        return next(new AppError('Not Valid driver', 400));
    }
    const [police, some] = await Promise.all([
        trafficPoliceModel
            .find({
                $or: coordinates
            })
            .select('name phone'),
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        set(ref(db, `driver/${req.driver.unicId}`), { ...alerts, ...req.body })
    ]);
    // console.log(police);
    await Promise.all(
        police.map((el) =>
            sendEmail({
                email: el.phone,
                subject: 'Alert For Ambulance',
                message: `MR.${el.name}, There is ambulance going to cross your place. please use this id and track the ambulace. Please use this id to track the ambulance : ${req.driver.unicId}`
            })
        )
    );
    return res.status(200).json({
        status: 'Success'
    });
});

// chage roots after pickuped patients
exports.updateRootsAfterPickuped = catchAsync(async (req, res, next) => {
    if (req.driver.status === 'inActive') {
        return next(new AppError('Something was wrong .', 400));
    }
    const alerts = await ambulanceModel
        .findOne({
            naahiwabdsID: req.params.assignId,
            status: 'pickuped'
        })
        .lean();
    if (!alerts) {
        return next(
            new AppError('Something went wrong with this driver.', 400)
        );
    }
    const startLoc = req.body.userLocation.join(',');
    const destLoc = req.body.destinationLocation.join(',');

    let resp;
    await axios({
        method: 'GET',
        url: `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${process.env.GOOGLE_MAP_API}`
    })
        .then((res) => {
            if (res.status !== 200 && res.data.status !== 'OK') {
                return next(
                    new AppError(
                        'Please select the valid location for routring',
                        400
                    )
                );
            }
            resp = res.data.routes[0].overview_polyline.points;
        })
        .catch(function (error) {
            console.log(error);
            return next(
                new AppError(
                    'Something went wrong while processing your request',
                    400
                )
            );
        });

    let precoordinates = polyline.decode(resp);
    precoordinates = await Promise.all(
        precoordinates.map((el) => {
            return {
                location: {
                    $geoWithin: {
                        $centerSphere: [[el[1], el[0]], 0.05 / 6378.1]
                    }
                }
            };
        })
    );
    const assignedDate = new Date();
    const [start, police, firebase] = await Promise.all([
        ambulanceModel.findOneAndUpdate(
            { naahiwabdsID: req.params.assignId, status: 'pickuped' },
            {
                $push: {
                    previousLocations: {
                        userLocation: alerts.userLocation,
                        destinationLocation: alerts.destinationLocation,
                        updateLocation: {
                            type: 'Point',
                            coordinates: [
                                req.body.userLocation[1],
                                req.body.userLocation[0]
                            ]
                        },
                        createdAt: assignedDate
                    }
                },
                status: 'started'
            }
        ),
        trafficPoliceModel
            .find({
                $or: precoordinates
            })
            .select('name phone'),
        set(ref(db, `ambulance/${req.driver.unicId}`), {})
    ]);
    console.log('jiu');
    await Promise.all(
        police.map((el) =>
            sendEmail({
                email: el.phone,
                subject: 'Update for ambulance',
                message: `MR.${el.name}, For the some reason the ambulance driver changed the direction of current route. We will send the notification if the altered date was in your route.For more information,Pleace check route details with : ${req.driver.unicId}`
            })
        )
    );
    req.upCheck = alerts;
    return next();
});

// update ambulace driver's request
exports.updateAmbulanceDeriversRequest = catchAsync(async (req, res, next) => {
    const [ambulance, driver] = await Promise.all([
        ambulanceModel.findOneAndUpdate(
            { hiwalbcmID: req.params.assignId, verification: 'requested' },
            {
                verification: req.body.status,
                adminResponseTime: Date.now(),
                responseDescription: req.body.description
            },
            {
                new: true,
                runValidators: true
            }
        ),
        ambulanceDriverModel.findOne({ hiwaladsID: req.params.driverId })
    ]);

    console.log(ambulance);
    if (!ambulance || !driver) {
        await ambulanceModel.findOneAndUpdate(
            { hiwalbcmID: req.params.assignId, verification: req.body.status },
            {
                verification: 'requested',
                adminResponseTime: undefined,
                responseDescription: undefined
            }
        );
        return next(
            new AppError('Something went wrong with this driver.', 400)
        );
    }
    await sendEmail({
        email: driver.phone,
        subject: 'Ambulance Status Response',
        message:
            req.body.status === 'rejected'
                ? `Rejected : For the some reason we can't accept yor request.`
                : 'Accepted : You request was accepted please start your location serive.'
    });

    return res.status(200).json({ status: 'Success' });
});

// start ambulace driver patient to hosptial
exports.startDriverFromPatientToHospital = catchAsync(
    async (req, res, next) => {
        const drivers = req.driver;
        const [alerts] = await Promise.all([
            ambulanceModel.findOne({
                hiwalbcmID: req.params.assignId,
                verification: 'accepted'
            })
        ]);
        if (!alerts) {
            return next(
                new AppError('Something went wrong with this driver.', 400)
            );
        }
        if (alerts.status === 'pickuped') {
            return next(new AppError('You already started the service.', 400));
        }
        const startLoc = req.body.driverLocation.join(',');
        const destLoc = [
            alerts.destinationLocation.coordinates[1],
            alerts.destinationLocation.coordinates[0]
        ].join(',');

        let resp;
        await axios({
            method: 'GET',
            url: `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destLoc}&key=${process.env.GOOGLE_MAP_API}`
        })
            .then((res) => {
                if (res.status !== 200 && res.data.status !== 'OK') {
                    return next(
                        new AppError(
                            'Please select the valid location for routring',
                            400
                        )
                    );
                }
                resp = res.data.routes[0].overview_polyline.points;
            })
            .catch(function (error) {
                console.log(error);
                return next(
                    new AppError(
                        'Something went wrong while processing your request',
                        400
                    )
                );
            });

        let precoordinates = polyline.decode(resp);
        precoordinates = await Promise.all(
            precoordinates.map((el) => {
                const a = Object.values(el);
                return {
                    location: {
                        $geoWithin: {
                            $centerSphere: [[a[1], a[0]], 0.05 / 6378.1]
                        }
                    }
                };
            })
        );
        const [driver, police, some] = await Promise.all([
            ambulanceModel.findOneAndUpdate(
                {
                    _id: alerts._id,
                    verification: 'accepted',
                    status: 'started'
                },
                {
                    status: 'pickuped',
                    patientToHospitalStartedTime: Date.now()
                }
            ),
            trafficPoliceModel
                .find({
                    $or: precoordinates
                })
                .select('name phone')
        ]);
        await Promise.all([
            police.map((el) =>
                sendEmail({
                    email: el.phone,
                    subject: 'Alert For Ambulance',
                    message: `MR.${el.name}, There is ambulance going to cross your place. please use this id and track the ambulace. Please use this id to track the ambulance : ${drivers.unicId}`
                })
            ),
            sendEmail({
                email: req.driver.phone,
                subject: 'Alert For Ambulance',
                message: `MR.${drivers.driverName}, Your live location updated was started. Please start working : ${drivers.unicId}`
            })
        ]);

        return res.status(200).json({
            status: 'Success'
        });
    }
);

// create new ambulance driver
exports.fullFillTheAmbulanceStatus = catchAsync(async (req, res, next) => {
    if (req.driver.status === 'inActive') {
        return next(new AppError('Something was wrong .', 400));
    }
    const alerts = await ambulanceModel
        .findOne({
            naahiwabdsID: req.params.assignId,
            status: 'pickuped'
        })
        .lean();
    if (!alerts) {
        return next(
            new AppError('Something went wrong with this driver.', 400)
        );
    }

    let coordinates = [
        {
            lat: 13.073770000000001,
            lng: 80.23521000000001
        },
        {
            lat: 13.073810000000002,
            lng: 80.23544000000001
        },
        {
            lat: 13.07385,
            lng: 80.23554
        },
        {
            lat: 13.074050000000002,
            lng: 80.23558000000001
        },
        {
            lat: 13.074710000000001,
            lng: 80.23564
        },
        {
            lat: 13.075590000000002,
            lng: 80.23573
        },
        {
            lat: 13.07619,
            lng: 80.23579000000001
        },
        {
            lat: 13.076060000000002,
            lng: 80.23525000000001
        },
        {
            lat: 13.075750000000001,
            lng: 80.2339
        },
        {
            lat: 13.075880000000002,
            lng: 80.23388000000001
        },
        {
            lat: 13.076030000000001,
            lng: 80.23455000000001
        },
        {
            lat: 13.07619,
            lng: 80.23535000000001
        },
        {
            lat: 13.07629,
            lng: 80.23578
        },
        {
            lat: 13.076410000000001,
            lng: 80.23669000000001
        },
        {
            lat: 13.076530000000002,
            lng: 80.23726
        },
        {
            lat: 13.07684,
            lng: 80.23844000000001
        },
        {
            lat: 13.076960000000001,
            lng: 80.23894
        },
        {
            lat: 13.077190000000002,
            lng: 80.23997
        },
        {
            lat: 13.077280000000002,
            lng: 80.24028000000001
        },
        {
            lat: 13.07736,
            lng: 80.24066
        },
        {
            lat: 13.077670000000001,
            lng: 80.24219000000001
        },
        {
            lat: 13.07779,
            lng: 80.24288
        },
        {
            lat: 13.07792,
            lng: 80.24388
        },
        {
            lat: 13.077960000000001,
            lng: 80.24434000000001
        },
        {
            lat: 13.077990000000002,
            lng: 80.24508
        },
        {
            lat: 13.078090000000001,
            lng: 80.24608
        },
        {
            lat: 13.07816,
            lng: 80.24654000000001
        },
        {
            lat: 13.07839,
            lng: 80.2476
        },
        {
            lat: 13.078570000000001,
            lng: 80.2484
        },
        {
            lat: 13.07877,
            lng: 80.2496
        },
        {
            lat: 13.078840000000001,
            lng: 80.25009
        },
        {
            lat: 13.0789,
            lng: 80.25207
        },
        {
            lat: 13.07886,
            lng: 80.25314
        },
        {
            lat: 13.07887,
            lng: 80.25349000000001
        },
        {
            lat: 13.078930000000001,
            lng: 80.25404
        },
        {
            lat: 13.079130000000001,
            lng: 80.25555
        },
        {
            lat: 13.079160000000002,
            lng: 80.25593
        },
        {
            lat: 13.079210000000002,
            lng: 80.2566
        },
        {
            lat: 13.079270000000001,
            lng: 80.25710000000001
        },
        {
            lat: 13.079250000000002,
            lng: 80.2574
        },
        {
            lat: 13.07929,
            lng: 80.25775
        },
        {
            lat: 13.079460000000001,
            lng: 80.25937
        },
        {
            lat: 13.07956,
            lng: 80.26002000000001
        },
        {
            lat: 13.079790000000001,
            lng: 80.26098
        },
        {
            lat: 13.080140000000002,
            lng: 80.26189000000001
        },
        {
            lat: 13.080330000000002,
            lng: 80.26270000000001
        },
        {
            lat: 13.08064,
            lng: 80.26428000000001
        },
        {
            lat: 13.080800000000002,
            lng: 80.26519
        },
        {
            lat: 13.080820000000001,
            lng: 80.26572
        },
        {
            lat: 13.08079,
            lng: 80.26692000000001
        },
        {
            lat: 13.08079,
            lng: 80.26797
        },
        {
            lat: 13.08084,
            lng: 80.27012
        },
        {
            lat: 13.080890000000002,
            lng: 80.27072000000001
        },
        {
            lat: 13.08098,
            lng: 80.27090000000001
        },
        {
            lat: 13.081040000000002,
            lng: 80.27108000000001
        },
        {
            lat: 13.081230000000001,
            lng: 80.27179000000001
        },
        {
            lat: 13.081510000000002,
            lng: 80.27334
        },
        {
            lat: 13.081610000000001,
            lng: 80.27395000000001
        },
        {
            lat: 13.081660000000001,
            lng: 80.27435000000001
        },
        {
            lat: 13.08172,
            lng: 80.27523000000001
        },
        {
            lat: 13.081880000000002,
            lng: 80.27624
        },
        {
            lat: 13.0821,
            lng: 80.27788000000001
        },
        {
            lat: 13.082160000000002,
            lng: 80.27844
        },
        {
            lat: 13.082170000000001,
            lng: 80.27856000000001
        },
        {
            lat: 13.08206,
            lng: 80.27853
        },
        {
            lat: 13.081980000000001,
            lng: 80.27796000000001
        },
        {
            lat: 13.08178,
            lng: 80.27798000000001
        },
        {
            lat: 13.081760000000001,
            lng: 80.27787000000001
        },
        {
            lat: 13.08168,
            lng: 80.27729000000001
        }
    ];
    coordinates = await Promise.all(
        coordinates.map((el) => {
            const a = Object.values(el);
            return {
                location: {
                    $geoWithin: {
                        $centerSphere: [[a[1], a[0]], 0.05 / 6378.1]
                    }
                }
            };
        })
    );

    const [start, police, firebase, driver] = await Promise.all([
        ambulanceModel.findOneAndUpdate(
            { naahiwabdsID: req.params.assignId, status: 'pickuped' },
            {
                status: 'reached'
            }
        ),
        trafficPoliceModel
            .find({
                $or: coordinates
            })
            .select('name phone'),
        set(ref(db, `ambulance/${req.driver.unicId}`), {}),
        ambulanceDriverModel.findByIdAndUpdate(req.driver._id, {
            status: 'inActive'
        })
    ]);
    if (!start || !driver) {
        const data = await Promise.all([
            ambulanceModel.findOneAndUpdate(
                { naahiwabdsID: req.params.assignId, status: 'reached' },
                {
                    status: 'pickuped'
                }
            ),
            ambulanceDriverModel.findByIdAndUpdate(req.driver._id, {
                status: 'active'
            })
        ]);
        return next(
            new AppError('Warning', ' Somthing went wrong wiht this driver.')
        );
    }
    console.log('ji');
    await Promise.all([
        police.map((el) =>
            sendEmail({
                email: el.phone,
                subject: 'Alert For Ambulance',
                message: `MR.${el.name},Thank you for your time to cooperate with us on the Ambulance Service.`
            })
        )
    ]);
    return res.status(200).json({
        status: 'Success'
    });
});

// get my ambulance request
exports.getMyAmbulanceServices = catchAsync(async (req, res, next) => {
    const ambulance = await ambulanceModel.findOne({
        ambulanceDriverID: req.driver._id,
        status: 'waiting'
    });
    return res.status(200).json({
        status: 'Success',
        docs: ambulance
    });
});
// get my ambulance started
exports.getMyAmbulanceServicesDriverToPatient = catchAsync(
    async (req, res, next) => {
        const ambulance = await ambulanceModel.findOne({
            ambulanceDriverID: req.driver._id,
            status: 'started',
            verification: 'waiting'
        });
        return res.status(200).json({
            status: 'Success',
            docs: ambulance
        });
    }
);

// get ambulance driver pickuped
exports.getMyRequestPatienToHospital = catchAsync(async (req, res, next) => {
    const ambulance = await ambulanceModel.findOne({
        ambulanceDriverID: req.driver._id,

        $or: [
            {
                verification: 'requested',
                $or: [{ status: 'started' }, { status: 'pickuped' }]
            },
            {
                verification: 'accepted',
                $or: [{ status: 'started' }, { status: 'pickuped' }]
            },
            {
                verification: 'rejected',
                $or: [{ status: 'started' }, { status: 'pickuped' }]
            }
        ]
    });

    return res.status(200).json({
        status: 'Success',
        docs: ambulance
    });
});

// assign data for create new Ambulance service
exports.assignDataForCreateNewAmbulanceService = catchAsync(
    async (req, res, next) => {
        req.body.hiwaanasmID = await encryptID(
            process.env.AMBULANCE_ALERT_SECRET
        );
        req.body.createdAt = Date.now();
        return next();
    }
);

// create new homecare service
exports.createNewAmbulanceService = factoryController.createOne(
    ambulanceServiceModel
);

// get all Ambulance service
exports.getAllAmbulanceServices = factoryController.getAll(
    ambulanceServiceModel
);

// check the partner and councilar
exports.checkValidVendorandPartner = catchAsync(async (req, res, next) => {
    const [partner, ambulance] = await Promise.all([
        partnerModel.findOne({
            userId: req.user._id,
            status: 'accepted',
            for: 'Ambulance Service'
        }),
        ambulanceProviderModel.exists({ userId: req.user._id })
    ]);

    if (!partner) {
        return next(
            new AppError('Please verify or create partner service.', 400)
        );
    }
    if (ambulance) {
        return next(new AppError('You already regsitered a service.', 400));
    }

    req.body.userId = req.user._id;
    req.body.partnerId = partner._id;
    req.body.createdAt = Date.now();
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    req.body.hiwapspID = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
    return next();
});

// create  ambulance servies
exports.createAmbulanceProviders = factoryController.createOne(
    ambulanceProviderModel
);

// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Ambulance Service'
    };
    req.body.userId = req.user._id;
    return next();
};

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// verify valid data
exports.checkValidAmbulanceServicesAndDrivers = catchAsync(
    async (req, res, next) => {
        if (req.params.type === 'services') {
            if (!req.body.latitude || !req.body.longitude) {
                return next(
                    new AppError(
                        'Latitude and longitude should be included.',
                        400
                    )
                );
            }
            if (!req.body.ambulanceNumber) {
                return next(
                    new AppError('Ambulance Number should be included.', 400)
                );
            }
            if (!req.body.services || !req.body.services.length) {
                return next(
                    new AppError(
                        'Services should be included. or atlease one service should be included',
                        400
                    )
                );
            }
        } else if (req.params.type === 'drivers') {
            if (!req.body.name) {
                return next(
                    new AppError('Driver name should be included.', 400)
                );
            }
            if (!req.body.phone) {
                return next(
                    new AppError('Drvier phone number should be included.', 400)
                );
            }

            if (!req.body.driverProfile && req.body.statusType === 'create') {
                return next(
                    new AppError('Drvier profile should be included.', 400)
                );
            }
        }

        return next();
    }
);

// assign partner search data
exports.manageAmbulanceServicesAndDrivers = catchAsync(
    async (req, res, next) => {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);

        if (req.params.type === 'services') {
            const services = await ambulanceServiceModel
                .find()
                .distinct('name');
            if (!Array.isArray(req.body.services)) {
                return next(
                    new AppError('Somthing went wrong, Please try again.', 400)
                );
            }
            const [filterValue] = await Promise.all([
                req.body.services.every((v) => services.includes(v))
            ]);
            if (!filterValue) {
                return next(
                    new AppError(
                        'Please select the valid ambulance services.',
                        400
                    )
                );
            }
            req.query.objData = {
                'ambulance.ambulanceService': {
                    $elemMatch: { hiwpmasasssID: req.query.serviceId }
                }
            };
            if (!req.query.serviceId || !uuiddetails) {
                req.query.serviceId = await encryptID(
                    process.env.JOP_PORTAL_SECRET
                );
                req.query.objData = {};
            }
            req.query.pull = {
                'ambulance.ambulanceService': {
                    hiwpmasasssID: req.query.serviceId
                }
            };
            req.query.push = {
                'ambulance.ambulanceService': {
                    hiwpmasasssID: req.query.serviceId,
                    ambulanceNumber: req.body.ambulanceNumber,
                    location: {
                        type: 'Point',
                        coordinates: [req.body.longitude, req.body.latitude]
                    },
                    services: req.body.services
                }
            };
        } else if (req.params.type === 'drivers') {
            req.query.objData = {
                'ambulance.driverDetails': {
                    $elemMatch: { hiwaddusID: req.query.serviceId }
                }
            };
            if (!req.query.serviceId || !uuiddetails) {
                req.query.serviceId = await encryptID(
                    process.env.JOP_PORTAL_SECRET
                );
                req.query.objData = {};
            }
            req.query.pull = {
                'ambulance.driverDetails': {
                    hiwaddusID: req.query.serviceId
                }
            };
            req.query.push = {
                'ambulance.driverDetails': {
                    hiwaddusID: req.query.serviceId,
                    name: req.body.name,
                    phone: req.body.phone,
                    driverProfile: req.body.driverProfile
                }
            };
        }
        const a = await partnerModel.updateOne(
            {
                userId: req.user._id,
                for: 'Ambulance Service',
                ...req.query.objData
            },
            {
                $pull: { ...req.query.pull }
            }
        );

        if (
            req.params.service === 'manage' ||
            req.params.service === 'create'
        ) {
            const b = await partnerModel.updateOne(
                {
                    userId: req.user._id,
                    for: 'Ambulance Service'
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
            console.log(b);
        }
        return res.status(200).json({
            status: 'Success'
        });
    }
);

// update ambulance provider data
exports.updateAmbulanceProviders = factoryController.updateOne(
    ambulanceProviderModel
);

// filter data and and get values
exports.sendQuotesToNearbyServices = catchAsync(async (req, res, next) => {
    const [lat, lug] = req.body.userStartLocation;
    let len = 1;
    let services = [];

    while (len <= 4) {
        // eslint-disable-next-line no-await-in-loop
        services = await partnerModel.aggregate([
            {
                $geoNear: {
                    distanceField: 'calculated',
                    near: { type: 'Point', coordinates: [lug, lat] },
                    maxDistance: len * 5000
                }
            },
            {
                $match: {
                    'ambulance.ambulanceService': {
                        $elemMatch: {
                            services: {
                                $in: req.body.requestedService
                            }
                        }
                    }
                }
            }
        ]);
        if (services.length >= process.env.AMBULANCE_BOOKING_LIMIT * 1) {
            break;
        }
        len += 1;
    }

    if (!services.length) {
        return next(
            new AppError(
                "Sorry we couldn't find any ambulance providers in 20km radios.",
                404
            )
        );
    }

    services = _.sampleSize(services, process.env.BLOOD_DONNERS_LIMIT * 1);
    req.body.userStartLocation = { type: 'Point', coordinates: [lug, lat] };
    req.body.userDestinationLocation = {
        type: 'Point',
        coordinates: [
            req.body.userDestinationLocation[1],
            req.body.userDestinationLocation[0]
        ]
    };
    req.body.batch = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
    req.body.createdAt = Date.now();
    req.body.services = [];
    len = 0;
    while (len < services.length) {
        // eslint-disable-next-line no-await-in-loop
        const uuid = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
        const obj = {
            bookingDate: req.body.bookingDate,
            bookingTime: req.body.bookingTime,
            userId: req.user._id,
            requestedService: req.body.requestedService,
            userStartLocation: req.body.userStartLocation,
            userDestinationLocation: req.body.userDestinationLocation,
            createdAt: req.body.createdAt,
            hiwnrqID: uuid,
            providerUserId: services[len].userId,
            providerEID: services[len].hiwpmID,
            batch: req.body.batch
        };

        req.body.services.push(obj);
        len += 1;
    }
    req.body = req.body.services;
    return next();
});

// create new ambulance request
exports.createNewAmbulanceQuoteRequest =
    factoryController.createOne(ambulanceQuotesModel);

// assign data for update new status from vendor
exports.assignDataForServiceProvers = (req, res, next) => {
    req.updateOneSearch = {
        hiwnrqID: req.params.quoteId,
        providerUserId: req.user._id,
        status: 'requested'
    };
    if (req.body.status !== 'responded' && req.body.status !== 'rejected') {
        return next(
            new AppError(
                'Please select the proper way to update your response.',
                400
            )
        );
    }
    req.body = {
        status: req.body.status,
        quoteAmount: req.body.quoteAmount ?? undefined,
        vendorRespondDescription: req.body.description,
        providerResponstTime: Date.now()
    };
    return next();
};
// update service provider
exports.updateServiceProviders =
    factoryController.updateOne(ambulanceQuotesModel);

// update ambulace quotes
exports.updateStatusForuserResponsd = catchAsync(async (req, res, next) => {
    if (
        req.params.status !== 'canceled' ||
        req.params.status !== !'rejected' ||
        req.params.status !== 'completed'
    ) {
        return next(
            new AppError(
                'Somthing went wrong while processing your request',
                400
            )
        );
    }
});

// assign data for cancel ambulaatequote
exports.assignDataForCancelQuote = (req, res, next) => {
    req.updateAllSearchQuery = {
        userId: req.user._id,
        $or: [
            { status: 'requested' },
            { status: 'responded' },
            { status: 'rejected' },

            { status: 'accepted' }
        ],
        batch: req.params.batchID
    };
    req.updateAllData = { status: 'canceled', canceledTime: Date.now() };
    return next();
};

// update many
exports.updateAmbulanceQuotes =
    factoryController.updateAll(ambulanceQuotesModel);

// send json fro update all
exports.sendJsonForUpdateAll = factoryController.sendJsonForUpdateAll();

// update ambulance response
exports.responseProvidersQuote = (req, res, next) => {
    if (req.params.status !== 'rejected' && req.params.status !== 'accepted') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }

    req.updateOneSearch = {
        userId: req.user._id,
        status: 'responded',
        hiwnrqID: req.params.quoteId
    };
    req.body = { status: req.params.status, userRespondTime: Date.now() };
    return next();
};

// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        partner: true,
        from: 'Ambulance Service',
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    return next();
};

// assingn data for get application
exports.assignDataForGetApplicants = (req, res, next) => {
    req.body.from = 'Ambulance Service';
    return next();
};
// assingn data for get application
exports.assignDataForNewQuotes = (req, res, next) => {
    req.query.from = 'Ambulance Service';
    return next();
};

// assign data for update ad
exports.assignDataForUpdateAdvertisement = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: 'Ambulance Service',
        hiwnadmID: req.params.adId
    };
    return next();
};

// assign data for get my qutoes
exports.assignDataForGetMyQuotes = (req, res, next) => {
    req.body = { from: 'Ambulance Service' };
    return next();
};

// get a quote
exports.getAQuotes = catchAsync(async (req, res, next) => {
    let quotes = await medicalMarketQuoteRequesterModel.aggregate([
        {
            $match: {
                for: req.params.quoteId,
                userId: req.user._id,
                from: 'Ambulance Service'
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
        from: 'Ambulance Service'
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
        from: 'Ambulance Service',
        proposeStatus: 'proposal-submited'
    };
    req.body.proposeStatus = req.body.status;
    req.body.userActionDate = Date.now();
    return next();
};

// get all ambulance service lsit
exports.getAmbulanceServiceList = catchAsync(async (req, res, next) => {
    const services = await ambulanceServiceModel.find();
    return res.status(200).json({
        status: 'Success',
        docs: services
    });
});

// get my active quiets
exports.getActiveAmbulanceQuotes = catchAsync(async (req, res, next) => {
    const quotes = await ambulanceQuotesModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                $or: [
                    { status: 'responded' },
                    { status: 'responded' },
                    { status: 'accepted' }
                ]
            }
        },

        {
            $group: {
                _id: '$batch',
                requestedService: { $first: '$requestedService' },
                userStartLocation: { $first: '$userStartLocation' },
                userDestinationLocation: { $first: '$userDestinationLocation' },
                bookingDate: { $first: '$bookingDate' },
                bookingTime: { $first: '$bookingTime' }
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// get a active ambulance quotes
exports.getAActiveAmbulanceQuoteDetails = catchAsync(async (req, res, next) => {
    const quotes = await ambulanceQuotesModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                $or: [
                    { status: 'responded' },
                    { status: 'responded' },
                    { status: 'accepted' }
                ],
                batch: req.params.quoteId
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'providerUserId',
                foreignField: 'userId',
                pipeline: [
                    {
                        $match: { status: 'accepted', for: 'Ambulance Service' }
                    },
                    {
                        $project: {
                            company: 1,
                            centerPhone: 1,
                            _id: 0,
                            location: 1
                        }
                    }
                ],
                as: 'requesterData'
            }
        },
        {
            $unwind: '$requesterData'
        },
        {
            $group: {
                _id: '$batch',
                requestedService: { $first: '$requestedService' },
                userStartLocation: { $first: '$userStartLocation' },
                userDestinationLocation: { $first: '$userDestinationLocation' },
                bookingDate: { $first: '$bookingDate' },
                bookingTime: { $first: '$bookingTime' },
                requesterData: {
                    $push: {
                        partnerDetails: '$requesterData',
                        quoteAmount: '$quoteAmount',
                        vendorRespondDescription: '$vendorRespondDescription',
                        quoteId: '$hiwnrqID'
                    }
                }
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});
// get all of my responded quotes
exports.getAllAmbulanceQuotes = catchAsync(async (req, res, next) => {
    const quotes = await ambulanceQuotesModel.aggregate([
        {
            $match: { userId: req.user._id, status: 'responded' }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'providerUserId',
                foreignField: '_id',
                pipeline: [
                    {
                        $project: {
                            name: 1,
                            phone: 1,
                            _id: 0
                        }
                    }
                ],
                as: 'requesterData'
            }
        },
        {
            $unwind: '$requesterData'
        },
        {
            $group: {
                _id: '$batch',
                requestedService: { $first: '$requestedService' },
                userStartLocation: { $first: '$userStartLocation' },
                userDestinationLocation: { $first: '$userDestinationLocation' },
                bookingDate: { $first: '$bookingDate' },
                bookingTime: { $first: '$bookingTime' },
                requesterData: {
                    $push: {
                        partnerDetails: '$requesterData',
                        quoteAmount: '$quoteAmount',
                        vendorRespondDescription: '$vendorRespondDescription',
                        quoteId: '$hiwnrqID'
                    }
                }
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs: quotes
    });
});

// get partner and quotese
exports.getPartnerAndQuotes = catchAsync(async (req, res, next) => {
    const [partner] = await partnerModel.aggregate([
        {
            $match: {
                ...req.search,
                for: 'Ambulance Service',
                status: 'accepted'
            }
        },
        {
            $project: {
                for: 1,
                hiwpmID: 1,
                profileImage: 1,
                bannerImage: 1
            }
        },
        {
            $lookup: {
                from: 'ambulance service quotes',
                localField: 'hiwpmID',
                foreignField: 'providerEID',
                pipeline: [
                    {
                        $facet: {
                            active: [
                                {
                                    $match: {
                                        $or: [
                                            {
                                                status: 'requested'
                                            },
                                            {
                                                status: 'responded'
                                            },
                                            {
                                                status: 'accepted'
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $group: {
                                                    _id: '$_id',
                                                    name: { $first: '$name' },
                                                    phone: { $first: '$phone' }
                                                }
                                            }
                                        ],
                                        as: 'user'
                                    }
                                },
                                {
                                    $unwind: '$user'
                                }
                            ],
                            history: [
                                {
                                    $match: {
                                        $and: [
                                            {
                                                status: { $ne: 'requested' }
                                            },
                                            {
                                                status: { $ne: 'responded' }
                                            },
                                            {
                                                status: { $ne: 'accepted' }
                                            }
                                        ]
                                    }
                                },
                                {
                                    $lookup: {
                                        from: 'users',
                                        localField: 'userId',
                                        foreignField: '_id',
                                        pipeline: [
                                            {
                                                $group: {
                                                    _id: '$_id',
                                                    name: { $first: '$name' },
                                                    phone: { $first: '$phone' }
                                                }
                                            }
                                        ],
                                        as: 'user'
                                    }
                                },
                                {
                                    $unwind: '$user'
                                }
                            ]
                        }
                    }
                ],
                as: 'quotes'
            }
        },
        {
            $unwind: '$quotes'
        }
    ]);
    console.log(req.search);
    if (!partner) {
        return next(new AppError('Vendor not found.', 404));
    }
    req.body.partner = partner;
    return next();
});

// set search queery for ambulanc equotes
exports.searchDataForAmbulanceQuotes = (req, res, next) => {
    req.search = { userId: req.user._id };
    return next();
};

// send partner data
exports.sendMyAmbulanceQuotes = (req, res) =>
    res.status(200).json({ status: 'Success', docs: req.body.partner });

// send json for ambulance quotes
exports.sendJsonForDrivers = (req, res) =>
    res
        .status(200)
        .json({ status: 'Success', docs: req.docs.ambulance.driverDetails });

// send json for ambulce services
exports.sendJsonForServices = (req, res) =>
    res
        .status(200)
        .json({ status: 'Success', docs: req.docs.ambulance.ambulanceService });

// verify ambulance driver
exports.verifyAmbulanceDriver = catchAsync(async (req, res, next) => {
    const [{ partner, drivers, ambulance }] = await partnerModel.aggregate([
        {
            $match: {
                for: 'Ambulance Service',
                userId: req.user._id,
                status: 'accepted'
            }
        },
        {
            $facet: {
                partner: [
                    {
                        $project: {
                            hiwpmID: 1,
                            _id: 1
                        }
                    }
                ],
                drivers: [
                    {
                        $unwind: '$ambulance.driverDetails'
                    },
                    {
                        $match: {
                            'ambulance.driverDetails.hiwaddusID':
                                req.params.driverId
                        }
                    },
                    {
                        $project: {
                            _id: '$ambulance.driverDetails.hiwaddusID',
                            name: '$ambulance.driverDetails.name',
                            phone: '$ambulance.driverDetails.phone',
                            driverProfile:
                                '$ambulance.driverDetails.driverProfile'
                        }
                    }
                ],
                ambulance: [
                    {
                        $unwind: '$ambulance.ambulanceService'
                    },
                    {
                        $match: {
                            'ambulance.ambulanceService.hiwpmasasssID':
                                req.params.ambulanceId
                        }
                    },
                    {
                        $project: {
                            _id: '$ambulance.ambulanceService.hiwpmasasssID',
                            ambulanceNumber:
                                '$ambulance.ambulanceService.ambulanceNumber',
                            location: '$ambulance.ambulanceService.location',
                            services: '$ambulance.ambulanceService.services'
                        }
                    }
                ]
            }
        }
    ]);

    if (!ambulance || !drivers) {
        return next(new AppError('Ambulance or Driver not found', 404));
    }

    const AssignDriver = await ambulanceQuotesModel.findOneAndUpdate(
        {
            providerUserId: req.user._id,
            status: 'accepted',
            hiwnrqID: req.params.quoteId,
            assignedAmbulanceDriver: { $eq: null }
        },
        {
            ambulanceAssignedTime: Date.now(),
            assignedAmbulanceDriver: {
                _id: ambulance[0]._id,
                name: ambulance[0].name,
                phone: ambulance[0].phone,
                driverProfile: ambulance[0].driverProfile
            },
            assignedAmbulance: {
                ambulanceNumber: drivers.ambulanceNumber,
                location: drivers.location,
                services: drivers.services,
                id: drivers._id
            }
        },
        { runValidators: true, new: true }
    );

    if (!AssignDriver) {
        return next(new AppError('Not a valid quote.', 400));
    }
    const uuid = await encryptID(process.env.AMBULANCE_ALERT_SECRET);
    const obj = {
        name: drivers[0].name,
        phone: drivers[0].phone,
        drivereEId: drivers[0].id,
        profileImage: drivers[0].driverProfile,
        partnerID: partner[0]._id,
        partnerEID: partner[0].hiwpmID,
        createdAt: Date.now(),
        assignedDate: new Date(AssignDriver.bookingDate).setHours(0, 0, 0, 0),
        assignedTime: AssignDriver.bookingTime,
        quoteId: AssignDriver._id,
        quoteEId: AssignDriver.hiwnrqID,
        userStartLocation: AssignDriver.userStartLocation,
        userDestinationLocation: AssignDriver.userDestinationLocation,
        hiwadshsID: uuid,
        ambulaneDetails: { ...ambulance[0], id: ambulance[0]._id }
    };
    console.log(obj);
    await Promise.all([
        sendMail({
            email: 'muthazhagan187@gmail.com',
            subject: 'Ambulance Assigned',
            message: `You are assigned an ambulance for ${new Date(
                AssignDriver.bookingDate
            ).toLocaleDateString()}, ${AssignDriver.bookingTime}`
        }),
        privateAmbulanceAssignModel.create(obj)
    ]);
    return res.status(200).json({
        status: 'Success'
    });
});

// filter new blood bank data
exports.filterAmbulancePartner = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'name',
            'phone',
            'centerPhone',
            'centerLandLine',
            'latitude',
            'longitude',
            'openTime',
            'closeTime',
            'address',
            'city'
        )
    ]);

    return next();
});
// assign partner search data
exports.assignPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Ambulance Service'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
    };
    req.body.userId = req.user._id;
    req.body = { $set: req.body };
    return next();
};

// update home care service
exports.updateAmbulancePartner = factoryController.updateOne(partnerModel);

// send json for update one
exports.sendJsonForUpdateOne = factoryController.sendJsonForUpdateOne();

// update booked ambulance driver status
exports.updateBookedAmbulanceDriverStatus = catchAsync(
    async (req, res, next) => {
        let obj = {};
        if (req.params.status === 'started') {
            req.params.Astatus = 'assigned';
            obj = {
                startedLocation: {
                    type: 'Point',
                    coordinates: [req.body.location[1], req.body.location[0]]
                },
                startedTime: Date.now(),
                status: req.params.status
            };
        } else if (req.params.status === 'completed') {
            obj = {
                status: req.params.status,
                completedLocation: {
                    type: 'Point',
                    coordinates: [req.body.location[1], req.body.location[0]]
                },
                completedTime: Date.now()
            };
            req.params.Astatus = 'started';
        } else {
            return next(
                new AppError('Something went wrong please try again later.')
            );
        }

        const date = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        console.log(date);
        const status = await privateAmbulanceAssignModel.updateOne(
            {
                phone: req.user.phone,
                hiwadshsID: req.params.driverId,
                status: req.params.Astatus,
                assignedDate: date
            },
            {
                ...obj
            },
            {
                runValidators: true
            }
        );

        if (!status.matchedCount) {
            return next(
                new AppError(
                    'Something went wrong wwhile processing your request.',
                    400
                )
            );
        }
        return res.status(200).json({ status: 'Success' });
    }
);

// get all of my assigned driver history
exports.myAmbulanceAssignDatas = catchAsync(async (req, res, next) => {
    const data = await partnerModel.findOne({
        for: 'Ambulance Service',
        status: 'accepted',
        'ambulance.driverDetails.phone': req.user.phone
    });
    if (!data) {
        return next(new AppError('You are not Ambulance Driver', 400));
    }
    const assignDatas = await privateAmbulanceAssignModel.aggregate([
        {
            $match: {
                phone: req.user.phone,
                partnerID: data._id,
                partnerEID: data.hiwpmID
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            $or: [
                                {
                                    status: 'started'
                                },
                                {
                                    status: 'assigned'
                                }
                            ]
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $and: [
                                {
                                    status: { $ne: 'started' }
                                },
                                {
                                    status: { $ne: 'assigned' }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json({ status: 'Success', docs: assignDatas });
});
