// ============================================================
// import packages
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');

// ============================================================
// import models
const partnerModel = require('../models/shared/partnerModel');
const studyAbroadModel = require('../models/StudyAbroad/studyAbroadModel');
const studyAbroadFormModel = require('../models/StudyAbroad/studyAbroadOnlineApplication');

// ============================================================
// import controllers
const factoryController = require('./factoryControllers');

// ============================================================
// import utili
const catchAsync = require('../util/catchAsync');
const encryptID = require('../util/uuid');
const AppError = require('../util/AppError');
const filerDataFromRequest = require('../util/filterObjects');

// assign partner search data
exports.assignPartnerSearchData = catchAsync(async (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        status: 'accepted',
        for: 'Study Abroad'
    };
    return next();
});

// verify valid partner to do this service
exports.verifyValidPartner = factoryController.findOne(partnerModel);

// verify valid partner and service
exports.verifyValidPartnerAndServices = catchAsync(async (req, res, next) => {
    const [partner, abroad] = await Promise.all([
        partnerModel.findOne(req.searchQuery),
        studyAbroadModel.findOne({ userId: req.user._id })
    ]);
    if (!partner) {
        return next(new AppError('Invalid partner', 400));
    }
    if (!abroad) {
        return next(new AppError('College not found', 404));
    }
    req.data = {};
    req.data.partner = partner;
    req.data.college = abroad;
    return next();
});
// create new suudy abroad details
exports.createStudyAbroadDetailsidItNew = catchAsync(async (req, res, next) => {
    if (req.docs.studyAbroad.status) {
        return next();
    }
    const eID = await encryptID(process.env.DONNATION_SECRET);
    const studyaboroad = await studyAbroadModel.create({
        userId: req.user._id,
        partnerId: req.docs._id,
        partnerEId: req.docs.hiwpmID,
        hiwsabmID: eID,
        country: req.docs.country,
        createdAt: Date.now(),
        name: req.docs.company
    });
    if (!studyaboroad) {
        return next(new AppError('Something went wrong please try again'));
    }
    await partnerModel.findByIdAndUpdate(req.docs._id, {
        studyAbroad: { status: true }
    });
    return next();
});

// assign partner id
exports.assignPartnerId = (req, res, next) => {
    req.body.partnerId = req.docs._id;
    return next();
};

// create new service
exports.createNewService = factoryController.createOne(studyAbroadModel);

// create new service
exports.createNewAdmission = factoryController.createOne(studyAbroadFormModel);

// send created new service  to client
exports.sendServiceJson = factoryController.sendJson();

// assign partner search data
exports.assignValidPartnerSearchData = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        _id: req.params.serviceid
    };
    req.updateQuery = req.body;
    return next();
};

// update home care service
exports.updateStudyAbroad = factoryController.updateOne(studyAbroadModel);

// send json for update study abroud
exports.sendServiceJsonupdateOne = factoryController.sendJsonForUpdateOne();

// delete studyabrod service
exports.deleteStudyAbroadService = catchAsync(async (req, res, next) => {
    await studyAbroadModel.findByIdAndDelete(req.params.serviceid);
    return next();
});

//verify Valid partner's service
exports.verifyValidPartnerissSerive =
    factoryController.findOne(studyAbroadModel);

// assign data for find college
exports.assignDAtaForFindAllData = (req, res, next) => {
    const obj = {};
    req.query.sort === 'fees'
        ? (req.query.sort =
              'courseDetails.underGraduateFees.totalTutionFeesHostel')
        : (req.query.sort =
              '-courseDetails.underGraduateFees.totalTutionFeesHostel');
    return next();
};

// get list college
exports.getAllColleges = factoryController.getAllFilter(studyAbroadModel);

// send json for filter all
exports.sendJsonForGetAllFilter = factoryController.sendAllFilter();

// assignd data for get colleges
exports.assignDataForGetAColleges = (req, res, next) => {
    req.searchQuery = {
        verified: true,
        hiwsabmID: req.params.collegeId
    };
    return next();
};

// get a verified data
exports.getACollege = factoryController.findOne(studyAbroadModel);

// get a verified data
exports.sendJsonForGetOne = factoryController.sendJsonForFindOne();

// update course details
exports.assignDataForUpdateCourseDetails = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            userId: req.user._id,
            partnerId: req.docs._id
        };
        req.body.underGraduationCourseSyllabus = await Promise.all(
            req.body.underGraduationCourseSyllabus.map(async (el) => {
                const eID = await encryptID(process.env.DONNATION_SECRET);
                return { ...el, hiwsaugcssID: eID };
            })
        );

        req.body.eligiblityCretria = {
            minimumPercentage: req.body.minimumPercentage,
            entranceExam: req.body.entranceExam
        };
        req.body.underGraduateFees = {
            tutionFees: req.body.tutionFees,
            tutionFeesHostel: req.body.tutionFeesHostel,
            tutionFeesACHostel: req.body.tutionFeesACHostel,
            totalTutionFees: req.body.totalTutionFees,
            totalTutionFeesHostel: req.body.totalTutionFeesHostel,
            totalTutionFeesACHostel: req.body.totalTutionFeesACHostel
        };
        req.body.termFees = {
            firstTerm: req.body.firtTermFees,
            remainingFees: req.body.reminFeesPaitWithin
        };
        req.body = { courseDetails: req.body };
        return next();
    }
);

