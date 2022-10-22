// ============================================================
// import models
const { validate: uuidValidate } = require('uuid');

const fs = require('fs');

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
const jobportalModel = require('../models/JopPortal/postJobModel');
const applyJobModel = require('../models/JopPortal/applyJobModel');
const userJobDetailsModel = require('../models/JopPortal/userJobDetailsModel');
const partnerModel = require('../models/shared/partnerModel');
const jobCategories = require('../models/JopPortal/jobCategoriesModel');

// ============================================================
// create controllers
// assign data for post a new job form speak to us
exports.assignDataForCreateNewJobPostFromSpeakToUs = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Speak To Us';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.councilarEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);

// assign data for post a new job form Deaddiction center
exports.assignDataForCreateNewJobPostFromDeaddiction = catchAsync(
    async (req, res, next) => {
        req.body.from = 'De-Addiction service';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.deaddicationEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// check the partner and councilar
exports.checkValidVendorandAssignData = catchAsync(async (req, res, next) => {
    if (req.params.from !== 'user') {
        const [partner] = await Promise.all([
            partnerModel.findOne({
                userId: req.user._id,
                status: 'accepted',
                for: req.params.from
            })
        ]);

        if (!partner) {
            return next(new AppError('Invalid user.', 401));
        }
        req.body.userId = req.user._id;
        req.body.partner = true;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.expiredOn = new Date(
            Date.now() + 7 * 1000 * 3600 * 24
        ).setHours(23, 59, 59, 999);
        req.body.partnerId = partner._id;
        req.body.partnerEID = partner.hiwpmID;
        req.body.from = partner.for;
        req.body.email = partner.email;
        req.body.phone = partner.centerPhone;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
    } else {
        req.body.from = 'user';
        req.body.userId = req.user._id;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = false;
        req.body.expiredOn = new Date(
            Date.now() + 7 * 1000 * 3600 * 24
        ).setHours(23, 59, 59, 999);
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
    }
    return next();
});

// assign data for post a new job form ambulance service
exports.assignDataForCreateNewJobPostFromambulanceService = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Ambulance Service';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.ambulanceEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form bloodbank service
exports.assignDataForCreateNewJobPostFromBloodBank = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Blood Bank';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.bloodbankEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.location[1], req.body.location[0]]
        };
        return next();
    }
);
// assign data for post a new job form ambulance service
exports.assignDataForCreateNewJobPostFromOpticlas = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Opticals';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.ambulanceEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form ambulance service
exports.assignDataForCreateNewJobPostFromOnlineConsultancy = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Online Consultancy';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.ambulanceEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form expert service
exports.assignDataForCreateNewJobPostFromMeetTheExpertService = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Meet the Expert';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.expertEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form gym service
exports.assignDataForCreateNewJobPostFromGYM = catchAsync(
    async (req, res, next) => {
        req.body.from = 'GYM';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.gymEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form Homecare
exports.assignDataForCreateNewJobPostFromHomecareService = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Homecare service';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.homecareEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);
// assign data for post a new job form hearingAid service
exports.assignDataForCreateNewJobPostFromHearingAid = catchAsync(
    async (req, res, next) => {
        req.body.from = 'Hearing AID';
        req.body.userId = req.user._id;
        req.body.parentEID = req.body.hearingAidEID;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = true;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);

// assign data for post a new job from user
exports.assignDataForCreateNewJobPostUser = catchAsync(
    async (req, res, next) => {
        req.body.from = 'User';
        req.body.userId = req.user._id;
        req.body.hiwjbmID = await encryptID(process.env.SPEAK_TO_US_SECRET);
        req.body.createdAt = Date.now();
        req.body.partner = false;
        req.body.expiredOn = Date.now() + 7 * 1000 * 3600 * 24;
        req.body.location = {
            type: 'Point',
            coordinates: [req.body.coordinates[1], req.body.coordinates[0]]
        };
        return next();
    }
);

// check partner id and partner encrypt id is updated
exports.checkPartnerIdandPartnerEid = (req, res, next) => {
    if (!req.body.parentEID || !req.body.partnerId) {
        return next(
            new AppError(
                'Somthing went wrong while processing your requrest',
                400
            )
        );
    }
    return next();
};
// create new job portal
exports.createNewPost = factoryControllers.createOne(jobportalModel);

// send json for create one
exports.sendJsonForCreateOne = factoryControllers.sendJson();

// assign data for search one
exports.assingDataforSearchAJob = catchAsync(async (req, res, next) => {
    const [job, applyjob, userData] = await Promise.all([
        jobportalModel.findOne({
            status: 'active',
            hiwjbmID: req.params.serviceId,
            expiredOn: { $gt: new Date(Date.now()) }
        }),
        applyJobModel.findOne({
            jobEId: req.params.serviceId,
            userId: req.user._id
        }),

        userJobDetailsModel.findOne({ userId: req.user._id })
    ]);

    if (applyjob) {
        return next(new AppError('You already applied this job', 400));
    }
    if (!job) {
        return next(new AppError('Something went wrong with this job..', 400));
    }

    if (!userData) {
        return res.status(401).json({
            status: 'Fail-User',
            message:
                "This user is don't have any profile.Click the below button to create it."
        });
    }
    if (!userData.profileSummary || !userData.personalDetails) {
        return res.status(404).json({
            status: 'Fail-Summary'
        });
    }
    req.body.userId = req.user._id;
    req.body.createdAt = Date.now();
    req.body.jobEId = job.hiwjbmID;
    req.body.jobDetails = {
        jobTitle: job.jobTitle,
        yearorExperience: job.yearorExperience,
        category: job.category,
        speciality: job.speciality,
        salaryPerMonth: job.salaryPerMonth,
        vacancy: job.vacancy,
        description: job.description,
        address: job.address,
        city: job.city,
        state: job.state,
        country: job.country,
        pincode: job.pincode,
        jobType: job.jobType,
        phone: job.phone,
        email: job.email,
        workTimeFrom: job.workTimeFrom,
        workTimeTo: job.workTimeTo,
        coordinates: job.coordinates,
        expiredOn: job.expiredOn,
        userId: job.userId,
        from: job.from,
        createdAt: job.createdAt
    };
    req.body.hiwnjasID = await encryptID(process.env.JOP_PORTAL_SECRET);
    return next();
});

// creaate new job
exports.applyNewJob = factoryControllers.createOne(applyJobModel);

// assign data for update personal detail
exports.updateUserPesonalDetails = catchAsync(async (req, res, next) => {
    if (
        Object.keys(req.body)[0] === 'personalDetails' ||
        Object.keys(req.body)[0] === 'profileSummary'
    ) {
        const data = await userJobDetailsModel.updateOne(
            {
                userId: req.user._id
            },
            req.body
        );
        return res.status(202).json({
            status: 'Success'
        });
        // eslint-disable-next-line no-else-return
    } else if (
        Object.keys(req.body)[0] === 'employementDetails' ||
        Object.keys(req.body)[0] === 'educationDetails'
    ) {
        const uuiddetails = uuidValidate(req.query.serviceId ?? 0);
        let obj = Object.fromEntries([
            [`${Object.keys(req.body)[0]}.jpUEID`, req.query.serviceId]
        ]);
        if (!req.query.serviceId || !uuiddetails) {
            req.query.serviceId = await encryptID(
                process.env.JOP_PORTAL_SECRET
            );
            obj = {};
            req.body[Object.keys(req.body)[0]].jpUEID = req.query.serviceId;
        }

        // eslint-disable-next-line node/no-unsupported-features/es-builtins
        const objpull = Object.fromEntries([
            [Object.keys(req.body)[0], { jpUEID: req.query.serviceId }]
        ]);

        const datas = await userJobDetailsModel.updateOne(
            {
                userId: req.user._id,
                ...obj
            },
            {
                $pull: objpull
            }
        );

        if (!datas.matchedCount) {
            return next(
                new AppError(
                    'Something went wrong while processing your request.',
                    401
                )
            );
        }
        if (req.query.deleteuserdata) {
            return res.status(202).json({
                status: 'Successed'
            });
        }
        if (Object.keys(obj).length) {
            req.body[Object.keys(req.body)[0]].jpUEID = req.query.serviceId;
            obj = {};
        }

        const data = await userJobDetailsModel.updateOne(
            {
                userId: req.user._id,
                ...obj
            },
            {
                $push: req.body
            }
        );
        if (data.matchedCount) {
            return res.status(202).json({
                status: 'Success'
            });
        }
    }
    return next(
        new AppError('Something went wrong while processing your request.', 401)
    );
});

// check if the user is already exist
exports.checkifTheUserAlreadyExist = catchAsync(async (req, res, next) => {
    let userData = await userJobDetailsModel.findOne({
        userId: req.user._id
    });

    return res.status(200).json({ status: 'Success', docs: userData });
});

// create userData
exports.createUserData = catchAsync(async (req, res, next) => {
    let userData = await userJobDetailsModel.findOne({
        userId: req.user._id
    });

    if (userData) {
        return next(new AppError('You already created user personal data.'));
    }
    userData = await userJobDetailsModel.create({
        userId: req.user._id,
        createdAt: Date.now()
    });
    return res.status(200).json({ status: 'Success', docs: userData });
});

// prevent false data
exports.preventFalseDataUpdate = (req, res, next) => {
    req.body = filerDataFromRequest(
        req.body,
        'jobTitle',
        'yearorExperience',
        'category',
        'speciality',
        'salaryPerMonth',
        'vacancy',
        'description',
        'address',
        'city',
        'state',
        'country',
        'pincode',
        'jobType',
        'phone',
        'bannerImage',
        'email',
        'workTimeFrom',
        'workTimeTo',
        'coordinates'
    );
    return next();
};

// prevent false data
exports.preventFalseDataDelete = (req, res, next) => {
    req.body = { status: 'inActive' };
    req.updateOneSearch = {};
    return next();
};

// send json for update one
exports.sendJsonForUpdateOne = factoryControllers.sendJsonForUpdateOne();

// getjob applicants
exports.getJobApplicats = catchAsync(async (req, res, next) => {
    const [applicants] = await jobportalModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                partner: true,
                from: req.body.from,
                hiwjbmID: req.params.jobId
            }
        },
        {
            $lookup: {
                from: 'job applies',
                localField: 'hiwjbmID',
                foreignField: 'jobEId',
                as: 'applicants'
            }
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs: applicants
    });
});

