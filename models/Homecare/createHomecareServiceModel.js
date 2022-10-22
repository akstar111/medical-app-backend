// ============================================================
// import libraries
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create schema
const homecareServiceSchema = new mongoose.Schema(
    {
        contactPersonName: {
            type: String,
            required: [true, 'Contact person name should be included.']
        },
        contactPersonPhone: {
            type: String,
            required: [true, 'Contact person phone number should be included.']
        },
        homecareName: {
            type: String,
            required: [true, 'Homecare service name should be included.']
        },
        homecarePhone: {
            type: String,
            required: [true, 'Homecare phone should be included.']
        },
        landLine: {
            type: String
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email should be included'],
            validate: [validator.isEmail, 'Please Enter the valide Email.']
        },
        openTime: {
            type: String,
            required: [true, 'Open time should be included.']
        },
        closeTime: {
            type: String,
            required: [true, 'Close name should be included..']
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        serviceType: {
            type: String,
            required: true,
            enum: ['company', 'individual']
        },
        city: {
            type: String,
            required: [true, 'City should be included.']
        },
        address: {
            type: String,
            required: [true, 'Address should be included.']
        },
        hiwhcsns: {
            type: String,
            required: true
        },

        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true]
        },
        createdAt: {
            type: Date,
            required: true
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'Application must contain partner id.']
        },
        facilities: [
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String,
                    requird: true
                },
                hiwhcmflsID: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// create virtual populate
homecareServiceSchema.virtual('reviews', {
    ref: 'Homecare Reviews',
    foreignField: 'homecareServiceId',
    localField: '_id'
});
homecareServiceSchema.virtual('partner', {
    ref: 'Partner',
    foreignField: '_id',
    localField: 'partnerId'
});

// ============================================================
// populate user id
homecareServiceSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'userId',
            select: 'name price date'
        }
    ]);
    next();
});

// ============================================================
// create model
const homecareServiceModel = mongoose.model(
    'HomeCareService',
    homecareServiceSchema
);

module.exports = homecareServiceModel;
