// ============================================================
// import libraries
const mongoose = require('mongoose');
const { validate } = require('uuid');

// ============================================================
// create schema
const bloodDonationRouter = new mongoose.Schema(
    {
        donnerName: {
            type: String,
            required: [true, 'Donner Name should be included.']
        },
        donnerPhone: {
            type: String,
            required: [true, 'Donner Phone should be included.']
        },
        bloodGroup: {
            type: String,
            required: [true, 'Donner blood group should be included.'],
            enum: ['o+', 'b+', 'o-', 'ab+']
        },
        donnerAddress: {
            type: String,
            required: [true, "Donner's address should be included."]
        },
        idProof: {
            type: String,
            required: [true, 'ID Proof should be included.']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true]
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        lastDonatedDate: {
            type: Date
        },
        hiwbdndID: {
            type: String,
            required: [true],
            unique: true,
            validate: {
                validator: function (el) {
                    return validate(el);
                },
                message:
                    'Something went wrong while processing your requrest.Please try again.'
            }
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
// create virtual populate
bloodDonationRouter.virtual('request', {
    ref: 'Blood Donation Blood Requests',
    foreignField: 'donnerEID',
    localField: 'hiwbdndID'
});
// ============================================================
// create model
const newBloodDonnerModel = mongoose.model(
    'Blood Donation New Donner',
    bloodDonationRouter
);

// ============================================================
// export model
module.exports = newBloodDonnerModel;