// get a jop applicant
exports.getJobApplication = catchAsync(async (req, res, next) => {
    const [applicants] = await applyJobModel.aggregate([
        {
            $match: {
                hiwnjasID: req.params.applicantId,
                'jobDetails.userId': req.user._id
            }
        }
    ]);

    if (!applicants) {
        return next(new AppError('Cannot able to find appliant.', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs: applicants
    });
});

// update jobs
exports.updateJob = factoryControllers.updateOne(jobportalModel);

// find my active jobs
exports.GetMyPostedJobs = catchAsync(async (req, res, next) => {
    const jobs = await jobportalModel.find({
        userId: req.user._id,
        from: req.params.from,
        expiredOn: { $gte: Date.now() },
        status: 'active'
    });

    req.body.jobs = jobs;
    return next();
});

// get categories and job application
exports.getCategories = catchAsync(async (req, res, next) => {
    const getaJob = await jobportalModel.findOne({
        userId: req.user._id,
        hiwjbmID: req.params.jobId
    });
    req.body.job = getaJob;
    req.body.categories = categories;
    return next();
});

// assign data for get a job and applicants
exports.assignDataforGetJobandReceivedApplications = (req, res, next) => {
    req.searchQuery = {
        userId: req.user._id,
        hiwjbmID: req.params.jobId,
        from: req.params.from
    };
    req.queryPopulate = { path: 'applicants' };
    return next();
};

// get a joba and applicants
exports.getJobandapplications =
    factoryControllers.findOneWithPopulate(jobportalModel);

// get a applicant
exports.findOneJobApplicant = catchAsync(async (req, res, next) => {
    const [applicant] = await jobportalModel.aggregate([
        {
            $lookup: {
                from: 'job applies',
                localField: 'hiwjbmID',
                foreignField: 'jobEId',
                pipeline: [{ $match: { hiwnjasID: req.params.applicantId } }],
                as: 'job'
            }
        },
        {
            $unwind: '$job'
        },
        {
            $group: {
                _id: '$_id',
                job: { $first: '$job' }
            }
        }
    ]);
    if (!applicant) {
        return next(new AppError('Something went wrong with this job', 400));
    }
    req.body.applicant = applicant.job;
    return next();
});

// assing data for find all jobs
exports.assignDataForGetAllJobs = (req, res, next) => {
    req.searchQuery = {
        status: 'active',
        expiredOn: { $gt: new Date(Date.now()) },
        partnerDetails: { $size: 1 }
    };
    req.queryPopulate = [
        {
            path: 'partnerDetails',
            select: 'company'
        }
    ];
    return next();
};

// get all jobs
exports.getAllJobs =
    factoryControllers.getFindAllWithPopulateFilter(jobportalModel);

// filter
// filter array values
exports.filterVerifiedPartners = catchAsync(async (req, res, next) => {
    req.body.findAllFilter = await Promise.all(
        req.body.findAllFilter.filter((el) => el.partnerDetails.length)
    );
    return next();
});

// send all jobs
exports.sendJsonForAllFilter = factoryControllers.sendAllFilter();

// assign data for get ajob// get related sevend data
exports.getAJob = catchAsync(async (req, res, next) => {
    const [filterdData] = await jobportalModel.aggregate([
        {
            $match: {
                hiwjbmID: req.params.jobId,
                expiredOn: { $gt: new Date(Date.now()) },
                status: 'active'
            }
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'partnerId',
                foreignField: '_id',
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        },

        {
            $lookup: {
                from: 'jobs',
                localField: 'parter._id',
                foreignField: 'partnerId',
                pipeline: [
                    {
                        $match: {
                            hiwjbmID: { $ne: req.params.jobId },
                            // expiredOn: { $gt: new Date(Date.now()) },
                            status: 'active'
                        }
                    },
                    {
                        $limit: 20
                    }
                ],
                as: 'relatedJobs'
            }
        }
    ]);

    if (!filterdData) {
        return next(new AppError("We counldn't find this job.", 404));
    }

    return res.status(200).json({
        status: 'Success',
        job: filterdData
    });
});

// filter valid data
exports.filterValidJobData = (req, res, next) => {
    req.body = filerDataFromRequest(
        req.body,
        'jobTitle',
        'yearOfExperience',
        'category',
        'speciality',
        'jobType',
        'salaryPerMonth',
        'vacancy',
        'location',
        'workTimeFrom',
        'workTimeTo',
        'city',
        'state',
        'pincode',
        'email',
        'phone',
        'country',
        'address',
        'description'
    );
    return next();
};

// check if the category and specialty is valide
exports.checkCategoryandSpecility = catchAsync(async (req, res, next) => {
    const categories = await jobCategories.findOne({ name: req.body.category });
    if (!categories) {
        return next(new AppError('Please select the valide category', 400));
    }

    if (!categories.specialists.includes(req.body.speciality)) {
        return next(new AppError('Please select the valid speciality.', 400));
    }
    return next();
});
// assign data for update job
exports.assignDataForUpdateJobs = (req, res, next) => {
    req.updateOneSearch = {
        userId: req.user._id,
        from: req.params.from,
        hiwjbmID: req.params.jobId,
        status: 'active'
    };
    req.body.location = {
        type: 'Point',
        coordinates: [req.body.location[1], req.body.location[0]]
    };
    return next();
};

// assign data for get my job applications
exports.getMyJobApplications = catchAsync(async (req, res, next) => {
    const docs = await applyJobModel.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: { status: 'applied' }
                    }
                ],
                history: [
                    {
                        $match: {
                            status: { $ne: 'applied' }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get my job list
exports.getMyJobList = catchAsync(async (req, res, next) => {
    const docs = await jobportalModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                from: req.params.from
            }
        },
        {
            $facet: {
                active: [
                    {
                        $match: {
                            expiredOn: { $gte: new Date() },
                            status: 'active'
                        }
                    }
                ],
                history: [
                    {
                        $match: {
                            $or: [
                                {
                                    expiredOn: { $lt: new Date() }
                                },
                                { status: 'inActive' }
                            ]
                        }
                    }
                ]
            }
        }
    ]);
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get my job applicants
exports.getMyJobApplicants = catchAsync(async (req, res, next) => {
    const [docs] = await jobportalModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                hiwjbmID: req.params.jobId,
                from: req.params.from
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
                            status: 'accepted',
                            userId: req.user._id,
                            for: req.params.from
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        },
        {
            $project: {
                partner: 0
            }
        },

        {
            $lookup: {
                from: 'job applies',
                localField: 'hiwjbmID',
                foreignField: 'jobEId',
                pipeline: [{ $project: { jobDetails: 0 } }],
                as: 'applicants'
            }
        }
    ]);
    if (!docs) {
        return next(new AppError('Job not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get a applicant
exports.getAApplicant = catchAsync(async (req, res, next) => {
    const [docs] = await applyJobModel.aggregate([
        {
            $match: {
                hiwnjasID: req.params.applicantId
            }
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: 'jobs',
                localField: 'jobEId',
                foreignField: 'hiwjbmID',
                pipeline: [{ $limit: 1 }],
                as: 'job'
            }
        },
        {
            $unwind: '$job'
        },
        {
            $lookup: {
                from: 'partners',
                localField: 'job.partnerId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            status: 'accepted',
                            userId: req.user._id,
                            for: req.params.from
                        }
                    }
                ],
                as: 'partner'
            }
        },
        {
            $unwind: '$partner'
        },
        {
            $project: {
                job: 0,
                partner: 0
            }
        }
    ]);
    if (!docs) {
        return next(new AppError('Applicant not found', 404));
    }
    req.body.docs = docs;
    return next();
});

