// ============================================================
// import libraries
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// ============================================================
// import models
const userModel = require('../models/shared/userModel');

// ============================================================
// import utllities
const catchAsync = require('../util/catchAsync');
const sendMail = require('../util/sendMail');
const AppError = require('../util/AppError');
const ambulanceDriverModel = require('../models/AmbulanceAlert/ambulanceDriversModel');
const sendSMS = require('../util/sendSMS');
const encryptID = require('../util/uuid');
// ============================================================
// create JWT
const signJWT = (id) =>
    jwt.sign({ id }, process.env.JSON_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });

// ============================================================
// create user session
const sendJWT = (user, statusCode, res) => {
    const token = signJWT(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
    if (process.env.NODE_DEV === 'production') {
        cookieOptions.secure = true;
    }
    console.log('hi');
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    return res.status(200).json({
        status: 'Success',
        token
    });
};

// ============================================================
// product user routes
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.query.jwt) {
        token = req.query.jwt;
    } else if (req.body.jwt) {
        token = req.body.jwt;
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMTJmMmI4ZTkyZGQ2ZTFiNWUxOTM2NSIsImlhdCI6MTY2NDk2NjAyNCwiZXhwIjoxNjcyNzQyMDI0fQ.WfB29PVarDUBYV5c7O8wUnC9ohcEY4urzPc_FF1_Zx0';
    if (!token) {
        return next(
            new AppError(
                'You are not loggedin. Please login and try to access the page.',
                401
            )
        );
    }
    let decode = {};
    try {
        decode = await promisify(jwt.verify)(token, process.env.JSON_SECRET);
    } catch (err) {
        return next(
            new AppError(
                'You are not loggedin. Please login and try to access the page.',
                401
            )
        );
    }
    const freshUser = await userModel.findById(decode.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The user no longer exist. please create a new account',
                401
            )
        );
    }

    if (freshUser.checkPassAfterToken(decode.iat)) {
        return next(
            new AppError(
                'The Password changed by user in recently. please login again',
                401
            )
        );
    }

    req.user = freshUser;
    next();
});
// product ambulance routes
exports.protectDriver = catchAsync(async (req, res, next) => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZmRlNDc3YzQ3MzNlMDFkYjkzMGY5ZCIsImlhdCI6MTY2MDkyMjY1NCwiZXhwIjoxNjY5NTYyNjU0fQ.z9FBTkRyOkmQ-ur1VchiKiHmLrsOdL62le8epLumGxA';
    if (!token) {
        return next(
            new AppError(
                'You are not loggedin. Please login and try to access the page.',
                401
            )
        );
    }
    const decode = await promisify(jwt.verify)(
        token,
        process.env.JWT_DRIVER_SECRET
    );
    const freshUser = await ambulanceDriverModel.findById(decode.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The user no longer exist. please create a new account',
                401
            )
        );
    }

    req.driver = freshUser;
    next();
});

// ============================================================
// check if the user is already login
exports.isUserAlreadyLogin = catchAsync(async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JSON_SECRET
            );
            const freshUser = await userModel.findById(decode.id);
            if (!freshUser) {
                return next();
            }
            if (freshUser.checkPassAfterToken(decode.iat)) {
                return next();
            }

            res.locals.user = freshUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
});

// redirect user if not logedin
exports.redirectUserttoLogin = (req, res, next) => {
    if (res.locals.user) {
        return next();
    }
    return res.redirect('/login');
};

// Account Verification
const userAccountVerification = async (req, res, next, user) => {
    try {
        const conformationToken = await user.userConformationToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `${req.protocol}://${req.get(
            'host'
        )}/api/user/verifyUser/${conformationToken}`;
        const message = `Forgot user password? Click to reset.\n ${resetUrl}.\n If you know the password just igonore it.`;
        await sendMail({
            email: user.email,
            subject: 'Account verification  token(Valid only 10min)',
            message
        });
    } catch (err) {
        user.accountVerificationToken = undefined;
        user.accountVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                'Something went worng to send your email.Please Try again later',
                500
            )
        );
    }
};

// signup user
exports.signup = catchAsync(async (req, res, next) => {
    req.body.createdAt = Date.now();
    const signupUser = await userModel.create(req.body);
    await userAccountVerification(req, res, next, signupUser);
    return res.json({
        status: 'Success',
        message: 'The message send successfull'
    });
});

// ============================================================
// login user
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next(new AppError('Please Enter The Email and Password', 400));
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (
        !user ||
        !(await user.checkPassword(
            password,
            '$2b$12$kt1SWOPHmqg1.kavDJD/r.p5rkZX9fHGfRKggwPeER55Ns1/t.6AO'
        ))
    ) {
        return next(new AppError('Email or Password in invalid', 401));
    }

    if (!user.accountVerification) {
        await userAccountVerification(req, res, next, user);
        return next(
            new AppError(
                'You are bending in account verification.We sended mail to your account.check and verify',
                401
            )
        );
    }

    sendJWT(user, 200, res);
});

exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
        }
        next();
    };

exports.logout = (req, res, next) => {
    res.cookie('jwt', 'login', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    return res.status(200).json({ status: 'Success' });
};

// genrate otp for user
const generateOtpForUser = async (req, res, next, user) => {
    try {
        const generateOtp = await user.generateOtpForUser();
        await user.save({ validateBeforeSave: false });
        await sendSMS({
            message: `Here is your otp : ${generateOtp}`,
            phone: req.body.phone
        });
    } catch (err) {
        user.phoneVerificationToken = undefined;
        user.phoneVerificationTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError(err.name, 400));
    }
};

// generate otp for user
exports.userOtpGenerate = catchAsync(async (req, res, next) => {
    const user = await userModel.findOne({ phone: req.body.phone });
    if (!user) {
        req.body.createdAt = Date.now();
        req.body.hiwuueidmID = await encryptID(process.env.FITNESS_SECRET);
        const newUser = await userModel.create(req.body);
        generateOtpForUser(req, res, next, newUser);
    } else {
        generateOtpForUser(req, res, next, user);
    }
    return res.status(200).json({ status: 'Success' });
});

// verify user otp
exports.verifyUserOtp = catchAsync(async (req, res, next) => {
    const token = (
        (((req.body.otp / 6) * 2) / 4523 - 123) / 1212 +
        452
    ).toString(26);
    const user = await userModel.findOne({
        phone: req.body.phone,
        phoneVerificationToken: token,
        phoneVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Not Valid datas', 400));
    }
    user.accountVerification = true;
    user.phoneVerificationToken = undefined;
    user.phoneVerificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return sendJWT(user, 200, res);
});
