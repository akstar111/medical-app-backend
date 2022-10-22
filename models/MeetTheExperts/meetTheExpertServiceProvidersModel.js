// ============================================================
// import packages
const mongoose = require('mongoose');
const validator = require('validator');

// ============================================================
// create mongoose shcema
const meetTheExpertsServiceProviderSchema = new mongoose.Schema(
    {
        serviceType: {
            type: String,
            required: [true, 'Service type should be included.'],
            enum: ['contractors', 'service', 'consultants']
        },
        vendorType: {
            type: String,
            required: [true, 'Select your service type'],
            enum: ['individual', 'company']
        },
        expertType: {
            type: String,
            required: [true, 'Expert type should be included.']
        },
        description: {
            type: String,
            required: [true, 'Please ellobrate about your service']
        },
        priceFrom: {
            type: Number,
            required: [true, 'Service should be included price started from']
        },
        priceTo: {
            type: Number,
            required: [true, 'Service Should be included price End to']
        },
        workingTimeFrom: {
            type: String,
            required: [true, 'Service should be include starts when']
        },
        workingTimeTo: {
            type: String,
            required: [true, 'Service should be include end when']
        },

        ratingsAverage: {
            type: Number,
            default: 0,
            max: 5,
            set: (val) => Math.round(val * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'Insurance must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'de-addiction must contain partner.']
        },

        serviceImage: {
            type: String,
            required: [true, 'Service image should be included.']
        },
        hiwmtespsID: {
            type: String,
            required: true,
            unique: [true, 'something went wrong please try again.']
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
//
meetTheExpertsServiceProviderSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'partnerId',
            select: 'bannerImage address'
        }
    ]);
    next();
});

// ============================================================
// create mongose model
const meetTheExpertsServiceProviderModel = mongoose.model(
    'Meet the Expert Service Providers',
    meetTheExpertsServiceProviderSchema
);

// ============================================================
// export model
module.exports = meetTheExpertsServiceProviderModel;
