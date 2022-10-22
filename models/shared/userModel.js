// import mongoose
const mongoose = require('mongoose');

// import bcrypt
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// import validaor
const validator = require('validator');

// create mongoose schema for user
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            // required: [true, 'Email should be included'],
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        phone: {
            type: String,
            required: true,
            unique: true
        },
        hiwuueidmID: {
            type: String,
            required: true,
            unique: true
        },
        // password: {
        //     type: String,
        //     // required: [true, 'Please Enter the password'],
        //     select: false,
        //     minlength: 8
        // },
        // conformPassword: {
        //     type: String,
        //     // required: [true, 'Please enter the Conform password'],
        //     validate: {
        //         validator: function (el) {
        //             return el === this.password;
        //         },
        //         message: 'Password must be same.'
        //     }
        // },
        profileImage: {
            type: String,
            default:
                'https://medi-app360.s3.amazonaws.com/1652723237848-cover.jpg'
        },
        accountVerification: {
            type: Boolean,
            default: false
        },
        accountVerificationToken: String,
        accountVerificationExpires: Date,
        phoneVerificationToken: String,
        phoneVerificationTokenExpires: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
        passwordChangeAt: Date,
        role: {
            type: String,
            enum: ['user', 'admin', 'vendor'],
            default: 'user'
        },
        lastUpdate: {
            type: Date,
            default: Date.now()
        },
        address: {
            type: String
        },
        city: String,
        state: String,
        pincode: {
            type: Number,
            maxLength: 6
        },

        createdAt: {
            type: Date,
            required: true
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.conformPassword = undefined;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

// check password is correct
userSchema.methods.checkPassword = async function (userPassword, dataPassword) {
    console.log(userPassword, dataPassword);
    return await bcrypt.compare(userPassword, dataPassword);
};

// check token session
userSchema.methods.checkPassAfterToken = function (JWTCreatDate) {
    if (this.passwordChangeAt) {
        const getPerfectTime = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10
        );

        return JWTCreatDate < getPerfectTime;
    }
    return false;
};

userSchema.methods.forgotPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

userSchema.methods.userConformationToken = function () {
    const conformationtoken = crypto.randomBytes(73).toString('hex');
    this.accountVerificationToken = crypto
        .createHash('sha256')
        .update(conformationtoken)
        .digest('hex');
    this.accountVerificationExpires = Date.now() + 10 * 60 * 1000;
    return conformationtoken;
};
userSchema.methods.generateOtpForUser = function () {
    const conformationtoken = Math.floor(100000 + Math.random() * 900000);
    this.phoneVerificationToken = (
        (((conformationtoken / 6) * 2) / 4523 - 123) / 1212 +
        452
    ).toString(26);
    this.phoneVerificationTokenExpires = Date.now() + 10 * 60 * 1000;
    return conformationtoken;
};

// create a model for user
const userModel = mongoose.model('Users', userSchema);

// export user model
module.exports = userModel;