// assin data for update facilites
exports.assignDataForUpdateFaciliesDetails = catchAsync(
    async (req, res, next) => {
        req.updateOneSearch = {
            userId: req.user._id,
            partnerId: req.docs._id
        };
        req.body.indianEmbassyContactDetails = {
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email
        };
        req.body = { faciliteisAvailable: req.body };
        return next();
    }
);

// filter hearinga id partner data
exports.filterStudyAbroadData = catchAsync(async (req, res, next) => {
    [req.body] = await Promise.all([
        filerDataFromRequest(
            req.body,
            'name',
            'phone',
            'centerPhone',
            'centerLandLine',
            'location',
            'openTime',
            'closeTime',
            'address',

            'city'
        )
    ]);
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
});
// assign data for update study abroad
exports.assignDataForUpdateStudyAbroad = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        for: 'Study Abroad'
    };

    return next();
};

// update study abroad
exports.updateStudyAboard = factoryController.updateOne(partnerModel);

// check the aborad aleady created
exports.checkIfDataAlreadyCreated = (req, res, next) => {
    if (req.docs.studyAbroad.status) {
        return next();
    }
    return res.redirect('/vendor/study-abroad');
};

// assing data for get study abroad
exports.assignDataForGetStudyAbroad = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        partnerId: req.docs._id
    };
    req.body.partner = req.docs;
    return next();
};

const multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
    if (
        file.mimetype.startsWith('image') ||
        file.mimetype.startsWith('video')
    ) {
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
        name: 'collegeInfraStructureVideo'
    },
    {
        name: 'hostelImages'
    },
    {
        name: 'libraryImages'
    }
]);

// resize iamges
exports.resizeCollegeDetailsImages = catchAsync(async (req, res, next) => {
    if (req.files.hostelImages?.length) {
        req.body.hostelImages = [];
        await Promise.all(
            req.files.hostelImages.map((el) => {
                const data = sharp(el.buffer)
                    .resize(800, 800)
                    .toFormat('jpeg')
                    .jpeg({ quality: 100 });
                req.body.hostelImages.push(data);
            })
        );
    }
    if (req.files.libraryImages?.length) {
        req.body.libraryImages = [];
        await Promise.all(
            req.files.libraryImages.map((el) => {
                const data = sharp(el.buffer)
                    .resize(800, 800)
                    .toFormat('jpeg')
                    .jpeg({ quality: 100 });
                req.body.libraryImages.push(data);
            })
        );
    }
    return next();
});

// update study abroad college details files on aws
exports.uploadCollegeDetailsFilesOnAWS = catchAsync(async (req, res, next) => {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRETKEY,
        region: process.env.AWS_REGION
    });

    const infraName = `${`${`${req.user._id
        .toString()
        .split(/[a-z]+/)
        .join('')}-${req.data.college.hiwsabmID.split(/[a-z]+/).join('')}`}`
        .split('-')
        .join('')}advertisement`;
    if (req.files.collegeInfraStructureVideo?.length) {
        const params = {
            Bucket: process.env.AWS_BUCKET,
            Key: `${infraName}-college-infrastructure.mp4`,
            ContentType: 'video/mp4',
            Body: req.files.collegeInfraStructureVideo[0].buffer
        };
        try {
            const video = await s3.upload(params).promise();
            console.log(video.Location);
            req.body.collegeInfraStructureVideo = video.Location;
        } catch (err) {
            return next(
                new AppError(
                    'Somehing went wrong while processing your request.Please try again.',
                    401
                )
            );
        }
    }
    if (req.body.hostelImages?.length) {
        req.body.hostelImages = await Promise.all(
            req.body.hostelImages.map(async (el, index) => {
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${infraName}-college-hostel-${index}.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el
                };
                try {
                    const image = await s3.upload(params).promise();
                    return image.Location;
                } catch (err) {
                    console.log(err);
                    return next(
                        new AppError(
                            'Somehing went wrong while processing your request.Please try again.',
                            401
                        )
                    );
                }
            })
        );
    }
    if (req.body.libraryImages?.length) {
        req.body.libraryImages = await Promise.all(
            req.body.libraryImages.map(async (el, index) => {
                const params = {
                    Bucket: process.env.AWS_BUCKET,
                    Key: `${infraName}-college-library-${index}.jpeg`,
                    ContentType: 'image/jpeg',
                    Body: el
                };
                try {
                    const image = await s3.upload(params).promise();
                    return image.Location;
                } catch (err) {
                    return next(
                        new AppError(
                            'Somehing went wrong while processing your request.Please try again.',
                            401
                        )
                    );
                }
            })
        );
    }
    req.body.hostelFacilities = {
        withFood: req.body.withFood,
        cookingFacilites: req.body.cookingFacilites
    };
    req.body.courseAvailable = req.body.courseAvailable.split(',');
    req.body.ugCourses = req.body.ugCourses.split(',');
    req.body.pgCourses = req.body.pgCourses.split(',');
    req.body.sportIndoorActivities = req.body.sportIndoorActivities
        .split(',')
        .filter(Boolean);

    console.log(req.body.sportIndoorActivities);
    req.updateByIdQuery = req.data.college._id;
    req.updateQuery = {
        collegeDetails: { ...req.data.college.collegeDetails, ...req.body }
    };

    return next();
});

// update studyabroad by id
exports.updateStudyAbroadByID = factoryController.updateById(studyAbroadModel);

// send json for update by id
exports.sendJsonForUpdateById = factoryController.sendJsonForUpdatedById();