// send jsoon for get a pplicant
exports.sendJsonForApp = (req, res) =>
    res.status(200).json({ status: 'Success', docs: req.body.docs });

// get my job applicants
exports.getMyJobApplicantsUser = catchAsync(async (req, res, next) => {
    const [docs] = await jobportalModel.aggregate([
        {
            $match: {
                userId: req.user._id,
                hiwjbmID: req.params.jobId,
                from: 'user'
            }
        },
        {
            $lookup: {
                from: 'job applies',
                localField: 'hiwjbmID',
                foreignField: 'jobEId',
                pipeline: [{ $project: { jobDetails: 0 } }],
                as: 'applicants'
            }
        }
    ]);
    if (!docs) {
        return next(new AppError('Job not found', 404));
    }
    return res.status(200).json({
        status: 'Success',
        docs
    });
});

// get a applicant for user
exports.getAUserApplicant = catchAsync(async (req, res, next) => {
    const [docs] = await applyJobModel.aggregate([
        {
            $match: {
                hiwnjasID: req.params.applicantId
            }
        },
        {
            $limit: 1
        },
        {
            $lookup: {
                from: 'jobs',
                localField: 'jobEId',
                foreignField: 'hiwjbmID',
                pipeline: [{ $match: { userId: req.user._id } }, { $limit: 1 }],
                as: 'job'
            }
        },
        {
            $unwind: '$job'
        }
    ]);

    if (!docs) {
        return next(new AppError('Applicant not found', 404));
    }
    req.body.docs = docs;
    return next();
});

// send jsoon for get a pplicant
exports.sendJsonForApp = (req, res) =>
    res.status(200).json({ status: 'Success', docs: req.body.docs });

// update applicatn status
exports.updateApplicantStatus = catchAsync(async (req, res, next) => {
    if (req.body.docs.status !== 'applied') {
        return next(
            new AppError(
                'Something went wrong while processing your request',
                400
            )
        );
    }
    const status = await applyJobModel.findByIdAndUpdate(req.body.docs._id, {
        status: req.params.status
    });
    return res.status(200).json({
        status: 'Success'
    });
});

// get all categories
exports.getAllJobcategories = factoryControllers.getAllFilter(jobCategories);