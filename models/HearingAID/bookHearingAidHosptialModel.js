// ============================================================
// import packages
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create mongoose schema
const bookHearingaidHospitalSchema = new mongoose.Schema(
    {
        hospitalEID: {
            type: String,
            required: true
        },
        hospitalId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'hearing aid must contain userId.']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'hearing aid slot must contain userId.']
        },
        hiwbhhID: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (el) {
                    return validate(el);
                },
                message: 'Something went wrong while processing your requrest.'
            }
        },
        bookedDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: [
                'requested',
                'accepted',
                'rejected',
                'canceled',
                'not-arrived',
                'completed'
            ],
            default: 'requested'
        },
        scheduleTime: {
            type: String
        },
        vendorResposnse: {
            type: String
        },
        createdAt: {
            type: Date,
            requried: true
        },
        cancelTime: {
            type: Date
        },
        userResponseDate: Date,
        userResponseDescription: String,
        vendorActionDate: {
            type: Date
        },
        notArrivedResposnse: {
            type: String
        },
        notArrivedResposnseDate: {
            type: Date
        }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

// create virture populte
bookHearingaidHospitalSchema.virtual('hosital', {
    ref: 'Partner',
    localField: 'hospitalId',
    foreignField: '_id'
});

// ============================================================
// create model
const bookHearingAidHospitalModel = mongoose.model(
    'Hearing-AID Book Hospital',
    bookHearingaidHospitalSchema
);

// ============================================================
// export model
module.exports = bookHearingAidHospitalModel;
