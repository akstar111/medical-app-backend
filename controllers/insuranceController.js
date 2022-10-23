// ============================================================
// import models
const insuranceModel = require('../models/Insurance/insuranceModel');

// ============================================================
// import util
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

// ============================================================
// import controllers
const factoryControllers = require('../controllers/factoryControllers');

exports.checkInsuranceDatas = catchAsync(async (req, res, next) => {
    // console.log(req.body.phone?.toString().startsWith('+'));
    // if (
    //     !req.body.phone?.toString().startsWith('+') ||
    //     !req.body.authorityPersonPhone?.toString().startsWith('+')
    // ) {
    //     return next(new AppError('Please Enter the valid phone number', 400));
    // }
    return next();
});

exports.createInsurance = factoryControllers.createOne(insuranceModel);

exports.sendJsonInsurance = async (req, res, next) => {
    return res.status(200).json({
        status: 'Success',
        navigation: 'New Insurance Register 2',
        userId: req.body.docs._id
    });
};

exports.assignInsuranceRegisterData = async (req, res, next) => {
    const date = new Date();
    let a = date.setMonth(date.getMonth() + req.body.validity * 1);
    req.body.validity = a;
    req.body.userId = req.user._id;
    return next();
};

exports.checkInsurancePage1Data = (req, res, next) => {
    if (!req.body.name) return next(new AppError('Please Enter the name', 400));
    if (!req.body.age) return next(new AppError('Please Enter the age', 400));
    if (!req.body.gender)
        return next(new AppError('Please Enter the gender', 400));
    if (!req.body.dateOfBirth)
        return next(new AppError('Please Enter the Date of Birth', 400));
    if (!req.body.addressLine1)
        return next(new AppError('Please Enter the Address 1', 400));
    if (!req.body.city) return next(new AppError('Please Enter the city', 400));
    if (!req.body.state)
        return next(new AppError('Please Enter the state', 400));
    if (!req.body.pincode)
        return next(new AppError('Please Enter the pincode', 400));
    if (!req.body.phone)
        return next(new AppError('Please Enter the phone', 400));
    if (!req.body.profileImage)
        return next(new AppError('Please Select the Profile Image', 400));

    if (!req.body.phone?.toString().startsWith('+')) {
        return next(new AppError('Please Enter the valid phone number', 400));
    }
    req.body.age = req.body.age;
    if (req.body.age.length > 2 || isNaN(req.body.age * 1)) {
        return next(new AppError('Please Select the valid age', 400));
    }
    if (req.body.pincode.length > 6 || isNaN(req.body.pincode * 1)) {
        return next(new AppError('Please Select the valid pincode', 400));
    }
    return res.status(200).json({
        status: 'Success',
        navigation: 'New Insurance Register 2'
    });
};

exports.checkInsurancePage2Data = (req, res, next) => {
    if (!req.body.insuranceType)
        return next(new AppError('Please Enter the Insurance Type', 400));
    if (!req.body.insuranceStream)
        return next(new AppError('Please Enter the insurance Stream', 400));
    if (!req.body.insuranceAuthorityPerson)
        return next(
            new AppError('Please Enter the Insurance Authority Person', 400)
        );
    if (!req.body.authorityPersonName)
        return next(
            new AppError('Please Enter the Authority Person Name', 400)
        );
    if (!req.body.authorityPersonPhone)
        return next(
            new AppError('Please Enter the Authority Person Phone', 400)
        );
    if (!req.body.naminiImage)
        return next(new AppError('Please Enter the Namini Image', 400));
    if (!req.body.naminiAadhar)
        return next(new AppError('Please Enter the Namini Aadhar', 400));
    if (!req.body.userAadhar)
        return next(new AppError('Please Enter the User Aadhar', 400));
    if (!req.body.userPan)
        return next(new AppError('Please Enter the User Pan', 400));

    return res.status(200).json({
        status: 'Success',
        navigation: 'Verify Insurance Details'
    });
};

// assign check insurance data
exports.checkRenewInsuranceData = catchAsync(async (req, res, next) => {
    const check = await insuranceModel.findById(req.params.insuranceId);
    if (!check) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }

    if (check.validity > new Date(Date.now())) {
        return next(new AppError('This insurance still not expired.', 401));
    }
    const date = new Date();
    let a = date.setMonth(date.getMonth() + req.body.validity * 1);
    req.body.validity = a;
    return next();
});

// update insurace
exports.updateInsuraceValidity = catchAsync(async (req, res, next) => {
    const update = await insuranceModel.findByIdAndUpdate(
        req.params.insuranceId,
        { validity: req.body.validity }
    );
    if (!update) {
        return next(
            new AppError(
                'Something went wrong while processing your request.',
                401
            )
        );
    }
    return next();
});

// send json for updted insurance
exports.sendJsonForUpdatedById = factoryControllers.sendJsonForUpdatedById();
