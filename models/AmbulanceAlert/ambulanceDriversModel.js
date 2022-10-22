// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const ambulanceDriverSchema = new mongoose.Schema({
    driverName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inActive'],
        default: 'inActive'
    },
    phoneVerificationToken: {
        type: String
    },
    phoneVerificationTokenExpires: {
        type: Date
    },
    profileImage: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    unicId: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: String,
        default: 'sAdmin',
        enum: ['sAdmin', 'admin']
    },
    createdAt: {
        type: Date,
        required: true
    },
    hiwaladsID: {
        type: String,
        required: true,
        unique: [true, 'Something went wrong please try again.'],
        validate: {
            validator: function (el) {
                return validate(el);
            },
            message:
                'Something went wrong while processing your requrest.Please try again.'
        }
    }
});
ambulanceDriverSchema.methods.driverPhoneConformationToken = function () {
    const conformationtoken = Math.floor(100000 + Math.random() * 900000);
    this.phoneVerificationToken = ((conformationtoken / 6) * 2).toString(32);
    this.phoneVerificationTokenExpires = Date.now() + 15 * 60 * 1000;
    return conformationtoken;
};

// ============================================================
// create model
const ambulanceDriverModel = mongoose.model(
    'Ambulance Drivers',
    ambulanceDriverSchema
);

// ============================================================
// export model
module.exports = ambulanceDriverModel;
