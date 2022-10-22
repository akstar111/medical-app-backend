// ============================================================
// import libraries
const mongoose = require('mongoose');

// create schema
const deaddtictionSchema = new mongoose.Schema(
    {
        priceFrom: {
            type: Number,
            required: [true, 'Addiction center must be enter the pay rate.']
        },
        priceTo: {
            type: Number,
            required: [true, 'Addiction center must be enter the pay rate.']
        },
        description: {
            type: String,
            required: [true, 'Description should be included.']
        },
        serviceName: {
            type: String,
            required: [true, 'Please select the service name']
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Users',
            required: [true, 'de-addiction must contain userId.']
        },
        partnerId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Partner',
            required: [true, 'de-addiction must contain partner.']
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            max: 5,
            set: (val) => Math.round(val * 10) / 10
        },
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        bannerImage: {
            type: String,
            required: [true, 'Banner image should be included.'],
            default:
                'https://medi-app360.s3.ap-south-1.amazonaws.com/photo_2022-09-07_00-38-23.jpg'
        },
        serviceImages: [String],
        hiwdacmID: {
            required: true,
            type: String
        },
        createdAt: {
            type: Date,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true,
            default: 'partner',
            enum: ['partner', 'admin']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// create virtual populate
deaddtictionSchema.virtual('reviews', {
    ref: 'De-addiction Reviews',
    foreignField: 'deAddictionId',
    localField: '_id'
});

// ============================================================
// populate user id
deaddtictionSchema.pre(/^find/, function (next) {
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
const deaddtictionModel = mongoose.model(
    'De-Addiction Center',
    deaddtictionSchema
);

// ============================================================
// export de-addiction center
module.exports = deaddtictionModel;
